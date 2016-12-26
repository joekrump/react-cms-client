import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './HomePageTemplate.scss';

const HomeTemplate = (props) => (
  <div className="page home">
    <div className="page-container">
      <div id="name" className="big-box" data-editable data-name="name" onInput={props.handleNameChanged ? props.handleNameChanged : undefined}>
        <h1 className="page-title" data-ce-placeholder="Page Title">{props.name ? props.name : ''}</h1>
      </div>
      <div className="page-content" data-editable data-name="content" data-ce-placeholder="Content..." dangerouslySetInnerHTML={{__html: props.content}} />
    </div>
  </div>
);

const styledTemplate = withStyles(s)(HomeTemplate);

export {styledTemplate as HomeTemplate};
