import React from 'react';
import { connect } from 'react-redux';
import { apiGet, apiPut, apiPost, updateToken } from '../../../http/requests'
import NotificationSnackbar from '../../Notifications/Snackbar/Snackbar'
import TextField from 'material-ui/TextField';
import Editor from "../Admin/Quill/Editor"

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
          this.props.updateSnackbar(true, 'Error', res.statusText, 'error')
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
          value={this.state.name ? this.state.name : null}
          style={{width: '100%', fontSize: '4.0rem', lineHeight: '1.1', height: '6.0rem'}}
          autoFocus={this.state.name ? false : true}
        />
        <Editor content={this.state.content} handleSave={this.handleSave}/>
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