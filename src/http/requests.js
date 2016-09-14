import superagent from 'superagent';
import AppConfig from '../../app_config/app';
// import AuthIntercept from './AuthIntercept'

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path) {
  return AppConfig.apiBaseUrl + path;
}

class APIClient {

	/**
	 * Constructor for this class. Generates RESTful HTTP methods. (see 'methods' variable above.)
	 * Note: The methods built correspond to the methods available in the superagent library.
	 * @param  {Object} store The Redux 'liftedStore' for the app. Used to access token from store and to make dispatch requests.
	 * @return undefined
	 */
	constructor(store) {
		this.store = store;
		this.updateToken = this._updateToken.bind(this);

		methods.forEach((method) =>
		  this[method] = (path, authRequired = true, { params, data } = {}) => new Promise((resolve, reject) => {
		    const request = superagent[method](formatUrl(path));

		    request.set('Accept', 'application/json')
		    
		    if (params) {
		      request.query(params);
		    }

		    if(authRequired) {
		    	// Get statetree and get auth.token from that.
		      request.set('Authorization', 'Bearer ' + this.store.getState().auth.token)
		    }

		    // request.use(AuthIntercept);

		    if (data) {
		      request.send(data);
		    }

		    request.end((err, res) => err ? reject(res || err) : resolve(res));
		  })
		);
	}

	/**
	 * Dispatch a TOKEN_UDPATED action
	 * @param  {string} token - token value to update
	 * @return {[type]}       [description]
	 */
	_updateToken(token){
		this.store.dispatch({
			type: 'TOKEN_UPDATED',
			token: token.split(" ")[1] // remove 'Bearer' from Authorization header and get just token
		})
	}

	/**
	 * Get the path to the API server for a resource (used for DELETE AND POST requests)
	 * @param  {string} resourceNamePlural The plural name of the resource (ex. Pages)
	 * @return {string}                    A URL string to the API server for the resource
	 */
	getResourceURL(resourceNamePlural){
	  return AppConfig.apiBaseUrl + resourceNamePlural
	}
}

export default APIClient;