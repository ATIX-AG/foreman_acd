import Immutable from 'seamless-immutable';

import { applicationInstanceReportData1 } from '../__fixtures__/applicationInstanceReportData1.fixtures';

export const successState = Immutable(applicationInstanceReportData1);

const ACTIVE_HOST_ID = 2;

// Payload Data
export const initApplicationInstanceReportPayload = applicationInstanceReportData1;
export const setActiveHostPayload = {
  activeHostId: ACTIVE_HOST_ID,
};
