import React from 'react';
import { capitalize } from '../../../helpers/string'

const Details = ({ params: { resourceNameSingular, resourceId }, location: { query } }) => {
  return (

    <div className="admin-index">
      <h1>{capitalize(resourceNameSingular)} {resourceId}</h1>
    </div>
  );
};
export default Details;