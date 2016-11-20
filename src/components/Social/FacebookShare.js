import React from 'react';

const FacebookShare = (props) => (
  <a href={
    `https://www.facebook.com/sharer/sharer.php?u=${props.url}`} 
    target="_blank" 
    className="svgfb" 
    title="Share on Facebook">
      <svg width="32" height="32" viewBox="0 0 32 32">
      <desc>Facebook</desc>
      <g>
        <path d="M 17.996,32L 12,32 L 12,16 l-4,0 l0-5.514 l 4-0.002l-0.006-3.248C 11.993,2.737, 13.213,0, 18.512,0l 4.412,0 l0,5.515 l-2.757,0 c-2.063,0-2.163,0.77-2.163,2.209l-0.008,2.76l 4.959,0 l-0.585,5.514L 18,16L 17.996,32z">
        </path>
      </g>
    </svg>
  </a>
);


export default FacebookShare;