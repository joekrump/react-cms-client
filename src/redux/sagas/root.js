import logoutSaga     from './logout';
import loginSaga      from './login';
import tokenSaga      from './tokenUpdated';
import formFieldSaga  from './fieldUpdate';
import adminIndexSaga from './ui/admin/index';
import adminSaga      from './admin';

export default function* rootSaga(){
  yield [
    loginSaga(),
    adminSaga(),
    adminIndexSaga(),
    formFieldSaga(),
    logoutSaga(),
    tokenSaga()
  ]
}