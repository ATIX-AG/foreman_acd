const applicationInstanceReport = state =>
  state.foremanAcd.applicationInstanceReport;

export const selectHosts = state => applicationInstanceReport(state).hosts;
export const selectActiveHostId = state =>
  applicationInstanceReport(state).activeHostId;
export const selectDeploymentState = state =>
  applicationInstanceReport(state).deploymentState;
export const selectInitialConfigureState = state =>
  applicationInstanceReport(state).initialConfigureState;
export const selectInitialConfigureJobUrl = state =>
  applicationInstanceReport(state).initialConfigureJobUrl;
export const selectShowInitialConfigureJob = state =>
  applicationInstanceReport(state).showInitialConfigureJob;
