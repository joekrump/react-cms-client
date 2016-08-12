import { store } from '../store'

const AuthIntercept = require('superagent-intercept')((err, res) => {
	// console.log(res.status);
	// console.log(res);
	if(res.status === 401 && store.getState().auth.logged_in && res.body.message === "Token has expired") {
		// If user is logged in and their token has expired, log them out.
		store.dispatch({
			type: 'USER_LOGGED_OUT',
			redirectPath: '/login'
		})
	} 
});

export default AuthIntercept