import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import ContactForm  from '../../../Forms/ContactForm';
import s from './ContactPageTemplate.scss';

const ContactTemplate = (props) => (
  <div className="page contact">
    <div className="page-container">
      <div data-editable data-name="name" className="big-box" onInput={props.handleNameChanged ? props.handleNameChanged : undefined}>
        <h1 className="page-title" data-ce-placeholder="Page Title">{props.name ? props.name : ''}</h1>
      </div>
      <div className="page-content" data-editable data-name="content" data-ce-placeholder="Content..." dangerouslySetInnerHTML={{__html: props.content}} />
    </div>
    <div className="page-container">
      <ContactForm />
    </div>      
  </div>
)

const styledTemplate = withStyles(s)(ContactTemplate)

export {styledTemplate as ContactTemplate};
