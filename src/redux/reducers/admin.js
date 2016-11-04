import { singularizeName } from '../../helpers/ResourceHelper';
import merge from 'lodash.merge';
import assign from 'lodash.assign';
import initialState from '../store/initial_states/admin/admin';

const adminReducer = (state = initialState, action) => {
  let update = {}

  switch (action.type) {
    case 'UPDATE_RESOURCE_MODE':
      update[state.resource.name.plural] = assign({}, state.resources[state.resource.name.plural], {mode: action.mode})

      return {
        resource: state.resource,
        editorData: state.editorData,
        pageType: state.pageType,
        resourceId: state.resourceId,
        dataLoading: state.dataLoading,
        resources: assign({}, state.resources, update)
      }
    case 'UPDATE_INDEX_HAS_CHANGES':
      update[action.resourceNamePlural] = assign({}, state.resources[action.resourceNamePlural], {
        hasChanges: action.hasChanges
      })
      
      return {
        resource: state.resource,
        editorData: state.editorData,
        pageType: state.pageType,
        resourceId: state.resourceId,
        dataLoading: state.dataLoading,
        resources: assign({}, state.resources, update)
      }
    case 'UPDATE_ADMIN_EDITOR_DATA':
      return {
        resource: state.resource,
        editorData: merge({}, state.editorData, action.newData),
        pageType: state.pageType,
        resourceId: state.resourceId,
        dataLoading: state.dataLoading,
        resources: state.resources
      }
    case 'DELETE_ADMIN_EDITOR_DATA':
      return {
        resource: state.resource,
        editorData: {},
        pageType: state.pageType,
        dataLoading: state.dataLoading,
        resources: state.resources
      }
    case 'UPDATE_ADMIN_STATE':
      return {
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