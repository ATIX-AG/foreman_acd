import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';

import {
  selectHosts,
  selectActiveHostId,
} from '../ApplicationInstanceReportSelectors';

import {
  applicationInstanceReportData_1,
} from '../__fixtures__/applicationInstanceReportData_1.fixtures';

const stateFactory = obj => ({
  foremanAcd: {
    applicationInstanceReport: obj,
  },
});

const fixtures = {
  'should return hosts from applicationInstanceReportData_1 fixtures': () =>
    selectHosts(stateFactory(applicationInstanceReportData_1)),
  'should return activeHostId from applicationInstanceReportData_1 fixtures': () =>
    selectActiveHostId(stateFactory(applicationInstanceReportData_1)),
};

describe('ApplicationInstanceSelectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
