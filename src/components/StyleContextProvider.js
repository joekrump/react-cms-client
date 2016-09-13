import React from 'react'
import s from './App.scss'

class ContextProvider extends React.Component {

  static propTypes = {
    context: React.PropTypes.shape({
      insertCss: React.PropTypes.func,
    }),
    error: React.PropTypes.object,
  };

  static childContextTypes = {
    insertCss: React.PropTypes.func.isRequired,
  };

  getChildContext() {
    const context = this.props.context;
    return {
      insertCss: context.insertCss || emptyFunction,
    };
  }

  componentWillMount() {
    const { insertCss } = this.props.context;
    this.removeCss = insertCss(s);
  }

  componentWillUnmount() {
    this.removeCss();
  }

  render() {
    return <div id="context">{this.props.children}</div>
  }
}

export default ContextProvider