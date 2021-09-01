const applicationInstanceReport = state => state.foremanAcd.applicationInstanceReport;

export const selectHosts = state => applicationInstanceReport(state).hosts;
export const selectActiveHostId = state => applicationInstanceReport(state).activeHostId;
export const selectDeploymentState = state => applicationInstanceReport(state).deploymentState;
