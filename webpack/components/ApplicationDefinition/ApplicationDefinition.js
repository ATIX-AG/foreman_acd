import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Button,
  MessageDialog,
  Table,
  FormControl,
  inlineEditFormatterFactory,
} from 'patternfly-react';
import * as resolve from 'table-resolver';
import ForemanModal from 'foremanReact/components/ForemanModal';
import Select from 'foremanReact/components/common/forms/Select';
import { translate as __ } from 'foremanReact/common/I18n';
import ParameterSelection from '../ParameterSelection';
import AddTableEntry from '../common/AddTableEntry';
import DeleteTableEntry from '../common/DeleteTableEntry';
import RailsData from '../common/RailsData';
import AnsiblePlaybookSelector from './components/AnsiblePlaybookSelector';
import { EasyHeaderFormatter } from '../../helper';

import {
  PARAMETER_SELECTION_PARAM_TYPE_FOREMAN,
  PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE,
} from '../ParameterSelection/ParameterSelectionConstants';

class ApplicationDefinition extends React.Component {
  static isEditing({ rowData }) {
    return rowData.backup !== undefined;
  }

  static createAnsibleGroupObject(ansibleGroups, withAll = false) {
    const ansibleGroupObj = {};

    const ansibleGroupArray = Object.keys(ansibleGroups);
    ansibleGroupArray.forEach(e => {
      ansibleGroupObj[e] = e;
    });

    if (withAll === false && ansibleGroupObj.hasOwnProperty('all')) {
      delete ansibleGroupObj.all;
    }

    return ansibleGroupObj;
  }

  addTableEntryAllowed() {
    return this.props.editMode || this.props.ansiblePlaybook.id === '';
  }

