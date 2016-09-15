import APIClient from '../../http/requests'
import ContentTools from 'ContentTools';
import {ImageUploader, buildCloudinaryURL, parseCloudinaryURL} from './ImageUploader';

const sKeyCode = 83;

class Editor {

  constructor(getPageName, submitURL, handleSaveSuccess, context, resourceNamePlural, store) {
    this.submitURL = submitURL;
    this.handleSaveSuccess = handleSaveSuccess;
    this.resourceNamePlural = resourceNamePlural;
    this.store = store;
    // new or edit
    // 
    this.editContext = context;
    this.getPageName = getPageName;

    ContentTools.IMAGE_UPLOADER = this.createImageUploader;
    ContentTools.MIN_CROP = 30;
    ContentTools.DEFAULT_VIDEO_WIDTH = 800;
    ContentTools.DEFAULT_VIDEO_HEIGHT = 600;
    ContentEdit.DEFAULT_MAX_ELEMENT_WIDTH = 2000;

    // Capture image resize events and update the Cloudinary URL
    // eslint-disable-next-line
    ContentEdit.Root.get().bind('taint', function (element) {
      var args, filename, transforms, url;

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

    this.editor.addEventListener('saved', (event) => {this.handleSave(event, this.submitURL)});
    this.editor.addEventListener('start', this.handleEditStart.bind(this));
    this.editor.addEventListener('stop', this.handleEditStop.bind(this));

    if(typeof window !== 'undefined') {
      window.addEventListener('keydown', (event) => this.handleKeyDown(event));
    }
  }

  handleKeyDown(event) {
    // If not editing then return early.
    if(this.editor.getState().toUpperCase() !== 'EDITING') {
      return;
    }
    // If the control key is not down in the editor then return early.
    if(!this.editor.ctrlDown()) {
      return;
    }
    this.handleKeyboardSave(event);
  }

  handleKeyboardSave(event) {
    let handled = false;
    if (event.keyCode !== undefined) {
      if(event.keyCode === sKeyCode) {
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
  
  handleEditStart(event) {
    // Call save every 30 seconds
    let autoSave = () => {
      this.editor.save(true);
      // console.log(this.editor.getState());
    };
    this.editor.autoSaveTimer = setInterval(autoSave, 30 * 1000);
  }
  handleEditStop(event) {

    // Stop the autosave
    clearInterval(this.editor.autoSaveTimer);
  }
  handleSave(event, submitURL) {
    // console.log('Event: ', event)
    // console.log('this: ', this)
    if(!submitURL) {
      // IF no URL to save to is provided then return early
      return;
    }
    var passive, regions;

    // Check if this was a passive save
    passive = event.detail().passive;

    // Check to see if there are any changes to save
    regions = event.detail().regions;
    if (Object.keys(regions).length === 0) {
        return;
    }
    let payload = {}
    let regionValue;

    (Object.keys(regions)).forEach((key) => {
      if(key === 'name') {
        regionValue = regions[key].replace(/<\/?[^>]+(>|$)/g, "")
      } else {
        regionValue = regions[key]
      }
      payload[key] = regionValue;
    })

    // Set the editors state to busy while we save our changes
    // 
    try {
      this.editor.busy(true);
      let httpMethod = this.editContext === 'edit' ? 'put' : 'post'
      let client = new APIClient(this.store);

      client[httpMethod](submitURL, true, {data: payload})
      .then((res) => {
        if (res.statusCode !== 200) {
          this.editor.busy(false);
          new ContentTools.FlashUI('no');
        } else {
          this.editor.busy(false);
          if(this.editContext !== 'edit') {
            this.editContext = 'edit';
            this.submitURL = this.resourceNamePlural + '/' + res.body.data.id;
            this.handleSaveSuccess(this.submitURL, passive)
          } else {
            this.handleSaveSuccess(null, passive)
          }
        }
      }).catch((res) => {
        this.editor.busy(false);
        console.warn(res);
        
        if(res && res.statusText) {
          // this.props.updateSnackbar(true, 'Error', res.statusText, 'error')
        }
        new ContentTools.FlashUI('no');
      })
    } catch (e) {
      this.editor.busy(false);
      console.log('Exception: ', e)
      new ContentTools.FlashUI('no');
    }
  }
}

export default Editor;