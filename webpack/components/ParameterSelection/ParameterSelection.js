import React from 'react';
import PropTypes from 'prop-types';
import * as sort from 'sortabular';
import { compose } from 'recompose';
import { orderBy } from 'lodash';
import * as resolve from 'table-resolver';
import Select from 'foremanReact/components/common/forms/Select';
import store from 'foremanReact/redux';
import {
  isNewDefinition,
  isEditDefinition,
  isDefinition,
  isNewInstance,
  isEditInstance,
  isInstance,
  transformForemanData,
  transformParameterTypes,
} from './ParameterSelectionHelper';

import {
  PARAMETER_TYPES,
} from './ParameterSelectionConstants';

import {
  Icon,
  Button,
  Table,
  FormControl,
  defaultSortingOrder,
  customHeaderFormattersDefinition,
  inlineEditFormatterFactory,
} from 'patternfly-react';

const theme = {
  scheme: 'foreman',
  backgroundColor: 'rgba(0, 0, 0, 255)',
  base00: 'rgba(0, 0, 0, 0)',
};


class ParameterSelection extends React.Component {

  constructor(props) {
    super(props);
  }

  renderAddButton(mode, addParameter) {
    if (isInstance(mode))
      return null;

    return (
      <Button bsStyle="default" disabled={ this.props.editMode || this.props.hostgroupId <= 0 } onClick={() => addParameter()}>
        <Icon type="fa" name="plus" />
      </Button>
    );
  }

  renderDeleteButton(mode, deleteParameter, additionalData) {
    if (isInstance(mode))
      return null;

    return (
      <span>
      &nbsp;
      <Button
        bsStyle="default"
        onClick={() => window.confirm("Are you sure you wish to delete this item?") && deleteParameter(additionalData) }
      >
        <Icon type="pf" name="delete" />
      </Button>
      </span>
    );
  }

  renderSelectApplication(applications, url, loadParameterSelection, appDefinition) {
    return (
      <Select
         value={appDefinition.id.toString()}
         onChange={e => loadParameterSelection(url, e.target.value) }
         options={applications}
         allowClear
         key="key"
      />
    );
  }

  renderSelectHostgroup(hostgroups, url, loadForemanData, hostgroupId) {
    return (
      <Select
         value={hostgroupId.toString()}
         onChange={e => loadForemanData(url, e.target.value, true) }
         options={hostgroups}
         allowClear
         key="key"
      />
    );
  }

  renderRailsInputHidden(view, parameter, value) {
    var id = "foreman_appcendep_"+ view +"_"+ parameter;
    var name = "foreman_appcendep_"+ view +"["+ parameter +"]";

    return (
      <input
        id={id}
        name={name}
        value={value}
        type="hidden"
      />
    );
  }

  renderShowDivText(text) {
    return (
      <div>{text}</div>
    );
  }

