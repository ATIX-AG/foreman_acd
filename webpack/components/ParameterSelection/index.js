import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import './ParameterSelection.scss';
import ParameterSelection from './ParameterSelection';
import * as ParameterSelectionActions from './ParameterSelectionActions';

import {
  selectLoading,
  selectEditMode,
  selectForemanData,
  selectParameterTypes,
  selectParameters,
  selectSortingColumns,
  selectColumns,
  selectServiceDefinition,
} from './ParameterSelectionSelectors';

const mapStateToProps = state => ({
  loading: selectLoading(state),
  editMode: selectEditMode(state),
  foremanData: selectForemanData(state),
  parameterTypes: selectParameterTypes(state),
  parameters: selectParameters(state),
  sortingColumns: selectSortingColumns(state),
  columns: selectColumns(state),
  serviceDefinition: selectServiceDefinition(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(ParameterSelectionActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParameterSelection);

