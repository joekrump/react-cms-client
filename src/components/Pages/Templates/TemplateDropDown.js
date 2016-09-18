import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';


export default class TemplateDropDown extends React.Component {

  constructor(props) {
    super(props);
    
    // let template_id = typeof props.defaultTemplate === 'string' ? parseInt(props.defaultTemplate) : props.defaultTemplate;
    
    this.state = {
      value: props.defaultTemplateId ? props.defaultTemplateId : 1
    };
  }

  handleChange = (event, index, value) => {
    this.setState({value});
    this.props.handleChangeCallback(value);
  }

  componentWillReceiveProps(nextProps){
    if((nextProps.defaultTemplateId) && (this.props.defaultTemplateId !== nextProps.defaultTemplateId)) {
      // let template_id = typeof nextProps.defaultTemplate === 'string' ? parseInt(nextProps.defaultTemplate) : nextProps.defaultTemplate;
      // console.log('Type: ', (typeof template_id))

      this.setState({value: nextProps.defaultTemplateId})
    }
  }

  render() {
    if(!this.props.templateOptions.length === 0) {
      return null;
    }

    let menuItems = this.props.templateOptions.map((option) => {
      return (<MenuItem key={'template-option-' + option.id} value={option.id} primaryText={option.display_name} />)
    })
    return (
      <div>
        <DropDownMenu value={this.state.value} onChange={this.handleChange}
          style={{width: 302}}
        >
          {menuItems}
        </DropDownMenu>
      </div>
    );
  }
}