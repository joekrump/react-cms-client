import React from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';


export default class TemplateDropDown extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.defaultValue ? props.defaultValue : 1
    };
  }

  handleChange = (event, index, value) => {
    this.setState({value});
  }

  render() {
    let menuItems = this.props.templateOptions.map((option) => {
      return (<MenuItem value={option.id} primaryText={option.display_name} />)
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