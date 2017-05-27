// src/components/Layout/FrontendPage.js
import React from 'react';
import s from './FrontendPage.scss'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import TopNav from '../Nav/SiteTopNav'
import {connect} from 'react-redux'

const FrontendPage = (props) => (
  <div className={"frontend-page-container" + (props.loggedIn ? ' logged-in' : '')}>
    {props.loggedIn ? <TopNav /> : null}
    {props.children}
  </div>
) 

const mapStateToProps = (state) => {
  return {
    loggedIn: state.auth.logged_in
  }
}

export default connect(mapStateToProps)(withStyles(s)(FrontendPage));