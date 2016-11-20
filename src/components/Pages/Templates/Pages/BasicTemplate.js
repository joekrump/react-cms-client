import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BasicPageTemplate.scss';
import RoundSocialLinks from '../../Page/RoundSocialLinks';

const BasicPageTemplate = (props) => (
  <div className="page basic">
    <div className="page-container">
      <div data-editable data-name="name" onInput={props.handleNameChanged ? props.handleNameChanged : undefined}>
        <h1 data-ce-placeholder="Page Title">{props.name ? props.name : ''}</h1>
      </div>
      <div className="page-content" data-editable data-name="content" data-ce-placeholder="Content..." dangerouslySetInnerHTML={{__html: props.content}} />
    </div>
    <div className="page-container">
      <RoundSocialLinks 
        url={props.url} 
        title={props.title}
        media={props.media}
        baseUrl={props.baseUrl}
      />
    </div>
  </div>
)

export default withStyles(s)(BasicPageTemplate);