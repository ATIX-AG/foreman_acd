import React, { useState } from 'react'
import PropTypes from 'prop-types';
import {
  Icon,
  Button,
} from 'patternfly-react';
import * as resolve from 'table-resolver';
import ForemanModal from 'foremanReact/components/ForemanModal';
import {
  sprintf,
  translate as __
} from 'foremanReact/common/I18n';
import Select from 'foremanReact/components/common/forms/Select';
import ParameterSelection from '../ParameterSelection';
import AddTableEntry from '../common/AddTableEntry';
import DeleteTableEntry from '../common/DeleteTableEntry';
import RailsData from '../common/RailsData';
import EasyHeaderFormatter from '../common/EasyHeaderFormatter';
import AppDefinitionSelector from './components/AppDefinitionSelector';
import ServiceCounter from './components/ServiceCounter';
import { arrayToObject } from '../../helper';

import {
  Table,
  FormControl,
  inlineEditFormatterFactory,
} from 'patternfly-react';

import {
  PARAMETER_SELECTION_PARAM_TYPE_FOREMAN,
  PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE,
} from '../ParameterSelection/ParameterSelectionConstants';

class ApplicationInstance extends React.Component {

  constructor(props) {
    super(props);
  }

  isEditing({rowData}) {
    return (rowData.backup !== undefined);
  }

  addTableEntryAllowed() {
    return this.props.editMode || this.props.appDefinition.id == ''
  }

  validateParameters() {
    let result = true;
    let msg = "";

    this.props.hosts.forEach(h => {
      if (h.foremanParameters.map(e => e.value).filter(i => i == "").length > 0) {
        result = false;

        if (msg == "") {
          msg += __("For some hosts the values for some parameters are missing. Check the values for these hosts:\n");
        }
        msg += "- "+ h.hostname +"\n";
      }
    });

    const invalidMinServices = this.props.services.filter(s => (Number(s.minCount) != 0) && (s.currentCount < s.minCount));
    const invalidMaxServices = this.props.services.filter(s => (Number(s.maxCount) != 0) && (s.currentCount > s.maxCount));

    console.log(invalidMinServices);

    if (invalidMinServices.length > 0 || invalidMaxServices.length > 0) {
      result = false;

      if (msg != "") {
        msg += "\n";
      }

      msg += __("Unachieved service counts:");
      msg += "\n";

      invalidMinServices.map(s => { msg += sprintf(
        __(`- service ${s.name} expects at ${s.minCount} least configured hosts\n`)
      )});

      invalidMaxServices.map(s => { msg += sprintf(
        __(`- service ${s.name} expects no more than ${s.axCount} configured hosts\n`)
      )});
    }

    return {
      validateResult: result,
      validateMsg: msg
    }
  }

  componentDidMount() {
    const {
      data: { mode, appDefinition, hosts, ansibleVarsAll, appDefinitionUrl },
      initApplicationInstance,
      addApplicationInstanceHost,
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

    const inlineEditButtonsFormatter = inlineEditFormatterFactory({
      isEditing: additionalData => this.props.editMode,
      renderValue: (value, additionalData) => (
        <td style={{ padding: '2px' }}>
          <Button
            bsStyle="default"
            onClick={() => activateEditApplicationInstanceHost(additionalData)}
          >
            <Icon type="pf" name="edit" title={__("edit entry")} />
          </Button>
          &nbsp;
          <Button
            bsStyle="default"
            onClick={() => openForemanParameterSelectionModal(additionalData)}
          >
            <Icon type="pf" name="settings" title={__("change parameters")} />
          </Button>
          &nbsp;
          <Button
            bsStyle="default"
            onClick={() => openAnsibleParameterSelectionModal(additionalData)}
          >
            <span title={__("change ansible variables")}>A</span>
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
          <Button bsStyle="default" disabled>
            <Icon type="pf" name={__("edit")} />
          </Button>
          &nbsp;
          <Button bsStyle="default" disabled>
            <Icon type="pf" name={__("settings")} />
          </Button>
          &nbsp;
          <Button bsStyle="default" disabled>
            <span>A</span>
          </Button>
          &nbsp;
          <DeleteTableEntry
            hidden={false}
            disabled={true}
            onDeleteTableEntry={deleteApplicationInstanceHost}
            additionalData={additionalData}
          />
        </td>
      )
    });
    this.inlineEditButtonsFormatter = inlineEditButtonsFormatter;

    this.headerFormatter = EasyHeaderFormatter;

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
            onBlur={e => changeEditApplicationInstanceHost(e.target.value, additionalData) }
          />
        </td>
      ),
      renderEditSelect: (value, additionalData, options) => (
        <td className="editing">
          <Select
            value={value.toString()}
            onChange={e => changeEditApplicationInstanceHost(e.target.value, additionalData) }
            options={options}
            allowClear
            key="key"
          />
        </td>
      )
    };

