import React from 'react'
import { fullBlack } from 'material-ui/styles/colors';
import { ListItem } from 'material-ui/List';
import {fade} from 'material-ui/utils/colorManipulator';
import muiTheme from '../../../muiTheme';
import IndexItemActions from './IndexItemActions'


const IndexItem = (props) => {

  return(
    <ListItem
      className="index-list-item"
      disabled
      rightIconButton={<IndexItemActions resourceType={props.resourceType} id={props.id} />}
      primaryText={<div style={{color: muiTheme.palette.textColor}}><strong>{props.primary}</strong> - <span>{props.secondary}</span></div>}
      style={{backgroundColor: fade(fullBlack, 0.7)}}
    />
  );
}

export default IndexItem;