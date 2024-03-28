import { testSelectorsSnapshotWithFixtures } from 'react-redux-test-utils';

import {
  selectHosts,
  selectActiveHostId,
} from '../ApplicationInstanceReportSelectors';

import { applicationInstanceReportData1 } from '../__fixtures__/applicationInstanceReportData1.fixtures';

const stateFactory = obj => ({
  foremanAcd: {
    applicationInstanceReport: obj,
  },
});

const fixtures = {
  'should return hosts from applicationInstanceReportData1 fixtures': () =>
    selectHosts(stateFactory(applicationInstanceReportData1)),
  'should return activeHostId from applicationInstanceReportData1 fixtures': () =>
    selectActiveHostId(stateFactory(applicationInstanceReportData1)),
};

describe('ApplicationInstanceSelectors', () =>
  testSelectorsSnapshotWithFixtures(fixtures));