    const inlineEditFormatter = inlineEditFormatterFactory({
      isEditing: additionalData => this.isEditing(additionalData),
      renderValue: (value, additionalData) => {
        let prettyValue = value;
        if (additionalData.property == 'service') {
          const serviceList = arrayToObject(this.props.services, "id", "name");
          prettyValue = serviceList[value];
        }
        return inlineEditFormatterImpl.renderValue(prettyValue, additionalData)
      },
      renderEdit: (value, additionalData) => {
        let prettyValue = value;
        if (additionalData.property == 'service') {
          const availableServices = this.props.services.filter(service => ((Number(service['maxCount']) == 0) || (service['currentCount'] < service['maxCount'])));
          const serviceList = arrayToObject(availableServices, "id", "name");

          if (additionalData.rowData.newEntry === true) {
            return inlineEditFormatterImpl.renderEditSelect(value, additionalData, serviceList);
          }
          prettyValue = serviceList[value];
          return inlineEditFormatterImpl.renderValue(prettyValue, additionalData)
        }
	if (additionalData.property == 'hostname') {
	  if (additionalData.rowData.newEntry === true) {
            return inlineEditFormatterImpl.renderEditText(value, additionalData);
          }
          return inlineEditFormatterImpl.renderValue(prettyValue, additionalData)
        }
        return inlineEditFormatterImpl.renderEditText(prettyValue, additionalData);
      }
    });
    this.inlineEditFormatter = inlineEditFormatter;

