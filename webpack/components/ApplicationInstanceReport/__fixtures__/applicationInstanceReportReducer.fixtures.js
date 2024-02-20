import Immutable from 'seamless-immutable';
import { cloneDeep, findIndex, findLastIndex } from 'lodash';

import { applicationInstanceReportData_1 } from '../__fixtures__/applicationInstanceReportData_1.fixtures';

export const successState = Immutable(applicationInstanceReportData_1);

const ACTIVE_HOST_ID = 2;

// Payload Data
export const initApplicationInstanceReportPayload = applicationInstanceReportData_1;
export const setActiveHostPayload = {
  activeHostId: ACTIVE_HOST_ID,
};
