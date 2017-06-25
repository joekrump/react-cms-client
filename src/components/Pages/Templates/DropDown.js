import React from "react";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";

export default class DropDown extends React.Component {

  constructor(props) {
    super(props);
    this.optionValues = Object.values(this.props.options);
    this.state = { value: props.selectedOption ? props.selectedOption : this.optionValues[0] };
  }

  handleChange = (event, index, value) => {
    this.setState({value});
    this.props.handleChangeCallback(value);
  }

  componentWillReceiveProps(nextProps){
    if((nextProps.selectedOption) && (this.props.selectedOption !== nextProps.selectedOption)) {
      this.setState({ value: nextProps.selectedOption })
    } else if(nextProps.options !== this.props.options && this.state.value === undefined) {
      this.optionValues = Object.values(nextProps.options);
      this.setState({ value: this.optionValues[0]});
    }
  }

  buildMenuItems = () => {
    return this.props.indexes.map((index) => {
      if(!this.props.options[index]) {
        return null;
      }

      return (<MenuItem
        key={`dd-option-${index}`}
        value={this.props.options[index]}
        primaryText={this.props.options[index].displayName}
      />);
    });
  }

  render() {
    if(!this.optionValues.length === 0) {
      return null;
    }

    return (
      <div>
        <DropDownMenu 
          value={this.state.value}
          onChange={this.handleChange}
          style={{width: 302}}
        >
          {this.buildMenuItems()}
        </DropDownMenu>
      </div>
    );
  }
}
