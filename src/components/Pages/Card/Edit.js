import React from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { replace } from 'react-router-redux'
import ContentTools from 'ContentTools';
import APIClient from '../../../http/requests'
import Editor from "../../Editor/Editor"
import s from '../../Editor/styles/content-tools.scss';

// import LatinCardTemplate from '../Templates/Cards/LatinCardTemplate'
// import BasicCardTemplate from '../Templates/Cards/BasicCardTemplate'
import Card from './Card';
import BackButton from '../../Nav/BackButton'
import FloatingPageMenu from '../../Menu/FloatingPageMenu'
import TemplateDropDown from '../Templates/TemplateDropDown'
import NotificationSnackbar from '../../Notifications/Snackbar/Snackbar'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

class CardEdit extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      front_content: null,
      back_content: null,
      primary: null,
      editor: null,
      editContext: this.props.editContext,
      full_path: '/',
      name: null,
      side: 'FRONT',
      resourceURL: props.resourceNamePlural + '/' + props.resourceId,
      template: null,
      templates: [{id:1, display_name:'Basic Card'}, {id:2, display_name:'Latin Card'}],
      template_id: props.template_id ? props.template_id : 1
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
         this.handleSuccessfulDataFetch(client, res, (res) => this.setPreExistingCardData(res))
      }).catch((res) => {
        console.log('Error: ', res)
      })
    } else {
      this.setNewCardData([{id:1, display_name:'Basic Card'}, {id:2, display_name:'Latin Card'}])
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
      front_content: res.body.data.front_content,
      back_content: res.body.data.back_content
    };

    this.setState(newState);

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
      console.warn('Could not get data for Card ', res);
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
  setPreExistingCardData(res) {
    this.setState({
      front_content: res.body.data.front_content,
      back_content: res.body.data.back_content,
      template_id: res.body.data.template_id,
      primary: res.body.data.primary,
      editor: this.makeEditor(),
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
   * @param {object} res - server response object.
   */
  setNewCardData(data) {
    let editor = this.makeEditor();
    this.setState({
      editor: editor
    })
    // set the template_id within the context of the editor
    editor.updateTemplateId(this.state.template_id);
  }

  getTemplateComponent(template_id){
    let template = null;

    switch(template_id) {
      case 1: {
        template = 'basic'
        break;
      }
      case 2: {
        template = 'latin'
        break;
      }
      default: {
        template = 'basic'
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
      () => (this.state.primary), 
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
    let template = this.getTemplateComponent(template_id);
    console.log(template_id);
    console.log(template);
    this.setState({
      template_id,
      template
    })
    this.state.editor.updateTemplateId(template_id);
  }

  onSideChange(evt, value) {
    this.setState({
      side: value
    })
  }

  render() {
    return (
      <div className="card-edit">
        <FloatingPageMenu>
          <BackButton label={this.props.resourceNamePlural} link={'/admin/' + this.props.resourceNamePlural.toLowerCase()} />
          <TemplateDropDown 
            templateOptions={this.state.templates} 
            defaultTemplateId={this.state.template_id} 
            handleChangeCallback={(template_id) => this.handleTemplateChange(template_id)} 
          />
          <RadioButtonGroup 
            style={{marginLeft: 24}}
            name="side" defaultSelected="FRONT" onChange={(evt, value) => this.onSideChange(evt, value)}>
            <RadioButton
              value="FRONT"
              label="Show Front"
              style={{marginTop: 16, marginBottom: 16}}
            />
            <RadioButton
              value="BACK"
              label="Show Back"
            />
          </RadioButtonGroup>
        </FloatingPageMenu>
        <Card
          cardClass={this.state.template}
          side={this.state.side}
          editContext="edit"
          duration={800}
          front_content={this.state.front_content} 
          back_content={this.state.back_content}
        >
        </Card>
        <NotificationSnackbar 
          open={this.props.snackbar.show} 
          header={this.props.snackbar.header}
          content={this.props.snackbar.content}
          type={this.props.snackbar.notificationType}
        />
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

CardEdit.contextTypes = {
  store: React.PropTypes.object.isRequired
};

export default withStyles(s)(connect(
  mapStateToProps,
  mapDispatchToProps
)(CardEdit))
