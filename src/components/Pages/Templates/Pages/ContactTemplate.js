import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './ContactPageTemplate.scss';

const ContactPageTemplate = (props) => (
  <div className="page contact">
    <div className="page-container">
      <div data-editable data-name="name" onInput={props.handleNameChanged ? props.handleNameChanged : undefined}>
        <h1 id="name" data-ce-placeholder="Page Title">{props.name ? props.name : ''}</h1>
      </div>
      <div className="page-content" data-editable data-name="content" data-ce-placeholder="Content..."  dangerouslySetInnerHTML={{__html: props.content}} />

      <form>
        <input type="text" placeholder="dummy" /><br/>
        <input type="text" placeholder="dummy" /><br/>
        <input type="text" placeholder="dummy" /><br/>
        <input type="text" placeholder="dummy" /><br/>
      </form>
    </div>
  </div>
)

export default withStyles(s)(ContactPageTemplate);