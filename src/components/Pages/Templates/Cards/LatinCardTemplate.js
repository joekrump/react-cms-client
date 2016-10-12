import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './LatinCardTemplate.scss';

const LatinCardTemplate = (props) => (
  <div className="latin">
    <div className="front" data-editable data-name="front_content" 
    data-ce-placeholder="Front Content..." 
    dangerouslySetInnerHTML={{__html: props.front_content}} 
    tabindex="-1" />
    <div className="back" data-editable data-name="back_content" 
    data-ce-placeholder="Back Content..." 
    dangerouslySetInnerHTML={{__html: props.back_content}} 
     tabindex="-1" />
  </div>
)

export default withStyles(s)(LatinCardTemplate);