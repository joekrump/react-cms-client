import React from 'react'
import PreviewIcon from 'material-ui/svg-icons/action/launch'
import IconButton from 'material-ui/IconButton';
import { Link } from 'react-router'

const styles = {
  smallIcon: {
    width: 24,
    height: 24
  },
  buttonStyles: {
    width: 36,
    height: 36,
    // padding: '12px 8px 12px 8px'
  }
}

const PreviewButton = (props) => (
  <IconButton style={styles.buttonStyles} tooltip="View" 
    tooltipPosition='top-center' 
    containerElement={
      <Link to={{
        pathname: props.path,
      }} />
    }
  >
    <PreviewIcon style={styles.smallIcon} />
  </IconButton>
)


export default PreviewButton;
