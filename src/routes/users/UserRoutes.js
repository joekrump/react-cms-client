import AdminIndex from '../../components/pages/admin/Index';
import User from '../../components/pages/admin/User'
import Edit from '../../components/pages/admin/Edit'

const UserRoutes = {

  path: 'users',


  getChildRoutes(partialNextState, callback) {
    require.ensure([], function (require) {
      callback(null, [
        { 
          path: ':id', 
          indexRoute: { 
            component: User
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

export default UserRoutes;