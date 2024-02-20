import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ReportViewer from '../ReportViewer';

const noop = () => {};

const data = [
  { name: 'report 1', status: 'done' },
  { name: 'report 2', status: 'pending' },
];

const fixtures = {
  'should render the report viewer': {
    hidden: false,
    report: data,
  },
  'should render the hidden report viewer': {
    hidden: true,
    report: data,
  },
};

describe('ReportViewer', () =>
  testComponentSnapshotsWithFixtures(ReportViewer, fixtures));
