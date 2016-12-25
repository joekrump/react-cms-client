import React from 'react';

import HomeTemplate from '../Templates/Pages/HomeTemplate';
import ContactTemplate from '../Templates/Pages/ContactTemplate';
import BasicTemplate from '../Templates/Pages/BasicTemplate';
import LoginTemplate from '../Templates/Pages/LoginTemplate';
import PaymentTemplate from '../Templates/Pages/PaymentTemplate';
import SignupTemplate from '../Templates/Pages/SignupTemplate';
import ForgotPasswordTemplate from '../Templates/Pages/ForgotPasswordTemplate';
import ResetPasswordTemplate from '../Templates/Pages/ResetPasswordTemplate';

import PageNotFound from '../Errors/404/404';
import APIClient from '../../../http/requests';
import FrontendPage from '../../Layout/FrontendPage';
import { connect } from 'react-redux';
import AppConfig from '../../../../app_config/app';
import { push } from 'react-router-redux';
import Helmet from 'react-helmet';
import defaultImage from '../Templates/Pages/home-bg.jpg';

class Page extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      page: null
    }
  }

  isAdminPage() {
    return (this.props.pathname.substring(1, 6).toLowerCase() === 'admin')
  }

  componentWillMount() {
    if(!this.isAdminPage()) {
      this.loadPageContent(this.props.pathname);
    }
  }

  loadPageContent(pathname) {
    const client = new APIClient(this.props.dispatch);

    client.get('page', false, {params: {fullpath: pathname}}).then((res) => {
      this.resolveDataFetch(res, this.setPreExistingPageData)
    }, this.rejectDataFetch).catch(this.rejectDataFetch)
  }

  isInternalLink(anchorElement) {
    return anchorElement.href.includes(AppConfig.baseUrl);
  }

  navigateViaRouter = (event) => {
    event.preventDefault();
    this.props.dispatch(push(event.currentTarget.getAttribute('href')));
  }

  setPreExistingPageData = (res) => {
    this.setState({
      name: res.body.data.name,
      content: res.body.data.content,
      image_url: res.body.data.image_url || defaultImage,
      page: this.getRenderedPage(
        res.body.data.template_id, 
        res.body.data.content, 
        res.body.data.name
      )
    })
  }

  componentDidUpdate() {
    const internalLinks = this.getInteralLinks();
    
    if(internalLinks.length > 0) {
      this.addLinkBehaviorToAnchorElements(internalLinks)
    } 
  }

  addLinkBehaviorToAnchorElements(anchorElements) {
    anchorElements.forEach((anchorElement) => {
      anchorElement.addEventListener('click', this.navigateViaRouter, false);
    })
  }

  getInteralLinks() {
    if(typeof(document) !== 'undefined') {
      const pageTemplate = document.getElementsByClassName('page');
      let internalLinks = [];
      if(pageTemplate.length > 0) {
        let contentAnchors = pageTemplate[0].getElementsByTagName("a");

        if(contentAnchors.length > 0) {
          internalLinks = this.htmlCollectionToArray(contentAnchors).filter(this.isInternalLink)
        }
      }
      return internalLinks;
    }
  }

  // Todo: move into helper.
  htmlCollectionToArray(htmlCollection) {
    return [].slice.call(htmlCollection);
  }

  rejectDataFetch = (res) => {
    if(res.statusCode && res.statusCode >= 300) {
      this.props.updatePageStatusCode(res.statusCode);
    } else {
      console.warn('Error: ', res)
    }
  }

  resolveDataFetch = (res, updateStateCallback) => {
    this.props.updatePageStatusCode(res.statusCode);
    if (res.statusCode === 200) {
      updateStateCallback(res);
    }
  }

  componentWillReceiveProps(nextProps){
    if(this.props.pathname !== nextProps.pathname) {
      this.loadPageContent(nextProps.pathname);
    }
  }

  getRenderedPage(template_id, content, name, image_url){
    let page = null;
    // May come in as a string from query params so parse as int.
    template_id = parseInt(template_id, 10);

    switch(template_id) {
      case 1: {
        page = (<BasicTemplate 
          name={name} 
          content={content} 
          pathname={this.props.pathname}
          url={this.getPageURL()} 
          title={this.state.name}
          media={this.state.image_url || defaultImage}
          baseUrl={AppConfig.baseUrl}
        />)
        break;
      }
      case 2: {
        page = (<ContactTemplate name={name} content={content} pathname={this.props.pathname}/>)
        break;
      }
      case 3: {
        page = (<HomeTemplate name={name} content={content} image_url={image_url || null}/>);
        break;
      }
      case 4: {
        page = (<LoginTemplate name={name} content={content} pathname={this.props.pathname} location={this.props.location}/>);
        break;
      }
      case 5: {
        page = (<PaymentTemplate name={name} content={content} pathname={this.props.pathname} />);
        break;
      }
      case 6: {
        page = (<SignupTemplate name={name} content={content} pathname={this.props.pathname} />);
        break;
      }
      case 7: {
        page = (<ForgotPasswordTemplate name={name} content={content} pathname={this.props.pathname} />);
        break;
      }
      case 8: {
        page = (<ResetPasswordTemplate name={name} content={content} pathname={this.props.pathname} />);
        break;
      }
      default: {
        page = (<BasicTemplate name={name} content={content} pathname={this.props.pathname}
          url={this.getPageURL()} 
          title={this.state.name}
          media={this.state.image_url || defaultImage}
          baseUrl={AppConfig.baseUrl}
        />)
        break;
      }
    }

    return page;
  }

  makeHelmetMeta() {
    let headerMeta = [
      {property: 'og:title', content: this.state.name},
    ];

    if(this.state.image_url) {
      headerMeta.push({property: 'og:image', content: this.state.image_url});
    }

    if(typeof(window) !== 'undefined') {
      headerMeta.push({property: 'og:url', content: window.location.href});
    }
    return headerMeta;
  }

  getPageURL() {
    return (typeof(window) !== 'undefined') ? window.location.href : `${AppConfig.baseUrl}/${this.props.pathname}`;
  }

  render() {
    if(this.props.statusCode !== 200) {
      return (<PageNotFound />)
    }

    return (
      <FrontendPage>
        <Helmet 
          title={`${AppConfig.siteTitle} | ${this.state.name}`}
          meta={this.makeHelmetMeta()}
        />
        {this.state.page}
      </FrontendPage>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updatePageStatusCode: (statusCode) => {
      dispatch ({
        type: 'UPDATE_PAGE_STATUS_CODE',
        statusCode
      })
    },
    dispatch
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    pathname: state.routing.locationBeforeTransitions.pathname,
    statusCode: state.page.statusCode
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Page)
