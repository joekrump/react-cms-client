import React from 'react';
import { Link } from 'react-router'
import ActionHome from 'material-ui/svg-icons/action/home';
import RaisedButton from 'material-ui/RaisedButton';

// Top level styling
import './404.css'

const PageNotFound = (props, state) => {

  return( 
    <div className="page-not-found-wrapper">
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

export default PageNotFound;