    initApplicationInstance(
      appDefinition,
      hosts,
      ansibleVarsAll,
      this.headerFormatter,
      this.inlineEditFormatter,
      this.inlineEditButtonsFormatter,
    );
  };

  render() {
    const {
      data: { mode, applications, organization, location, foremanDataUrl, appDefinitionUrl },
      appDefinition,
      services,
      hosts,
      columns,
      addApplicationInstanceHost,
      confirmEditApplicationInstanceHost,
      cancelEditApplicationInstanceHost,
      closeForemanParameterSelectionModal,
      openAnsibleParameterSelectionModal,
      closeAnsibleParameterSelectionModal,
      changeParameterSelectionMode,
      loadApplicationDefinition,
    } = this.props;

    let { validateResult, validateMsg } = this.validateParameters();

    if (validateResult == false) {
      $('input[type="submit"][name="commit"]').attr("disabled", true);
    } else {
      $('input[type="submit"][name="commit"]').attr("disabled", false);
    }

    return (
      <span>
        <div class="service-counter">
          <ServiceCounter
            title="Service counts"
            serviceList={ services }
            hostList={ hosts }
          />
        </div>
        <div>
          <AppDefinitionSelector
            label="Application Definition"
            editable={ mode == 'newInstance' }
            viewText={ appDefinition.name }
            options={ applications }
            onChange={ loadApplicationDefinition }
            selectValue={ appDefinition.id.toString() }
            additionalData={{url: appDefinitionUrl}}
          />
          {appDefinition.id == '' ? (
          <p style={{ paddingTop: 25 }}>
            <pre>{ "App Definition can't be blank" }</pre>
          </p>
        ) : (<div></div>)}
        </div>
        <div className="form-group">
          <AddTableEntry
             hidden={ false }
             disabled={ this.addTableEntryAllowed() }
             onAddTableEntry={ addApplicationInstanceHost }
          />
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
                cell: cellProps => cellProps.children
              }
            }}
          >
            <Table.Header headerRows={resolve.headerRows({ columns })} />
            <Table.Body
              rows={hosts}
              rowKey="id"
              onRow={(rowData, { rowIndex }) => ({
                role: 'row',
                isEditing: () => this.isEditing({ rowData }),
                onCancel: () => cancelEditApplicationInstanceHost({ rowData, rowIndex }),
                onConfirm: () => confirmEditApplicationInstanceHost({ rowData, rowIndex }),
                last: rowIndex === services.length - 1
              })}
            />
          </Table.PfProvider>
          <AddTableEntry
            hidden={ false }
            disabled={ this.addTableEntryAllowed() }
            onAddTableEntry={ addApplicationInstanceHost }
          />
          <span style={{ marginLeft: 30 }}>
            Ansible group vars 'all':
            <Button
              style={{ marginLeft: 10 }}
              bsStyle="default"
              disabled={ this.props.editMode }
              onClick={() => openAnsibleParameterSelectionModal({
                isAllGroup: true
              })}
            >
              <span title={__("change ansible variables for 'all'")}>A</span>
            </Button>
          </span>
        </div>
        <div>
          <ForemanModal
            id="AppInstanceForemanParamSelection"
            dialogClassName="param_selection_modal"
            title={__("Foreman Parameter specification for Application Instance")}
          >
            <ForemanModal.Header closeButton={false}>
              Parameter specification
            </ForemanModal.Header>
            {this.props.parametersData ? (
              <ParameterSelection
                editModeCallback={ (hide) => changeParameterSelectionMode({ mode: hide })}
                paramType={ PARAMETER_SELECTION_PARAM_TYPE_FOREMAN }
                location={ location }
                organization={ organization }
                paramDataUrl= { foremanDataUrl }
                data={ this.props.parametersData }
              />
            ) : (<span>Empty</span>)
            }
            <ForemanModal.Footer>
              <div>
                <Button bsStyle="primary" disabled={this.props.paramEditMode} onClick={() => closeForemanParameterSelectionModal({ mode: 'save' })}>{__("Save")}</Button>
                <Button bsStyle="default" disabled={this.props.paramEditMode} onClick={() => closeForemanParameterSelectionModal({ mode: 'cancel' })}>{__("Cancel")}</Button>
              </div>
            </ForemanModal.Footer>
          </ForemanModal>
        </div>
        <div>
          <ForemanModal
            id="AppInstanceAnsibleParamSelection"
            dialogClassName="param_selection_modal"
            title={__("Ansible group variables for Application Instance")}
          >
            <ForemanModal.Header closeButton={false}>
              Parameter specification
            </ForemanModal.Header>
            {this.props.parametersData ? (
              <ParameterSelection
                editModeCallback={ (hide) => changeParameterSelectionMode({ mode: hide })}
                paramType={ PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE }
                location={ location }
                organization={ organization }
                data={ this.props.parametersData }
              />
            ) : (<span>Empty</span>)
            }
            <ForemanModal.Footer>
              <div>
                <Button bsStyle="primary" disabled={this.props.paramEditMode} onClick={() => closeAnsibleParameterSelectionModal({ mode: 'save' })}>{__("Save")}</Button>
                <Button bsStyle="default" disabled={this.props.paramEditMode} onClick={() => closeAnsibleParameterSelectionModal({ mode: 'cancel' })}>{__("Cancel")}</Button>
              </div>
            </ForemanModal.Footer>
          </ForemanModal>
        </div>
        {validateResult == false ? (
          <p style={{ paddingTop: 25 }}>
            <pre>{ validateMsg }</pre>
          </p>
        ) : (<div></div>)}
        <RailsData
          key='applications_instance'
          view='app_instance'
          parameter='hosts'
          value={JSON.stringify(this.props.hosts)}
        />
        <RailsData
          key='applications_instance'
          view='app_instance'
          parameter='ansible_vars_all'
          value={JSON.stringify(this.props.ansibleVarsAll)}
        />
      </span>
    )};
}

ApplicationInstance.defaultProps = {
  error: {},
  appDefinition: { "id": '', "name": '' },
  editMode: false,
  services: [],
  hosts: [],
  ansibleVarsAll: [],
  parametersData: {},
  columns: [],
  editParamsOfRowId: null,
  paramEditMode: false,
}

ApplicationInstance.propTypes = {
  initApplicationInstance: PropTypes.func,
  editMode: PropTypes.bool.isRequired,
  services: PropTypes.array,
  appDefinition: PropTypes.object,
  columns: PropTypes.array,
  hosts: PropTypes.array,
  ansibleVarsAll: PropTypes.array,
  loadApplicationDefinition: PropTypes.func,
  addApplicationInstanceHost: PropTypes.func,
  deleteApplicationInstanceHost: PropTypes.func,
  activateEditApplicationInstanceHost: PropTypes.func,
  confirmEditApplicationInstanceHost: PropTypes.func,
  cancelEditApplicationInstanceHost: PropTypes.func,
  changeEditApplicationInstanceHost: PropTypes.func,
  openForemanParameterSelectionModal: PropTypes.func,
  closeForemanParameterSelectionModal: PropTypes.func,
  openAnsibleParameterSelectionModal: PropTypes.func,
  closeAnsibleParameterSelectionModal: PropTypes.func,
  changeParameterSelectionMode: PropTypes.func,
  parametersData: PropTypes.object,
  paramEditMode: PropTypes.bool,
};

export default ApplicationInstance;
