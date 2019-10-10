import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ParameterSelection from './ParameterSelection';
import * as ParameterSelectionActions from './ParameterSelectionActions';

import {
  selectLoading,
  selectEditMode,
  selectForemanData,
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

