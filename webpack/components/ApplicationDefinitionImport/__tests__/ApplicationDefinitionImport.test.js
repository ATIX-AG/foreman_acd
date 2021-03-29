import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ApplicationDefinitionImport from '../ApplicationDefinitionImport';

const noop = () => {};

const fixtures = {
  'should render application definition import': {
      location: "Default Location",
      organization: "Default Organization",
      hostgroups: [],
      ansiblePlaybookServices: [],
    initApplicationDefinitionImport: noop,
    addApplicationDefinitionImportService: noop,
    closeAlertModal: noop,
  },
};

describe('ApplicationDefinitionImport', () =>
  testComponentSnapshotsWithFixtures(ApplicationDefinitionImport, fixtures));
