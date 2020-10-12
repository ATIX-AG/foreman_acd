import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import './ParameterSelection.scss';
import ParameterSelection from './ParameterSelection';
import * as ParameterSelectionActions from './ParameterSelectionActions';

import {
  selectLoading,
  selectEditMode,
  selectParamData,
  selectParameterTypes,
  selectParameters,
  selectSortingColumns,
  selectColumns,
  selectParamDefinition,
} from './ParameterSelectionSelectors';

const mapStateToProps = state => ({
  loading: selectLoading(state),
  editMode: selectEditMode(state),
  paramData: selectParamData(state),
  parameterTypes: selectParameterTypes(state),
  parameters: selectParameters(state),
  sortingColumns: selectSortingColumns(state),
  columns: selectColumns(state),
  paramDefinition: selectParamDefinition(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(ParameterSelectionActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParameterSelection);