  componentDidMount() {
    const {
      data: {
        ansiblePlaybook,
        services,
        ansibleVarsAll,
        hostgroups,
        supportedPlugins,
      },
      initApplicationDefinition,
      deleteApplicationDefinitionService,
      activateEditApplicationDefinitionService,
      changeEditApplicationDefinitionService,
      openForemanParameterSelectionModal,
      openAnsibleParameterSelectionModal,
    } = this.props;

    const inlineEditButtonsFormatter = inlineEditFormatterFactory({
      isEditing: additionalData => this.props.editMode,
      renderValue: (value, additionalData) => (
        <td style={{ padding: '2px' }}>
          <Button
            bsStyle="default"
            onClick={() =>
              activateEditApplicationDefinitionService(additionalData)
            }
          >
            <Icon type="pf" name="edit" title={__('Edit entry')} />
          </Button>
          &nbsp;
          <Button
            bsStyle="default"
            onClick={() => openForemanParameterSelectionModal(additionalData)}
          >
            <Icon type="pf" name="settings" title={__('Change parameters')} />
          </Button>
          &nbsp;
          <Button
            bsStyle="default"
            onClick={() => openAnsibleParameterSelectionModal(additionalData)}
          >
            <span title={__('Change ansible variables')}>A</span>
          </Button>
          &nbsp;
          <DeleteTableEntry
            hidden={false}
            disabled={false}
            onDeleteTableEntry={deleteApplicationDefinitionService}
            additionalData={additionalData}
          />
        </td>
      ),
      renderEdit: (value, additionalData) => (
        <td style={{ padding: '2px' }}>
          <Button bsStyle="default" disabled>
            <Icon type="pf" name={__('edit')} />
          </Button>
          &nbsp;
          <Button bsStyle="default" disabled>
            <Icon type="pf" name={__('settings')} />
          </Button>
          &nbsp;
          <Button bsStyle="default" disabled>
            <span>A</span>
          </Button>
          &nbsp;
          <DeleteTableEntry
            hidden={false}
            disabled
            onDeleteTableEntry={deleteApplicationDefinitionService}
            additionalData={additionalData}
          />
        </td>
      ),
    });
    this.inlineEditButtonsFormatter = inlineEditButtonsFormatter;

    this.headerFormatter = EasyHeaderFormatter;

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
            onBlur={e =>
              changeEditApplicationDefinitionService(
                e.target.value,
                additionalData
              )
            }
          />
        </td>
      ),
      renderEditSelect: (value, additionalData, options) => (
        <td className="editing">
          <Select
            value={value.toString()}
            onChange={e =>
              changeEditApplicationDefinitionService(
                e.target.value,
                additionalData
              )
            }
            options={options}
            allowClear
            key="key"
          />
        </td>
      ),
    };

    const inlineEditFormatter = inlineEditFormatterFactory({
      isEditing: additionalData => this.constructor.isEditing(additionalData),
      renderValue: (value, additionalData) => {
        let prettyValue = value;
        if (additionalData.property === 'hostgroup') {
          prettyValue = hostgroups[value];
        } else if (additionalData.property === 'ansibleGroup') {
          const ag = this.constructor.createAnsibleGroupObject(
            this.props.ansiblePlaybook.groups
          );
          prettyValue = ag[value];
        }
        return inlineEditFormatterImpl.renderValue(prettyValue, additionalData);
      },
      renderEdit: (value, additionalData) => {
        if (additionalData.property === 'hostgroup') {
          if (additionalData.rowData.newEntry === true) {
            return inlineEditFormatterImpl.renderEditSelect(
              value,
              additionalData,
              hostgroups
            );
          }
          return inlineEditFormatterImpl.renderValue(
            hostgroups[value],
            additionalData
          );
        } else if (additionalData.property === 'ansibleGroup') {
          const ag = this.constructor.createAnsibleGroupObject(
            this.props.ansiblePlaybook.groups
          );

          if (additionalData.rowData.newEntry === true) {
            return inlineEditFormatterImpl.renderEditSelect(
              value,
              additionalData,
              ag
            );
          }
          return inlineEditFormatterImpl.renderValue(ag[value], additionalData);
        }
        return inlineEditFormatterImpl.renderEditText(value, additionalData);
      },
    });
    this.inlineEditFormatter = inlineEditFormatter;

    initApplicationDefinition(
      ansiblePlaybook,
      services,
      ansibleVarsAll,
      supportedPlugins,
      this.headerFormatter,
      this.inlineEditFormatter,
      this.inlineEditButtonsFormatter
    );
  }

  render() {
    const {
      data: {
        organization,
        location,
        mode,
        ansiblePlaybooks,
        foremanDataUrl,
        ansibleDataUrl,
      },
      showAlertModal,
      alertModalText,
      alertModalTitle,
      closeAlertModal,
      ansiblePlaybook,
      services,
      columns,
      hiddenForemanParameterTypes,
      addApplicationDefinitionService,
      confirmEditApplicationDefinitionService,
      cancelEditApplicationDefinitionService,
      closeForemanParameterSelectionModal,
      openAnsibleParameterSelectionModal,
      closeAnsibleParameterSelectionModal,
      changeParameterSelectionMode,
      loadAnsibleData,
    } = this.props;

    return (
      <span>
        <MessageDialog
          show={showAlertModal}
          onHide={closeAlertModal}
          primaryAction={closeAlertModal}
          primaryActionButtonContent={__('OK')}
          primaryActionButtonBsStyle="danger"
          icon={<Icon type="pf" name="error-circle-o" />}
          title={alertModalTitle}
          primaryContent={alertModalText}
        />
        <div>
          <AnsiblePlaybookSelector
            label="Ansible Playbook"
            hidden={false}
            editable={mode === 'newDefinition'}
            viewText={ansiblePlaybook.name}
            options={ansiblePlaybooks}
            onChange={loadAnsibleData}
            selectValue={ansiblePlaybook.id.toString()}
            additionalData={{ url: ansibleDataUrl }}
          />
          {ansiblePlaybook.id === '' ? (
            <div style={{ paddingTop: 25 }}>
              <pre>Ansible Playbook can&apos;t be blank</pre>
            </div>
          ) : (
            <div />
          )}
        </div>
        <div className="form-group">
          <Table.PfProvider
            striped
            bordered
            hover
            dataTable
            inlineEdit
            columns={columns}
            components={{
              body: {
                row: Table.InlineEditRow,
                cell: cellProps => cellProps.children,
              },
            }}
          >
            <Table.Header headerRows={resolve.headerRows({ columns })} />
            <Table.Body
              rows={services}
              rowKey="id"
              onRow={(rowData, { rowIndex }) => ({
                role: 'row',
                isEditing: () => this.constructor.isEditing({ rowData }),
                onCancel: () =>
                  cancelEditApplicationDefinitionService({ rowData, rowIndex }),
                onConfirm: () =>
                  confirmEditApplicationDefinitionService({
                    rowData,
                    rowIndex,
                  }),
                last: rowIndex === services.length - 1,
              })}
            />
          </Table.PfProvider>
          <AddTableEntry
            hidden={false}
            disabled={this.addTableEntryAllowed()}
            onAddTableEntry={addApplicationDefinitionService}
          />
          <span style={{ marginLeft: 30 }}>
            Ansible group vars &apos;all&apos;:
            <Button
              style={{ marginLeft: 10 }}
              bsStyle="default"
              disabled={this.props.editMode}
              onClick={() =>
                openAnsibleParameterSelectionModal({
                  isAllGroup: true,
                })
              }
            >
              <span title={__("Change ansible variables for 'all'")}>A</span>
            </Button>
          </span>
        </div>
        <div>
          <ForemanModal
            id="AppDefinitionForemanParamSelection"
            dialogClassName="param_selection_modal"
            title={__(
              'Foreman Parameter definition for Application Definition'
            )}
          >
            <ForemanModal.Header closeButton={false}>
              Parameter definition
            </ForemanModal.Header>
            {this.props.parametersData ? (
              <ParameterSelection
                editModeCallback={hide =>
                  changeParameterSelectionMode({ mode: hide })
                }
                paramType={PARAMETER_SELECTION_PARAM_TYPE_FOREMAN}
                hiddenParameterTypes={hiddenForemanParameterTypes}
                location={location}
                organization={organization}
                paramDataUrl={foremanDataUrl}
                data={this.props.parametersData}
              />
            ) : (
              <span>Empty</span>
            )}
            <ForemanModal.Footer>
              <div>
                <Button
                  bsStyle="primary"
                  disabled={this.props.paramEditMode}
                  onClick={() =>
                    closeForemanParameterSelectionModal({ mode: 'save' })
                  }
                >
                  {__('Save')}
                </Button>
                <Button
                  bsStyle="default"
                  disabled={this.props.paramEditMode}
                  onClick={() =>
                    closeForemanParameterSelectionModal({ mode: 'cancel' })
                  }
                >
                  {__('Cancel')}
                </Button>
              </div>
            </ForemanModal.Footer>
          </ForemanModal>
        </div>
        <div>
          <ForemanModal
            id="AppDefinitionAnsibleParamSelection"
            dialogClassName="param_selection_modal"
            title={__('Ansible variables for Application Definition')}
          >
            <ForemanModal.Header closeButton={false}>
              Parameter definition
            </ForemanModal.Header>
            {this.props.parametersData ? (
              <ParameterSelection
                editModeCallback={hide =>
                  changeParameterSelectionMode({ mode: hide })
                }
                paramType={PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE}
                location={location}
                organization={organization}
                data={this.props.parametersData}
              />
            ) : (
              <span>Empty</span>
            )}
            <ForemanModal.Footer>
              <div>
                <Button
                  bsStyle="primary"
                  disabled={this.props.paramEditMode}
                  onClick={() =>
                    closeAnsibleParameterSelectionModal({ mode: 'save' })
                  }
                >
                  {__('Save')}
                </Button>
                <Button
                  bsStyle="default"
                  disabled={this.props.paramEditMode}
                  onClick={() =>
                    closeAnsibleParameterSelectionModal({ mode: 'cancel' })
                  }
                >
                  {__('Cancel')}
                </Button>
              </div>
            </ForemanModal.Footer>
          </ForemanModal>
        </div>
        <RailsData
          key="application_definition_services_data"
          view="app_definition"
          parameter="services"
          value={JSON.stringify(this.props.services)}
        />
        <RailsData
          key="application_definition_ansible_data"
          view="app_definition"
          parameter="ansible_vars_all"
          value={JSON.stringify(this.props.ansibleVarsAll)}
        />
      </span>
    );
  }
}

