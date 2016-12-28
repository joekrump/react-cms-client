import React from 'react';
import AddIcon from 'material-ui/svg-icons/content/add';
import { Link } from 'react-router';
import IconButton from 'material-ui/IconButton';

export default class AddNestedItemButton extends React.Component {
  render() {
    return (
      <Link to={`/admin/${this.props.resourceType}/new?parent_id=${this.props.parentModelId}`}>
        <IconButton tooltip="New Child"
                    tooltipPosition='top-center'
                    style={this.props.styles.buttonStyles}>
          <AddIcon style={this.props.styles.smallIcon}/>
        </IconButton>
      </Link>
    );
  }
}
