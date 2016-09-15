import React from 'react';
import { capitalize } from '../../../../../helpers/StringHelper'
import AdminLayout from '../../Layout/AdminLayout'

const Details = ({ params: { resourceNameSingular, resourceId }, location: { query } }) => {
  return (
    <AdminLayout>
      <div className="admin-index">
        <h1>{capitalize(resourceNameSingular)} {resourceId}</h1>
      </div>
    </AdminLayout>
  );
};
export default Details;