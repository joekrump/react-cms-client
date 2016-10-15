import React from 'react';
import { Link } from 'react-router'
import ActionHome from 'material-ui/svg-icons/action/home';
import RaisedButton from 'material-ui/RaisedButton';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import FrontendPage from '../../../Layout/FrontendPage';
// Top level styling
import s from '../ErrorPage.scss'

const Forbidden = () => {

  return( 
    <FrontendPage>
      <div className="page error-page not-allowed">
        <div className="page-container">
          <div className="title">403 - Access Denied</div>
          <div className="content">
            It appears you're trying to access a page that you don't have permission to. If this seems to be an error, contact your site administrator in order to obtain permission.
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

export default withStyles(s)(Forbidden);


