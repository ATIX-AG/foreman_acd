import { testComponentSnapshotsWithFixtures } from 'react-redux-test-utils';

import ApplicationInstance from '../ApplicationInstance';

const noop = () => {};

const baseFixtures = {
  data: {
    mode: '',
    location: 'Default Location',
    organization: 'Default Organization',
    appDefinition: {},
    hosts: [],
    ansibleVarsAll: [],
  },
  activateEditApplicationInstanceHost: noop,
  addApplicationInstanceHost: noop,
  cancelEditApplicationInstanceHost: noop,
  changeEditApplicationInstanceHost: noop,
  changeParameterSelectionMode: noop,
  closeAddExistingHostsModal: noop,
  closeAlertModal: noop,
  closeAnsibleParameterSelectionModal: noop,
  closeForemanParameterSelectionModal: noop,
  confirmEditApplicationInstanceHost: noop,
  deleteApplicationInstanceHost: noop,
  initApplicationInstance: noop,
  loadApplicationDefinition: noop,
  openForemanParameterSelectionModal: noop,
  openAnsibleParameterSelectionModal: noop,
  openAddExistingHostsModal: noop,
};

const fixtures = {
  'should render without optional-values': baseFixtures,
  'should render newInstance': {
    ...baseFixtures,
    data: {
      ...baseFixtures.data,
      mode: 'newInstance',
      applications: {
        '1': 'dummy-definition',
        '2': 'test-definition',
      },
      supportedPlugins: {
        puppet: false,
        katello: true,
      },
    },
  },
  'should render editInstance': {
    ...baseFixtures,
    data: {
      ...baseFixtures.data,
      mode: 'editInstance',
      appDefinition: {
        id: 2,
        name: 'test-definition',
      },
      hosts: [
        {
          id: 1,
          hostname: 'grafana-host',
          service: '1',
          description: '',
          isExistingHost: false,
          foremanParameters: [],
          ansibleParameters: [],
        },
        {
          id: 2,
          hostname: 'prometheus-host',
          service: '2',
          description: '',
          isExistingHost: false,
          foremanParameters: [],
          ansibleParameters: [],
        },
      ],
      supportedPlugins: {
        puppet: false,
        katello: true,
      },
    },
  },
};

describe('ApplicationInstance', () =>
  testComponentSnapshotsWithFixtures(ApplicationInstance, fixtures));
