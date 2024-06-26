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
import $ from 'jquery';
import ForemanModal from 'foremanReact/components/ForemanModal';
import { sprintf, translate as __ } from 'foremanReact/common/I18n';
import Select from 'foremanReact/components/common/forms/Select';
import ParameterSelection from '../ParameterSelection';
import ExistingHostSelection from '../ExistingHostSelection';
import AddTableEntry from '../common/AddTableEntry';
import DeleteTableEntry from '../common/DeleteTableEntry';
import RailsData from '../common/RailsData';
import AppDefinitionSelector from './components/AppDefinitionSelector';
import ServiceCounter from './components/ServiceCounter';
import { arrayToObject, EasyHeaderFormatter } from '../../helper';

import {
  PARAMETER_SELECTION_PARAM_TYPE_FOREMAN,
  PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE,
} from '../ParameterSelection/ParameterSelectionConstants';

class ApplicationInstance extends React.Component {
  static isEditing({ rowData }) {
    return rowData.backup !== undefined;
  }

  changeDataAllowed() {
    return this.props.editMode || this.props.appDefinition.id === '';
  }

  validateParameters() {
    let result = true;
    let msg = '';

    this.props.hosts.forEach(h => {
      if (
        h.foremanParameters.map(e => e.value).filter(i => i === '').length > 0
      ) {
        result = false;

        if (msg === '') {
          msg += __(
            'For some hosts the values for some parameters are missing. Check the values for these hosts:\n'
          );
        }
        msg += `- ${h.hostname}\n`;
      }
    });

    const invalidMinServices = this.props.services.filter(
      s => Number(s.minCount) !== 0 && s.currentCount < s.minCount
    );
    const invalidMaxServices = this.props.services.filter(
      s => Number(s.maxCount) !== 0 && s.currentCount > s.maxCount
    );

    if (invalidMinServices.length > 0 || invalidMaxServices.length > 0) {
      result = false;

      if (msg !== '') {
        msg += '\n';
      }

      msg += __('Unachieved service counts:');
      msg += '\n';

      invalidMinServices.forEach(s => {
        msg += sprintf(
          __(
            `- service ${s.name} expects at ${s.minCount} least configured hosts\n`
          )
        );
      });

      invalidMaxServices.forEach(s => {
        msg += sprintf(
          __(
            `- service ${s.name} expects no more than ${s.axCount} configured hosts\n`
          )
        );
      });
    }

    return {
      validateResult: result,
      validateMsg: msg,
    };
  }

