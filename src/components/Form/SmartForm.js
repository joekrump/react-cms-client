import React from 'react';
import { connect } from 'react-redux';
import Form from './Form';
import * as actions from '../../actions/form';

export const SmartForm = connect(state => state, actions)(Form);