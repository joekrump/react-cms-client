import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

import {cyan500, cyan700, grey300, grey400, grey500,
  lightBlue500, lightBlue700,
  white, darkBlack, fullBlack} from 'material-ui/styles/colors';

import {fade} from 'material-ui/utils/colorManipulator';

const muiTheme = getMuiTheme(baseTheme, {
  palette: {
    primary1Color: cyan500,
    primary2Color: cyan700,
    primary3Color: grey400,
    accent1Color: lightBlue500,
    accent2Color: lightBlue700,
    accent3Color: grey500,
    textColor: white,
    alternateTextColor: white,
    canvasColor: fade(fullBlack, 0.7),
    borderColor: grey300,
    disabledColor: fade(grey400, 0.7),
    pickerHeaderColor: cyan500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fade(cyan700, 0.7)
  },
  appBar: {
    height: 56,
  },
  userAgent: (typeof req !== 'undefined') ? req.headers['user-agent'] : false
});


export default muiTheme;