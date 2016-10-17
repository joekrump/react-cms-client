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
  pageType: 'dashboard', // can be show, edit, new, settings or dashboard
  resourceId: null,
  editorData: {}
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_MODE':
      return {
        mode: action.mode,
        index: state.index,
        resource: state.resource,
        editorData: state.editorData,
        pageType: state.pageType,
        resourceId: state.resourceId
      }
    case 'UPDATE_INDEX_HAS_CHANGES':
      return {
        mode: state.mode,
        index: {
          hasChanges: action.hasChanges
        },
        resource: state.resource,
        editorData: state.editorData,
        pageType: state.pageType,
        resourceId: state.resourceId
      }
    case 'UPDATE_ADMIN_EDITOR_DATA':
      return {
        mode: state.mode,
        index: {
          hasChanges: state.hasChanges
        },
        resource: state.resource,
        editorData: merge({}, state.editorData, action.newData),
        pageType: state.pageType,
        resourceId: state.resourceId
      }
    case 'DELETE_ADMIN_EDITOR_DATA':
      return {
        mode: state.mode,
        index: {
          hasChanges: state.hasChanges
        },
        resource: state.resource,
        editorData: {},
        pageType: state.pageType
      }
    case 'UPDATE_ADMIN_STATE':
      return {
        mode: state.mode,
        index: state.index,
        resource: {
          name: {
            plural: action.namePlural,
            singular: singularizeName(action.namePlural)
          }
        },
        editorData: state.editorData,
        pageType: action.pageType,
        resourceId: action.resourceId
      }
    default:
      return state;
  }
}

export {adminReducer as admin}