// src/components/Editor/Editor.js
import APIClient from '../../http/requests'
import ContentTools from 'ContentTools';
import {ImageUploader, buildCloudinaryURL, parseCloudinaryURL} from './ImageUploader';

const sKeyCode = 83; // key code for the 's' key on the keyboard;

class Editor {

  constructor(getAdditionalFields, submitURL, handleSaveSuccess, editContext, resourceNamePlural, dispatch) {
    if(typeof window !== 'undefined') {
      this.submitURL = submitURL;
      this.handleSaveSuccess = handleSaveSuccess;
      this.resourceNamePlural = resourceNamePlural;
      this.dispatch = dispatch;
      this.dirty_data = false;
      this.keypressSave = false; // used to help determine what the save context was.
      this.editContext = editContext; // 'new' or 'edit'

      this.setAdditionalFields = this.setAdditionalFields.bind(this);
      this.setAdditionalFields(getAdditionalFields);
      this.setContentToolsProps();
      this.setImageModificationHandler();

      // Initialise editor for the page.
      // 
      this.editor = ContentTools.EditorApp.get();
      this.editor.init('*[data-editable]', 'data-name');

      window.addEventListener('keydown', (event) => this.handleKeyDown(event));
      this.editor.addEventListener('saved', (event) => this.handleSave(event, this.submitURL));
      this.editor.addEventListener('start', (event) => this.handleEditStart(event));
    }
  }

  setAdditionalFields(getAdditionalFields) {
    this.getAdditionalFields = getAdditionalFields;
    this.fields = getAdditionalFields();
    this.modifiedFields = {}; // Keeps track of whether a field has been modified since the last save.
    
    if(this.fields && this.fields.length > 0) {
      Object.keys(this.fields).forEach((fieldname) => {
        this.modifiedFields[fieldname] = false;
      });
    }
  }

  setContentToolsProps() {
    ContentTools.IMAGE_UPLOADER = this.createImageUploader;
    ContentTools.MIN_CROP = 30;
    ContentTools.DEFAULT_VIDEO_WIDTH = 889;
    ContentTools.DEFAULT_VIDEO_HEIGHT = 500;

    // eslint-disable-next-line
    ContentEdit.DEFAULT_MAX_ELEMENT_WIDTH = 980;
    // eslint-disable-next-line
    ContentEdit.RESIZE_CORNER_SIZE = 50;
  }

  setImageModificationHandler() {
    // Capture image resize events and update the Cloudinary URL
    // eslint-disable-next-line
    ContentEdit.Root.get().bind('taint', (element) => {
      var args, filename, transforms, url;
      // return early if there is no actual change that has been made.
      if(!this.editor.history) {
        return;
      }

      // Check the element tainted is an image
      if (element.type() !== 'Image') {
        return;
      }

      // Parse the existing URL
      args = parseCloudinaryURL(element.attr('src'));
      filename = args[0];
      transforms = args[1];

      // // If no filename is found then exit (not a Cloudinary image)
      if (!filename) {
        return;
      }

      // Remove any existing resize transform
      if (transforms.length > 0 && transforms[transforms.length -1]['c'] === 'scale') {
        transforms.pop();
      }

      // // Change the resize transform for the element
      transforms.push({c: 'scale', w: element.size()[0], h: element.size()[1]});
      url = buildCloudinaryURL(filename, transforms);
      if (url !== element.attr('src')) {
        element.attr('src', url);
      }
    });
  }

  getEditor(){
    return this.editor;
  }

  updateField(fieldName, newValue) {
    this.fields[fieldName] = newValue;
    this.modifiedFields[fieldName] = true; // indicates that the field has been modified since last save.
    this.dirty_data = true;
  }

  handleKeyDown(event) {
    let editorState = this.editor.getState().toUpperCase();

    if(!this.editor.ctrlDown() && (editorState !== 'EDITING' || (editorState !== 'READY' && this.dirty_data))) {
      return;
    } else {
      this.handleKeyboardSave(event);
    }
  }

  handleKeyboardSave(event) {
    let handled = false;
    if (event.keyCode !== undefined) {
      if((event.keyCode === sKeyCode) && this.editor.ctrlDown()) {
        this.keypressSave = true;
        this.editor.save(true); // save with passive set to true so editor keeps its state.
        handled = true;
      }
    }

    if(handled) {
      event.preventDefault();
    }
  }

  createImageUploader(dialog){
    return new ImageUploader(dialog);
  }

