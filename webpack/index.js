import componentRegistry from 'foremanReact/components/componentRegistry';
import injectReducer from 'foremanReact/redux/reducers/registerReducer';
import ParameterSelection from './components/ParameterSelection';
import reducer from './reducer';

injectReducer('foremanAppcendep', reducer);

componentRegistry.register({ name: 'ParameterSelection', type: ParameterSelection, });
