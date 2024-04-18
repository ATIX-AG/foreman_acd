import React from 'react';
import PropTypes from 'prop-types';
import * as sort from 'sortabular';
import { orderBy, findIndex, cloneDeep } from 'lodash';
import * as resolve from 'table-resolver';
import {
  Button,
  Table,
  FormControl,
  InputGroup,
  customHeaderFormattersDefinition,
  inlineEditFormatterFactory,
} from 'patternfly-react';

import Select from 'foremanReact/components/common/forms/Select';
import { translate as __ } from 'foremanReact/common/I18n';
import ForemanModal from 'foremanReact/components/ForemanModal';

import AddTableEntry from '../common/AddTableEntry';
import EditTableEntry from '../common/EditTableEntry';
import DeleteTableEntry from '../common/DeleteTableEntry';
import LockTableEntry from '../common/LockTableEntry';
import * as YamlValidator from '../../js-yaml';

import { transformForemanData } from './ParameterSelectionHelper';

import {
  PARAMETER_SELECTION_TYPES,
  PARAMETER_SELECTION_PARAM_TYPE_FOREMAN,
} from './ParameterSelectionConstants';

class ParameterSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = { textValue: '' };
  }

  handleChange = event => {
    this.setState({ textValue: event.target.value });
  };

  static isEditing({ rowData }) {
    return rowData.backup !== undefined;
  }

  yamlValidator() {
    let result = true;
    let msg = '';
    try {
      YamlValidator.load(this.state.textValue);
    } catch (e) {
      result = false;
      msg = `Invalid Yaml: ${e.name}: ${e.message}`;
    }
    return {
      validateResult: result,
      validateMsg: msg,
    };
  }

  yamlValue() {
    if (this.props.editParamsRowIndex !== undefined) {
      const id = this.props.editParamsRowIndex;
      if (this.props.parameters[id] !== undefined) {
        return this.props.parameters[id].value;
      }
    }
    return '';
  }

  // enables our custom header formatters extensions to reactabular
  customHeaderFormatters = customHeaderFormattersDefinition;

  componentDidMount() {
    const {
      data: {
        useDefaultValue,
        allowRowAdjustment,
        allowNameAdjustment,
        allowDescriptionAdjustment,
        parameters,
        paramDefinition,
      },
      paramType,
      paramDataUrl,
      hiddenParameterTypes,
      initParameterSelection,
      sortParameter,
      deleteParameter,
      lockParameter,
      activateEditParameter,
      changeEditParameter,
      openParameterSelectionDialogBox,
      loadParamData,
    } = this.props;

    if (paramDataUrl !== undefined) {
      switch (paramType) {
        case PARAMETER_SELECTION_PARAM_TYPE_FOREMAN: {
          loadParamData({
            paramDefinition,
            url: paramDataUrl,
            dataType: paramType,
            clearParameters: false,
          });
          break;
        }
        default:
      }
    }

    const inlineEditButtonsFormatter = inlineEditFormatterFactory({
      isEditing: additionalData => this.props.editMode,
      renderValue: (value, additionalData) => (
        <td style={{ padding: '2px' }}>
          <EditTableEntry
            disabled={false}
            handleLocking={!allowRowAdjustment}
            onEditTableEntry={() => activateEditParameter(additionalData)}
            additionalData={additionalData}
          />
          &nbsp;
          <LockTableEntry
            hidden={!allowRowAdjustment}
            disabled={!allowRowAdjustment}
            onLockTableEntry={lockParameter}
            additionalData={additionalData}
          />
          &nbsp;
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
          <EditTableEntry
            hidden={false}
            handleLocking={false}
            disabled
            onEditTableEntry={() => activateEditParameter(additionalData)}
            additionalData={additionalData}
          />
          &nbsp;
          <LockTableEntry
            hidden={!allowRowAdjustment}
            disabled
            onLockTableEntry={lockParameter}
            additionalData={additionalData}
          />
          &nbsp;
          <DeleteTableEntry
            hidden={!allowRowAdjustment}
            disabled
            onDeleteTableEntry={deleteParameter}
            additionalData={additionalData}
          />
        </td>
      ),
    });
    this.inlineEditButtonsFormatter = inlineEditButtonsFormatter;

    const getSortingColumns = () => this.props.sortingColumns || {};

    const sortableTransform = sort.sort({
      getSortingColumns,
      onSort: (selectedColumn, defaultSortingOrder) =>
        sortParameter(selectedColumn, defaultSortingOrder),
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
      renderEditText: (value, additionalData, subtype = 'text') => (
        <td className="editing">
          <FormControl
            type={subtype}
            defaultValue={value}
            onBlur={e => changeEditParameter(e.target.value, additionalData)}
          />
        </td>
      ),
      renderEditComplexText: (value, additionalData, subtype = 'text') => (
        <td className="editing">
          <InputGroup>
            <FormControl
              type={subtype}
              defaultValue={additionalData.rowData.isYaml === true ? '' : value}
              onBlur={e => changeEditParameter(e.target.value, additionalData)}
              readOnly={additionalData.rowData.isYaml}
              placeholder="Press YAML button for Yaml Data"
            />
            <InputGroup.Button>
              <Button onClick={e => openParameterSelectionDialogBox(e)}>
                {' '}
                YAML{' '}
              </Button>
            </InputGroup.Button>
          </InputGroup>
        </td>
      ),
      renderEditSelect: (value, additionalData, options) => (
        <td className="editing">
          <Select
            value={value.toString()}
            onChange={e => changeEditParameter(e.target.value, additionalData)}
            options={options}
            allowClear
            key="key"
          />
        </td>
      ),
    };

    // TODO: should we differentiate between paramType FOREMAN and ANSIBLE?

    const inlineEditFormatter = inlineEditFormatterFactory({
      isEditing: additionalData => this.constructor.isEditing(additionalData),
      renderValue: (value, additionalData) => {
        let prettyValue = value;
        if (additionalData.property === 'type') {
          prettyValue = PARAMETER_SELECTION_TYPES[value];
        } else if (additionalData.property === 'value') {
          switch (additionalData.rowData.type) {
            case 'computeprofile':
              prettyValue = transformForemanData(
                this.props.paramData.computeprofiles
              )[value];
              break;
            case 'domain':
              prettyValue = transformForemanData(this.props.paramData.domains)[
                value
              ];
              break;
            case 'lifecycleenv':
              prettyValue = transformForemanData(
                this.props.paramData.lifecycle_environments
              )[value];
              break;
            case 'ptable':
              prettyValue = transformForemanData(this.props.paramData.ptables)[
                value
              ];
              break;
            case 'password':
              prettyValue = '****************';
              break;
            case 'puppetenv':
              prettyValue = transformForemanData(
                this.props.paramData.environments
              )[value];
              break;
            case 'text':
              prettyValue = value;
              break;
            case 'complex':
              prettyValue = additionalData.rowData.isYaml
                ? 'YAML value'
                : value;
              break;
            default:
          }
        }
        return inlineEditFormatterImpl.renderValue(prettyValue, additionalData);
      },
      renderEdit: (value, additionalData) => {
        switch (additionalData.property) {
          case 'type':
            if (additionalData.rowData.newEntry === true) {
              return inlineEditFormatterImpl.renderEditSelect(
                value,
                additionalData,
                this.props.parameterTypes
              );
            }
            return inlineEditFormatterImpl.renderValue(
              PARAMETER_SELECTION_TYPES[value],
              additionalData
            );
          case 'value':
            switch (additionalData.rowData.type) {
              case 'computeprofile':
                return inlineEditFormatterImpl.renderEditSelect(
                  value,
                  additionalData,
                  transformForemanData(this.props.paramData.computeprofiles)
                );
              case 'domain':
                return inlineEditFormatterImpl.renderEditSelect(
                  value,
                  additionalData,
                  transformForemanData(this.props.paramData.domains)
                );
              case 'lifecycleenv':
                return inlineEditFormatterImpl.renderEditSelect(
                  value,
                  additionalData,
                  transformForemanData(
                    this.props.paramData.lifecycle_environments
                  )
                );
              case 'puppetenv':
                return inlineEditFormatterImpl.renderEditSelect(
                  value,
                  additionalData,
                  transformForemanData(this.props.paramData.environments)
                );
              case 'ptable':
                return inlineEditFormatterImpl.renderEditSelect(
                  value,
                  additionalData,
                  transformForemanData(this.props.paramData.ptables)
                );
              case 'password':
                return inlineEditFormatterImpl.renderEditText(
                  value,
                  additionalData,
                  'password'
                );
              case 'text':
              case 'complex':
                return inlineEditFormatterImpl.renderEditComplexText(
                  value,
                  additionalData
                );
              default:
                return inlineEditFormatterImpl.renderEditText(
                  value,
                  additionalData
                );
            }
          default:
            return inlineEditFormatterImpl.renderEditText(
              value,
              additionalData
            );
        }
      },
    });

    this.inlineEditFormatter = inlineEditFormatter;

    initParameterSelection(
      paramType,
      paramDefinition,
      parameters,
      hiddenParameterTypes,
      useDefaultValue,
      allowNameAdjustment,
      allowDescriptionAdjustment,
      this.sortingFormatter,
      this.sortableTransform,
      this.inlineEditFormatter,
      this.inlineEditButtonsFormatter
    );
  }

  // workaround because Recompose JS doesn't work -> webpack issues
  compose = (...funcs) =>
    funcs.reduce(
      (a, b) => (...args) => a(b(...args)),
      arg => arg
    );

  render() {
    const {
      data: { allowRowAdjustment },
      parameters,
      columns,
      sortingColumns,
      addParameter,
      confirmEditParameter,
      cancelEditParameter,
      closeParameterSelectionDialogBox,
      editModeCallback,
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
          strategy: sort.strategies.byProperty,
        })
      )(tmpParameters);
      sortedParameters.push(newEntry);
    } else {
      sortedParameters = this.compose(
        sort.sorter({
          columns,
          sortingColumns,
          sort: orderBy,
          strategy: sort.strategies.byProperty,
        })
      )(parameters);
    }

    // Make sure that the component which includes the
    // ParameterSelection is aware of the current editMode state
    if (editModeCallback !== undefined) {
      editModeCallback(this.props.editMode);
    }

    const { validateResult, validateMsg } = this.yamlValidator();

    return (
      <div>
        <div className="clearfix">
          <div className="form-group">
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
                      sortingColumns,
                    }),
                },
                body: {
                  row: Table.InlineEditRow,
                  cell: cellProps => cellProps.children,
                },
              }}
            >
              <Table.Header headerRows={resolve.headerRows({ columns })} />
              <Table.Body
                rows={sortedParameters}
                rowKey="id"
                onRow={(rowData, { rowIndex }) => ({
                  role: 'row',
                  isEditing: () => this.constructor.isEditing({ rowData }),
                  onCancel: () => cancelEditParameter({ rowData, rowIndex }),
                  onConfirm: () => confirmEditParameter({ rowData, rowIndex }),
                  last: rowIndex === sortedParameters.length - 1,
                })}
              />
            </Table.PfProvider>
            <AddTableEntry
              hidden={!allowRowAdjustment}
              disabled={this.props.editMode}
              onAddTableEntry={addParameter}
            />
          </div>
        </div>
        <div>
          <ForemanModal
            id="ParameterSelectionComplexDataModal"
            dialogClassName="complex_data_modal"
            title={__('YAML Data Input')}
          >
            <ForemanModal.Header closeButton={false} />
            <textarea
              id="yamlData"
              defaultValue={this.yamlValue()}
              onChange={this.handleChange}
              style={{ width: '550px', height: '350px', fontFamily: 'Courier' }}
            />
            <ForemanModal.Footer>
              <div>
                {validateResult === false ? (
                  <div className="form-group">
                    <div className="alert alert-danger alert-dismissable">
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                        aria-label="Close"
                      >
                        <span className="pficon pficon-close" />
                      </button>
                      <span className="pficon pficon-error-circle-o" />
                      {validateMsg}
                    </div>
                  </div>
                ) : (
                  <div />
                )}
                <Button
                  bsStyle="primary"
                  onClick={() =>
                    closeParameterSelectionDialogBox({ mode: 'save' })
                  }
                >
                  {__('Save')}
                </Button>
                <Button
                  bsStyle="default"
                  onClick={() =>
                    closeParameterSelectionDialogBox({ mode: 'cancel' })
                  }
                >
                  {__('Cancel')}
                </Button>
              </div>
            </ForemanModal.Footer>
          </ForemanModal>
        </div>
      </div>
    );
  }
}

