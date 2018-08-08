/**
 * @author zakary
 * @description 配置material-ui的主题
 */

import {createMuiTheme} from '@material-ui/core/styles';

import red from '@material-ui/core/colors/red';

export default createMuiTheme({
  palette: {
    primary: {
      light: '#8e99f3',
      main: '#5c6bc0',
      dark: '#002984',
      contrastText: '#ffffff'
    },
    secondary: {
      light: '#ff867c',
      main: '#ef5350',
      dark: '#b61827',
      contrastText: '#212121'
    },
    error: red
  }
});