import request from 'superagent';
import AppConfig from '../../app_config/app';

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
		apiRequest = apiRequest.set('Authorization', 'Bearer ' + sessionStorage.laravelAccessToken)
	}

	return apiRequest;
}