import logoutSaga     from './logout';
import loginSaga      from './login';
import tokenSaga      from './tokenUpdated';
import adminIndexSaga from './ui/admin/index';
import adminSaga      from './admin';

export default function* rootSaga(){
  yield [
    loginSaga(),
    adminSaga(),
    adminIndexSaga(),
    logoutSaga(),
    tokenSaga()
  ]
}