  componentDidMount() {
    const {
      data: { mode, appDefinition, location, organization, loadForemanDataUrl, parameters },
      initParameterSelection,
      sortParameter,
      deleteParameter,
      activateEditParameter,
      changeEditParameter,
      loadForemanData,
    } = this.props;

    if (isEditDefinition(mode) || isEditInstance(mode)) {
       loadForemanData(loadForemanDataUrl, appDefinition.hostgroup_id);
    }

    // enables our custom header formatters extensions to reactabular
    this.customHeaderFormatters = customHeaderFormattersDefinition;

    const isEditing = ({rowData }) => {
      return (rowData.backup !== undefined);
    };
    this.isEditing = isEditing;

    const inlineEditButtonsFormatter = inlineEditFormatterFactory({
      isEditing: additionalData => this.props.editMode,
      renderValue: (value, additionalData) => (
        <td style={{ padding: '2px' }}>
          <Button
            bsStyle="default"
            onClick={() => activateEditParameter(additionalData)}
          >
            <Icon type="pf" name="edit" />
          </Button>
          {this.renderDeleteButton(mode, deleteParameter, additionalData)}
        </td>
      ),
      renderEdit: (value, additionalData) => (
        <td style={{ padding: '2px' }}>
          <Button bsStyle="default" disabled>
            <Icon type="pf" name="edit" />
          </Button>
        </td>
      )
    });
    this.inlineEditButtonsFormatter = inlineEditButtonsFormatter;

    const getSortingColumns = () => this.props.sortingColumns || {};

    const sortableTransform = sort.sort({
      getSortingColumns,
      onSort: (selectedColumn, defaultSortingOrder) => sortParameter(selectedColumn, defaultSortingOrder),
      strategy: sort.strategies.byProperty,
    });
    this.sortableTransform = sortableTransform;

    const sortingFormatter = sort.header({
      sortableTransform,
      getSortingColumns,
      strategy: sort.strategies.byProperty,
    });
    this.sortingFormatter = sortingFormatter;

    const inlineEditFormatterImpl = {
      renderValue: (value, additionalData) => (
        <td>
          <span className="static">{value}</span>
        </td>
      ),
      renderEditText: (value, additionalData, subtype='text') => (
        <td className="editing">
          <FormControl
            type={subtype}
            defaultValue={value}
            onBlur={e => changeEditParameter(e.target.value, additionalData) }
          />
        </td>
      ),
      renderEditSelect: (value, additionalData, options) => (
        <td className="editing">
          <Select
            value={value.toString()}
            onChange={e => changeEditParameter(e.target.value, additionalData) }
            options={options}
            allowClear
            key="key"
          />
        </td>
      ),
    };

    const inlineEditFormatter = inlineEditFormatterFactory({
      isEditing: additionalData => isEditing(additionalData),
      renderValue: (value, additionalData) => {
        var prettyValue = value;
        if (additionalData.property == 'value') {
          switch (additionalData.rowData.type) {
            case 'computeprofile':
              prettyValue = transformForemanData(this.props.foremanData['computeprofiles'])[value]
              break;
            case 'domain':
              prettyValue = transformForemanData(this.props.foremanData['domains'])[value]
              break;
            case 'lifecycleenv':
              prettyValue = transformForemanData(this.props.foremanData['environments'])[value]
              break;
            case 'ptable':
              prettyValue = transformForemanData(this.props.foremanData['ptables'])[value]
              break;
            case 'puppetenv':
              prettyValue = transformForemanData(this.props.foremanData['environments'])[value]
              break;
          }
        } else if (additionalData.property == 'type') {
          prettyValue = PARAMETER_TYPES[value];
        }
        return inlineEditFormatterImpl.renderValue(prettyValue, additionalData)
      },
      renderEdit: (value, additionalData) => {
        switch (additionalData.property) {
          case 'type':
            if (additionalData.rowData.newEntry === true) {
              //FIXME: this would delete the currently selected option
              //return inlineEditFormatterImpl.renderEditSelect(value, additionalData, transformParameterTypes(PARAMETER_TYPES, this.props.rows.map(item => item["type"]).filter(item => item != 'hostparam')));
              return inlineEditFormatterImpl.renderEditSelect(value, additionalData, PARAMETER_TYPES);
            }
            return inlineEditFormatterImpl.renderValue(value, additionalData)
          case 'value':
            switch (additionalData.rowData.type) {
              case 'computeprofile':
                return inlineEditFormatterImpl.renderEditSelect(value, additionalData, transformForemanData(this.props.foremanData['computeprofiles']));
              case 'domain':
                return inlineEditFormatterImpl.renderEditSelect(value, additionalData, transformForemanData(this.props.foremanData['domains']));
              case 'lifecycleenv':
                // FIXME
                return inlineEditFormatterImpl.renderEditSelect(value, additionalData, transformForemanData(this.props.foremanData['environments']));
              case 'puppetenv':
                return inlineEditFormatterImpl.renderEditSelect(value, additionalData, transformForemanData(this.props.foremanData['environments']));
              case 'ptable':
                return inlineEditFormatterImpl.renderEditSelect(value, additionalData, transformForemanData(this.props.foremanData['ptables']));
              case 'text':
              default:
                return inlineEditFormatterImpl.renderEditText(value, additionalData);
            }
          default:
            return inlineEditFormatterImpl.renderEditText(value, additionalData)
        }
      }
    });
    this.inlineEditFormatter = inlineEditFormatter;

    initParameterSelection(
      mode,
      appDefinition,
      parameters,
      this.sortingFormatter,
      this.sortableTransform,
      this.inlineEditFormatter,
      this.inlineEditButtonsFormatter,
    );
  }

