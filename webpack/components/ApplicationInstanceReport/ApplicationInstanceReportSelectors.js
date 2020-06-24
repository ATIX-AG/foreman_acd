const applicationInstanceReport = state => state.foremanAcd.applicationInstanceReport;

export const selectHosts = state => applicationInstanceReport(state).hosts;
export const selectReport = state => applicationInstanceReport(state).report;
export const selectActiveHostId = state => applicationInstanceReport(state).activeHostId;
