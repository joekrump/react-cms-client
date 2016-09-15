import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './HomePageTemplate.scss';

const HomePageTemplate = (props) => (
  <div className="page home">
    <div className="page-container">
      <div className="big-box"  data-editable data-name="name">
        <h1 data-ce-placeholder="Page Title">{props.name ? props.name : ''}</h1>
      </div>
      <div data-editable data-name="content" data-ce-placeholder="Content..."  dangerouslySetInnerHTML={{__html: props.content}} />
    </div>
  </div>
)

export default withStyles(s)(HomePageTemplate);