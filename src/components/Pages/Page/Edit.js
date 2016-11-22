import React from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { replace } from 'react-router-redux'
import APIClient from '../../../http/requests'
import Editor from "../../Editor/Editor"
import s from '../../Editor/styles/content-tools.scss';
// Available templates
import HomeTemplate from '../Templates/Pages/HomeTemplate'
import ContactTemplate from '../Templates/Pages/ContactTemplate'
import BasicTemplate from '../Templates/Pages/BasicTemplate'
import LoginTemplate from '../Templates/Pages/LoginTemplate'
import PaymentTemplate from '../Templates/Pages/PaymentTemplate'
import SignupTemplate from '../Templates/Pages/SignupTemplate'
import ForgotPasswordTemplate from '../Templates/Pages/ForgotPasswordTemplate'
import ResetPasswordTemplate from '../Templates/Pages/ResetPasswordTemplate'

import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import EditDrawer from '../../Menu/EditDrawer'
import TemplateDropDown from '../Templates/TemplateDropDown'
import {slugify} from '../../../helpers/StringHelper';
import NotificationSnackbar from '../../Notifications/Snackbar/Snackbar';
import AppConfig from '../../../../app_config/app';
import defaultImage from '../Templates/Pages/home-bg.jpg';

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
      show_title: false,
      slug: props.slug ? props.slug : '',
      explicitSlug: props.slug ? true : false,
      submitDisabled: false,
      template: null,
      templates: [],
      template_id: props.template_id,
      image_url: null,
      summary: '',
      draft: true,
      in_menu: false
    }

    this.getPageURL = this.getPageURL.bind(this);
    this.getPageImage = this.getPageImage.bind(this);
  }

  componentWillUnmount() {
    this.resetEditor();
  }

  componentWillMount() {
    if(this.state.editContext === 'edit') {
      this.props.dispatch(replace('/admin/' + this.state.resourceURL + '/edit'))
    }
    this.setState({
      template: this.getTemplateComponent(this.props.template_id, this.props.name, this.props.content)
    })
  }

  resetEditor() {
    if(this.state.editor){
      this.props.deleteEditorData();
      this.state.editor.destroyEditor();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    // if(nextProps.pathname !== this.pathname) {
    //   this.resetEditor();
    // }
    // If there has been a change to the template_id then rerender the page with the
    // corresponding template.
    if(this.state.editor === null && nextState.editor !== null && this.state.editContext === 'new') {
      if(nextState.editor.editor.isReady()) {
        // nextState.editor.editor.syncRegions();
        nextState.editor.editor.start()
      }
    }
    if((this.state.template_id !== nextState.template_id)
      || (this.props.name !== nextProps.name)
      || (this.props.content !== nextProps.content)
    ){
      this.setState({
        template: this.getTemplateComponent(nextState.template_id, nextProps.name, nextProps.content)
      })
    }
  }

  componentDidMount(){
    this.setState({
      resourceURL: this.props.submitUrl
    });

    let client = new APIClient(this.props.dispatch)

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
  
  componentDidUpdate(prevProps, prevState) {
    if(prevState.template_id !== this.state.template_id) {
      if(this.state.editor) {
        this.state.editor.editor.syncRegions();
      }
    }
  }

  /**
   * Callback function used to update state data once the Editor has saved it.
   * @param  {string} url      - New url to the page that has been saved.
   * @param  {object} res      - The response from the server
   * @param  {boolean} passive - Whether or not the Editor was in passive mode when saving.
   * @return undefined.
   */
  handleSaveSuccess(url, res, passive){
    let newState = {
      content: res.body.data.content,
      name: res.body.data.name,
      explicitSlug: this.state.slug !== ''
    };

    // If the server has had to modify the state for some reason then show the updated state.
    //
    if(res.body.data.slug !== this.state.slug) {
      newState.slug = res.body.data.slug;
    }

    this.setState(newState);

    // if(url) {
    //   // this.props.dispatch(replace('/admin/' + url + '/edit'))
    // }
    this.props.updateSnackbar(true, 'Success', 'Page Saved!', 'success');
  }
  
  /**
   * Function used to update state data after it has been retreived from the API server.
   * @param  {APIClient} client             - The client use to make HTTP requests.
   * @param  {Object} res                   - The response from the API server
   * @param  {function} updateStateCallback - A callback function used to update the state.
   * @return undefined
   */
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

  /**
   * Set state values for the Page being edited based on the response for the API server.
   * @param {object} res - The response from the server
   */
  setPreExistingPageData(res) {
    this.props.updateEditorData({
      name: res.body.data.name,
      content: res.body.data.content
    })

    this.setState({
      full_path: res.body.data.full_path,
      templates: res.body.data.templates,
      slug: res.body.data.slug,
      editor: this.makeEditor(),
      show_title: res.body.data.show_title === 1,
      summary: res.body.data.summary || '',
      image_url: res.body.data.image_url || defaultImage,
      explicitSlug: res.body.data.slug ? true : false,
      draft: res.body.data.draft === 1,
      in_menu: res.body.data.in_menu === 1
    });

    if(!this.state.template_id) {
      this.setState({
        template_id: parseInt(res.body.data.template_id, 10)
      })
    }
    this.setState({
      template: this.getTemplateComponent(this.state.template_id, this.props.name, this.props.content)
    })
  }

  /**
   * Initialize state values for a new Page.
   * @param {object} res - server response object.
   */
  setNewPageData(res) {
    let editor = this.makeEditor();
    this.setState({
      templates: res.body.data, // data should contain a list of templates
      template_id: res.body.data[0].id,
      editor: editor,
      show_title: true
    })
    editor.updateField('template_id', res.body.data[0].id);
  }

  /**
   * Handler for when the Page name value changes.
   * @param  {event} event - the event that was fired
   * @return undefined
   */
  handleNameChanged(event){
    // If this is not a new page, or if there is already a slug return early.
    if(this.state.editContext !== 'new' || this.state.explicitSlug) {
      return 1;
    }
    // otherwise, update the slug based on what the 'name' currently is.
    // 
    this.updateSlug(slugify((event.target).textContent));
  }

  /**
   * Determine which page template component to render and return that component.
   * @param  {integer} template_id - The id corresponding to the template to render
   * @return {React.Component}     - The page template to render.
   */
  getTemplateComponent(template_id, name, content){
    let template = null;

    switch(template_id) {
      case 1: {
        template = (<BasicTemplate 
          name={name} 
          content={content}
          image_url={this.getPageImage()}
          url={this.getPageURL()}
          handleNameChanged={(e) => this.handleNameChanged(e)} />)
        break;
      }
      case 2: {
        template = (<ContactTemplate 
          name={name} 
          content={content}
          handleNameChanged={(e) => this.handleNameChanged(e)} />)
        break;
      }
      case 3: {
        template = (<HomeTemplate 
          name={name} 
          content={content}
          handleNameChanged={(e) => this.handleNameChanged(e)} />);
        break;
      }
      case 4: {
        template = (<LoginTemplate 
          name={name} 
          content={content} 
          disabled={true}
          handleNameChanged={(e) => this.handleNameChanged(e)} />);
        break;
      }
      case 5: {
        template = (<PaymentTemplate 
          name={name} 
          content={content} 
          submitDisabled={true}
          editMode={true}
          handleNameChanged={(e) => this.handleNameChanged(e)} />);
        break;
      }
      case 6: {
        template = (<SignupTemplate
          name={name} 
          content={content} 
          submitDisabled={true}
          editMode={true}
          handleNameChanged={(e) => this.handleNameChanged(e)} />);
        break;
      }
      case 7: {
        template = (<ForgotPasswordTemplate
          name={name} 
          content={content} 
          submitDisabled={true}
          editMode={true}
          handleNameChanged={(e) => this.handleNameChanged(e)} />);
        break;
      }
      case 8: {
        template = (<ResetPasswordTemplate
          name={name} 
          content={content} 
          submitDisabled={true}
          editMode={true}
          handleNameChanged={(e) => this.handleNameChanged(e)} />);
        break;
      }
      default: {
        template = (<BasicTemplate 
          name={name} 
          content={content}
          handleNameChanged={(e) => this.handleNameChanged(e)} />)
        break;
      }
    }

    return template;
  }

  /**
   * Create the Editor to use for editing content of a Page.
   * @return {Editor} - The editor to use for editing Page content.
   */
  makeEditor(){
    return new Editor(
      () => this.getAdditionalFieldValues(), 
      this.props.submitUrl, 
      (url, res, passive) => this.handleSaveSuccess(url, res, passive), 
      this.state.editContext, 
      this.props.resourceNamePlural, 
      this.props.dispatch,
    )
  }

  getAdditionalFieldValues() {
    return {
      image_url: this.state.image_url,
      show_title: this.state.show_title,
      summary: this.state.summary,
      template_id: this.state.template_id,
      slug: this.state.slug,
      in_menu: this.state.in_menu,
      draft: this.state.draft
    }
  }

  /**
   * Hander for when the value of the page template from the DropDown is changed.
   * @param  {integer} template_id - The new template_id
   * @return undefined
   */
  handleTemplateChange(template_id) {
    if(this.state.template_id === template_id){
      return;
    }

    this.updateData();
    this.updateTemplate(template_id);
  }

  updateTemplate(template_id) {
    this.setState({
      template_id: template_id
    })
    this.state.editor.updateTemplateId(template_id);
  }

  updateData() {
    if(this.state.editor.editor.history) {
      let snapshot = this.state.editor.editor.history.snapshot();
      this.props.updateEditorData({
        name: snapshot.regions.name.replace(/<\/?[^>]+(>|$)/g, ""),
        content: snapshot.regions.content
      })
    }
  }

  /**
   * Handler for when the value of the slug TextField changes.
   * @param  {Event} event - The event that was fired
   * @return undefined
   */
  handleSlugChange(event) {
    this.setState({explicitSlug: true})
    this.updateSlug(slugify(event.target.value));
  }

  updateSlug(slug) {
    this.setState({
      slug: slug
    })
    this.state.editor.updateField('slug', slug);
  }

  handleToggleShowTitle(event) {
    this.setState({
      show_title: !this.state.show_title
    })
    this.state.editor.updateField('show_title', !this.state.show_title);
  }

  getPageURL() {
    return (typeof(window) !== 'undefined') ? window.location.href : `${AppConfig.baseUrl}/${this.props.pathname}`;
  }

  getPageImage() {
    return this.state.image_url ? this.state.image_url : defaultImage;
  }

  handleFieldChange(evt, name, type) {
    evt.preventDefault();
    
    let newStateValue = {};
    
    if(type === 'toggle') {
      newStateValue[name] = !this.state[name];
    } else {
      newStateValue[name] = evt.target.value;
    }
    this.setState(newStateValue);
    this.state.editor.updateField(name, evt.target.value);
  }

  render() {
    return (
      <div className="page-edit">
        <EditDrawer>
          <Toggle
            label="Publish"
            labelPosition="right"
            onToggle={(evt) => this.handleFieldChange(evt, 'draft', 'toggle')}
            defaultToggled={!this.state.draft}
            style={{marginLeft: 24, marginTop: 5, width: 256}}
          />
          <TemplateDropDown 
            templateOptions={this.state.templates} 
            defaultTemplateId={this.state.template_id} 
            handleChangeCallback={(template_id) => this.handleTemplateChange(template_id)} 
          />
          {/* Do not display the slug text field if this is the homepage (page with full_path of "/") */}
          {this.state.editContext === 'edit' && this.state.full_path === '/' ?
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
          <Toggle
            label="Show Page Title?"
            labelPosition="right"
            onToggle={(event) => this.handleToggleShowTitle(event)}
            defaultToggled={this.state.show_title}
            style={{marginLeft: 24, marginTop: 5, width: 256}}
          />
          <TextField
            type='text'
            hintText='Summary (200 characters or less)'
            floatingLabelText='Summary'
            onChange={(e) => this.handleFieldChange(e, 'summary')}
            value={this.state.summary}
            style={{marginLeft: 24}}
            multiLine={true}
          /> 
        </EditDrawer>
        {this.state.template}
        <NotificationSnackbar />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    token: state.auth.token,
    pathname: state.routing.locationBeforeTransitions.pathname,
    name: state.admin.editorData.name,
    content: state.admin.editorData.content
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
    },
    updateEditorData: (newData) => {
      dispatch({
        type: 'UPDATE_ADMIN_EDITOR_DATA',
        newData
      })
    },
    deleteEditorData: () => {
      dispatch({
        type: 'DELETE_ADMIN_EDITOR_DATA'
      })
    },
    dispatch
  }
}

export default withStyles(s)(connect(
  mapStateToProps,
  mapDispatchToProps
)(PageEdit))
