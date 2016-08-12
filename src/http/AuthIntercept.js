import { store } from '../store'

const AuthIntercept = require('superagent-intercept')((err, res) => {
	if(res.status === 401 && store.getState().auth.logged_in) {
		console.log('logged in but 401');
	} 
});

export default AuthIntercept