ApplicationDefinition.defaultProps = {
  showAlertModal: false,
  alertModalText: '',
  alertModalTitle: '',
  editMode: false,
  ansiblePlaybook: { id: '', name: '' },
  services: [],
  ansibleVarsAll: [],
  parametersData: {},
  columns: [],
  hiddenForemanParameterTypes: [],
  paramEditMode: false,
  deleteApplicationDefinitionService: undefined,
  activateEditApplicationDefinitionService: undefined,
  confirmEditApplicationDefinitionService: undefined,
  cancelEditApplicationDefinitionService: undefined,
  changeEditApplicationDefinitionService: undefined,
  openForemanParameterSelectionModal: undefined,
  closeForemanParameterSelectionModal: undefined,
  openAnsibleParameterSelectionModal: undefined,
  closeAnsibleParameterSelectionModal: undefined,
  changeParameterSelectionMode: undefined,
};

ApplicationDefinition.propTypes = {
  data: PropTypes.object.isRequired,
  loadAnsibleData: PropTypes.func.isRequired,
  initApplicationDefinition: PropTypes.func.isRequired,
  showAlertModal: PropTypes.bool,
  alertModalText: PropTypes.string,
  alertModalTitle: PropTypes.string,
  editMode: PropTypes.bool,
  ansiblePlaybook: PropTypes.object,
  services: PropTypes.array,
  ansibleVarsAll: PropTypes.array,
  columns: PropTypes.array,
  hiddenForemanParameterTypes: PropTypes.array,
  closeAlertModal: PropTypes.func.isRequired,
  addApplicationDefinitionService: PropTypes.func.isRequired,
  deleteApplicationDefinitionService: PropTypes.func,
  activateEditApplicationDefinitionService: PropTypes.func,
  confirmEditApplicationDefinitionService: PropTypes.func,
  cancelEditApplicationDefinitionService: PropTypes.func,
  changeEditApplicationDefinitionService: PropTypes.func,
  openForemanParameterSelectionModal: PropTypes.func,
  closeForemanParameterSelectionModal: PropTypes.func,
  openAnsibleParameterSelectionModal: PropTypes.func,
  closeAnsibleParameterSelectionModal: PropTypes.func,
  changeParameterSelectionMode: PropTypes.func,
  parametersData: PropTypes.object,
  paramEditMode: PropTypes.bool,
};

export default ApplicationDefinition;
