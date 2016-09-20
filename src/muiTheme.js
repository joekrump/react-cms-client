import getMuiTheme from 'material-ui/styles/getMuiTheme';
import baseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';

import { indigoA400, indigoA700, grey100, grey300, grey400,
  lightBlue500, lightBlue700, white, darkBlack, fullBlack } from 'material-ui/styles/colors';

import {fade} from 'material-ui/utils/colorManipulator';

const muiTheme = getMuiTheme(baseTheme, {
  palette: {
    primary1Color: indigoA400,
    primary2Color: indigoA700,
    primary3Color: grey100,
    accent1Color: lightBlue500,
    accent2Color: lightBlue700,
    accent3Color: grey100,
    textColor: white,
    alternateTextColor: white,
    canvasColor: fade(fullBlack, 0.7),
    borderColor: grey300,
    disabledColor: fade(grey100, 0.9),
    pickerHeaderColor: lightBlue500,
    clockCircleColor: fade(darkBlack, 0.07),
    shadowColor: fade(fullBlack, 0.7)
  },
  appBar: {
    height: 56,
  },
  raisedButton: {
    disabledColor: fade(indigoA400, 0.4),
    disabledTextColor: fade(grey400, 0.4)
  },
  snackbar: {
    backgroundColor: fade(fullBlack, 0.7)
  },
  // eslint-disable-next-line
  userAgent: (typeof req !== 'undefined') ? req.headers['user-agent'] : false
});


export default muiTheme;