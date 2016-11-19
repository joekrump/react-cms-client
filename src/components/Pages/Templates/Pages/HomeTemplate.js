import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './HomePageTemplate.scss';
import image from './home-bg.jpg';
import Helmet from 'react-helmet';

const HomePageTemplate = (props) => (
  <div className="page home">
    <Helmet 
      meta={[
        {property: 'og:title', content: props.name},
        {property: 'og:image', content: props.image_url ? props.image_url : image},
        {property: 'og:url', content: window.location.href}
      ]}
    />
    <div className="page-container">
      <div id="name" className="big-box" data-editable data-name="name" onInput={props.handleNameChanged ? props.handleNameChanged : undefined}>
        <h1 data-ce-placeholder="Page Title">{props.name ? props.name : ''}</h1>
      </div>
      <div data-editable data-name="content" data-ce-placeholder="Content..." dangerouslySetInnerHTML={{__html: props.content}} />
    </div>
  </div>
)

export default withStyles(s)(HomePageTemplate);