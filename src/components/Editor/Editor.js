import { apiPost, apiPut } from '../../http/requests'
import ContentTools from 'ContentTools';
import {ImageUploader, buildCloudinaryURL, parseCloudinaryURL} from './ImageUploader';

require('./styles/content-tools.scss');

class Editor {

  constructor(getPageName, getSubmitURL, setSubmitURL, context, resourceNamePlural) {
    this.getSubmitURL = getSubmitURL;
    this.setSubmitURL = setSubmitURL;
    this.resourceNamePlural = resourceNamePlural;
    // new or edit
    // 
    this.editContext = context;
    this.getPageName = getPageName;

    ContentTools.IMAGE_UPLOADER = this.createImageUploader;
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

      // If no filename is found then exit (not a Cloudinary image)
      if (!filename) {
        return;
      }

      // Remove any existing resize transform
      if (transforms.length > 0 && transforms[transforms.length -1]['c'] === 'fill') {
        transforms.pop();
      }

      // Change the resize transform for the element
      transforms.push({c: 'fill', w: element.size()[0], h: element.size()[1]});
      url = buildCloudinaryURL(filename, transforms);
      if (url !== element.attr('src')) {
        element.attr('src', url);
      }
    });

    // Initialise editor for the page.
    // 
    this.editor = ContentTools.EditorApp.get();
    this.editor.init('*[data-editable]', 'data-name');
    this.editor.addEventListener('saved', this.handleSave.bind(this));
    this.editor.addEventListener('start', this.handleEditStart.bind(this));
    this.editor.addEventListener('stop', this.handleEditStop.bind(this));
    // Start the editor for the page by default.
    // this.editor.start();

  }

  createImageUploader(dialog){
    return new ImageUploader(dialog);
  }

  destoryEditor(){
    this.editor.destroy();
    this.getSubmitURL = null;
    this.setSubmitURL = null;
    this.resourceNamePlural = null;
    this.editContext = null;
    this.getPageName = null;
  }
  
  handleEditStart(event) {
    // Call save every 30 seconds
    let autoSave = () => {
      this.editor.save(true);
      console.log(this.editor.getState());
    };
    this.editor.autoSaveTimer = setInterval(autoSave, 30 * 1000);
  }
  handleEditStop(event) {

    // Stop the autosave
    clearInterval(this.editor.autoSaveTimer);
  }
  handleSave(event) {
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

    (Object.keys(regions)).map((key) => {
      console.log(key)
      if(key === 'name') {
        regionValue = regions[key].replace(/<\/?[^>]+(>|$)/g, "")
      } else {
        regionValue = regions[key]
      }
      payload[key] = regionValue;
    })

    // Set the editors state to busy while we save our changes
    try {
      this.editor.busy(true);
      console.log(payload);
      let serverRequest = this.editContext === 'edit' ? apiPut(this.getSubmitURL()) : apiPost(this.getSubmitURL())
      serverRequest.send(payload)

      .end(function(err, res){
        if(err !== null) {
          this.editor.busy(false);
          console.warn(err);
          
          if(res && res.statusText) {
            // this.props.updateSnackbar(true, 'Error', res.statusText, 'error')
          }
          new ContentTools.FlashUI('no');
          
          // Something unexpected happened
        } else if (res.statusCode !== 200) {
          this.editor.busy(false);
          new ContentTools.FlashUI('no');
          // not status OK
          // console.log('Resource Form not OK ',res);
          // res.body.errors gives an array of errors from the server.
          // 
          // this.props.updateSnackbar(true, 'Error', res.body.message, 'warning');
        } else {
          this.editor.busy(false);
          if(this.editContext !== 'edit') {
            this.editContext = 'edit';
            this.setSubmitURL(this.resourceNamePlural + '/' + res.body.data.id)
          }

          if (!passive) {
            new ContentTools.FlashUI('ok');
          }

          // if(this.props.loginCallback) {
          //   this.props.loginCallback(res.body.user, res.body.token)
          // } else {
          //   // if(this.props.context !== 'edit'){
          //   //   setTimeout(this.resetForm, 500);
          //   // }
          // }
        }
      }.bind(this));
    } catch (e) {
      this.editor.busy(false);
      console.log('Exception: ', e)
    }
  }
}

export default Editor;