import React from 'react';

import './FlexContainer.css';

const FlexContainer = (props) => (
  <div className="flex-container">
    {props.children}
  </div>
);

export default FlexContainer;