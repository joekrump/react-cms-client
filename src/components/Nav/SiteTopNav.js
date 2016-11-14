import React from 'react';
import AppConfig from '../../../app_config/app'
import { Link } from 'react-router';
import Drawer from 'material-ui/Drawer';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SiteTopNav.scss'

const breakpointWidth = 626;


class TopNav extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: null,
      mobileNavVisible: false
    };
  }

  renderNavigation() {
    <Drawer 
      open={this.state.menuOpen}
      docked={false} 
      onRequestChange={() => this.handleToggleMenu()}
    >
    </Drawer>
  }

  handleToggleMenu() {
    if(!this.state.mobileNavVisible) {
      this.setState({mobileNavVisible: true});
    } else {
      this.setState({mobileNavVisible: false});
    }
  }

  renderMobileNav() {
    if(this.state.mobileNavVisible) {
      return LINKS;
    }
  }

  handleResize() {
    this.setState({windowWidth: window.innerWidth});
  }

  componentDidMount() {
    if(typeof window !== 'undefined') {
      window.addEventListener('resize', this.handleResize.bind(this));
    }
  }

  componentWillUnmount() {
    if(typeof window !== 'undefined') {
      window.removeEventListener('resize', this.handleResize.bind(this));
    }
  }

  render() {
    return (
      <div className="top-nav">
        <div className="page-container">
          <span className="logo light"></span>
          {AppConfig.siteTitle ? (<h1 className="site-title">{AppConfig.siteTitle}</h1>) : null}
          <div className="nav-links-container">
            {this.renderNavigation()}
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(TopNav);