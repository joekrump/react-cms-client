import AdminIndex from '../../components/Pages/Admin/Resources/Index/Index';
import Show from '../../components/Pages/Admin/Resources/Show/Show';
import Edit from '../../components/Pages/Admin/Resources/Edit/Edit';
import New from '../../components/Pages/Admin/Resources/New/New';
import { onAdminEnterHandler } from '../../routes'

const getAdminRoutes = (store) => {
  let routes = {
    path: ':resourceNamePlural',
    indexRoute: { 
      component: AdminIndex,
      onEnter: (nextState) => onAdminEnterHandler(nextState, store, 'index')
    },
    childRoutes: [
      { 
        path: 'new', 
        component: New, 
        onEnter: (nextState) => onAdminEnterHandler(nextState, store, 'new') 
      },
      { 
        path: ':resourceId',
        indexRoute: { 
          component: Show,
          onEnter: (nextState) => onAdminEnterHandler(nextState, store, 'show') 
        },
        childRoutes: [
          { 
            path: 'edit', 
            component: Edit,
            onEnter: (nextState) => onAdminEnterHandler(nextState, store, 'edit') 
          }
        ]
      }
    ]
  }

  return routes;
}

export default getAdminRoutes;