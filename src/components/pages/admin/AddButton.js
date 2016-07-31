import React from 'react';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const AddButton = () => {
  const handleClick = (e) => {
    console.log('click')
  }
  const handleMouseEnter = (e) => {
  }
  return (
    <FloatingActionButton style={{position: 'fixed', bottom: '30px', right: '30px'}} onMouseEnter={handleMouseEnter} onClick={handleClick}>
      <ContentAdd />
    </FloatingActionButton>
  )
}
    
export default AddButton;