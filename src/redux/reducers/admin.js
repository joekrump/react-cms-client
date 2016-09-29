import {singularizeName} from '../../helpers/ResourceHelper';

const initialState = {
  mode: 'PASSIVE', // possible modes: EDIT_INDEX, PASSIVE, EDIT_CONTENT
  index: {
    hasChanges: false
  },
  resource: {
    name: {
      plural: '',
      singular: ''
    }
  }
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_MODE':
      return {
        mode: action.mode,
        index: state.index,
        resource: state.resource
      }
    case 'UPDATE_INDEX_HAS_CHANGES':
      return {
        mode: state.mode,
        index: {
          hasChanges: action.hasChanges
        },
        resource: state.resource
      }
    case 'UPDATE_CURRENT_RESOURCE':
      return {
        mode: state.mode,
        index: state.index,
        resource: {
          name: {
            plural: action.namePlural,
            singular: singularizeName(action.namePlural)
          }
        } 
      }
    default:
      return state;
  }
}

export {adminReducer as admin}