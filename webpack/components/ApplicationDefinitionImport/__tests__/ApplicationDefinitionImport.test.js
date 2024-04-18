import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ApplicationDefinitionImport from '../ApplicationDefinitionImport';

const noop = () => {};

const baseFixtures = {
  location: 'Default Location',
  organization: 'Default Organization',
  hostgroups: { '1': 'alma8' },
  ansiblePlaybookServices: [],
  initApplicationDefinitionImport: noop,
  addApplicationDefinitionImportService: noop,
  closeAlertModal: noop,
  changeEditApplicationDefinitionImportService: noop,
  handleImportAnsiblePlaybook: noop,
};

const fixtures = {
  'should render application definition import': baseFixtures,

  'should render application definition import with loaded archive': {
    ...baseFixtures,
    ansiblePlaybookServices: [
      {
        id: 1,
        name: 'Service1',
        hostgroup: '',
        backup: {
          id: 1,
          name: 'Service1',
          hostgroup: '',
        },
      },
      {
        id: 2,
        name: 'Service2',
        hostgroup: '',
        backup: {
          id: 2,
          name: 'Service2',
          hostgroup: '',
        },
      },
    ],
  },
};

describe('ApplicationDefinitionImport', () =>
  testComponentSnapshotsWithFixtures(ApplicationDefinitionImport, fixtures));
