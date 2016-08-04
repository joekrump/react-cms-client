import { takeEvery, takeLatest } from 'redux-saga'
import { call, put } from 'redux-saga/effects'


export default function* rootSaga(){
  yield [
    dashboardSaga()
  ]
}


// Generator for the dashboard Saga
function* dashboardSaga() {
  console.log('dashbaordSaga')
}