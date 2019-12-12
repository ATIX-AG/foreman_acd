import componentRegistry from 'foremanReact/components/componentRegistry';
import injectReducer from 'foremanReact/redux/reducers/registerReducer';
import ParameterSelection from './components/ParameterSelection';
import ApplicationDefinition from './components/ApplicationDefinition';
import ApplicationInstance from './components/ApplicationInstance';
import reducer from './reducer';

injectReducer('foremanAcd', reducer);

componentRegistry.register({ name: 'ParameterSelection', type: ParameterSelection, });
componentRegistry.register({ name: 'ApplicationDefinition', type: ApplicationDefinition, });
componentRegistry.register({ name: 'ApplicationInstance', type: ApplicationInstance, });
