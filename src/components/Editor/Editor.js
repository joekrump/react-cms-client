import APIClient from '../../http/requests'
import ContentTools from 'ContentTools';
import {ImageUploader, buildCloudinaryURL, parseCloudinaryURL} from './ImageUploader';

const sKeyCode = 83;

class Editor {

  constructor(getPageName, submitURL, handleSaveSuccess, editContext, resourceNamePlural, dispatch, template_id) {
    if(typeof window !== 'undefined') {
      this.submitURL = submitURL;
      this.handleSaveSuccess = handleSaveSuccess;
      this.resourceNamePlural = resourceNamePlural;
      this.dispatch = dispatch;
      this.template_id = parseInt(template_id, 10);
      this.slug = '';
      this.dirty_data = false;
      this.keypressSave = false; // used to help determine what the save context was.
      // new or edit
      // 
      this.editContext = editContext;
      this.getPageName = getPageName;

      ContentTools.IMAGE_UPLOADER = this.createImageUploader;
      ContentTools.MIN_CROP = 30;
      ContentTools.DEFAULT_VIDEO_WIDTH = 889;
      ContentTools.DEFAULT_VIDEO_HEIGHT = 500;

      // eslint-disable-next-line
      ContentEdit.DEFAULT_MAX_ELEMENT_WIDTH = 980;
      // eslint-disable-next-line
      ContentEdit.RESIZE_CORNER_SIZE = 50;

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

      // Initialise editor for the page.
      // 
      this.editor = ContentTools.EditorApp.get();
      this.editor.init('*[data-editable]', 'data-name');

      window.addEventListener('keydown', (event) => this.handleKeyDown(event));
      this.editor.addEventListener('saved', (event) => this.handleSave(event, this.submitURL));
      this.editor.addEventListener('start', (event) => this.handleEditStart(event));
    }

  }

  getEditor(){
    return this.editor;
  }

  updateTemplateId(template_id){
    this.template_id = template_id;
    this.dirty_data = true;
  }

  updateSlug(slug) {
    this.slug = slug;
    this.dirty_data = true;
  }

  handleKeyDown(event) {
    let editorState = this.editor.getState().toUpperCase();
    // If editor is not in a state of EDITING and is also not in a READY state with dirty_data == true
    // then return early.
    if(editorState !== 'EDITING' && (editorState !== 'READY' && this.dirty_data)) {
      return;
    }
    // If the control key is not down in the editor then return early.
    if(!this.editor.ctrlDown()) {
      return;
    } else {
      this.handleKeyboardSave(event);
    }
  }

  handleKeyboardSave(event) {
    let handled = false;
    if (event.keyCode !== undefined) {
      if(event.keyCode === sKeyCode) {
        this.keypressSave = true;
        // save() already checks to see if there is dirty data before it issues a request to the server
        // so no need to check it again here.
        this.editor.save(true);
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
    this.getPageName = null;
  }

  dispatchNotification(show, header, content, notificationType) {
    this.dispatch({
      type: 'NOTIFICATION_SNACKBAR_UPDATE',
      show,
      header,
      content,
      notificationType
    })
  }
  
  handleEditStart(event) {
    // Call save every 30 seconds
    // let autoSave = () => {
    //   this.editor.save(true);
    // };
    // if(this.editContext !== 'new') {
    //   this.editor.autoSaveTimer = setInterval(autoSave, 30 * 1000);
    // }
  }
  handleEditStop(event) {
    // Stop the autosave
    // clearInterval(this.editor.autoSaveTimer);
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
      this.dirty_data = false;
    }
    this.editor.busy(false); // set the editor to not busy once handling of server response has been completed. 
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
  handleSave(event, submitURL) {

    if(this.editor.busy()) {
      this.dispatchNotification(true, 'Warning', 'Editor already saving, please wait', 'warning')
      return;
    }
    // while the editor is saving, set busy to true.
    this.editor.busy(true);
    
    if(!submitURL) {
      // IF no URL to save to is provided then return early
      this.editor.busy(false);
      return;
    }
    
    // Check if this was a passive save
    // 
    let passive = event.detail().passive;
    // Check to see if there are any changes to save
    // 
    let regions = event.detail().regions;
    // console.log(this.editor.domRegions());
    // console.log(this.editor.regions());
    let numRegions = Object.keys(regions).length;
    let payload = {};

    if (numRegions === 0 && !this.dirty_data) {
      this.editor.busy(false);
      return;
    } else {
      let regionValue;
      (Object.keys(regions)).forEach((key) => {
        if(key === 'name') {
          regionValue = regions[key].replace(/<\/?[^>]+(>|$)/g, "") // strip HTML tags
        } else {
          regionValue = regions[key]
        }
        payload[key] = regionValue;
      })
    }

    if(this.dirty_data || (this.editContext === 'new')) {
      payload.template_id = this.template_id;
      // if there is dirty data and there is a slug, then send the slug in the payload.
      // TODO: refactor this. As slug shouldn't be sent with every request.
      if(this.slug) {
        payload.slug = this.slug;
      }
    } 

    // Set the editors state to busy while we save our changes
    // 
    try {
      console.log('save');
      console.log(this.dispatch)
      let httpMethod = this.editContext === 'edit' ? 'put' : 'post'
      let client = new APIClient(this.dispatch);

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