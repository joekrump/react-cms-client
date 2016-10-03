import logoutSaga    from './logout';
import loginSaga     from './login';
import tokenSaga     from './tokenUpdated';
import formFieldSaga from './fieldUpdate';
import adminIndexSaga from './ui/admin/index';

export default function* rootSaga(){
  yield [
    logoutSaga(),
    loginSaga(),
    tokenSaga(),
    formFieldSaga(),
    adminIndexSaga()
  ]
}