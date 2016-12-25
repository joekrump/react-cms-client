import React from 'react';
import AppConfig from '../../../app_config/app'
import { Link } from 'react-router';
import Drawer from 'material-ui/Drawer';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './SiteTopNav.scss'
import MobileMenu from '../Menu/MobileMenu'
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import IconButton from 'material-ui/IconButton';

const breakpointWidth = 850;

class TopNav extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      windowWidth: (typeof window !== 'undefined' ? window.innerWidth : null),
      mobileNavVisible: false
    };
  }

  handleToggleMenu() {
    if(!this.state.mobileNavVisible) {
      this.setState({mobileNavVisible: true});
    } else {
      this.setState({mobileNavVisible: false});
    }
  }

  renderMobileNav() {
    return (
      <div>
        <IconButton tooltip="Open Menu" onClick={(evt) => this.handleToggleMenu(evt)}>
          <MenuIcon />
        </IconButton>
        <Drawer 
          open={this.state.mobileNavVisible}
          docked={false} 
          onRequestChange={() => this.handleToggleMenu()}
          containerStyle={{backgroundColor: 'black'}}
        >
          <MobileMenu />
        </Drawer>
      </div>
    );
  }

  shouldRenderMobileNav() {
    return this.state.windowWidth < breakpointWidth;
  }

  buildDefaultLinks() {
    return AppConfig.routes.public.map((link, i) => (
      <Link 
        key={'top-link' + i}
        className="top-link" 
        to={link.url} 
        activeClassName="active"
        onlyActiveOnIndex={link.url === '/'}>
        {link.routeTitle}
      </Link>)
    );
  }
  renderDefaultNav() {
    return (
      <div className="nav-links-container">
        {this.buildDefaultLinks()}
      </div>
    );
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
          {this.shouldRenderMobileNav() ? this.renderMobileNav() : null}
          {this.shouldRenderMobileNav() ? null : (<span className="logo light"></span>)}
          {AppConfig.siteTitle ? (<h1 className="site-title">{AppConfig.siteTitle}</h1>) : null}
          {this.shouldRenderMobileNav() ? null : this.renderDefaultNav()}
        </div>
      </div>
    );
  }
}

TopNav.contextTypes = {
  router: React.PropTypes.object.isRequired
}

export default withStyles(s)(TopNav);