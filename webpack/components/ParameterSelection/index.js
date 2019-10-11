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
  selectRows,
  selectSortingColumns,
  selectColumns,
  selectSortingDisabled,
  selectAppDefinition,
  selectHostgroupId,
} from './ParameterSelectionSelectors';

const mapStateToProps = state => ({
  loading: selectLoading(state),
  editMode: selectEditMode(state),
  foremanData: selectForemanData(state),
  parameterTypes: selectParameterTypes(state),
  rows: selectRows(state),
  sortingColumns: selectSortingColumns(state),
  columns: selectColumns(state),
  sortingDisabled: selectSortingDisabled(state),
  appDefinition: selectAppDefinition(state),
  hostgroupId: selectHostgroupId(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(ParameterSelectionActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParameterSelection);

