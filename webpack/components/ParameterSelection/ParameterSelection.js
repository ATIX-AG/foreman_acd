import $ from 'jquery';
import React from 'react';
import PropTypes from 'prop-types';
import * as sort from 'sortabular';
import { orderBy } from 'lodash';
import * as resolve from 'table-resolver';
import Select from 'foremanReact/components/common/forms/Select';
import AddTableEntry from '../common/AddTableEntry';
import DeleteTableEntry from '../common/DeleteTableEntry';
import ExtSelect from '../common/ExtSelect';

import {
  transformForemanData,
} from './ParameterSelectionHelper';

import {
  dropRight,
  findIndex,
  cloneDeep,
} from 'lodash';

import {
  PARAMETER_SELECTION_TYPES,
  PARAMETER_SELECTION_PARAM_TYPE_FOREMAN,
  PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE,
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

  isEditing({rowData}) {
    return (rowData.backup !== undefined);
  }

  // enables our custom header formatters extensions to reactabular
  customHeaderFormatters = customHeaderFormattersDefinition;

  componentDidMount() {
    const {
      data: { useDefaultValue, allowRowAdjustment, allowNameAdjustment, allowDescriptionAdjustment, parameters, paramDefinition },
      location,
      organization,
      paramType,
      paramDataUrl,
      initParameterSelection,
      sortParameter,
      deleteParameter,
      activateEditParameter,
      changeEditParameter,
      loadParamData,
    } = this.props;

    if (paramType == PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE) {
      if (parameters.length <= 0) {
        loadParamData({ paramDefinition: paramDefinition, url: paramDataUrl, dataType: paramType, clearParameters: false });
      }
    } else if (paramType == PARAMETER_SELECTION_PARAM_TYPE_FOREMAN) {
      loadParamData({ paramDefinition: paramDefinition, url: paramDataUrl, dataType: paramType, clearParameters: false });
    }

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
          <DeleteTableEntry
            hidden={!allowRowAdjustment}
            disabled={false}
            onDeleteTableEntry={deleteParameter}
            additionalData={additionalData}
          />
        </td>
      ),
      renderEdit: (value, additionalData) => (
        <td style={{ padding: '2px' }}>
          <Button bsStyle="default" disabled>
            <Icon type="pf" name="edit" />
          </Button>
          <DeleteTableEntry
            hidden={!allowRowAdjustment}
            disabled={true}
            onDeleteTableEntry={deleteParameter}
            additionalData={additionalData}
          />
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

    // TODO: should we differentiate between paramType FOREMAN and ANSIBLE?

    const inlineEditFormatter = inlineEditFormatterFactory({
      isEditing: additionalData => this.isEditing(additionalData),
      renderValue: (value, additionalData) => {
        let prettyValue = value;
        if (additionalData.property == 'type') {
          prettyValue = PARAMETER_SELECTION_TYPES[value];
        } else if (additionalData.property == 'value') {
          switch (additionalData.rowData.type) {
            case 'computeprofile':
              prettyValue = transformForemanData(this.props.paramData['computeprofiles'])[value]
              break;
            case 'domain':
              prettyValue = transformForemanData(this.props.paramData['domains'])[value]
              break;
            case 'lifecycleenv':
              prettyValue = transformForemanData(this.props.paramData['lifecycle_environments'])[value]
              break;
            case 'ptable':
              prettyValue = transformForemanData(this.props.paramData['ptables'])[value]
              break;
            case 'password':
              prettyValue = '****************'
              break;
            case 'puppetenv':
              prettyValue = transformForemanData(this.props.paramData['environments'])[value]
              break;
            case 'text':
              prettyValue = value
              break;
          }
        }
        return inlineEditFormatterImpl.renderValue(prettyValue, additionalData)
      },
      renderEdit: (value, additionalData) => {
        switch (additionalData.property) {
          case 'type':
            if (additionalData.rowData.newEntry === true) {
              return inlineEditFormatterImpl.renderEditSelect(value, additionalData, this.props.parameterTypes);
            }
            return inlineEditFormatterImpl.renderValue(PARAMETER_SELECTION_TYPES[value], additionalData)
          case 'value':
            switch (additionalData.rowData.type) {
              case 'computeprofile':
                return inlineEditFormatterImpl.renderEditSelect(value, additionalData, transformForemanData(this.props.paramData['computeprofiles']));
              case 'domain':
                return inlineEditFormatterImpl.renderEditSelect(value, additionalData, transformForemanData(this.props.paramData['domains']));
              case 'lifecycleenv':
                return inlineEditFormatterImpl.renderEditSelect(value, additionalData, transformForemanData(this.props.paramData['lifecycle_environments']));
              case 'puppetenv':
                return inlineEditFormatterImpl.renderEditSelect(value, additionalData, transformForemanData(this.props.paramData['environments']));
              case 'ptable':
                return inlineEditFormatterImpl.renderEditSelect(value, additionalData, transformForemanData(this.props.paramData['ptables']));
              case 'password':
                return inlineEditFormatterImpl.renderEditText(value, additionalData, 'password');
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
      paramType,
      paramDefinition,
      parameters,
      useDefaultValue,
      allowNameAdjustment,
      allowDescriptionAdjustment,
      this.sortingFormatter,
      this.sortableTransform,
      this.inlineEditFormatter,
      this.inlineEditButtonsFormatter,
    );
  }

  // workaround because Recompose JS doesn't work -> webpack issues
  compose = (...funcs) => funcs.reduce((a, b) => (...args) => a(b(...args)), arg => arg)

  render() {
    const {
      data: { allowRowAdjustment, applications },
      location,
      organization,
      parameters,
      columns,
      sortingColumns,
      loading,
      addParameter,
      confirmEditParameter,
      cancelEditParameter,
    } = this.props;

    let sortedParameters;
    const newEntryIndex = findIndex(parameters, 'newEntry');

    if (newEntryIndex >= 0) {
      const newEntry = parameters[newEntryIndex];
      // sort all elements, besides the newEntry which will be
      // added to the end of the Array
      const tmpParameters = cloneDeep(parameters);
      tmpParameters.splice(newEntryIndex, 1);
      sortedParameters = this.compose(
        sort.sorter({
          columns,
          sortingColumns,
          sort: orderBy,
          strategy: sort.strategies.byProperty
        })
      )(tmpParameters);
      sortedParameters.push(newEntry);
    } else {
      sortedParameters = this.compose(
        sort.sorter({
          columns,
          sortingColumns,
          sort: orderBy,
          strategy: sort.strategies.byProperty
        })
      )(parameters);
    }

    return(
      <div>
        <div className="clearfix">
          <div className="form-group">
            <AddTableEntry
               hidden={!allowRowAdjustment}
               disabled={ this.props.editMode }
               onAddTableEntry={ addParameter }
            />
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
                rows={sortedParameters}
                rowKey="id"
                onRow={(rowData, { rowIndex }) => ({
                  role: 'row',
                  isEditing: () => this.isEditing({ rowData }),
                  onCancel: () => cancelEditParameter({ rowData, rowIndex }),
                  onConfirm: () => confirmEditParameter({ rowData, rowIndex }),
                  last: rowIndex === sortedParameters.length - 1
                })}
              />
            </Table.PfProvider>
            <AddTableEntry
               hidden={!allowRowAdjustment}
               disabled={ this.props.editMode }
               onAddTableEntry={ addParameter }
            />
          </div>
        </div>
      </div>
    );
  }
}

ParameterSelection.defaultProps = {
  error: {},
  editMode: false,
  loading: false,
  paramData: {},
  parameters: [],
  columns: [],
  sortingColumns: {},
};

ParameterSelection.propTypes = {
  data: PropTypes.shape({
    parameters: PropTypes.array,
    paramDefinition: PropTypes.object,
    applications: PropTypes.object,
  }).isRequired,
  location: PropTypes.string.isRequired,
  organization: PropTypes.string.isRequired,
  paramDataUrl: PropTypes.string,
  initParameterSelection: PropTypes.func,
  editMode: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  paramData: PropTypes.object.isRequired,
  parameterTypes: PropTypes.object,
  parameters: PropTypes.array,
  sortingColumns: PropTypes.object,
  columns: PropTypes.array,
  sortParameter: PropTypes.func,
  addParameter: PropTypes.func,
  deleteParameter: PropTypes.func,
  activateEditParameter: PropTypes.func,
  confirmEditParameter: PropTypes.func,
  cancelEditParameter: PropTypes.func,
  changeEditParameter: PropTypes.func,
  loadParamData: PropTypes.func,
  paramDefinition: PropTypes.object,
};

export default ParameterSelection;
