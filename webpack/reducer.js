import { combineReducers } from 'redux';

import parameterSelectionParameters from './components/ParameterSelection/ParameterSelectionReducer';
import applicationDefinitionConf from './components/ApplicationDefinition/ApplicationDefinitionReducer';
import applicationDefinitionImportConf from './components/ApplicationDefinitionImport/ApplicationDefinitionImportReducer';
import applicationInstanceConf from './components/ApplicationInstance/ApplicationInstanceReducer';
import applicationInstanceReport from './components/ApplicationInstanceReport/ApplicationInstanceReportReducer';
import syncGitRepoConf from './components/SyncGitRepo/SyncGitRepoReducer';

import {
  APPLICATION_DEFINITION_FOREMAN_PARAMETER_SELECTION_MODAL_CLOSE,
  APPLICATION_DEFINITION_ANSIBLE_PARAMETER_SELECTION_MODAL_CLOSE,
} from './components/ApplicationDefinition/ApplicationDefinitionConstants';

import {
  APPLICATION_INSTANCE_FOREMAN_PARAMETER_SELECTION_MODAL_CLOSE,
  APPLICATION_INSTANCE_ANSIBLE_PARAMETER_SELECTION_MODAL_CLOSE,
} from './components/ApplicationInstance/ApplicationInstanceConstants';

const rootReducer = (state = {}, action) => {

  const param_state = parameterSelectionParameters(state.parameterSelectionParameters, action);
  const app_ins_report_state = applicationInstanceReport(state.applicationInstanceReport, action);

  if (action.type == APPLICATION_DEFINITION_FOREMAN_PARAMETER_SELECTION_MODAL_CLOSE) {
    action.payload.parameterSelection = param_state.parameters;
  }
  if (action.type == APPLICATION_DEFINITION_ANSIBLE_PARAMETER_SELECTION_MODAL_CLOSE) {
    action.payload.parameterSelection = param_state.parameters;
  }
  const app_def_state = applicationDefinitionConf(state.applicationDefinitionConf, action);
  const app_def_import_state = applicationDefinitionImportConf(state.applicationDefinitionImportConf, action);

  if (action.type == APPLICATION_INSTANCE_FOREMAN_PARAMETER_SELECTION_MODAL_CLOSE) {
    action.payload.parameterSelection = param_state.parameters;
  }
  if (action.type == APPLICATION_INSTANCE_ANSIBLE_PARAMETER_SELECTION_MODAL_CLOSE) {
    action.payload.parameterSelection = param_state.parameters;
  }
  const app_ins_state = applicationInstanceConf(state.applicationInstanceConf, action);

  const sync_git_repo_state = syncGitRepoConf(state.syncGitRepoConf, action);

  return {
    applicationDefinitionConf: app_def_state,
    applicationDefinitionImportConf: app_def_import_state,
    applicationInstanceConf: app_ins_state,
    parameterSelectionParameters: param_state,
    applicationInstanceReport: app_ins_report_state,
    syncGitRepoConf: sync_git_repo_state,
  };
};

export default rootReducer;