  componentDidMount() {
    const {
      data: {
        mode,
        appDefinition,
        hosts,
        ansibleVarsAll,
        appDefinitionUrl,
        supportedPlugins,
      },
      initApplicationInstance,
      deleteApplicationInstanceHost,
      activateEditApplicationInstanceHost,
      changeEditApplicationInstanceHost,
      openForemanParameterSelectionModal,
      openAnsibleParameterSelectionModal,
      loadApplicationDefinition,
    } = this.props;

    if (mode === 'editInstance') {
      loadApplicationDefinition(appDefinition.id, { url: appDefinitionUrl });
    }

    const alreadyDeployedMsg = __(
      'This is an already deployed host. Changing the parameters is not possible!'
    );

    const inlineEditButtonsFormatter = inlineEditFormatterFactory({
      isEditing: additionalData => this.props.editMode,
      renderValue: (value, additionalData) => (
        <td style={{ padding: '2px' }}>
          {additionalData.rowData.isExistingHost === true ? (
            <Icon
              style={{ marginRight: 8, marginLeft: 2 }}
              type="pf"
              name="info"
              title={alreadyDeployedMsg}
            />
          ) : (
            <span />
          )}
          <Button
            bsStyle="default"
            onClick={() => activateEditApplicationInstanceHost(additionalData)}
          >
            <Icon type="pf" name="edit" title={__('Edit entry')} />
          </Button>
          &nbsp;
          {additionalData.rowData.isExistingHost === false ? (
            <Button
              bsStyle="default"
              onClick={() => openForemanParameterSelectionModal(additionalData)}
            >
              <Icon type="pf" name="settings" title={__('Change parameters')} />
            </Button>
          ) : (
            <span />
          )}
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
            onDeleteTableEntry={deleteApplicationInstanceHost}
            additionalData={additionalData}
          />
        </td>
      ),
      renderEdit: (value, additionalData) => (
        <td style={{ padding: '2px' }}>
          {additionalData.rowData.isExistingHost === true ? (
            <Icon
              style={{ marginRight: 8, marginLeft: 2 }}
              type="pf"
              name="info"
              title={alreadyDeployedMsg}
            />
          ) : (
            <span />
          )}
          <Button bsStyle="default" disabled>
            <Icon type="pf" name={__('edit')} />
          </Button>
          &nbsp;
          {additionalData.rowData.isExistingHost === false ? (
            <Button bsStyle="default" disabled>
              <Icon type="pf" name={__('settings')} />
            </Button>
          ) : (
            <span />
          )}
          &nbsp;
          <Button bsStyle="default" disabled>
            <span>A</span>
          </Button>
          &nbsp;
          <DeleteTableEntry
            hidden={false}
            disabled
            onDeleteTableEntry={deleteApplicationInstanceHost}
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
              changeEditApplicationInstanceHost(e.target.value, additionalData)
            }
          />
        </td>
      ),
      renderEditSelect: (value, additionalData, options) => (
        <td className="editing">
          <Select
            value={value.toString()}
            onChange={e =>
              changeEditApplicationInstanceHost(e.target.value, additionalData)
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
        if (additionalData.property === 'service') {
          const serviceList = arrayToObject(this.props.services, 'id', 'name');
          prettyValue = serviceList[value];
        }
        return inlineEditFormatterImpl.renderValue(prettyValue, additionalData);
      },
      renderEdit: (value, additionalData) => {
        let prettyValue = value;
        if (additionalData.property === 'service') {
          const availableServices = this.props.services.filter(
            service =>
              Number(service.maxCount) === 0 ||
              service.currentCount < service.maxCount
          );
          const serviceList = arrayToObject(availableServices, 'id', 'name');

          if (additionalData.rowData.newEntry === true) {
            return inlineEditFormatterImpl.renderEditSelect(
              value,
              additionalData,
              serviceList
            );
          }
          prettyValue = serviceList[value];
          return inlineEditFormatterImpl.renderValue(
            prettyValue,
            additionalData
          );
        }
        if (additionalData.property === 'hostname') {
          if (additionalData.rowData.newEntry === true) {
            return inlineEditFormatterImpl.renderEditText(
              value,
              additionalData
            );
          }
          return inlineEditFormatterImpl.renderValue(
            prettyValue,
            additionalData
          );
        }
        return inlineEditFormatterImpl.renderEditText(
          prettyValue,
          additionalData
        );
      },
    });
    this.inlineEditFormatter = inlineEditFormatter;

    initApplicationInstance(
      appDefinition,
      hosts,
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
        mode,
        applications,
        organization,
        location,
        foremanDataUrl,
        appDefinitionUrl,
      },
      showAlertModal,
      alertModalText,
      alertModalTitle,
      closeAlertModal,
      appDefinition,
      services,
      hosts,
      columns,
      hiddenForemanParameterTypes,
      addApplicationInstanceHost,
      confirmEditApplicationInstanceHost,
      cancelEditApplicationInstanceHost,
      closeForemanParameterSelectionModal,
      openAnsibleParameterSelectionModal,
      closeAnsibleParameterSelectionModal,
      openAddExistingHostsModal,
      closeAddExistingHostsModal,
      changeParameterSelectionMode,
      loadApplicationDefinition,
    } = this.props;

    const { validateResult, validateMsg } = this.validateParameters();

