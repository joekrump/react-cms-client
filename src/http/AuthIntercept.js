import { store } from '../redux/store/store'

const AuthIntercept = require('superagent-intercept')((err, res) => {
  if(err) {
    console.warn('ERROR: ', err);
  } else if(res.status === 401 && store.getState().auth.logged_in && res.body.message === "Token has expired") {
		// If user is logged in and their token has expired, log them out.
		store.dispatch({
			type: 'USER_LOGGED_OUT',
			redirectPath: '/login'
		})
	} 
});

export default AuthIntercept;
