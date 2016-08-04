import React from 'react';

import './FlexContainer.css';

const FlexContainer = (props) => (
  <div className="flexContainer">
    {props.children}
  </div>
);

export default FlexContainer;