  render() {
    const {
      data: { mode, applications, hostgroups, loadParameterSelectionUrl, loadForemanDataUrl },
      rows,
      columns,
      sortingColumns,
      sortingDisabled,
      loading,
      addParameter,
      confirmEditParameter,
      cancelEditParameter,
      loadParameterSelection,
      loadForemanData,
      appDefinition,
      hostgroupId,
    } = this.props;

    var sortedRows;
    if (sortingDisabled === false) {
      sortedRows = compose(
        sort.sorter({
          columns,
          sortingColumns,
          sort: orderBy,
          strategy: sort.strategies.byProperty
        })
      )(rows);
    } else {
     sortedRows = rows;
    }

    return(
      <div>
        {isDefinition(mode) ? (
        <div className="clearfix">
          <div className="form-group">
            <label className="col-md-2 control-label">Host Group</label>
            <div className="col-md-4">
              {isNewDefinition(mode) && this.renderSelectHostgroup(hostgroups, loadForemanDataUrl, loadForemanData, hostgroupId) }
              {isEditDefinition(mode) && this.renderShowDivText(hostgroups[hostgroupId]) }
              {this.renderRailsInputHidden('app_definition', 'hostgroup_id', hostgroupId) }
            </div>
          </div>
        </div>
        ) : (
        <div className="clearfix">
          <div className="form-group">
            <label className="col-md-2 control-label">Application Definition</label>
            <div className="col-md-4">
              {isNewInstance(mode) && this.renderSelectApplication(applications, loadParameterSelectionUrl, loadParameterSelection, appDefinition)}
              {isEditInstance(mode) && this.renderShowDivText(appDefinition.name)}
              {isInstance(mode) && this.renderRailsInputHidden('app_instance', 'app_definition_id', appDefinition.id)}
            </div>
          </div>
        </div>
        )}
        <div className="clearfix">
          <div className="form-group">
            <label className="col-md-1 control-label">Application parameters</label>
            <div className="col-md-5">&nbsp;</div>
          </div>
        </div>

        <div className="clearfix">
          <div className="form-group">
            {this.renderAddButton(mode, addParameter)}
            <Table.PfProvider
              striped
              bordered
              hover
              dataTable
              inlineEdit
              columns={columns}
              components={{
                header: {
                  cell: cellProps =>
                    this.customHeaderFormatters({
                      cellProps,
                      columns,
                      sortingColumns
                    })
                },
                body: {
                  row: Table.InlineEditRow,
                  cell: cellProps => cellProps.children
                }
              }}
            >
              <Table.Header headerRows={resolve.headerRows({ columns })} />
              <Table.Body
                rows={sortedRows}
                rowKey="id"
                onRow={(rowData, { rowIndex }) => ({
                  role: 'row',
                  isEditing: () => this.isEditing({ rowData }),
                  onCancel: () => cancelEditParameter({ rowData, rowIndex }),
                  onConfirm: () => confirmEditParameter({ rowData, rowIndex }),
                  last: rowIndex === sortedRows.length - 1
                })}
              />
            </Table.PfProvider>
            {this.renderAddButton(mode, addParameter)}
          </div>
          {this.renderRailsInputHidden(isDefinition(mode) ? 'app_definition' : 'app_instance', 'parameters', JSON.stringify(this.props.rows))}
        </div>
      </div>
    );
  }
}

ParameterSelection.defaultProps = {
  error: {},
  editMode: false,
  loading: false,
  foremanData: {},
  rows: [],
  columns: [],
  sortingColumns: {},
  sortingDisabled: false,
  appDefinition: { "id": '', "name": '', "hostgroup_id": '', "parameters": [] },
  hostgroupId: -1,
};

ParameterSelection.propTypes = {
  data: PropTypes.shape({
    mode: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    organization: PropTypes.string.isRequired,
    parameters: PropTypes.array,
    appDefinition: PropTypes.object,
    applications: PropTypes.object,
    hostgroups: PropTypes.object,
    loadParameterSelectionUrl: PropTypes.string,
    loadForemanDataUrl: PropTypes.string,
  }).isRequired,
  initParameterSelection: PropTypes.func,
  editMode: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  foremanData: PropTypes.object.isRequired,
  rows: PropTypes.array,
  sortingColumns: PropTypes.object,
  columns: PropTypes.array,
  sortingDisabled: PropTypes.bool,
  sortParameter: PropTypes.func,
  addParameter: PropTypes.func,
  deleteParameter: PropTypes.func,
  activateEditParameter: PropTypes.func,
  confirmEditParameter: PropTypes.func,
  cancelEditParameter: PropTypes.func,
  changeEditParameter: PropTypes.func,
  loadParameterSelection: PropTypes.func,
  loadForemanData: PropTypes.func,
  appDefinition: PropTypes.object,
  hostgroupId: PropTypes.number,
};

export default ParameterSelection;
