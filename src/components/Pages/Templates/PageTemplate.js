import React from 'react';
import { connect } from 'react-redux';
import APIClient from '../../../http/requests'
import Editor from "../../Editor/Editor"
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../../Editor/styles/content-tools.scss';
import { replace } from 'react-router-redux'
import ContentTools from 'ContentTools';
import HomePageTemplate from './HomePageTemplate'
import ContactPageTemplate from './ContactPageTemplate'

class PageTemplate extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      content: null,
      name: null,
      template: null,
      template_id: props.template_id,
      submitDisabled: false,
      resourceURL: props.resourceNamePlural + '/' + props.resourceId,
      editor: null
    }
  }

  getPageName(){
    return this.state.name;
  }

  getSubmitURL(){
    return this.state.resourceURL
  }

  handleSaveSuccess(url, passive){
    if(url) {
      this.store.dispatch(replace('/admin/' + url + '/edit'))

      this.setState({
        resourceURL: url
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
  componentWillMount() {
    if(this.props.context === 'edit') {
      this.context.store.dispatch(replace('/admin/' + this.state.resourceURL + '/edit'))
    }
    this.setState({
      template: this.getTemplateComponent(this.props.template_id)
    })
  }

  componentDidMount(){
    this.setState({
      resourceURL: this.props.submitUrl
    });

    if(this.props.context === 'edit'){
      let client = new APIClient(this.context.store)
      // if the Context is Edit, then get the existing data for the PageTemplate so it may be loaded into the page.
      client.get(this.state.resourceURL)
        .then((res) => {
          if (res.statusCode !== 200) {
            // not status OK
            console.log('Could not get data for Page ', res);
          } else {
            // this.setState({existingData: res.body.data})
            client.updateToken(res.header.authorization);

            this.setState({
              content: res.body.data.content,
              name: res.body.data.name,
              editor: this.makeEditor()
            })
            if(!this.state.template_id) {
              this.setState({
                template_id: res.body.data.template_id
              })
            }
            this.setState({
              template: this.getTemplateComponent(this.state.template_id)
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

  getTemplateComponent(template_id){
    let template = null;
    // May come in as a string from query params so parse as int.
    template_id = parseInt(template_id);

    switch(template_id) {
      case 1: {
        template = this.getBasicTemplate();
        break;
      }
      case 2: {
        template = this.getFancyTemplate();
        break;
      }
      case 3: {
        template = this.getOtherTemplate();
        break;
      }
      default: {
        template = this.getBasicTemplate();
        break;
      }
    }

    return template
  }

  getBasicTemplate(){
    return (
      <div className="page basic">
        <div className="page-container">
          <div data-editable data-name="name">
            <h1 data-ce-placeholder="Page Title">{this.state.name ? this.state.name : ''}</h1>
          </div>
          <div data-editable data-name="content" data-ce-placeholder="Content..."  dangerouslySetInnerHTML={{__html: this.state.content}} />
        </div>
      </div>
    )
  }

  getFancyTemplate(){
    return (
      <ContactPageTemplate name={this.state.name} content={this.state.content} />
    )
  }

  getOtherTemplate(){
    return (
      <HomePageTemplate name={this.state.name} content={this.state.content} />
    )
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
    return this.state.template
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