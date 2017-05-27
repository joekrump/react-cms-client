// src/components/Layout/FrontendLayout.js
import React from 'react'

/**
 * A higherorder component for applying styling to frontend pages.
 * @param  {Object} props props to pass.  
 * @return {Object}       - returns the wrapped component passed to it.
 */
const FrontendLayout = (props) => {
  return (
    <div className="frontend-container">
      {props.children}
    </div>
  )
}

export default FrontendLayout;