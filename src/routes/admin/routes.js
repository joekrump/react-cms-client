import AdminIndex from '../../components/Pages/Admin/Resources/Index/Index';
import Show from '../../components/Pages/Admin/Resources/Show/Show';
import Edit from '../../components/Pages/Admin/Resources/Edit/Edit';
import New from '../../components/Pages/Admin/Resources/New/New';
import { onAdminEnterHandler } from '../../routes'

const AdminIndexRoutes = (store) => {
  let routes = {
    path: ':resourceNamePlural',
    indexRoute: { 
      component: AdminIndex,
      onEnter: (nextState) => onAdminEnterHandler(nextState, store)
    },
    childRoutes: [
      { 
        path: 'new', 
        component: New, 
        onEnter: (nextState) => onAdminEnterHandler(nextState, store) 
      },
      { 
        path: ':resourceId',
        indexRoute: { 
          component: Show,
          onEnter: (nextState) => onAdminEnterHandler(nextState, store) 
        },
        childRoutes: [
          { 
            path: 'edit', 
            component: Edit,
            onEnter: (nextState) => onAdminEnterHandler(nextState, store) 
          }
        ]
      }
    ]
  }

  return routes;
}

export default AdminIndexRoutes;