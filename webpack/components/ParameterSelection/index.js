import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import ParameterSelection from './ParameterSelection';
import * as ParameterSelectionActions from './ParameterSelectionActions';

import {
  selectLoading,
  selectEditMode,
  selectPuppetEnv,
  selectLifecycleEnv,
  selectRows,
  selectSortingColumns,
  selectColumns,
  selectSortingDisabled,
  selectSelectedApp,
} from './ParameterSelectionSelectors';

const mapStateToProps = state => ({
  loading: selectLoading(state),
  editMode: selectEditMode(state),
  puppetEnv: selectPuppetEnv(state),
  lifecycleEnv: selectLifecycleEnv(state),
  rows: selectRows(state),
  sortingColumns: selectSortingColumns(state),
  columns: selectColumns(state),
  sortingDisabled: selectSortingDisabled(state),
  selectedApp: selectSelectedApp(state),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(ParameterSelectionActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ParameterSelection);

