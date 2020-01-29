const applicationInstanceDeployReport = state => state.foremanAcd.applicationInstanceDeployReport;

export const selectHosts = state => applicationInstanceDeployReport(state).hosts;
export const selectReport = state => applicationInstanceDeployReport(state).report;
export const selectActiveHostId = state => applicationInstanceDeployReport(state).activeHostId;
