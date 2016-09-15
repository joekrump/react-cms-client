import React from 'react';
import { connect } from 'react-redux';
import APIClient from '../../../http/requests'
import Editor from "../../Editor/Editor"
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../../Editor/styles/content-tools.scss';
import { replace } from 'react-router-redux'
import ContentTools from 'ContentTools';

class PageTemplate extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      content: null,
      name: null,
      templateName: null,
      submitDisabled: false,
      submitURL: '',
      editor: null
    }
  }

  getPageName(){
    return this.state.name;
  }

  getSubmitURL(){
    return this.state.submitURL
  }

  handleSaveSuccess(url, passive){
    if(url) {
      this.store.dispatch(replace('/admin/' + url + '/edit'))

      this.setState({
        submitURL: url
      });
    }

    if (!passive) {
      new ContentTools.FlashUI('ok');
    }
  }

  componentWillUnmount() {
    if(this.state.editor){
      this.state.editor.destroyEditor();
    }
  }

  componentDidMount(){
    this.setState({
      submitURL: this.props.submitUrl
    });

    if(this.props.context === 'edit'){
      let client = new APIClient(this.context.store)
      // if the Context is Edit, then get the existing data for the PageTemplate so it may be loaded into the page.
      client.get(this.props.resourceNamePlural + '/' + this.props.resourceId)
        .then((res) => {
          if (res.statusCode !== 200) {
            // not status OK
            console.log('Could not get data for Page ', res);
          } else {
            // this.setState({existingData: res.body.data})
            client.updateToken(res.header.authorization);

            this.setTemplate(res.body.data.template_id, this.setTemplateComponent);
            this.setState({
              content: res.body.data.content,
              name: res.body.data.name,
              editor: this.makeEditor()
            })
          }
        }).catch((res) => {
          console.log('Error: ', res)
        })
    } else {
      // If the context is not edit then just load the editor.
      this.setState({editor: this.makeEditor()});
    }
  }

  setTemplate(template_id, callback){
    let templateName = 'basic';

    switch(template_id) {
      case 1: {
        templateName = 'basic'
        break;
      }
      case 2: {
        templateName = 'fancy'
        break;
      }
      case 3: {
        templateName = 'other'
        break;
      }
      default: {
        break;
      }
    }
    this.setState({templateName});

    callback(templateName);
  }

  setTemplateComponent(templateName){
    
  }

  makeEditor(){
    return new Editor(
      this.getPageName, 
      this.props.submitUrl, 
      this.handleSaveSuccess, 
      this.props.context, 
      this.props.resourceNamePlural, 
      this.context.store
    )
  }

  resetForm(){
    this.props.resetForm(this.props.formName)
  }

  handleNameChange(e) {
    this.setState({
      name: e.target.value
    });
  }
  
  render() {

    return (
      <div>
        <div data-editable data-name="name">
          <h1 data-ce-placeholder="Page Title">{this.state.name ? this.state.name : ''}</h1>
        </div>
        <div data-editable data-name="content" data-ce-placeholder="Content..."  dangerouslySetInnerHTML={{__html: this.state.content}} />
      </div>
    )
  }
}

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

PageTemplate.contextTypes = {
  store: React.PropTypes.object.isRequired
};


export default withStyles(s)(connect(
  mapStateToProps,
  mapDispatchToProps
)(PageTemplate))