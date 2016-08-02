import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

const AddButton = (props) => {

  handleAddClick(e){
    e.preventDefault();
    
  },
  return (
    <FloatingActionButton onClick={handleAddClick}>
      <ContentAdd />
    </FloatingActionButton>
  )
}



export default AddButton;