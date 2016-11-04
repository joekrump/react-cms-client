import adminState from './admin/admin';
import authState from './auth';
import formsState from './forms/forms';
import notificationState from './notification';
import pageState from './page';
import paymentState from './payment';
import treeState from './tree';

export default {
  admin: adminState,
  auth: authState,
  forms: formsState,
  notification: notificationState,
  page: pageState,
  payment: paymentState,
  tree: treeState
}