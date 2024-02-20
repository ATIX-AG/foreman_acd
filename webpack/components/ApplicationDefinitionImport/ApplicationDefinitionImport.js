import React, { useState } from 'react';
import { cloneDeep } from 'lodash';
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
import Select from 'foremanReact/components/common/forms/Select';
import CommonForm from 'foremanReact/components/common/forms/CommonForm';
import AddTableEntry from '../common/AddTableEntry';
import DeleteTableEntry from '../common/DeleteTableEntry';
import RailsData from '../common/RailsData';
import { EasyHeaderFormatter } from '../../helper';
import { translate as __ } from 'foremanReact/common/I18n';

class ApplicationDefinitionImport extends React.Component {
  constructor(props) {
    super(props);
  }

  onFileChange = event => {
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
  };

  isEditing({ rowData }) {
    return rowData.backup !== undefined;
  }

  setAnsiblePlaybookServices() {
    this.setState({
      ansiblePlaybookServices: this.props.ansiblePlaybookServices,
    });
  }

  componentDidMount() {
    const { mode, ansiblePlaybookServices, hostgroups } = this.props;

    const {
      initApplicationDefinitionImport,
      changeEditApplicationDefinitionImportService,
      handleImportAnsiblePlaybook,
    } = this.props;

    this.headerFormatter = EasyHeaderFormatter;

    const inlineEditFormatterImpl = {
      renderValue: (value, additionalData) => (
        <td>
          <span className="static">{value}</span>
        </td>
      ),
      renderEditSelect: (value, additionalData, options) => (
        <td className="editing">
          <Select
            value={value.toString()}
            onChange={e =>
              changeEditApplicationDefinitionImportService(
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
      isEditing: additionalData => this.isEditing(additionalData),
      renderValue: (value, additionalData) => {
        let prettyValue = value;
        if (additionalData.property == 'hostgroup') {
          prettyValue = hostgroups[value];
        }
        return inlineEditFormatterImpl.renderValue(prettyValue, additionalData);
      },
      renderEdit: (value, additionalData) => {
        if (additionalData.property == 'hostgroup') {
          if (additionalData.rowData) {
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
        }
        return inlineEditFormatterImpl.renderValue(value, additionalData);
      },
    });
    this.inlineEditFormatter = inlineEditFormatter;

    initApplicationDefinitionImport(
      ansiblePlaybookServices,
      this.headerFormatter,
      this.inlineEditFormatter
    );
  }

  render() {
    const { organization, location, foremanDataUrl, mode } = this.props;

    const {
      showAlertModal,
      alertModalText,
      alertModalTitle,
      closeAlertModal,
      ansiblePlaybookServices,
      columns,
      handleImportAnsiblePlaybook,
    } = this.props;
    let ansibleServices;

    return (
      <span>
        {(ansibleServices = this.setAnsiblePlaybookServices)}
        {ansibleServices}
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
          <CommonForm
            label="Application Definition file"
            className="custom-file-upload"
          >
            <input type="file" onChange={this.onFileChange} />
          </CommonForm>
          <CommonForm>
            <Button
              bsStyle="default"
              onClick={e =>
                handleImportAnsiblePlaybook(this.state.selectedFile, e)
              }
            >
              {__('Import')}{' '}
            </Button>
          </CommonForm>
        </div>

        {Object.keys(this.props.ansiblePlaybookServices).length > 0 ? (
          <div className="form-group">
            <Table.PfProvider
              striped
              bordered
              hover
              dataTable
              columns={columns}
              components={{
                body: {
                  cell: cellProps => cellProps.children,
                },
              }}
            >
              <Table.Header headerRows={resolve.headerRows({ columns })} />
              <Table.Body
                rows={this.props.ansiblePlaybookServices}
                rowKey="id"
                onRow={(rowData, { rowIndex }) => ({
                  role: 'row',
                  isEditing: () => this.isEditing({ rowData }),
                  last:
                    rowIndex === this.props.ansiblePlaybookServices.length - 1,
                })}
              />
            </Table.PfProvider>
          </div>
        ) : null}
        <RailsData
          key="applications_definition_import"
          view="app_definition_import"
          parameter="services"
          value={JSON.stringify(this.props.ansiblePlaybookServices)}
        />
      </span>
    );
  }
}

ApplicationDefinitionImport.defaultProps = {
  error: {},
  showAlertModal: false,
  alertModalText: '',
  alertModalTitle: '',
  editMode: false,
  columns: [],
  ansiblePlaybookServices: [],
  editParamsOfRowId: null,
};

ApplicationDefinitionImport.propTypes = {
  error: PropTypes.object,
  ansiblePlaybookServices: PropTypes.array,
  initApplicationDefinitionImport: PropTypes.func,
  editMode: PropTypes.bool.isRequired,
  columns: PropTypes.array,
  showAlertModal: PropTypes.bool,
  alertModalText: PropTypes.string,
  alertModalTitle: PropTypes.string,
  closeAlertModal: PropTypes.func,
  handleImportAnsiblePlaybook: PropTypes.func,
  changeEditApplicationDefinitionImportService: PropTypes.func,
};

export default ApplicationDefinitionImport;
