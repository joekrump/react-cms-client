import React from 'react'

const BasicPageTemplate = (props) => (
  <div className="page basic">
    <div className="page-container">
      <div data-editable data-name="name">
        <h1 data-ce-placeholder="Page Title">{props.name ? props.name : ''}</h1>
      </div>
      <div data-editable data-name="content" data-ce-placeholder="Content..."  dangerouslySetInnerHTML={{__html: props.content}} />
    </div>
  </div>
)

export default BasicPageTemplate;