import React from 'react';

const MailShare = (props) => (
  <a href={`mailto:?subject=${props.subject}&amp;body=${props.body} - ${props.url}`} className="svgem" title="Share via Email"><svg width="32px" height="32px" viewBox="0 0 32 32"><desc>Email</desc><g><path d="M16.734,18.692c-0.193,0.152-0.426,0.228-0.658,0.228c-0.238,0-0.477-0.08-0.672-0.238C15.304,18.603,14.105,17.67,0,6.787 v19.848h32V6.753L16.734,18.692z"></path><path d="M30.318,5.365H1.643c9.66,7.453,13.152,10.15,14.43,11.143L30.318,5.365z"></path></g></svg></a>
);


export default MailShare;