import resources from './resources';

const initialState = {
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
  resources
};

export default initialState;