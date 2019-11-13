import componentRegistry from 'foremanReact/components/componentRegistry';
import injectReducer from 'foremanReact/redux/reducers/registerReducer';
import ParameterSelection from './components/ParameterSelection';
import reducer from './reducer';
import $ from 'jquery';

componentRegistry.register({
  name: 'ParameterSelection',
  type: ParameterSelection,
});

injectReducer('foremanAcd', reducer);
const { tfm } = window;

tfm.initParameterSelection = () => {
  tfm.reactMounter.mount(
    'ParameterSelection',
    '#param_selection',
    $('#param_selection').data('json')
  );
};
