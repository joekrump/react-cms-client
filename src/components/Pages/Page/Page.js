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
      page: null
    }
  }

  componentWillMount() {
    this.loadPageContent();
  }

  loadPageContent() {
    const client = new APIClient(this.context.store);

    client.get('data/pages/by-path', false, {params: {
      fullpath: this.props.pathname
    }}).then((res) => {
      this.handleSuccessfulDataFetch(client, res, (res) => this.setPreExistingPageData(res))
    }, (res) => {
      if(res.statusCode && res.statusCode !== 200) {
        this.props.updatePageStatusCode(res.statusCode);
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
      )
    })
  }

  handleSuccessfulDataFetch(client, res, updateStateCallback) {
    this.props.updatePageStatusCode(res.statusCode);
    if (res.statusCode === 200) {
      updateStateCallback(res);
    }
  }

  componentWillReceiveProps(nextProps){
    if(this.props.pathname !== nextProps.pathname) {
      this.loadPageContent();
    }
  }

  getRenderedPage(template_id, content, name){
    let page = null;
    // May come in as a string from query params so parse as int.
    template_id = parseInt(template_id, 10);

    switch(template_id) {
      case 1: {
        page = (<BasicPageTemplate name={name} content={content} pathname={this.props.pathname}/>)
        break;
      }
      case 2: {
        page = (<ContactPageTemplate name={name} content={content} pathname={this.props.pathname}/>)
        break;
      }
      case 3: {
        page = (<HomePageTemplate name={name} content={content} />);
        break;
      }
      case 4: {
        page = (<LoginPageTemplate name={name} content={content} pathname={this.props.pathname} location={this.props.location}/>);
        break;
      }
      case 5: {
        page = (<PaymentPageTemplate name={name} content={content} pathname={this.props.pathname} />);
        break;
      }
      default: {
        page = (<BasicPageTemplate name={name} content={content} pathname={this.props.pathname}/>)
        break;
      }
    }

    return page;
  }

  render() {
    if(this.props.statusCode !== 200) {
      return (<PageNotFound />)
    }
    return (
      <FrontendPage>
        {this.state.page}
      </FrontendPage>
    );
  }
}

Page.contextTypes = {
  store: React.PropTypes.object.isRequired
};

const mapDispatchToProps = (dispatch) => {
  return {
    updatePageStatusCode: (statusCode) => {
      dispatch ({
        type: 'UPDATE_PAGE_STATUS_CODE',
        statusCode
      })
    }
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    pathname: state.routing.locationBeforeTransitions.pathname,
    statusCode: state.page.statusCode
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)
