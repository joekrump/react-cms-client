import AdminIndex from '../../components/pages/admin/Index';
import Details from '../../components/pages/admin/Details';
import Edit from '../../components/pages/admin/Edit';
import New from '../../components/pages/admin/New';


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
  // 
  
  getChildRoutes(partialNextState, callback) {
    require.ensure([], (require) => {
      callback(null, [
        {
          path: 'new',
          getIndexRoute(partialNextState, callback) {
            require.ensure([], (require) => {
              callback(null, {
                component: New
              })
            })
          }
        }, 
        { path: ':resourceId', 
          indexRoute: { 
            component: Details
          },
          getChildRoutes(partialNextState, callback) {
            require.ensure([], (require) => {
              callback(null, [
                {
                  path: 'edit',
                  getComponents(nextState, callback) {
                    require.ensure([], (require) => {
                      callback(null, Edit)
                    })
                  }
                }
              ])
            })
          }
        }
      ])
    })
  },

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