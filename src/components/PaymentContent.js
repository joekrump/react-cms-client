import PaymentForm from '../PaymentForm';

import './PaymentContent.css';

var ReactScriptLoaderMixin = require('react-script-loader').ReactScriptLoaderMixin;

const PaymentContent = React.createClass({
  mixins: [ ReactScriptLoaderMixin ],

  getInitialState(){
    stripeLoading: true,
    stripeLoadingError: false,
  },
  render(){

    return();
  }
});