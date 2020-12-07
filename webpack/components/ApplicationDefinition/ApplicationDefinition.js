import $ from 'jquery';
import React, { useState } from 'react'
import PropTypes from 'prop-types';
import {
  Icon,
  Button,
} from 'patternfly-react';
import * as resolve from 'table-resolver';
import ForemanModal from 'foremanReact/components/ForemanModal';
import Select from 'foremanReact/components/common/forms/Select';
import ParameterSelection from '../ParameterSelection';
import AddTableEntry from '../common/AddTableEntry';
import DeleteTableEntry from '../common/DeleteTableEntry';
import RailsData from '../common/RailsData';
import EasyHeaderFormatter from '../common/EasyHeaderFormatter';
import AnsiblePlaybookSelector from './components/AnsiblePlaybookSelector';

import {
  Table,
  FormControl,
  inlineEditFormatterFactory,
} from 'patternfly-react';

import {
  PARAMETER_SELECTION_PARAM_TYPE_FOREMAN,
  PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE,
} from '../ParameterSelection/ParameterSelectionConstants';

class ApplicationDefinition extends React.Component {

  constructor(props) {
    super(props);
  }

  isEditing({rowData}) {
    return (rowData.backup !== undefined);
  }

  createAnsibleGroupObject(ansibleGroups, withAll=false) {
    const ansibleGroupObj = {};

    const ansibleGroupArray = Object.keys(ansibleGroups);
    ansibleGroupArray.forEach(e => (ansibleGroupObj[e] = e));

    if ((withAll === false) && (ansibleGroupObj.hasOwnProperty('all'))) {
      delete ansibleGroupObj.all;
    }

    return ansibleGroupObj;
  }

  componentDidMount() {
    const {
      data: { mode, ansiblePlaybook, ansibleDataUrl, services, ansibleVarsAll, hostgroups },
      initApplicationDefinition,
      addApplicationDefinitionService,
      deleteApplicationDefinitionService,
      activateEditApplicationDefinitionService,
      changeEditApplicationDefinitionService,
      openForemanParameterSelectionModal,
      openAnsibleParameterSelectionModal,
      loadAnsibleData,
    } = this.props;

    const inlineEditButtonsFormatter = inlineEditFormatterFactory({
      isEditing: additionalData => this.props.editMode,
      renderValue: (value, additionalData) => (
        <td style={{ padding: '2px' }}>
          <Button
            bsStyle="default"
            onClick={() => activateEditApplicationDefinitionService(additionalData)}
          >
            <Icon type="pf" name="edit" title="edit entry" />
          </Button>
          &nbsp;
          <Button
            bsStyle="default"
            onClick={() => openForemanParameterSelectionModal(additionalData)}
          >
            <Icon type="pf" name="settings" title="change parameters" />
          </Button>
          &nbsp;
          <Button
            bsStyle="default"
            onClick={() => openAnsibleParameterSelectionModal(additionalData)}
          >
            <span title="change ansible variables">A</span>
          </Button>
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
            <Icon type="pf" name="edit" />
          </Button>
          &nbsp;
          <Button bsStyle="default" disabled>
            <Icon type="pf" name="settings" />
          </Button>
          &nbsp;
          <Button
            bsStyle="default" disabled>
            <span>A</span>
          </Button>
          <DeleteTableEntry
            hidden={false}
            disabled={true}
            onDeleteTableEntry={deleteApplicationDefinitionService}
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
            onBlur={e => changeEditApplicationDefinitionService(e.target.value, additionalData) }
          />
        </td>
      ),
      renderEditSelect: (value, additionalData, options) => (
        <td className="editing">
          <Select
            value={value.toString()}
            onChange={e => changeEditApplicationDefinitionService(e.target.value, additionalData) }
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
        if (additionalData.property == 'hostgroup') {
          prettyValue = hostgroups[value];
        }
        else if (additionalData.property == 'ansibleGroup') {
          const ag = this.createAnsibleGroupObject(this.props.ansiblePlaybook.groups);
          prettyValue = ag[value];
        }
        return inlineEditFormatterImpl.renderValue(prettyValue, additionalData)
      },
      renderEdit: (value, additionalData) => {
        if (additionalData.property == 'hostgroup') {
          if (additionalData.rowData.newEntry === true) {
            return inlineEditFormatterImpl.renderEditSelect(value, additionalData, hostgroups);
          }
          return inlineEditFormatterImpl.renderValue(hostgroups[value], additionalData)
        }
        else if (additionalData.property == 'ansibleGroup') {
          const ag = this.createAnsibleGroupObject(this.props.ansiblePlaybook.groups);

          if (additionalData.rowData.newEntry === true) {
            return inlineEditFormatterImpl.renderEditSelect(value, additionalData, ag);
          }
          return inlineEditFormatterImpl.renderValue(ag[value], additionalData);
        }
        return inlineEditFormatterImpl.renderEditText(value, additionalData);
      }
    });
    this.inlineEditFormatter = inlineEditFormatter;

    initApplicationDefinition(
      ansiblePlaybook,
      services,
      ansibleVarsAll,
      this.headerFormatter,
      this.inlineEditFormatter,
      this.inlineEditButtonsFormatter,
    );
  };

