import request from 'superagent';
import AppConfig from '../../app_config/app';
import AuthIntercept from './AuthIntercept'

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path;

  return AppConfig.apiBaseUrl + adjustedPath;
}

class APIClient {
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
		      request.set('Authorization', 'Bearer ' + this.store.auth.token)
		    }

		    request.use(AuthIntercept);

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

	render() {
		return this;
	}
}

export default APIClient;

// /**
//  * Make a HTTP POST request
//  * @param  string     url          Path to specific route (will be appended to AppConfig.apiBaseUrl)
//  * @param  {Boolean}  authRequired (optional) Whether or not this request needs auth with it. Default: true
//  */


// export function apiPost(url, authRequired = true) {
// 	let postRequest = request.post(AppConfig.apiBaseUrl + url);
// 	return httpRequest(postRequest, authRequired)
// }

// /**
//  * Make a HTTP PUT request
//  * @param  string     url          Path to specific route (will be appended to AppConfig.apiBaseUrl)
//  * @param  {Boolean}  authRequired (optional) Whether or not this request needs auth with it. Default: true
//  */
// export function apiPut(url, authRequired = true) {
// 	let putRequest = request.put(AppConfig.apiBaseUrl + url);
// 	return httpRequest(putRequest, authRequired)
// }

// /**
//  * Get the path to the API server for a resource (used for DELETE AND POST requests)
//  * @param  {string} resourceNamePlural The plural name of the resource (ex. Pages)
//  * @return {string}                    A URL string to the API server for the resource
//  */
// export function getResourceURL(resourceNamePlural){
// 	return AppConfig.apiBaseUrl + resourceNamePlural
// }

// /**
//  * Make a HTTP GET request
//  * @param  string     url          Path to specific route (will be appended to AppConfig.apiBaseUrl)
//  * @param  {Boolean}  authRequired (optional) Whether or not this request needs auth with it. Default: true
//  */
// export function apiGet(url, authRequired = true) {
// 	let getRequest = request.get(AppConfig.apiBaseUrl + url);
// 	return httpRequest(getRequest, authRequired)
// }

// /**
//  * Make a HTTP DELETE request
//  * @param  string     url          Path to specific route (will be appended to AppConfig.apiBaseUrl)
//  * @param  {Boolean}  authRequired (optional) Whether or not this request needs auth with it. Default: true
//  */
// export function apiDelete(url, authRequired = true) {
// 	let deleteRequest = request.del(AppConfig.apiBaseUrl + url);
// 	return httpRequest(deleteRequest, authRequired)
// }

// function httpRequest(apiRequest, authRequired = true) {

// 	apiRequest.set('Accept', 'application/json')

// 	if(authRequired) {
// 		apiRequest = apiRequest.set('Authorization', 'Bearer ' + sessionStorage.laravelAccessToken)
// 	}

// 	return apiRequest.use(AuthIntercept);
// }