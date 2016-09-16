import React from 'react';
import { Link } from 'react-router'
import ActionHome from 'material-ui/svg-icons/action/home';
import RaisedButton from 'material-ui/RaisedButton';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
// Top level styling
import s from './404.scss'

const PageNotFound = (props, state) => {

  return( 
    <div className="page not-found">
      <div className="page-container">
        <div className="content">
          <div className="title">Page Not Found</div>
          <RaisedButton 
            containerElement={<Link to='/' />}
            label='Head back home'
            primary={true} 
            icon={<ActionHome />}
          />
        </div>
      </div>
    </div>
  );
};

export default withStyles(s)(PageNotFound);


