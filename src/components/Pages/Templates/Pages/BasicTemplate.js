import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './BasicPageTemplate.scss';
import RoundSocialLinks from '../../Page/RoundSocialLinks';

const BasicPageTemplate = (props) => (
  <div className="page basic">
    <div className="page-container">
      <div data-editable data-name="name" onInput={props.handleNameChanged ? props.handleNameChanged : undefined}>
        <h1 className="page-title" data-ce-placeholder="Page Title">{props.name ? props.name : ''}</h1>
      </div>
      {props.url ? (<RoundSocialLinks 
        className="top"
        url={props.url} 
        title={props.title}
        media={props.image_url}
        baseUrl={props.baseUrl}
      />) : null}
      
      <div className="page-content" data-editable data-name="content" data-ce-placeholder="Content..." dangerouslySetInnerHTML={{__html: props.content}} />
    </div>
    <div className="page-container">
      {props.url ? (<RoundSocialLinks 
        className="bottom"
        url={props.url} 
        title={props.title}
        media={props.image_url}
        baseUrl={props.baseUrl}
      />) : null}
    </div>
  </div>
)

export default withStyles(s)(BasicPageTemplate);