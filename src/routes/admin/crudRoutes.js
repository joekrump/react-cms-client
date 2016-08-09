  
import AdminIndex from '../../components/pages/admin/Index';
import Details from '../../components/pages/admin/Details';
import Edit from '../../components/pages/admin/Edit';
import New from '../../components/pages/admin/New';
import AppConfig from '../../../app_config/app';


const AdminCRUDRoutes = {

  path: ':resourceNameSingular',
  

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
  }
}

export default AdminCRUDRoutes;
