import React from 'react';

const LinkedInShare = (props) => (
  <a href={`http://www.linkedin.com/shareArticle?mini=true&amp;url=${props.url}&amp;title=${props.title}&amp;summary=${props.summary}&amp;source=${props.source}`} target="_blank" className="svgli" title="Share on LinkedIn"><svg width="32px" height="32px" viewBox="0 0 32 32"><desc>LinkedIn</desc><g><path d="M29.625,0H2.36C1.058,0,0,1.033,0,2.305v27.382c0,1.273,1.058,2.308,2.36,2.308h27.265 c1.306,0,2.371-1.034,2.371-2.308V2.305C31.996,1.033,30.931,0,29.625,0z M9.492,27.265h-4.75v-15.27h4.75V27.265z M7.118,9.908 c-1.525,0-2.753-1.233-2.753-2.752c0-1.517,1.229-2.75,2.753-2.75c1.518,0,2.75,1.233,2.75,2.75 C9.869,8.675,8.636,9.908,7.118,9.908z M27.262,27.265h-4.741V19.84c0-1.771-0.032-4.05-2.466-4.05 c-2.47,0-2.846,1.929-2.846,3.922v7.553h-4.74v-15.27h4.549v2.086h0.065c0.632-1.201,2.182-2.466,4.489-2.466 c4.802,0,5.689,3.162,5.689,7.273V27.265z"></path></g></svg></a>
);


export default LinkedInShare;