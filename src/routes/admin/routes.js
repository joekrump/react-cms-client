import AdminIndex from '../../components/pages/admin/Index';
// import Details from '../../components/pages/admin/Details';
// import Edit from '../../components/pages/admin/Edit';
// import AppConfig from '../../../app_config/app';


const AdminIndexRoutes = {

  path: ':resourceNamePlural',
  // onEnter(nextState, replace) {
  //   // Basic check to see if the user is trying to access a route for a resource that exists.
  //   let isRouteValid = false;
  //   AppConfig.validResourcesRootPaths.forEach((validRoute) => {
  //     console.log('validRoute', validRoute);
  //     console.log('thisRoute', nextState.location.pathname);
  //     if(nextState.location.pathname.includes('/admin' + validRoute)){
  //       isRouteValid = true;
  //       return;
  //     }
  //   })
  //   if(!isRouteValid) {
  //     replace({ nextPathname: nextState.location.pathname }, '/login')
  //   }
  // },

  getIndexRoute(partialNextState, callback) {
    require.ensure([], function (require) {
      callback(null, {
        component: AdminIndex
      })
    })
  }

  // getComponents(nextState, callback) {
  //   require.ensure([], function (require) {
  //     callback(null, AdminIndex)
  //   })
  // }
}

export default AdminIndexRoutes;