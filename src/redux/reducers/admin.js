import { singularizeName } from '../../helpers/ResourceHelper';
import merge from 'lodash.merge';
import resources from '../store/initial_states/admin/resources';

const initialState = {
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
  editorData: {},
  dataLoading: false,
  resources: resources
};

const adminReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_RESOURCE_MODE':
      return {
        index: state.index,
        resource: state.resource,
        editorData: state.editorData,
        pageType: state.pageType,
        resourceId: state.resourceId,
        dataLoading: state.dataLoading,
        resources: merge({}, state.resources, {state.resource.name.plural: {mode: action.mode}})
      }
    case 'UPDATE_INDEX_HAS_CHANGES':
      return {
        index: {
          hasChanges: action.hasChanges
        },
        resource: state.resource,
        editorData: state.editorData,
        pageType: state.pageType,
        resourceId: state.resourceId,
        dataLoading: state.dataLoading,
        resources: state.resources
      }
    case 'UPDATE_ADMIN_EDITOR_DATA':
      return {
        index: {
          hasChanges: state.hasChanges
        },
        resource: state.resource,
        editorData: merge({}, state.editorData, action.newData),
        pageType: state.pageType,
        resourceId: state.resourceId,
        dataLoading: state.dataLoading,
        resources: state.resources
      }
    case 'DELETE_ADMIN_EDITOR_DATA':
      return {
        index: {
          hasChanges: state.hasChanges
        },
        resource: state.resource,
        editorData: {},
        pageType: state.pageType,
        dataLoading: state.dataLoading,
        resources: state.resources
      }
    case 'UPDATE_ADMIN_STATE':
      return {
        index: state.index,
        resource: {
          name: {
            plural: action.namePlural,
            singular: singularizeName(action.namePlural)
          }
        },
        editorData: state.editorData,
        pageType: action.pageType,
        resourceId: action.resourceId,
        dataLoading: state.dataLoading,
        resources: state.resources
      }
    case 'UPDATE_ADMIN_LOAD_STATE':
      return {
        index: state.index,
        resource: state.resource,
        editorData: state.editorData,
        pageType: state.pageType,
        resourceId: state.resourceId,
        dataLoading: action.dataLoading,
        resources: state.resources
      }
    default:
      return state;
  }
}

export {adminReducer as admin}