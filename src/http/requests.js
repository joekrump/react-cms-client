import superagent from 'superagent';
import AppConfig from '../../app_config/app';
import { getToken } from '../auth';

function getFullURL(endpointPath) {
  return `${AppConfig.apiBaseUrl}${endpointPath}`;
}

class APIRequest {
  constructor(method, path, params, data, authRequired, updateToken) {
    this.updateToken = updateToken;
    return new Promise((resolve, reject) => {
      const request = superagent[method](getFullURL(path));
      this.setRequestHeader(request, authRequired);
      this.setRequestQueryParams(request, params);
      this.sendRequestData(request, data);
      this.sendAPIRequest(request, resolve, reject);   
    });
  }

  sendRequestData(request, data) {
    if (data) { request.send(data); }
  }

  setRequestHeader(request, authRequired) {
    request.set('Accept', 'application/json');
    if(authRequired) {
      request.set('Authorization', `Bearer ${getToken()}`)
    }
  }

  setRequestQueryParams(request, params) {
    if (params) { request.query(params); }
  }

  sendAPIRequest(request, successCB, errorCB) {
    request.end((err, res) => {
      if(err) {
        errorCB(res || err)
      } else {
        successCB(res)
        if (res.header.authorization) {
          this.updateToken(res.header.authorization);
        }
      }
    });
  }
}

class APIClient {

  /**
   * Generates RESTful HTTP methods. (see 'methods' array)
   * IMPORTANT: The methods built correspond to the methods available in the superagent library.
   * @param  {function} dispatch - redux dispatch method
   */
  constructor(dispatch) {
    const methods = ['get', 'post', 'put', 'patch', 'del'];

    this.updateToken = (token) => this._updateToken(token, dispatch);
    methods.forEach((method) => {
      this[method] = (
        path,
        authRequired = true,
        { params, data } = {}
      ) => new APIRequest(
        method, 
        path, 
        params, 
        data, 
        authRequired,
        this.updateToken,
      );
    });
  }

  /**
   * Dispatch a TOKEN_UDPATED action
   */
  _updateToken(token, dispatch){
    if(!dispatch) { return; }
    
    dispatch({
      type: 'TOKEN_UPDATED',
      token: token.split(" ")[1] // remove 'Bearer' from Authorization header and get just token
    })
  }
}

export { APIClient };
