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
      content: null,
      name: null,
      template_id: null,
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

  componentWillUpdate(nextProps, nextState) {
    // If there has been a change to the template_id then rerender the page with the
    // corresponding template.
    if(this.state.template_id !== nextState.template_id){
      this.setState({
        page: this.getRenderedPage(nextState.template_id)
      })
    }
  }

  setPreExistingPageData(res) {
    this.setState({
      content: res.body.data.content,
      name: res.body.data.name,
      template_id: res.body.data.template_id
    })
  }

  handleSuccessfulDataFetch(client, res, updateStateCallback) {
    if (res.statusCode !== 200) {
      this.setState({statusCode: res.statusCode})
    } else {
      updateStateCallback(res);
    }
  }

  getRenderedPage(template_id){
    let page = null;
    // May come in as a string from query params so parse as int.
    template_id = parseInt(template_id, 10);

    switch(template_id) {
      case 1: {
        page = (<BasicPageTemplate name={this.state.name} content={this.state.content} />)
        break;
      }
      case 2: {
        page = (<ContactPageTemplate name={this.state.name} content={this.state.content} />)
        break;
      }
      case 3: {
        page = (<HomePageTemplate name={this.state.name} content={this.state.content} />);
        break;
      }
      default: {
        page = (<BasicPageTemplate name={this.state.name} content={this.state.content} />)
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