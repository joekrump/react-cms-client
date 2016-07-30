import AdminIndex from '../../components/pages/admin/Index';
import Details from '../../components/pages/admin/Details'
import Edit from '../../components/pages/admin/Edit'
import AppConfig from '../../../config/app'

const AdminRoutes = {

  path: ':resourceName',
  onEnter(nextState, replace) {
    // if (!AppConfig.validPaths.includes(nextState.location.pathname.toLowerCase())) {
    //   replace({
    //     pathname: '/admin',
    //     state: { nextPathname: nextState.location.pathname }
    //   })
    // }
  },

  getChildRoutes(partialNextState, callback) {
    require.ensure([], function (require) {
      callback(null, [
        { 
          path: ':resourceId', 
          indexRoute: { 
            component: Details
          },
          getChildRoutes(partialNextState, callback) {
            require.ensure([], function (require) {
              callback(null, [
                {
                  path: 'edit',
                  getComponents(nextState, callback) {
                    require.ensure([], function (require) {
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

export default AdminRoutes;