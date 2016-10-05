import {singularizeName} from '../../helpers/ResourceHelper';
import merge from 'lodash.merge';

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
  },
  editorData: {

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
    case 'UPDATE_EDITOR_DATA':
      return {
        mode: state.mode,
        index: {
          hasChanges: state.hasChanges
        },
        resource: state.resource,
        editorData: merge({}, newData, state.editorData)
      }
    case 'DELETE_EDITOR_DATA':
      return {
        mode: state.mode,
        index: {
          hasChanges: state.hasChanges
        },
        resource: state.resource,
        editorData: {}
      }
    case 'UPDATE_CURRENT_RESOURCE_NAME':
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