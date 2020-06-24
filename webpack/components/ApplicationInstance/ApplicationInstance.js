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
import RailsData from '../common/RailsData'
import AppDefinitionSelector from './components/AppDefinitionSelector';
import ServiceCounter from './components/ServiceCounter';
import { arrayToObject } from '../../helper';

import {
  Table,
  FormControl,
  inlineEditFormatterFactory,
} from 'patternfly-react';

class ApplicationInstance extends React.Component {

  constructor(props) {
    super(props);
  }

  isEditing({rowData}) {
    return (rowData.backup !== undefined);
  }

  validateParameters() {
    let result = true;
    let msg = "";

    this.props.hosts.forEach(h => {
      if (h.parameters.map(e => e.value).filter(i => i == "").length > 0) {
        result = false;

        if (msg == "") {
          msg += "For some hosts the values for some parameters are missing. Check the values for these hosts:\n";
        }
        msg += "- "+ h.hostname +"\n";
      }
    });

    const invalidMinServices = this.props.services.filter(s => (Number(s.minCount) != 0) && (s.currentCount < s.minCount));
    const invalidMaxServices = this.props.services.filter(s => (Number(s.maxCount) != 0) && (s.currentCount > s.maxCount));

    if (invalidMinServices.length > 0 || invalidMaxServices.length > 0) {
      result = false;

      if (msg != "") {
        msg += "\n";
      }
      msg += "Unachieved service counts: \n";

      invalidMinServices.map(s => { msg += "- service "+ s.name +" expects at least "+ s.minCount +" configured hosts" });
      invalidMaxServices.map(s => { msg += "- service "+ s.name +" expects no more than "+ s.maxCount +" configured hosts" });
    }

    if (result === false) {
      window.alert(msg);
    }
    return result;
  }

  componentDidMount() {
    const {
      data: { mode, appDefinition, hosts, loadAppDefinitionUrl },
      initApplicationInstance,
      addApplicationInstanceHost,
      deleteApplicationInstanceHost,
      activateEditApplicationInstanceHost,
      changeEditApplicationInstanceHost,
      openParameterSelectionModal,
      closeParameterSelectionModal,
      loadApplicationDefinition,
    } = this.props;

    if (mode === 'editInstance') {
      loadApplicationDefinition(appDefinition.id, { url: loadAppDefinitionUrl });
    }

    const inlineEditButtonsFormatter = inlineEditFormatterFactory({
      isEditing: additionalData => this.props.editMode,
      renderValue: (value, additionalData) => (
        <td style={{ padding: '2px' }}>
          <Button
            bsStyle="default"
            onClick={() => activateEditApplicationInstanceHost(additionalData)}
          >
            <Icon type="pf" name="edit" />
          </Button>
          <Button
            bsStyle="default"
            onClick={() => openParameterSelectionModal(additionalData)}
          >
            <Icon type="pf" name="settings" />
          </Button>
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
            <Icon type="pf" name="edit" />
          </Button>
          <Button bsStyle="default" disabled>
            <Icon type="pf" name="settings" />
          </Button>
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

    const headerFormatter = value => <Table.Heading>{value}</Table.Heading>;
    this.headerFormatter = headerFormatter;

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
        return inlineEditFormatterImpl.renderEditText(prettyValue, additionalData);
      }
    });
    this.inlineEditFormatter = inlineEditFormatter;

    initApplicationInstance(
      appDefinition,
      hosts,
      this.headerFormatter,
      this.inlineEditFormatter,
      this.inlineEditButtonsFormatter,
    );
  };

  render() {
    const {
      data: { mode, applications, organization, location, loadForemanDataUrl, loadAppDefinitionUrl },
      appDefinition,
      services,
      hosts,
      columns,
      addApplicationInstanceHost,
      confirmEditApplicationInstanceHost,
      cancelEditApplicationInstanceHost,
      openParameterSelectionModal,
      closeParameterSelectionModal,
      ParameterSelectionModal,
      loadApplicationDefinition,
    } = this.props;

    // Start from validation when pressing submit. This should be in componentDidMount() but
    // unfortunatley then the event wasn't fired. To make sure, that the on-click is only added
    // once, there is a workaround to check if a css class "bound" exists.
    $('input[type="submit"][name="commit"]:not(.bound)').addClass('bound').on('click', () => this.validateParameters());

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
            additionalData={{url: loadAppDefinitionUrl}}
          />
        </div>
        <div className="form-group">
          <AddTableEntry
             hidden={ false }
             disabled={ this.props.editMode }
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
             disabled={ this.props.editMode }
             onAddTableEntry={ addApplicationInstanceHost }
          />
        </div>
        <div>
          <ForemanModal
            id="AppInstanceParamSelection"
            dialogClassName="param_selection_modal"
            title="Parameter specification for Application Instance"
          >
            <ForemanModal.Header closeButton={false}>
              Parameter specification
            </ForemanModal.Header>
            {this.props.parametersData ? (
              <ParameterSelection
                location={ location }
                organization={ organization }
                loadForemanDataUrl= { loadForemanDataUrl }
                data={ this.props.parametersData }
              />
            ) : (<span>Empty</span>)
            }
            <ForemanModal.Footer>
              <div>
                <Button bsStyle="primary" onClick={() => closeParameterSelectionModal({ mode: 'save' })}>Save</Button>
                <Button bsStyle="default" onClick={() => closeParameterSelectionModal({ mode: 'cancel' })}>Cancel</Button>
              </div>
            </ForemanModal.Footer>
          </ForemanModal>
        </div>
        <RailsData
          key='applications_instance'
          view='app_instance'
          parameter='hosts'
          value={JSON.stringify(this.props.hosts)}
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
  parametersData: {},
  columns: [],
  editParamsOfRowId: null,
}

ApplicationInstance.propTypes = {
  initApplicationInstance: PropTypes.func,
  editMode: PropTypes.bool.isRequired,
  services: PropTypes.array,
  appDefinition: PropTypes.object,
  columns: PropTypes.array,
  loadApplicationDefinition: PropTypes.func,
  addApplicationInstanceHost: PropTypes.func,
  deleteApplicationInstanceHost: PropTypes.func,
  activateEditApplicationInstanceHost: PropTypes.func,
  confirmEditApplicationInstanceHost: PropTypes.func,
  cancelEditApplicationInstanceHost: PropTypes.func,
  changeEditApplicationInstanceHost: PropTypes.func,
  openParameterSelectionModal: PropTypes.func,
  closeParameterSelectionModal: PropTypes.func,
  parametersData: PropTypes.object,
};

export default ApplicationInstance;
