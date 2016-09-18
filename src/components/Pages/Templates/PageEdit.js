import React from 'react';
import { connect } from 'react-redux';
import APIClient from '../../../http/requests'
import Editor from "../../Editor/Editor"
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from '../../Editor/styles/content-tools.scss';
import { replace } from 'react-router-redux'
import ContentTools from 'ContentTools';
// Available templates
import HomePageTemplate from './HomePageTemplate'
import ContactPageTemplate from './ContactPageTemplate'
import BasicPageTemplate from './BasicPageTemplate'
import LoginPageTemplate from './LoginPageTemplate'
import PaymentPageTemplate from './PaymentPageTemplate'

import TemplateDropDown from './TemplateDropDown'
import BackButton from '../../Nav/BackButton'
import FloatingPageMenu from '../../Menu/FloatingPageMenu'
import TextField from 'material-ui/TextField';
import {slugify} from '../../../helpers/StringHelper';

class PageEdit extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      content: null,
      editor: null,
      editContext: this.props.editContext,
      full_path: '/',
      name: null,
      resourceURL: props.resourceNamePlural + '/' + props.resourceId,
      slug: props.slug ? props.slug : '',
      slugManuallySet: props.slug ? true : false,
      submitDisabled: false,
      template: null,
      templates: [],
      template_id: props.template_id
    }
  }

  getPageName(){
    return this.state.name;
  }

  getSubmitURL(){
    return this.state.resourceURL
  }

  handleSaveSuccess(url, res, passive){
    this.setState({
      content: res.body.data.content,
      name: res.body.data.name,
      slugManuallySet: this.state.slug !== ''
    });
    if(url) {
      // this.context.store.dispatch(replace('/admin/' + url + '/edit'))
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
    if(this.state.editContext === 'edit') {
      this.context.store.dispatch(replace('/admin/' + this.state.resourceURL + '/edit'))
    }
    this.setState({
      template: this.getTemplateComponent(this.props.template_id)
    })
  }

  componentWillUpdate(nextProps, nextState) {
    // If there has been a change to the template_id then rerender the page with the
    // corresponding template.
    if(this.state.editor === null && nextState.editor !== null && this.state.editContext === 'new') {
      if(nextState.editor.editor.isReady()) {
        // nextState.editor.editor.syncRegions();
        nextState.editor.editor.start()
      }
    }
    if(this.state.template_id !== nextState.template_id){
      this.setState({
        template: this.getTemplateComponent(nextState.template_id)
      })
    }
  }

  componentDidMount(){
    this.setState({
      resourceURL: this.props.submitUrl
    });

    let client = new APIClient(this.context.store)

    if(this.props.editContext === 'edit'){
      // if the Context is Edit, then get the existing data for the PageTemplate so it may be loaded into the page.
      client.get(this.state.resourceURL).then((res) => {
         this.handleSuccessfulDataFetch(client, res, (res) => this.setPreExistingPageData(res))
      }).catch((res) => {
        console.log('Error: ', res)
      })
    } else {
      // The context otherwise will be 'new' in this case get a list of templates and make the Editor.
      //
      client.get('page-templates').then((res) => {
        this.handleSuccessfulDataFetch(client, res, (res) => this.setNewPageData(res))
      }).catch((res) => {
        console.log('Error: ', res)
      })
    }
  }
  
  handleSuccessfulDataFetch(client, res, updateStateCallback) {
    if (res.statusCode !== 200) {
      console.log('Could not get data for Page ', res);
    } else {
      if(res.header && res.header.authorization) {
        client.updateToken(res.header.authorization);
      }
      updateStateCallback(res);
    }
  }

  setPreExistingPageData(res) {
    this.setState({
      content: res.body.data.content,
      full_path: res.body.data.full_path,
      name: res.body.data.name,
      templates: res.body.data.templates,
      slug: res.body.data.slug,
      editor: this.makeEditor(),
      slugManuallySet: res.body.data.slug ? true : false
    });

    if(!this.state.template_id) {
      this.setState({
        template_id: parseInt(res.body.data.template_id, 10)
      })
    }
    this.setState({
      template: this.getTemplateComponent(this.state.template_id)
    })
  }

  setNewPageData(res) {
    this.setState({
      templates: res.body.data,
      editor: this.makeEditor()
    })
  }
  handleNameChanged(event){
    // If this is not a new page, or if there is already a slug return early.
    if(this.state.editContext !== 'new' || this.state.slugManuallySet) {
      return;
    }
    // otherwise, update the slug based on what the name currently is.
    this.updateSlug(slugify((event.target).textContent));
  }

  getTemplateComponent(template_id){
    let template = null;

    switch(template_id) {
      case 1: {
        template = (<BasicPageTemplate 
          name={this.state.name} 
          content={this.state.content}
          handleNameChanged={(e) => this.handleNameChanged(e)} />)
        break;
      }
      case 2: {
        template = (<ContactPageTemplate 
          name={this.state.name} 
          content={this.state.content}
          handleNameChanged={(e) => this.handleNameChanged(e)} />)
        break;
      }
      case 3: {
        template = (<HomePageTemplate 
          name={this.state.name} 
          content={this.state.content}
          handleNameChanged={(e) => this.handleNameChanged(e)} />);
        break;
      }
      case 4: {
        template = (<LoginPageTemplate 
          name={this.state.name} 
          content={this.state.content} 
          disabled={true}
          handleNameChanged={(e) => this.handleNameChanged(e)} />);
        break;
      }
      case 5: {
        template = (<PaymentPageTemplate 
          name={this.state.name} 
          content={this.state.content} 
          disabled={true}
          handleNameChanged={(e) => this.handleNameChanged(e)} />);
        break;
      }
      default: {
        template = (<BasicPageTemplate 
          name={this.state.name} 
          content={this.state.content}
          handleNameChanged={(e) => this.handleNameChanged(e)} />)
        break;
      }
    }

    return template
  }

  makeEditor(){
    return new Editor(
      this.getPageName, 
      this.props.submitUrl, 
      (url, res, passive) => this.handleSaveSuccess(url, res, passive), 
      this.state.editContext, 
      this.props.resourceNamePlural, 
      this.context.store,
      this.state.template_id
    )
  }

  handleTemplateChange(template_id) {
    this.setState({template_id})
    this.state.editor.updateTemplateId(template_id);
  }

  resetForm(){
    this.props.resetForm(this.props.formName)
  }

  handleSlugChange(event) {
    this.setState({slugManuallySet: true})
    this.updateSlug(slugify(event.target.value));
  }

  updateSlug(slug) {
    this.setState({
      slug: slug
    })
    this.state.editor.updateSlug(slug);
  }

  render() {
    return (
      <div className="page-edit">
        <FloatingPageMenu>
          <BackButton label={this.props.resourceNamePlural} link={'/admin/' + this.props.resourceNamePlural.toLowerCase()} />
          <TemplateDropDown 
            templateOptions={this.state.templates} 
            defaultTemplateId={this.state.template_id} 
            handleChangeCallback={(template_id) => this.handleTemplateChange(template_id)} 
          />
          {/* Do not display the slug text field if this is the homepage (page with full_path of "/") */}
          {this.state.full_path === '/' ?
            null :
            <TextField
              type='text'
              hintText='example-slug'
              floatingLabelText='Page Slug'
              onChange={(e) => this.handleSlugChange(e)}
              value={this.state.slug}
              style={{marginLeft: 24}}
            /> 
          }
        </FloatingPageMenu>
        {this.state.template}
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

PageEdit.contextTypes = {
  store: React.PropTypes.object.isRequired
};

export default withStyles(s)(connect(
  mapStateToProps,
  mapDispatchToProps
)(PageEdit))