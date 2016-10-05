import React from 'react';
import { capitalize } from '../../../../../helpers/StringHelper'
import AdminLayout from '../../Layout/AdminLayout'
import {connect} from 'react-redux';

const Details = (props) => {
  return (
    <AdminLayout>
      <div className="admin-index">
        <h1>{capitalize(props.nameSingular)} {props.params.resourceId}</h1>
      </div>
    </AdminLayout>
  );
};

const mapStateToProps = (state) => {
  return {
    nameSingular: state.admin.resource.name.singular
  }
}

export default connect(mapStateToProps)(Details);