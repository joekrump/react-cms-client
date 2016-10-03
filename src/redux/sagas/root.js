import logoutSaga    from './logout';
import loginSaga     from './login';
import tokenSaga     from './tokenUpdated';
import formFieldSaga from './fieldUpdate';

export default function* rootSaga(){
  yield [
    logoutSaga(),
    loginSaga(),
    tokenSaga(),
    formFieldSaga()
  ]
}