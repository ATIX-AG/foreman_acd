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
          const serviceList = arrayToObject(this.props.services, "id", "name");
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
      isModalOpen,
      addApplicationInstanceHost,
      confirmEditApplicationInstanceHost,
      cancelEditApplicationInstanceHost,
      openParameterSelectionModal,
      closeParameterSelectionModal,
      ParameterSelectionModal,
      loadApplicationDefinition,
    } = this.props;

    return (
      <span>
        <div>
          <ServiceCounter
            label="Service counts"
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
            isOpen={isModalOpen}
            dialogClassName="param_selection_modal"
            title="I'm a modal!"
            onClose={() => closeParameterSelectionModal({})}
          >
            <ForemanModal.Header>
              Parameter Instance
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
              Click the X in the upper right to close
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
  isModalOpen: false,
  editParamsOfRowId: null,
}

ApplicationInstance.propTypes = {
  initApplicationInstance: PropTypes.func,
  editMode: PropTypes.bool.isRequired,
  services: PropTypes.array,
  appDefinition: PropTypes.object,
  columns: PropTypes.array,
  isModalOpen: PropTypes.bool,
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
