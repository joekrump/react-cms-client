import React from 'react';
import auth from '../../auth';

const Logout = React.createClass({
  contextTypes: {
    router: React.PropTypes.object
  },
  componentDidMount() {
    auth.logout()
    this.context.router.replace('/login');
  },
  componentWillUpdate() {

  },
  render() {
    return null;
  }
})


export default Logout;