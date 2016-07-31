import AdminIndex from '../../components/pages/admin/Index';
import Details from '../../components/pages/admin/Details'
import Edit from '../../components/pages/admin/Edit'


const AdminRoutes = {

  path: ':resourceName',
  onEnter(nextState, replace) {
    // do something maybe...
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