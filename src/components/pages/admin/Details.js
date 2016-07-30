import React from 'react';
import { capitalize } from '../../../helpers/string'

const Details = ({ params: { resourceName, resourceId }, location: { query } }) => {
  return (

    <div className="admin-index">
      <h1>{capitalize(resourceName)} {resourceId}</h1>
    </div>
  );
};
export default Details;