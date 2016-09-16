import React from 'react';
import HomePageTemplate from '../Templates/HomePageTemplate'
import ContactPageTemplate from '../Templates/ContactPageTemplate'
import BasicPageTemplate from '../Templates/BasicPageTemplate'
import PageNotFound from '../Errors/404/404'
import APIClient from '../../../http/requests'
import FrontendPage from '../../Layout/FrontendPage';

class Page extends React.Component {
  
  constructor() {
    super();
    
    this.state = {
      statusCode: 200,
      page: null
    }
  }

  componentDidMount(){
    let client = new APIClient(this.context.store)
    // console.log(this)
    if(this.props.routeParams && this.props.routeParams.slug) {
      client.get('data/pages/' + this.props.routeParams.slug).then((res) => {
         this.handleSuccessfulDataFetch(client, res, (res) => this.setPreExistingPageData(res))
      }).catch((res) => {
        console.log('Error: ', res)
      })
    }
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
    if (res.statusCode !== 200) {
      this.setState({statusCode: res.statusCode})
    } else {
      updateStateCallback(res);
    }
  }

  getRenderedPage(template_id, content, name){
    let page = null;
    // May come in as a string from query params so parse as int.
    template_id = parseInt(template_id, 10);

    switch(template_id) {
      case 1: {
        page = (<BasicPageTemplate name={name} content={content} />)
        break;
      }
      case 2: {
        page = (<ContactPageTemplate name={name} content={content} />)
        break;
      }
      case 3: {
        page = (<HomePageTemplate name={name} content={content} />);
        break;
      }
      default: {
        page = (<BasicPageTemplate name={name} content={content} />)
        break;
      }
    }

    return page;
  }

  render() {
    if(this.state.statusCode === 404) {
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

export default Page;