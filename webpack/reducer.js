import parameterSelectionParameters from './components/ParameterSelection/ParameterSelectionReducer';
import applicationDefinitionConf from './components/ApplicationDefinition/ApplicationDefinitionReducer';
import applicationDefinitionImportConf from './components/ApplicationDefinitionImport/ApplicationDefinitionImportReducer';
import applicationInstanceConf from './components/ApplicationInstance/ApplicationInstanceReducer';
import applicationInstanceReport from './components/ApplicationInstanceReport/ApplicationInstanceReportReducer';
import existingHostSelectionConf from './components/ExistingHostSelection/ExistingHostSelectionReducer';
import syncGitRepoConf from './components/SyncGitRepo/SyncGitRepoReducer';

import {
  APPLICATION_DEFINITION_FOREMAN_PARAMETER_SELECTION_MODAL_CLOSE,
  APPLICATION_DEFINITION_ANSIBLE_PARAMETER_SELECTION_MODAL_CLOSE,
} from './components/ApplicationDefinition/ApplicationDefinitionConstants';

import {
  APPLICATION_INSTANCE_FOREMAN_PARAMETER_SELECTION_MODAL_CLOSE,
  APPLICATION_INSTANCE_ANSIBLE_PARAMETER_SELECTION_MODAL_CLOSE,
  APPLICATION_INSTANCE_ADD_EXISTING_HOSTS_MODAL_CLOSE,
} from './components/ApplicationInstance/ApplicationInstanceConstants';

const rootReducer = (state = {}, action) => {
  const paramState = parameterSelectionParameters(
    state.parameterSelectionParameters,
    action
  );
  const appInsReportState = applicationInstanceReport(
    state.applicationInstanceReport,
    action
  );

  if (
    action.type ===
    APPLICATION_DEFINITION_FOREMAN_PARAMETER_SELECTION_MODAL_CLOSE
  ) {
    action.payload.parameterSelection = paramState.parameters;
  }
  if (
    action.type ===
    APPLICATION_DEFINITION_ANSIBLE_PARAMETER_SELECTION_MODAL_CLOSE
  ) {
    action.payload.parameterSelection = paramState.parameters;
  }
  const appDefState = applicationDefinitionConf(
    state.applicationDefinitionConf,
    action
  );
  const appDefImportState = applicationDefinitionImportConf(
    state.applicationDefinitionImportConf,
    action
  );

  if (
    action.type === APPLICATION_INSTANCE_FOREMAN_PARAMETER_SELECTION_MODAL_CLOSE
  ) {
    action.payload.parameterSelection = paramState.parameters;
  }
  if (
    action.type === APPLICATION_INSTANCE_ANSIBLE_PARAMETER_SELECTION_MODAL_CLOSE
  ) {
    action.payload.parameterSelection = paramState.parameters;
  }

  const exHostState = existingHostSelectionConf(
    state.existingHostSelectionConf,
    action
  );
  if (action.type === APPLICATION_INSTANCE_ADD_EXISTING_HOSTS_MODAL_CLOSE) {
    action.payload.selectedHosts = exHostState.selectedHosts;
  }

  const appInsState = applicationInstanceConf(
    state.applicationInstanceConf,
    action
  );
  const syncGitRepoState = syncGitRepoConf(state.syncGitRepoConf, action);

  return {
    applicationDefinitionConf: appDefState,
    applicationDefinitionImportConf: appDefImportState,
    applicationInstanceConf: appInsState,
    applicationInstanceReport: appInsReportState,
    existingHostSelectionConf: exHostState,
    parameterSelectionParameters: paramState,
    syncGitRepoConf: syncGitRepoState,
  };
};

export default rootReducer;
