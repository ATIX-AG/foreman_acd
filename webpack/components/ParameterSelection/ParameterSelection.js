import React from 'react';
import PropTypes from 'prop-types';
import * as sort from 'sortabular';
import { compose } from 'recompose';
import { orderBy } from 'lodash';
import * as resolve from 'table-resolver';
import Select from 'foremanReact/components/common/forms/Select';
import {
  isNewDefinition,
  isEditDefinition,
  isDefinition,
  isNewInstance,
  isEditInstance,
  isInstance,
} from './ParameterSelectionHelper';

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
      return ("");

    return (
      <Button bsStyle="default" onClick={() => addParameter()}>
        <Icon type="fa" name="plus" />
      </Button>
    );
  }

  renderDeleteButton(mode, deleteParameter, additionalData) {
    if (isInstance(mode))
      return ("");

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

  renderSelectApplication(applications, url, loadParameterSelection, selectedApp) {
    return (
      <Select
         value={selectedApp}
         onChange={e => loadParameterSelection(url, e.target.value) }
         options={applications}
         allowClear
         key="key"
      />
    );
  }

  renderRailsAppDefinitionId(app_id) {
    return (
      <input
        value={app_id}
        id="foreman_appcendep_app_instance_app_definition_id"
        name="foreman_appcendep_app_instance[app_definition_id]"
        type="hidden"
      />
    );
  }

  renderRailsAppDefinitionName(app_name) {
    return (
      <div>Application Definition: {app_name}</div>
    );
  }

  componentDidMount() {
    const {
      data: { mode, puppetEnvUrl, lifecycleEnvUrl, lifecycleEnvOrganization, parameters },
      initParameterSelection,
      sortParameter,
      deleteParameter,
      activateEditParameter,
      changeEditParameter,
    } = this.props;

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
            value={value}
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
            case 'puppetenv':
              console.log("v: %o", this.props.puppetEnv);
              prettyValue = this.props.puppetEnv[value];
              break;
            case 'lifecycleenv':
              prettyValue = this.props.lifecycleEnv[value];
              break;
          }
        }
        return inlineEditFormatterImpl.renderValue(prettyValue, additionalData)
      },
      renderEdit: (value, additionalData) => {
        switch (additionalData.property) {
          case 'type':
            if (additionalData.rowData.newEntry === true) {
              return inlineEditFormatterImpl.renderEditSelect(value, additionalData, {
                ip: 'IP',
                hostname: 'Hostname',
                password: 'Root password',
                lifecycleenv: 'Lifecycle environment',
                puppetenv: 'Puppet environment',
                hostparam: 'Host parameter',
              })
            }
            return inlineEditFormatterImpl.renderValue(value, additionalData)
          case 'value':
            switch (additionalData.rowData.type) {
              case 'ip':
                return inlineEditFormatterImpl.renderEditText(value, additionalData)
              case 'hostname':
                return inlineEditFormatterImpl.renderEditText(value, additionalData)
              case 'password':
                return inlineEditFormatterImpl.renderEditText(value, additionalData, 'password')
              case 'puppetenv':
                return inlineEditFormatterImpl.renderEditSelect(value, additionalData, this.props.puppetEnv)
              case 'lifecycleenv':
                return inlineEditFormatterImpl.renderEditSelect(value, additionalData, this.props.lifecycleEnv)
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

    this.props.getPuppetEnvironments(
      puppetEnvUrl,
      { page: 1, perPage: 1000 },
      {}
    );

    this.props.getLifecycleEnvironments(
      lifecycleEnvUrl,
      lifecycleEnvOrganization,
      { page: 1, perPage: 1000 },
      {}
    );

    initParameterSelection(
      mode,
      parameters,
      this.sortingFormatter,
      this.sortableTransform,
      this.inlineEditFormatter,
      this.inlineEditButtonsFormatter,
    );
  }

  renderRailsParameters(mode) {
    var id = 'foreman_appcendep_app_definition_parameters'
    var name = 'foreman_appcendep_app_definition[parameters]'

    if (isInstance(mode)) {
      id = 'foreman_appcendep_app_instance_parameters'
      name = 'foreman_appcendep_app_instance[parameters]'
    }

    return (
      <input
        value={JSON.stringify(this.props.rows)}
        id={id}
        name={name}
        type="hidden"
      />
    );
  }

  render() {
    const {
      data: { mode, applications, appDefinition, loadParameterSelectionUrl },
      rows,
      columns,
      sortingColumns,
      sortingDisabled,
      loading,
      addParameter,
      confirmEditParameter,
      cancelEditParameter,
      loadParameterSelection,
      selectedApp,
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
        <div>
          {isNewInstance(mode) && this.renderSelectApplication(applications, loadParameterSelectionUrl, loadParameterSelection, selectedApp) }
          {isNewInstance(mode) && this.renderRailsAppDefinitionId(selectedApp) }
          {isEditInstance(mode) && (this.renderRailsAppDefinitionId(appDefinition.id), this.renderRailsAppDefinitionName(appDefinition.name)) }
        </div>
        <div>
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
        {this.renderRailsParameters(mode)}
      </div>
    );
  }
}

ParameterSelection.defaultProps = {
  error: {},
  editMode: false,
  loading: false,
  puppetEnv: {},
  lifecycleEnv: {},
  rows: [],
  columns: [],
  sortingColumns: {},
  sortingDisabled: false,
  selectedApp: '',
};

ParameterSelection.propTypes = {
  data: PropTypes.shape({
    mode: PropTypes.string.isRequired,
    parameters: PropTypes.array,
    puppetEnvUrl: PropTypes.string,
    lifecycleEnvUrl: PropTypes.string,
    lifecycleEnvOrganization: PropTypes.string,
    applications: PropTypes.array,
    loadParameterSelectionUrl: PropTypes.string,
  }).isRequired,
  getPuppetEnvironments: PropTypes.func,
  getLifecycleEnvironments: PropTypes.func,
  initParameterSelection: PropTypes.func,
  editMode: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  puppetEnv: PropTypes.object.isRequired,
  lifecycleEnv: PropTypes.object.isRequired,
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
  selectedApp: PropTypes.string,
};

export default ParameterSelection;
