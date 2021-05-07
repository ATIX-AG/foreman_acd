import componentRegistry from 'foremanReact/components/componentRegistry';
import injectReducer from 'foremanReact/redux/reducers/registerReducer';
import ParameterSelection from './components/ParameterSelection';
import SyncGitRepo from './components/SyncGitRepo';
import ApplicationDefinition from './components/ApplicationDefinition';
import ApplicationInstance from './components/ApplicationInstance';
import ApplicationInstanceReport from './components/ApplicationInstanceReport';
import reducer from './reducer';

injectReducer('foremanAcd', reducer);

componentRegistry.register({ name: 'ParameterSelection', type: ParameterSelection, });
componentRegistry.register({ name: 'SyncGitRepo', type: SyncGitRepo, });
componentRegistry.register({ name: 'ApplicationDefinition', type: ApplicationDefinition, });
componentRegistry.register({ name: 'ApplicationInstance', type: ApplicationInstance, });
componentRegistry.register({ name: 'ApplicationInstanceReport', type: ApplicationInstanceReport, });
