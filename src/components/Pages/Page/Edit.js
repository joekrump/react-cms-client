import React from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { replace } from 'react-router-redux'
import ContentTools from 'ContentTools';
import APIClient from '../../../http/requests'
import Editor from "../../Editor/Editor"
import s from '../../Editor/styles/content-tools.scss';
// Available templates
import HomePageTemplate from '../Templates/HomePageTemplate'
import ContactPageTemplate from '../Templates/ContactPageTemplate'
import BasicPageTemplate from '../Templates/BasicPageTemplate'
import LoginPageTemplate from '../Templates/LoginPageTemplate'
import PaymentPageTemplate from '../Templates/PaymentPageTemplate'

import TextField from 'material-ui/TextField';
import Toggle from 'material-ui/Toggle';
import BackButton from '../../Nav/BackButton'
import FloatingPageMenu from '../../Menu/FloatingPageMenu'
import TemplateDropDown from '../Templates/TemplateDropDown'
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
      showPageTitle: true,
      slug: props.slug ? props.slug : '',
      slugManuallySet: props.slug ? true : false,
      submitDisabled: false,
      template: null,
      templates: [],
      template_id: props.template_id
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
      slugManuallySet: this.state.slug !== ''
    };

    // If the server has had to modify the state for some reason then show the updated state.
    //
    if(res.body.data.slug !== this.state.slug) {
      newState.slug = res.body.data.slug;
    }

    this.setState(newState);

    if(url) {
      // this.context.store.dispatch(replace('/admin/' + url + '/edit'))
    }
    if (!passive) {
      new ContentTools.FlashUI('ok');
    }
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

  /**
   * Initialize state values for a new Page.
   * @param {[type]} res [description]
   */
  setNewPageData(res) {
    this.setState({
      templates: res.body.data,
      editor: this.makeEditor()
    })
  }

  /**
   * Handler for when the Page name value changes.
   * @param  {event} event - the event that was fired
   * @return undefined
   */
  handleNameChanged(event){
    // If this is not a new page, or if there is already a slug return early.
    // 
    if(this.state.editContext !== 'new' || this.state.slugManuallySet) {
      return;
    }
    // otherwise, update the slug based on what the name currently is.
    // 
    this.updateSlug(slugify((event.target).textContent));
  }

  /**
   * Determine which page template component to render and return that component.
   * @param  {integer} template_id - The id corresponding to the template to render
   * @return {React.Component}     - The page template to render.
   */
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

    return template;
  }

  /**
   * Create the Editor to use for editing content of a Page.
   * @return {Editor} - The editor to use for editing Page content.
   */
  makeEditor(){
    return new Editor(
      () => (this.state.name), 
      this.props.submitUrl, 
      (url, res, passive) => this.handleSaveSuccess(url, res, passive), 
      this.state.editContext, 
      this.props.resourceNamePlural, 
      this.context.store,
      this.state.template_id
    )
  }

  /**
   * Hander for when the value of the page template from the DropDown is changed.
   * @param  {integer} template_id - The new template_id
   * @return undefined
   */
  handleTemplateChange(template_id) {
    this.setState({template_id})
    this.state.editor.updateTemplateId(template_id);
  }

  resetForm(){
    this.props.resetForm(this.props.formName)
  }

  /**
   * Handler for when the value of the slug TextField changes.
   * @param  {Event} event - The event that was fired
   * @return undefined
   */
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

  handleToggleShowTitle(event) {
    this.setState({
      showTitle: !this.state.showTitle
    })
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
            defaultToggled={this.state.showPageTitle}
            style={{marginLeft: 24, marginTop: 5}}
          />
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