    /* eslint-disable jquery/no-attr */
    if (validateResult === false) {
      $('input[type="submit"][name="commit"]').attr('disabled', true);
    } else {
      $('input[type="submit"][name="commit"]').attr('disabled', false);
    }
    /* eslint-enable jquery/no-attr */

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
        <div className="service-counter">
          <ServiceCounter
            title="Service counts"
            serviceList={services}
            hostList={hosts}
          />
        </div>
        <div>
          <AppDefinitionSelector
            label="Application Definition"
            hidden={false}
            editable={mode === 'newInstance'}
            viewText={appDefinition.name}
            options={applications}
            onChange={loadApplicationDefinition}
            selectValue={appDefinition.id.toString()}
            additionalData={{ url: appDefinitionUrl }}
          />
          {appDefinition.id === '' ? (
            <div style={{ paddingTop: 25 }}>
              <pre>App Definition can&apos;t be blank</pre>
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
              rows={hosts}
              rowKey="id"
              onRow={(rowData, { rowIndex }) => ({
                role: 'row',
                isEditing: () => this.constructor.isEditing({ rowData }),
                onCancel: () =>
                  cancelEditApplicationInstanceHost({ rowData, rowIndex }),
                onConfirm: () =>
                  confirmEditApplicationInstanceHost({
                    rowData,
                    rowIndex,
                    appDefinition,
                  }),
                last: rowIndex === services.length - 1,
              })}
            />
          </Table.PfProvider>
          <AddTableEntry
            hidden={false}
            disabled={this.changeDataAllowed()}
            onAddTableEntry={addApplicationInstanceHost}
          />
          <span style={{ marginLeft: 10 }}>
            <Button
              bsStyle="default"
              disabled={this.changeDataAllowed()}
              onClick={() =>
                openAddExistingHostsModal({
                  isAllGroup: true,
                })
              }
            >
              <Icon title={__('Add existing hosts')} type="pf" name="server" />
            </Button>
          </span>
          <span style={{ marginLeft: 30 }}>
            Ansible group vars &lsquo;all&rsquo;:
            <Button
              style={{ marginLeft: 10 }}
              bsStyle="default"
              disabled={this.changeDataAllowed()}
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
            id="AppInstanceForemanParamSelection"
            dialogClassName="param_selection_modal"
            title={__(
              'Foreman Parameter specification for Application Instance'
            )}
          >
            <ForemanModal.Header closeButton={false}>
              {__('Parameter specification')}
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
            id="AppInstanceAnsibleParamSelection"
            dialogClassName="param_selection_modal"
            title={__('Ansible group variables for Application Instance')}
          >
            <ForemanModal.Header closeButton={false}>
              {__('Parameter specification')}
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
        <div>
          <ForemanModal
            id="AppInstanceAddExistingHosts"
            dialogClassName="add_existing_hosts_modal"
            title={__('Add existing hosts to an Application Instance')}
          >
            <ForemanModal.Header closeButton={false}>
              {__('Existing hosts selection')}
            </ForemanModal.Header>
            <ExistingHostSelection
              location={location}
              organization={organization}
              services={services}
              allHosts={this.props.hosts}
            />
            <ForemanModal.Footer>
              <div>
                <Button
                  bsStyle="primary"
                  disabled={this.props.paramEditMode}
                  onClick={() => closeAddExistingHostsModal({ mode: 'save' })}
                >
                  {__('Save')}
                </Button>
                <Button
                  bsStyle="default"
                  disabled={this.props.paramEditMode}
                  onClick={() => closeAddExistingHostsModal({ mode: 'cancel' })}
                >
                  {__('Cancel')}
                </Button>
              </div>
            </ForemanModal.Footer>
          </ForemanModal>
        </div>
        {validateResult === false ? (
          <div style={{ paddingTop: 25 }}>
            <pre>{validateMsg}</pre>
          </div>
        ) : (
          <div />
        )}
        <RailsData
          key="application_instance_hosts_data"
          view="app_instance"
          parameter="hosts"
          value={JSON.stringify(this.props.hosts)}
        />
        <RailsData
          key="application_instance_ansible_data"
          view="app_instance"
          parameter="ansible_vars_all"
          value={JSON.stringify(this.props.ansibleVarsAll)}
        />
      </span>
    );
  }
}

ApplicationInstance.defaultProps = {
  alertModalText: '',
  alertModalTitle: '',
  ansibleVarsAll: [],
  appDefinition: { id: '', name: '' },
  columns: [],
  data: {
    appDefinitionUrl: '',
    appDefinition: undefined,
    applications: undefined,
    foremanDataUrl: '',
    supportedPlugins: {},
  },
  editMode: false,
  hiddenForemanParameterTypes: [],
  hosts: [],
  parametersData: {},
  paramEditMode: false,
  services: [],
  showAlertModal: false,
};

ApplicationInstance.propTypes = {
  alertModalText: PropTypes.string,
  alertModalTitle: PropTypes.string,
  ansibleVarsAll: PropTypes.array,
  appDefinition: PropTypes.object,
  columns: PropTypes.array,
  data: PropTypes.shape({
    appDefinitionUrl: PropTypes.string,
    ansibleVarsAll: PropTypes.array.isRequired,
    appDefinition: PropTypes.object,
    applications: PropTypes.object,
    foremanDataUrl: PropTypes.string,
    hosts: PropTypes.array.isRequired,
    location: PropTypes.string.isRequired,
    mode: PropTypes.string.isRequired,
    organization: PropTypes.string.isRequired,
    supportedPlugins: PropTypes.object,
  }),
  editMode: PropTypes.bool,
  hiddenForemanParameterTypes: PropTypes.array,
  hosts: PropTypes.array,
  parametersData: PropTypes.object,
  paramEditMode: PropTypes.bool,
  services: PropTypes.array,
  showAlertModal: PropTypes.bool,
  activateEditApplicationInstanceHost: PropTypes.func.isRequired,
  addApplicationInstanceHost: PropTypes.func.isRequired,
  cancelEditApplicationInstanceHost: PropTypes.func.isRequired,
  changeEditApplicationInstanceHost: PropTypes.func.isRequired,
  changeParameterSelectionMode: PropTypes.func.isRequired,
  closeAddExistingHostsModal: PropTypes.func.isRequired,
  closeAlertModal: PropTypes.func.isRequired,
  closeAnsibleParameterSelectionModal: PropTypes.func.isRequired,
  closeForemanParameterSelectionModal: PropTypes.func.isRequired,
  confirmEditApplicationInstanceHost: PropTypes.func.isRequired,
  deleteApplicationInstanceHost: PropTypes.func.isRequired,
  initApplicationInstance: PropTypes.func.isRequired,
  loadApplicationDefinition: PropTypes.func.isRequired,
  openForemanParameterSelectionModal: PropTypes.func.isRequired,
  openAnsibleParameterSelectionModal: PropTypes.func.isRequired,
  openAddExistingHostsModal: PropTypes.func.isRequired,
};

export default ApplicationInstance;
