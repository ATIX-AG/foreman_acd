import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ParameterSelection from './ParameterSelection';
import * as ParameterSelectionActions from './ParameterSelectionActions';

import {
  selectLoading,
  selectEditMode,
  selectDefinition,
  selectPuppetEnv,
  selectLifecycleEnv,
  selectRows,
  selectSortingColumns,
  selectColumns,
  selectSortingDisabled,
} from './ParameterSelectionSelectors';

const mapStateToProps = state => ({
  loading: selectLoading(state),
  editMode: selectEditMode(state),
  definition: selectDefinition(state),
  puppetEnv: selectPuppetEnv(state),
  lifecycleEnv: selectLifecycleEnv(state),
  rows: selectRows(state),
  sortingColumns: selectSortingColumns(state),
  columns: selectColumns(state),
  sortingDisabled: selectSortingDisabled(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(ParameterSelectionActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParameterSelection);

