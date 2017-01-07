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
        ...state,
        resources: assign({}, state.resources, update),   
      }
    case 'UPDATE_INDEX_HAS_CHANGES':
      update[action.resourceNamePlural] = assign({}, state.resources[action.resourceNamePlural], {
        hasChanges: action.hasChanges
      })
      return {
        ...state,
        resources: assign({}, state.resources, update),
      }
    case 'UPDATE_ADMIN_EDITOR_DATA':
      return {
        ...state,
        editorData: merge({}, state.editorData, action.newData),
        
      }
    case 'DELETE_ADMIN_EDITOR_DATA':
      return {
        ...state,
        editorData: {},
      }
    case 'UPDATE_ADMIN_STATE':
      return {
        ...state,
        resource: {
          name: {
            plural: action.namePlural,
            singular: singularizeName(action.namePlural)
          }
        },
        pageType: action.pageType,
        resourceId: action.resourceId,
      }
    case 'UPDATE_ADMIN_LOAD_STATE':
      return {
        ...state,
        dataLoading: action.dataLoading,
      }
    default:
      return state;
  }
}

export {adminReducer as admin}