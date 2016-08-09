import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { Link } from 'react-router'
import { capitalize } from '../../../helpers/string'
import SpeedDial from '../../Menu/SpeedDial'


const AddButton = (props) => {
  // return (
  //   <FloatingActionButton style={{position: 'fixed', bottom: '30px', right: '30px'}} containerElement={
  //       <Link to={'/admin/' + props.resourceNameSingular + '/new'} />
  //     } tooltip={'Create a new ' + props.resourceNameSingular}>
  //     <ContentAdd />
  //   </FloatingActionButton>
  // )
  return (
    <SpeedDial />
  )
}
    
export default AddButton;