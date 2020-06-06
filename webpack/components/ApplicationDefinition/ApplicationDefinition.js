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

import {
  Table,
  FormControl,
  inlineEditFormatterFactory,
} from 'patternfly-react';

class ApplicationDefinition extends React.Component {

  constructor(props) {
    super(props);
  }

  isEditing({rowData}) {
    return (rowData.backup !== undefined);
  }

  componentDidMount() {
    const {
      data: { services, hostgroups },
      initApplicationDefinition,
      addApplicationDefinitionService,
      deleteApplicationDefinitionService,
      activateEditApplicationDefinitionService,
      changeEditApplicationDefinitionService,
      openParameterSelectionModal,
      closeParameterSelectionModal,
    } = this.props;

    const inlineEditButtonsFormatter = inlineEditFormatterFactory({
      isEditing: additionalData => this.props.editMode,
      renderValue: (value, additionalData) => (
        <td style={{ padding: '2px' }}>
          <Button
            bsStyle="default"
            onClick={() => activateEditApplicationDefinitionService(additionalData)}
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
          <Button bsStyle="default" disabled>
            <Icon type="pf" name="settings" />
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
        return inlineEditFormatterImpl.renderValue(prettyValue, additionalData)
      },
      renderEdit: (value, additionalData) => {
        if (additionalData.property == 'hostgroup') {
          if (additionalData.rowData.newEntry === true) {
            return inlineEditFormatterImpl.renderEditSelect(value, additionalData, hostgroups);
          }
          return inlineEditFormatterImpl.renderValue(hostgroups[value], additionalData)
        }
        return inlineEditFormatterImpl.renderEditText(value, additionalData);
      }
    });
    this.inlineEditFormatter = inlineEditFormatter;

    initApplicationDefinition(
      services,
      this.headerFormatter,
      this.inlineEditFormatter,
      this.inlineEditButtonsFormatter,
    );
  };

  render() {
    const {
      data: { organization, location, loadForemanDataUrl },
      services,
      columns,
      isModalOpen,
      addApplicationDefinitionService,
      confirmEditApplicationDefinitionService,
      cancelEditApplicationDefinitionService,
      openParameterSelectionModal,
      closeParameterSelectionModal,
      ParameterSelectionModal,
    } = this.props;

    return (
      <span>
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
        </div>
        <div>
          <ForemanModal
            id="AppDefinitionParamSelection"
            isOpen={isModalOpen}
            dialogClassName="param_selection_modal"
            title="Parameter Selection for Application Definition"
            onClose={() => closeParameterSelectionModal({})}
          >
            <ForemanModal.Header>
              Parameter Definition
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
          key='applications_definition'
          view='app_definition'
          parameter='services'
          value={JSON.stringify(this.props.services)}
        />
      </span>
    )};
}

ApplicationDefinition.defaultProps = {
  error: {},
  editMode: false,
  services: [],
  parametersData: {},
  columns: [],
  isModalOpen: false,
  editParamsOfRowId: null,
}

ApplicationDefinition.propTypes = {
  initApplicationDefinition: PropTypes.func,
  editMode: PropTypes.bool.isRequired,
  services: PropTypes.array,
  columns: PropTypes.array,
  isModalOpen: PropTypes.bool,
  addApplicationDefinitionService: PropTypes.func,
  deleteApplicationDefinitionService: PropTypes.func,
  activateEditApplicationDefinitionService: PropTypes.func,
  confirmEditApplicationDefinitionService: PropTypes.func,
  cancelEditApplicationDefinitionService: PropTypes.func,
  changeEditApplicationDefinitionService: PropTypes.func,
  openParameterSelectionModal: PropTypes.func,
  closeParameterSelectionModal: PropTypes.func,
  parametersData: PropTypes.object,
};

export default ApplicationDefinition;
