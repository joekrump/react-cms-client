import initialState from '../store/initial_states/page';

const page = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_PAGE_STATUS_CODE':
      return {
        statusCode: action.statusCode,
      };
    default:
      return state;
  }
};

export { page };
