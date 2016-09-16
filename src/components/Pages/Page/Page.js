import React from 'react';
import HomePageTemplate from '../Templates/HomePageTemplate'
import ContactPageTemplate from '../Templates/ContactPageTemplate'
import BasicPageTemplate from '../Templates/BasicPageTemplate'
import LoginPageTemplate from '../Templates/LoginPageTemplate'
import PaymentPageTemplate from '../Templates/PaymentPageTemplate'
import PageNotFound from '../Errors/404/404'
import APIClient from '../../../http/requests'
import FrontendPage from '../../Layout/FrontendPage';
import {connect} from 'react-redux';

class Page extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      pathname: props.location.pathname,
      statusCode: 200,
      page: null
    }
  }

  componentDidMount(){
    this.loadPageContent(this.props.location.pathname);
  }

  loadPageContent(pathname) {
    const client = new APIClient(this.context.store);

    client.get('data/pages/by-path', false, {params: {
      fullpath: pathname
    }}).then((res) => {
       this.handleSuccessfulDataFetch(client, res, (res) => this.setPreExistingPageData(res))
    }, (res) => {
      if(res.statusCode && res.statusCode !== 200) {
        this.setState({statusCode: res.statusCode})
      }
    }).catch((res) => {
      
      console.log('Error: ', res)
    })
  }

  setPreExistingPageData(res) {
    this.setState({
      page: this.getRenderedPage(
        res.body.data.template_id, 
        res.body.data.content, 
        res.body.data.name
      ),
      statusCode: 200
    })
  }

  handleSuccessfulDataFetch(client, res, updateStateCallback) {
    if (res.statusCode !== 200) {
      this.setState({statusCode: res.statusCode})
    } else {
      updateStateCallback(res);
    }
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      pathname: nextProps.location.pathname
    });
    this.loadPageContent(nextProps.location.pathname);
  }

  getRenderedPage(template_id, content, name){
    let page = null;
    // May come in as a string from query params so parse as int.
    template_id = parseInt(template_id, 10);

    switch(template_id) {
      case 1: {
        page = (<BasicPageTemplate name={name} content={content} pathname={this.state.pathname}/>)
        break;
      }
      case 2: {
        page = (<ContactPageTemplate name={name} content={content} pathname={this.state.pathname}/>)
        break;
      }
      case 3: {
        page = (<HomePageTemplate name={name} content={content} />);
        break;
      }
      case 4: {
        page = (<LoginPageTemplate name={name} content={content} pathname={this.state.pathname} location={this.props.location}/>);
        break;
      }
      case 5: {
        page = (<PaymentPageTemplate name={name} content={content} pathname={this.state.pathname} />);
        break;
      }
      default: {
        page = (<BasicPageTemplate name={name} content={content} pathname={this.state.pathname}/>)
        break;
      }
    }

    return page;
  }

  render() {
    if(this.state.statusCode !== 200) {
      return (<PageNotFound />)
    }
    return (
      <FrontendPage slug={this.props.params.slug}>
        {this.state.page}
      </FrontendPage>
    );
  }
}

Page.contextTypes = {
  store: React.PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => {
  console.log('Page ownProps:', ownProps)
  return {
    pathname: state.routing.locationBeforeTransitions.pathname
  }
}

export default connect(mapStateToProps)(Page)
