import request from 'superagent';
import AppConfig from '../../app_config/app';
import { store } from '../store'
import AuthIntercept from './AuthIntercept'
/**
 * Make a HTTP POST request
 * @param  string     url          Path to specific route (will be appended to AppConfig.apiBaseUrl)
 * @param  {Boolean}  authRequired (optional) Whether or not this request needs auth with it. Default: true
 */
export function apiPost(url, authRequired = true) {
	let postRequest = request.post(AppConfig.apiBaseUrl + url);
	return httpRequest(postRequest, authRequired)
}

/**
 * Make a HTTP PUT request
 * @param  string     url          Path to specific route (will be appended to AppConfig.apiBaseUrl)
 * @param  {Boolean}  authRequired (optional) Whether or not this request needs auth with it. Default: true
 */
export function apiPut(url, authRequired = true) {
	let putRequest = request.put(AppConfig.apiBaseUrl + url);
	return httpRequest(putRequest, authRequired)
}

/**
 * Make a HTTP GET request
 * @param  string     url          Path to specific route (will be appended to AppConfig.apiBaseUrl)
 * @param  {Boolean}  authRequired (optional) Whether or not this request needs auth with it. Default: true
 */
export function apiGet(url, authRequired = true) {
	let getRequest = request.get(AppConfig.apiBaseUrl + url);
	return httpRequest(getRequest, authRequired)
}

/**
 * Make a HTTP DELETE request
 * @param  string     url          Path to specific route (will be appended to AppConfig.apiBaseUrl)
 * @param  {Boolean}  authRequired (optional) Whether or not this request needs auth with it. Default: true
 */
export function apiDelete(url, authRequired = true) {
	let deleteRequest = deleteRequest.del(AppConfig.apiBaseUrl + url);
	return httpRequest(deleteRequest, authRequired)
}

function httpRequest(apiRequest, authRequired = true) {
	
	apiRequest.set('Accept', 'application/json')

	if(authRequired) {
		apiRequest = apiRequest.set('Authorization', 'Bearer ' + store.getState().auth.token)
	}

	return apiRequest.use(AuthIntercept);
}

/**
 * Dispatch a TOKEN_UDPATED action
 * @param  {string} token - token value to update
 * @return {[type]}       [description]
 */
export function updateToken(token){
	store.dispatch({
		type: 'TOKEN_UPDATED',
		token: token.split(" ")[1] // remove 'Bearer' from Authorization header and get just token
	})
}