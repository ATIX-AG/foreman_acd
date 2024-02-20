import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ApplicationInstanceReport from '../ApplicationInstanceReport';

const noop = () => {};

const hostData = [
  {
    id: 8,
    name: 'great-web-app-db-1',
    build: false,
    hostUrl: '/hosts/great-web-app-db-1.deploy3.dev.atix',
    progress_report: [],
    powerStatusUrl: '/api/v2/hosts/great-web-app-db-1.deploy3.dev.atix/power',
  },
  {
    id: 9,
    name: 'great-web-app-web-1',
    build: false,
    hostUrl: '/hosts/great-web-app-web-1.deploy3.dev.atix',
    progress_report: [],
    powerStatusUrl: '/api/v2/hosts/great-web-app-web-1.deploy3.dev.atix/power',
  },
  {
    id: 10,
    name: 'great-web-app-web-2',
    build: false,
    hostUrl: '/hosts/great-web-app-web-2.deploy3.dev.atix',
    progress_report: [],
    powerStatusUrl: '/api/v2/hosts/great-web-app-web-2.deploy3.dev.atix/power',
  },
];

const fixtures = {
  'should render application instance report': {
    data: {
      appInstanceName: 'instance name',
      deployTaskUrl: 'deploy/task/url',
      configureJobUrl: 'configure/job/url',
      hosts: hostData,
    },
    initApplicationInstanceReport: noop,
  },
};

describe('ApplicationInstanceReport', () =>
  testComponentSnapshotsWithFixtures(ApplicationInstanceReport, fixtures));
