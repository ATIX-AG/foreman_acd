import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ParameterSelection from './ParameterSelection';
import * as ParameterSelectionActions from './ParameterSelectionActions';

import {
  selectLoading,
  selectSimple,
} from './ParameterSelectionSelectors';

const mapStateToProps = state => ({
  loading: selectLoading(state),
  simple: selectSimple(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(ParameterSelectionActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParameterSelection);

