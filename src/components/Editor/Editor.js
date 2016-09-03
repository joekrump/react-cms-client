import { loadScript, loadStylesheet } from '../../helpers/ScriptsHelper'
import { apiPost, apiPut, updateToken } from '../../../http/requests'

class Editor {

  constructor(getPageName, getSubmitURL, setSubmitURL, context) {
    this.getSubmitURL = getSubmitURL;
    this.setSubmitURL = setSubmitURL;
    // new or edit
    this.editContext = context;
    this.getPageName = getPageName;
    loadScript('/content-tools/content-tools.min.js', () => {

      loadStylesheet('/content-tools/content-tools.min.css', () => {
        var editor = ContentTools.EditorApp.get();

        editor.init('*[data-editable]', 'data-name');

        editor.addEventListener('saved', this.handleSave.bind(this, editor));
        editor.addEventListener('start', this.handleEditStart.bind(this, editor));
        editor.addEventListener('stop', this.handleEditStop.bind(this, editor));        

      });
    });
  }
  
  handleEditStart(editor, event) {
    // Call save every 30 seconds
    let autoSave = () => {
      editor.save(true);
    };
    editor.autoSaveTimer = setInterval(autoSave, 30 * 1000);
  }
  handleEditStop(editor, event) {

    // Stop the autosave
    clearInterval(editor.autoSaveTimer);
  }
  handleSave(editor, event) {
    var name, onStateChange, passive, payload, regions, xhr;

    // Check if this was a passive save
    passive = event.detail().passive;

    // Check to see if there are any changes to save
    regions = event.detail().regions;
    if (Object.keys(regions).length == 0) {
        return;
    }

    // Set the editors state to busy while we save our changes
    editor.busy(true);

    // // Collect the contents of each region into a FormData instance
    // payload = new FormData();
    // payload.append('contents', regions.article);
    // payload.append('name', this.getPageName())

    // for (name in regions) {
    //     payload.append(name, regions[name]);
    // }

    // Send the update content to the server to be saved
    // onStateChange = function(event) {
    //   // Check if the request is finished
    //   if (event.target.readyState == 4) {
    //     editor.busy(false);
    //     if (event.target.status == '200') {
    //       // Save was successful, notify the user with a flash
    //       if (!passive) {
    //           new ContentTools.FlashUI('ok');
    //       }
    //     } else {
    //       // Save failed, notify the user with a flash
    //       new ContentTools.FlashUI('no');
    //     }
    //   }
    // };

    try {
      let serverRequest = this.editContext === 'edit' ? apiPut(this.getSubmitURL()) : apiPost(this.getSubmitURL())

      serverRequest.send({
        contents: regions.article,
        template_id: 1,
        name: this.getPageName()
      })
      .end(function(err, res){
        if(err !== null) {
          editor.busy(false);
          console.warn(err);
          
          if(res && res.statusText) {
            // this.props.updateSnackbar(true, 'Error', res.statusText, 'error')
          }
          
          // Something unexpected happened
        } else if (res.statusCode !== 200) {
          editor.busy(false);
          // not status OK
          // console.log('Resource Form not OK ',res);
          // res.body.errors gives an array of errors from the server.
          // 
          // this.props.updateSnackbar(true, 'Error', res.body.message, 'warning');
        } else {
          editor.busy(false);
          if(this.editContext !== 'edit') {
            this.setSubmitURL('test')
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
      console.log('Exception: ', e)
    }
  }
}

export default Editor;