ParameterSelection.defaultProps = {
  // error: {},
  columns: [],
  editParamsRowIndex: undefined,
  hiddenParameterTypes: [],
  paramData: {},
  paramDataUrl: undefined,
  paramDefinition: undefined,
  parameters: [],
  parameterTypes: {},
  sortingColumns: {},
};

ParameterSelection.propTypes = {
  // error: PropTypes.object,
  paramDataUrl: PropTypes.string,
  hiddenParameterTypes: PropTypes.array,

  // from ParameterSelectionActions
  initParameterSelection: PropTypes.func.isRequired,
  addParameter: PropTypes.func.isRequired,
  deleteParameter: PropTypes.func.isRequired,
  lockParameter: PropTypes.func.isRequired,
  activateEditParameter: PropTypes.func.isRequired,
  confirmEditParameter: PropTypes.func.isRequired,
  cancelEditParameter: PropTypes.func.isRequired,
  changeEditParameter: PropTypes.func.isRequired,
  sortParameter: PropTypes.func.isRequired,
  openParameterSelectionDialogBox: PropTypes.func.isRequired,
  closeParameterSelectionDialogBox: PropTypes.func.isRequired,
  loadParamData: PropTypes.func.isRequired,

  // from ApplicationInstance
  editModeCallback: PropTypes.func.isRequired,
  paramType: PropTypes.string.isRequired,
  // location: PropTypes.string.isRequired,
  // organization: PropTypes.string.isRequired,
  data: PropTypes.shape({
    useDefaultValue: PropTypes.bool,
    allowRowAdjustment: PropTypes.bool,
    allowNameAdjustment: PropTypes.bool,
    allowDescriptionAdjustment: PropTypes.bool,
    parameters: PropTypes.array,
    paramDefinition: PropTypes.object,
  }).isRequired,

  // from redux-state
  // loading: PropTypes.bool.isRequired,
  editMode: PropTypes.bool.isRequired,
  paramData: PropTypes.object,
  parameterTypes: PropTypes.object,
  parameters: PropTypes.array,
  sortingColumns: PropTypes.object,
  columns: PropTypes.array,
  paramDefinition: PropTypes.object,
  editParamsRowIndex: PropTypes.number,
};

export default ParameterSelection;