  render() {
    const {
      data: { organization, location, mode, ansiblePlaybooks, foremanDataUrl, ansibleDataUrl },
      ansiblePlaybook,
      services,
      columns,
      addApplicationDefinitionService,
      confirmEditApplicationDefinitionService,
      cancelEditApplicationDefinitionService,
      closeForemanParameterSelectionModal,
      openAnsibleParameterSelectionModal,
      closeAnsibleParameterSelectionModal,
      ParameterSelectionModal,
      loadAnsibleData,
    } = this.props;

    return (
      <span>
        <div>
          <AnsiblePlaybookSelector
            label="Ansible Playbook"
            editable={ mode == 'newDefinition' }
            viewText={ ansiblePlaybook.name }
            options={ ansiblePlaybooks }
            onChange={ loadAnsibleData }
            selectValue={ ansiblePlaybook.id.toString() }
            additionalData={{url: ansibleDataUrl }}
          />
        </div>
        <div className="form-group">
          <AddTableEntry
            hidden={ false }
            disabled={ this.props.editMode }
            onAddTableEntry={ addApplicationDefinitionService }
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
              rows={services}
              rowKey="id"
              onRow={(rowData, { rowIndex }) => ({
                role: 'row',
                isEditing: () => this.isEditing({ rowData }),
                onCancel: () => cancelEditApplicationDefinitionService({ rowData, rowIndex }),
                onConfirm: () => confirmEditApplicationDefinitionService({ rowData, rowIndex }),
                last: rowIndex === services.length - 1
              })}
            />
          </Table.PfProvider>
          <AddTableEntry
            hidden={ false }
            disabled={ this.props.editMode }
            onAddTableEntry={ addApplicationDefinitionService }
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
              <span title="change ansible variables for 'all'">A</span>
            </Button>
          </span>
        </div>
        <div>
          <ForemanModal
            id="AppDefinitionForemanParamSelection"
            dialogClassName="param_selection_modal"
            title="Foreman Parameter definition for Application Definition"
          >
            <ForemanModal.Header closeButton={false}>
              Parameter definition
            </ForemanModal.Header>
            {this.props.parametersData ? (
              <ParameterSelection
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
                <Button bsStyle="primary" onClick={() => closeForemanParameterSelectionModal({ mode: 'save' })}>Save</Button>
                <Button bsStyle="default" onClick={() => closeForemanParameterSelectionModal({ mode: 'cancel' })}>Cancel</Button>
              </div>
            </ForemanModal.Footer>
          </ForemanModal>
        </div>
        <div>
          <ForemanModal
            id="AppDefinitionAnsibleParamSelection"
            dialogClassName="param_selection_modal"
            title="Ansible variables for Application Definition"
          >
            <ForemanModal.Header closeButton={false}>
              Parameter definition
            </ForemanModal.Header>
            {this.props.parametersData ? (
              <ParameterSelection
                paramType={ PARAMETER_SELECTION_PARAM_TYPE_ANSIBLE }
                location={ location }
                organization={ organization }
                data={ this.props.parametersData }
              />
            ) : (<span>Empty</span>)
            }
            <ForemanModal.Footer>
              <div>
                <Button bsStyle="primary" onClick={() => closeAnsibleParameterSelectionModal({ mode: 'save' })}>Save</Button>
                <Button bsStyle="default" onClick={() => closeAnsibleParameterSelectionModal({ mode: 'cancel' })}>Cancel</Button>
              </div>
            </ForemanModal.Footer>
          </ForemanModal>
        </div>
        <RailsData
          key='applications_definition'
          view='app_definition'
          parameter='services'
          value={JSON.stringify(this.props.services)}
        />
        <RailsData
          key='applications_definition'
          view='app_definition'
          parameter='ansible_vars_all'
          value={JSON.stringify(this.props.ansibleVarsAll)}
        />
      </span>
    )};
}

ApplicationDefinition.defaultProps = {
  error: {},
  editMode: false,
  ansiblePlaybook: { "id": '', "name": '' },
  services: [],
  ansibleVarsAll: [],
  parametersData: {},
  columns: [],
  editParamsOfRowId: null,
}

ApplicationDefinition.propTypes = {
  initApplicationDefinition: PropTypes.func,
  editMode: PropTypes.bool.isRequired,
  ansiblePlaybook: PropTypes.object,
  services: PropTypes.array,
  ansibleVarsAll: PropTypes.array,
  columns: PropTypes.array,
  addApplicationDefinitionService: PropTypes.func,
  deleteApplicationDefinitionService: PropTypes.func,
  activateEditApplicationDefinitionService: PropTypes.func,
  confirmEditApplicationDefinitionService: PropTypes.func,
  cancelEditApplicationDefinitionService: PropTypes.func,
  changeEditApplicationDefinitionService: PropTypes.func,
  openForemanParameterSelectionModal: PropTypes.func,
  closeForemanParameterSelectionModal: PropTypes.func,
  openAnsibleParameterSelectionModal: PropTypes.func,
  closeAnsibleParameterSelectionModal: PropTypes.func,
  parametersData: PropTypes.object,
};

export default ApplicationDefinition;
