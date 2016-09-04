import React from 'react';
import { Link } from 'react-router'
import FlatButton from 'material-ui/FlatButton';
import BackArrow from 'material-ui/svg-icons/navigation/arrow-back'
import { fullWhite, cyan300 } from 'material-ui/styles/colors';


require('./FloatingBackButton.scss');

const FloatingBackButton = (props) => (

  <FlatButton
    className='floating-back-btn'
    // backgroundColor={cyan500}
    hoverColor={cyan300}
    containerElement={<Link to={props.link} />}
    label={props.label}
    labelStyle={{color: fullWhite}}
    // hoverColor={cyan500}
    icon={<BackArrow style={{ color: fullWhite }}/>}
  />
)

export default FloatingBackButton;