import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';


export default class TemplateDropDown extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultTemplate ? props.defaultTemplate : 1
    };
  }

  handleChange = (event, index, value) => {
    this.setState({value});
    this.props.handleChangeCallback(value);
  }

  componentWillReceiveProps(nextProps){
    if((nextProps.defaultTemplate) && this.props.defaultTemplate !== nextProps.defaultTemplate) {
      this.setState({value: parseInt(nextProps.defaultTemplate, 10)})
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
        <DropDownMenu value={this.state.value} onChange={this.handleChange}>
          {menuItems}
        </DropDownMenu>
      </div>
    );
  }
}