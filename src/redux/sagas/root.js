import logoutSaga     from './logout';
import loginSaga      from './login';
import tokenSaga      from './tokenUpdated';
import formFieldSaga  from './fieldUpdate';
import adminIndexSaga from './ui/admin/index';
import adminSaga      from './admin';
import locationSaga   from './location';

export default function* rootSaga(){
  yield [
    loginSaga(),
    locationSaga(),
    adminSaga(),
    adminIndexSaga(),
    formFieldSaga(),
    logoutSaga(),
    tokenSaga()
  ]
}