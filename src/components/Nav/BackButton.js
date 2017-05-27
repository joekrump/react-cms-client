// src/components/Nav/BackButton.js
import React from 'react';
import { Link } from 'react-router'
import FlatButton from 'material-ui/FlatButton';
import BackArrow from 'material-ui/svg-icons/navigation/arrow-back'
import { fullWhite } from 'material-ui/styles/colors';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BackButton.scss'

const BackButton = (props, context) => (
  <FlatButton
    className='back-btn'
    hoverColor={context.muiTheme.palette.primary2Color}
    containerElement={<Link to={props.link} />}
    label={props.label}
    labelStyle={{color: fullWhite}}
    icon={<BackArrow style={{ color: fullWhite }}/>}
  />
)

BackButton.contextTypes = {
  muiTheme: React.PropTypes.object.isRequired
}

export default withStyles(s)(BackButton);
