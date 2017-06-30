import React from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { replace } from 'react-router-redux';
import { APIClient } from '../../../http/requests';
import Editor from "../../Editor/Editor";
import s from '../../Editor/styles/content-tools.scss';
import { updateSnackbar } from "../../../redux/actions/notification";
import Card from './Card';
import EditDrawer from '../../Menu/EditDrawer';
import DropDown from '../Templates/DropDown';
import NotificationSnackbar from '../../Notifications/Snackbar/Snackbar';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

const templateIds = [1, 2];
const templateOptions = {
  1: { id: 1, displayName: "Basic Card", cardClassName: "basic" },
  2: { id: 2, displayName: "Latin Card", cardClassName: "latin" }
};

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
      resourceURL: `${props.resourceNamePlural}/${props.resourceId}`,
      selectedTemplate: null,
      templateId: props.template_id ? props.template_id : templateIds[0]
    }
  }

  componentWillUnmount() {
    if(this.state.editor){
      this.state.editor.destroyEditor();
    }
  }

  componentWillMount() {
    if(this.state.editContext === 'edit') {
      this.props.dispatch(replace(`/admin/${this.state.resourceURL}/edit`))
    }
    this.setState({
      selectedTemplate: this.getTemplateComponent(this.props.template_id)
    })
  }

  componentWillUpdate(nextProps, nextState) {
    // If there has been a change to the templateId then rerender the page with the
    // corresponding template.
    if(this.state.editor === null && nextState.editor !== null && this.state.editContext === 'new') {
      if(nextState.editor.editor.isReady()) {
        // nextState.editor.editor.syncRegions();
        nextState.editor.editor.start()
      }
    }
    if(this.state.templateId !== nextState.templateId){
      this.setState({
        selectedTemplate: this.getTemplateComponent(nextState.templateId)
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
         this.handleSuccessfulDataFetch(client, res, (res) => this.setPreExistingCardData(res))
      }).catch((res) => {
        console.warn('Error: ', res)
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
    const newState = {
      front_content: res.body.data.front_content,
      back_content: res.body.data.back_content
    };

    this.setState(newState);
    this.props.updateSnackbar(true, 'Success', 'Note Saved!', 'success');
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
      templateId: parseInt(res.body.data.template_id, 10),
      primary: res.body.data.primary,
      editor: this.makeEditor(),
    });

    this.setState({
      selectedTemplate: this.getTemplateComponent(this.state.templateId)
    });
  }

  /**
   * Initialize state values for a new Page.
   * @param {object} res - server response object.
   */
  setNewCardData(data) {
    const editor = this.makeEditor();
    this.setState({ editor });
    editor.updateField("template_id", this.state.templateId);
  }

  getTemplateComponent(templateId){
    let template = templateOptions[templateId];
    
    if(!template) {
      template = this.getDefaultTemplate();
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
      template_id: this.state.templateId,
    }
  }

  getDefaultTemplate() {
    return templateOptions[this.state.templateId];
  }

  handleTemplateChange(optionSelected) {
    this.setState({
      templateId: optionSelected.id,
      selectedTemplate: optionSelected
    });
    this.state.editor.updateField('template_id', optionSelected.id);
  }

  changeSide(evt, side) {
    this.setState({ side });
  }

  render() {
    return (
      <div className="card-edit">
        <EditDrawer>
          <DropDown 
            options={templateOptions}
            indexes={templateIds}
            selectedOption={this.state.selectedTemplate} 
            handleChangeCallback={(optionSelected) => this.handleTemplateChange(optionSelected)} 
          />
          <RadioButtonGroup 
            style={{marginLeft: 24}}
            name="side" defaultSelected="FRONT"
            onChange={(evt, value) => this.changeSide(evt, value)}
          >
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
        </EditDrawer>
        <Card
          cardClass={this.state.selectedTemplate.cardClassName}
          side={this.state.side}
          editContext="edit"
          duration={800}
          front_content={this.state.front_content} 
          back_content={this.state.back_content}
        >
        </Card>
        <NotificationSnackbar />
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateSnackbar: function(show, header, content, notificationType) {
    dispatch(updateSnackbar(show, header, content, notificationType));
  },
  dispatch
});

export default withStyles(s)(connect(
  null,
  mapDispatchToProps
)(CardEdit));

