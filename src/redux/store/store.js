// Dev tools
import { createDevTools } from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import SliderMonitor from 'redux-slider-monitor';
import DockMonitor from 'redux-devtools-dock-monitor'
import React from 'react'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'

const DevTools = createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h" changePositionKey="ctrl-q" changeMonitorKey='ctrl-m' defaultPosition='bottom'>
    <LogMonitor theme="tomorrow" preserveScrollTop={true} />
    <SliderMonitor />
  </DockMonitor>
)

const Store = () => {

  let store =  null;

  const getStore = () => {
    return store;
  }
  /**
   * [description]
   * @param  {[type]} reducers   [description]
   * @param  {[type]} middleware [description]
   * @param  {[type]} callback   [description]
   * @return {[type]}            [description]
   */
  const setStore = (reducers, middleware, callback) => {

    const reducer = combineReducers({
      ...reducers
    })
    store = createStore(
      reducer,
      { routing: { locationBeforeTransitions: null },
      auth: {logged_in: false} },
      compose(
        applyMiddleware(...middleware),
        ((typeof window !== 'undefined') && window.devToolsExtension) ? window.devToolsExtension() : DevTools.instrument() 
      )
    );

    console.log(store.getState());
    
    if(callback){
      callback();
    }

    return store;
  }
  return {
    setStore: setStore,
    getStore: getStore
  }
}


export default Store;