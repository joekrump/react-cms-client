import React from 'react';
import { connect } from 'react-redux';
import { apiGet, apiPut, apiPost, updateToken } from '../../../http/requests'
import NotificationSnackbar from '../../Notifications/Snackbar/Snackbar'
import TextField from 'material-ui/TextField';
import { loadScript, loadStylesheet } from '../../../helpers/ScriptsHelper'
// import Editor from "../../Editor/QuillEditor/Editor"

const listItemStyle = {
  padding: "0 16px"
};

const PageTemplate = React.createClass({

  getInitialState(){
    return {
      content: null,
      name: null,
      submitDisabled: false
    }
  },
  componentDidMount(){

    if(this.props.context === 'edit'){
      loadScript('/content-tools/content-tools.min.js', function(){

        loadStylesheet('/content-tools/content-tools.min.css', function(){
          var editor = ContentTools.EditorApp.get();
          editor.init('*[data-editable]', 'data-name');

            var ImageUploader;

            ImageUploader = (function() {
              ImageUploader.imagePath = 'image.png';

              ImageUploader.imageSize = [600, 174];

              function ImageUploader(dialog) {
                this._dialog = dialog;
                this._dialog.addEventListener('cancel', (function(_this) {
                  return function() {
                    return _this._onCancel();
                  };
                })(this));
                this._dialog.addEventListener('imageuploader.cancelupload', (function(_this) {
                  return function() {
                    return _this._onCancelUpload();
                  };
                })(this));
                this._dialog.addEventListener('imageuploader.clear', (function(_this) {
                  return function() {
                    return _this._onClear();
                  };
                })(this));
                this._dialog.addEventListener('imageuploader.fileready', (function(_this) {
                  return function(ev) {
                    return _this._onFileReady(ev.detail().file);
                  };
                })(this));
                this._dialog.addEventListener('imageuploader.mount', (function(_this) {
                  return function() {
                    return _this._onMount();
                  };
                })(this));
                this._dialog.addEventListener('imageuploader.rotateccw', (function(_this) {
                  return function() {
                    return _this._onRotateCCW();
                  };
                })(this));
                this._dialog.addEventListener('imageuploader.rotatecw', (function(_this) {
                  return function() {
                    return _this._onRotateCW();
                  };
                })(this));
                this._dialog.addEventListener('imageuploader.save', (function(_this) {
                  return function() {
                    return _this._onSave();
                  };
                })(this));
                this._dialog.addEventListener('imageuploader.unmount', (function(_this) {
                  return function() {
                    return _this._onUnmount();
                  };
                })(this));
              }

              ImageUploader.prototype._onCancel = function() {};

              ImageUploader.prototype._onCancelUpload = function() {
                clearTimeout(this._uploadingTimeout);
                return this._dialog.state('empty');
              };

              ImageUploader.prototype._onClear = function() {
                return this._dialog.clear();
              };

              ImageUploader.prototype._onFileReady = function(file) {
                var upload;
                console.log(file);
                this._dialog.progress(0);
                this._dialog.state('uploading');
                upload = (function(_this) {
                  return function() {
                    var progress;
                    progress = _this._dialog.progress();
                    progress += 1;
                    if (progress <= 100) {
                      _this._dialog.progress(progress);
                      return _this._uploadingTimeout = setTimeout(upload, 25);
                    } else {
                      return _this._dialog.populate(ImageUploader.imagePath, ImageUploader.imageSize);
                    }
                  };
                })(this);
                return this._uploadingTimeout = setTimeout(upload, 25);
              };

              ImageUploader.prototype._onMount = function() {};

              ImageUploader.prototype._onRotateCCW = function() {
                var clearBusy;
                this._dialog.busy(true);
                clearBusy = (function(_this) {
                  return function() {
                    return _this._dialog.busy(false);
                  };
                })(this);
                return setTimeout(clearBusy, 1500);
              };

              ImageUploader.prototype._onRotateCW = function() {
                var clearBusy;
                this._dialog.busy(true);
                clearBusy = (function(_this) {
                  return function() {
                    return _this._dialog.busy(false);
                  };
                })(this);
                return setTimeout(clearBusy, 1500);
              };

              ImageUploader.prototype._onSave = function() {
                var clearBusy;
                this._dialog.busy(true);
                clearBusy = (function(_this) {
                  return function() {
                    _this._dialog.busy(false);
                    return _this._dialog.save(ImageUploader.imagePath, ImageUploader.imageSize, {
                      alt: 'Example of bad variable names'
                    });
                  };
                })(this);
                return setTimeout(clearBusy, 1500);
              };

              ImageUploader.prototype._onUnmount = function() {};

              ImageUploader.createImageUploader = function(dialog) {
                return new ImageUploader(dialog);
              };

              return ImageUploader;

            window.ImageUploader = ImageUploader;

            window.onload = function() {
              var FIXTURE_TOOLS, editor, req;
              ContentTools.IMAGE_UPLOADER = ImageUploader.createImageUploader;
              ContentTools.StylePalette.add([new ContentTools.Style('By-line', 'article__by-line', ['p']), new ContentTools.Style('Caption', 'article__caption', ['p']), new ContentTools.Style('Example', 'example', ['pre']), new ContentTools.Style('Example + Good', 'example--good', ['pre']), new ContentTools.Style('Example + Bad', 'example--bad', ['pre'])]);
              editor = ContentTools.EditorApp.get();
              editor.init('[data-editable], [data-fixture]', 'data-name');
              editor.addEventListener('saved', function(ev) {
                var saved;
                console.log(ev.detail().regions);
                if (Object.keys(ev.detail().regions).length === 0) {
                  return;
                }
                editor.busy(true);
                saved = (function(_this) {
                  return function() {
                    editor.busy(false);
                    return new ContentTools.FlashUI('ok');
                  };
                })(this);
                return setTimeout(saved, 2000);
              });
              FIXTURE_TOOLS = [['undo', 'redo', 'remove']];
              ContentEdit.Root.get().bind('focus', function(element) {
                var tools;
                if (element.isFixed()) {
                  tools = FIXTURE_TOOLS;
                } else {
                  tools = ContentTools.DEFAULT_TOOLS;
                }
                if (editor.toolbox().tools() !== tools) {
                  return editor.toolbox().tools(tools);
                }
              });
              req = new XMLHttpRequest();
              req.overrideMimeType('application/json');
              req.open('GET', 'https://raw.githubusercontent.com/GetmeUK/ContentTools/master/translations/lp.json', true);
              return req.onreadystatechange = function(ev) {
                var translations;
                if (ev.target.readyState === 4) {
                  translations = JSON.parse(ev.target.responseText);
                  ContentEdit.addTranslations('lp', translations);
                  return ContentEdit.LANGUAGE = 'lp';
                }
              };
            };

          }).call(this);

        });
      });
      

      apiGet(this.props.resourceNamePlural + '/' + this.props.resourceId)
        .end(function(err, res){
          if(err !== null) {
            if(res.responseCode === 404) {
              console.warn(res);
            }
            // Something unexpected happened
          } else if (res.statusCode !== 200) {
            // not status OK
            console.log('Could not get Data for resource ', res);
          } else {
            // this.setState({existingData: res.body.data})
            updateToken(res.header.authorization);
            this.setState({
              content: res.body.data.editor_contents,
              name: res.body.data.name
            })

          }
        }.bind(this));
    } 
  },
  resetForm(){
    this.props.resetForm(this.props.formName)
  },

  handleSave(htmlContents) {
    this.submitToServer(htmlContents);
  },
  submitToServer(htmlContents){

    try {
      let serverRequest = this.props.context === 'edit' ? apiPut(this.props.submitUrl) : apiPost(this.props.submitUrl);
      
      this.setState({
        content: htmlContents
      });

      serverRequest.send({
        contents: htmlContents,
        template_id: 1,
        name: this.state.name
      })
      .end(function(err, res){
        if(err !== null) {

          console.warn(err);
          
          if(res && res.statusText) {
            this.props.updateSnackbar(true, 'Error', res.statusText, 'error')
          }
          
          // Something unexpected happened
        } else if (res.statusCode !== 200) {
          // not status OK
          // console.log('Resource Form not OK ',res);
          // res.body.errors gives an array of errors from the server.
          // 
          this.props.updateSnackbar(true, 'Error', res.body.message, 'warning');
        } else {

          if(this.props.context == 'edit') {
            this.props.updateSnackbar(true, 'Success', 'Update Successful', 'success');
          } else {
            this.props.updateSnackbar(true, 'Success', 'Added Successfully', 'success');
          }

          if(this.props.loginCallback) {
            this.props.loginCallback(res.body.user, res.body.token)
          } else {
            // if(this.props.context !== 'edit'){
            //   setTimeout(this.resetForm, 500);
            // }
          }
        }
      }.bind(this));
    } catch (e) {
      console.log('Exception: ', e)
    }
  },
  handleNameChange(e) {
    this.setState({
      name: e.target.value
    });
  },
  render() {
    return (
      <div>
        <TextField
          type='text'
          hintText="Page Name"
          // floatingLabelText="Page Name"
          onChange={(e) => this.handleNameChange(e)}
          // errorText={this.props.errorText}
          value={this.state.name ? this.state.name : ''}
          style={{width: '100%', fontSize: '4.0rem', lineHeight: '1.1', height: '6.0rem'}}
          autoFocus={this.state.name ? false : true}
        />
        <div data-editable data-name="article" dangerouslySetInnerHTML={{__html: this.state.content}} />
        <NotificationSnackbar 
          open={this.props.snackbar.show} 
          header={this.props.snackbar.header}
          content={this.props.snackbar.content}
          type={this.props.snackbar.notificationType}
        />
      </div>
    )
  }
})

const mapStateToProps = (state, ownProps) => {
  return {
    token: state.auth.token,
    snackbar: {
      show: state.notifications.snackbar.show,
      header: state.notifications.snackbar.header,
      content: state.notifications.snackbar.content,
      notificationType: state.notifications.snackbar.notificationType
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateSnackbar: (show, header, content, notificationType) => {
      dispatch ({
        type: 'NOTIFICATION_SNACKBAR_UPDATE',
        show,
        header,
        content,
        notificationType
      })
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PageTemplate)