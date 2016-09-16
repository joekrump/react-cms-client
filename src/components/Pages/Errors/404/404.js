import React from 'react';
import { Link } from 'react-router'
import ActionHome from 'material-ui/svg-icons/action/home';
import RaisedButton from 'material-ui/RaisedButton';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import FrontendPage from '../../../Layout/FrontendPage';
// Top level styling
import s from './404.scss'

const PageNotFound = (props, state) => {

  return( 
    <FrontendPage>
      <div className="page not-found">
        <div className="page-container">
          <div className="title">404 - Page Not Found</div>
          <div className="content">
            Well, that was quite an Adventure! Time to head back home now...
          </div>
          <RaisedButton 
            containerElement={<Link to='/' />}
            label='Head back home'
            primary={true} 
            icon={<ActionHome />}
          />
        </div>
      </div>
    </FrontendPage>
  );
};

export default withStyles(s)(PageNotFound);


