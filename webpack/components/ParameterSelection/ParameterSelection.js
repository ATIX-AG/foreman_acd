import React from 'react';
import JSONTree from 'react-json-tree';
import PropTypes from 'prop-types';
import * as sort from 'sortabular';
import { compose } from 'recompose';
import * as resolve from 'table-resolver';
import Select from 'foremanReact/components/common/forms/Select';

import {
  cloneDeep,
  findIndex,
  findLastIndex,
  orderBy
} from 'lodash';

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

  renderAddButton(definition, addParameter) {
    if (definition === false)
      return ("");

    return (
      <Button bsStyle="default" onClick={() => addParameter()}>
        <Icon type="fa" name="plus" />
      </Button>
    );
  }

  renderDeleteButton(definition, deleteParameter, additionalData) {
    if (definition === false)
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

  componentDidMount() {
    const {
      data: { definition, puppetEnvUrl, lifecycleEnvUrl, lifecycleEnvOrganization, parameters },
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
          {this.renderDeleteButton(definition, deleteParameter, additionalData)}
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
      renderValue: (value, additionalData) => (
        inlineEditFormatterImpl.renderValue(value, additionalData)
      ),
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
      definition,
      parameters,
      this.sortingFormatter,
      this.sortableTransform,
      this.inlineEditFormatter,
      this.inlineEditButtonsFormatter,
    );
  }

  renderParameterSelectionAsJson() {
    return (JSON.stringify(this.props.rows));
  };

  render() {
    const {
      data: { definition },
      rows,
      columns,
      sortingColumns,
      sortingDisabled,
      loading,
      addParameter,
      confirmEditParameter,
      cancelEditParameter,
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
          {this.renderAddButton(definition, addParameter)}
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
          {this.renderAddButton(definition, addParameter)}
        </div>
        <input
          value={this.renderParameterSelectionAsJson()}
          id="param_selection_json"
          name="param_selection_json"
          type="hidden"
        />
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
};

ParameterSelection.propTypes = {
  data: PropTypes.shape({
    definition: PropTypes.bool.isRequired,
    puppetEnvUrl: PropTypes.string.isRequired,
    lifecycleEnvUrl: PropTypes.string.isRequired,
    lifecycleEnvOrganization: PropTypes.string.isRequired,
    parameters: PropTypes.array.isRequired,
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
};

export default ParameterSelection;
