import { combineReducers } from 'redux';
import {
  cloneDeep,
  findIndex,
  findLastIndex,
} from 'lodash';

import parameterSelectionParameters from './components/ParameterSelection/ParameterSelectionReducer';
import applicationDefinitionConf from './components/ApplicationDefinition/ApplicationDefinitionReducer';
import applicationInstanceConf from './components/ApplicationInstance/ApplicationInstanceReducer';

import {
  APPLICATION_DEFINITION_PARAMETER_SELECTION_MODAL_CLOSE,
} from './components/ApplicationDefinition/ApplicationDefinitionConstants';

import {
  APPLICATION_INSTANCE_PARAMETER_SELECTION_MODAL_CLOSE,
} from './components/ApplicationInstance/ApplicationInstanceConstants';

const rootReducer = (state = {}, action: Action) => {

  let param_state = parameterSelectionParameters(state.parameterSelectionParameters, action);

  if (action.type == APPLICATION_DEFINITION_PARAMETER_SELECTION_MODAL_CLOSE) {
    action.payload.serviceParameterSelection = param_state.parameters;
  }
  let app_def_state = applicationDefinitionConf(state.applicationDefinitionConf, action);

  if (action.type == APPLICATION_INSTANCE_PARAMETER_SELECTION_MODAL_CLOSE) {
    action.payload.hostParameterSelection = param_state.parameters;
  }
  let app_ins_state = applicationInstanceConf(state.applicationInstanceConf, action);

  return {
    applicationDefinitionConf: app_def_state,
    applicationInstanceConf: app_ins_state,
    parameterSelectionParameters: param_state,
  };
};

export default rootReducer;
