import { combineReducers } from 'redux';
import {
  cloneDeep,
  findIndex,
  findLastIndex,
} from 'lodash';

import parameterSelectionParameters from './components/ParameterSelection/ParameterSelectionReducer';
import applicationDefinitionConf from './components/ApplicationDefinition/ApplicationDefinitionReducer';
import applicationInstanceConf from './components/ApplicationInstance/ApplicationInstanceReducer';
import applicationInstanceDeployReport from './components/ApplicationInstanceDeploy/ApplicationInstanceDeployReducer';

import {
  APPLICATION_DEFINITION_PARAMETER_SELECTION_MODAL_CLOSE,
} from './components/ApplicationDefinition/ApplicationDefinitionConstants';

import {
  APPLICATION_INSTANCE_PARAMETER_SELECTION_MODAL_CLOSE,
} from './components/ApplicationInstance/ApplicationInstanceConstants';

const rootReducer = (state = {}, action) => {

  const param_state = parameterSelectionParameters(state.parameterSelectionParameters, action);
  const app_ins_depl_report_state = applicationInstanceDeployReport(state.applicationInstanceDeployReport, action);

  if (action.type == APPLICATION_DEFINITION_PARAMETER_SELECTION_MODAL_CLOSE) {
    action.payload.serviceParameterSelection = param_state.parameters;
  }
  const app_def_state = applicationDefinitionConf(state.applicationDefinitionConf, action);

  if (action.type == APPLICATION_INSTANCE_PARAMETER_SELECTION_MODAL_CLOSE) {
    action.payload.hostParameterSelection = param_state.parameters;
  }
  const app_ins_state = applicationInstanceConf(state.applicationInstanceConf, action);

  return {
    applicationDefinitionConf: app_def_state,
    applicationInstanceConf: app_ins_state,
    parameterSelectionParameters: param_state,
    applicationInstanceDeployReport: app_ins_depl_report_state,
  };
};

export default rootReducer;