  destroyEditor(){
    if(typeof window !== 'undefined') {
      window.removeEventListener('keydown', (event) => this.handleKeyDown(event));
    }
    this.editor.destroy();
    this.submitURL = null;
    this.handleSaveSuccess = null;
    this.resourceNamePlural = null;
    this.editContext = null;
    this.getAdditionalFields = null;
  }

  dispatchNotification(show, header, content, notificationType) {
    this.dispatch({
      type: 'UPDATE_SNACKBAR',
      show,
      header,
      content,
      notificationType
    })
  }
  
  handleEditStart(event) {
    // do something on editor start
  }
  handleEditStop(event) {
    // do something on editor stop
  }

  onSaveSuccess(res, passive) {
    if (res.statusCode === 422) {
      this.dispatchNotification(true, 'Error', res.data.errors, 'error');
    } else if(res.statusCode !== 200) {
      this.dispatchNotification(true, 'Error', res.data.errors, 'error');
    } else {
      if(this.editContext !== 'edit') {
        this.editContext = 'edit';
        this.submitURL = this.resourceNamePlural + '/' + res.body.data.id;
        this.handleSaveSuccess(this.submitURL, res, passive)
      } else {
        this.handleSaveSuccess(null, res, passive)
      }
      this.resetModifiedData();
    }
    this.editor.busy(false); // set the editor to not busy once handling of server response has been completed. 
  }

  resetModifiedData() {
    Object.keys(this.modifiedFields).forEach((fieldName) => {
      this.modifiedFields[fieldName] = false;
    });
    this.dirty_data = false;
  }

  onSaveFailure(res, passive) {
    this.editor.busy(false);

    if(res.statusCode === 422){
      let firstFieldKey = Object.keys(res.body.errors).pop();
      let firstError = res.body.errors[firstFieldKey][0]; // get the first error for the first field with an error
      this.dispatchNotification(true, 'Error', firstError, 'error');
    } else {
      console.warn('EXCEPTION: ', res)
      this.dispatchNotification(true, 'Error', 'Something unexpected happened. Please report this as a bug.', 'error');
    }
  }

  makePayload(editorRegions) {
    let payload = {};
    let regionValue;
    
    (Object.keys(editorRegions)).forEach((key) => {
      if(key === 'name') {
        regionValue = editorRegions[key].replace(/<\/?[^>]+(>|$)/g, "").trim(); // strip HTML tags and trim
      } else {
        regionValue = editorRegions[key];
      }
      payload[key] = regionValue;
    });

    return payload;
  }

  addModifiedFieldsToPayload(payload) {
    let currentFieldValues = this.getAdditionalFields();

    Object.keys(this.modifiedFields).forEach((fieldName) => {
      if(this.modifiedFields[fieldName]) {
        payload[fieldName] = currentFieldValues[fieldName];
      }
    });

    return payload;
  }

  addAllFieldsToPayload(payload) {
    return Object.assign(payload, this.getAdditionalFields());
  }

  handleSave(event, submitURL) {

    if(this.editor.busy()) {
      this.dispatchNotification(true, 'Warning', 'Editor already saving, please wait', 'warning')
      return;
    }    

    this.editor.busy(true); // set editor to busy while trying to save.
    
    // IF no URL to save to is provided then return early
    if(!submitURL) {
      this.editor.busy(false);
      return;
    }
    
    let editorRegions = event.detail().regions;
    let numRegions = Object.keys(editorRegions).length;
    let payload = {};

    if (numRegions === 0 && !this.dirty_data) {
      this.editor.busy(false);
      return;
    } else {
      payload = this.makePayload(editorRegions)
    }

    if(this.editContext === 'new') {
      payload = this.addAllFieldsToPayload(payload);
    } else if (this.dirty_data) {
      payload = this.addModifiedFieldsToPayload(payload);
    }

    // Set the editors state to busy while we save our changes
    // 
    try {
      let httpMethod = this.editContext === 'edit' ? 'put' : 'post'
      let client = new APIClient(this.dispatch);
      let passive = event.detail().passive;

      client[httpMethod](submitURL, true, {data: payload}).then(
        (res) => this.onSaveSuccess(res, passive), 
        (res) => this.onSaveFailure(res, passive)
      ).catch((res) => this.onSaveFailure(res, passive))
    } catch (e) {
      this.onSaveFailure(e)
    }
  }
}

export default Editor;

