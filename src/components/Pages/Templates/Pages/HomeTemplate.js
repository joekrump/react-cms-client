import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './HomePageTemplate.scss';

const HomeTemplate = (props) => (
  <div className="page home">
    <div className="page-container">
      <h1 
        className="page-title big-box" 
        data-ce-placeholder="Page Title" 
        data-editable data-name="name" 
        onInput={props.handleNameChanged ? props.handleNameChanged : undefined}>
          {props.name ? props.name : ''}
      </h1>
      <div className="page-content" data-editable data-name="content" 
        data-ce-placeholder="Content..." 
        dangerouslySetInnerHTML={{__html: props.content}} />
    </div>
  </div>
);

const styledTemplate = withStyles(s)(HomeTemplate);

export {styledTemplate as HomeTemplate};
