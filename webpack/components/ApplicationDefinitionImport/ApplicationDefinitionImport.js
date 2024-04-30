import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Button,
  MessageDialog,
  Table,
  inlineEditFormatterFactory,
} from 'patternfly-react';
import * as resolve from 'table-resolver';
import { translate as __ } from 'foremanReact/common/I18n';
import Select from 'foremanReact/components/common/forms/Select';
import CommonForm from 'foremanReact/components/common/forms/CommonForm';
import RailsData from '../common/RailsData';
import { EasyHeaderFormatter } from '../../helper';

class ApplicationDefinitionImport extends React.Component {
  onFileChange = event => {
    // Update the state
    this.setState({ selectedFile: event.target.files[0] });
  };

  static isEditing({ rowData }) {
    return rowData.backup !== undefined;
  }

  componentDidMount() {
    const { ansiblePlaybookServices, hostgroups } = this.props;

    const {
      initApplicationDefinitionImport,
      changeEditApplicationDefinitionImportService,
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
      isEditing: additionalData => this.constructor.isEditing(additionalData),
      renderValue: (value, additionalData) => {
        let prettyValue = value;
        if (additionalData.property === 'hostgroup') {
          prettyValue = hostgroups[value];
        }
        return inlineEditFormatterImpl.renderValue(prettyValue, additionalData);
      },
      renderEdit: (value, additionalData) => {
        if (additionalData.property === 'hostgroup') {
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
    const {
      showAlertModal,
      alertModalText,
      alertModalTitle,
      closeAlertModal,
      ansiblePlaybookServices,
      columns,
      handleImportAnsiblePlaybook,
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

        {ansiblePlaybookServices.length > 0 ? (
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
                rows={ansiblePlaybookServices}
                rowKey="id"
                onRow={(rowData, { rowIndex }) => ({
                  role: 'row',
                  isEditable: () => this.isEditing({ rowData }),
                  last: ansiblePlaybookServices.length - 1,
                })}
              />
            </Table.PfProvider>
          </div>
        ) : null}
        <RailsData
          key="applications_definition_import"
          view="app_definition_import"
          parameter="services"
          value={JSON.stringify(ansiblePlaybookServices)}
        />
      </span>
    );
  }
}

ApplicationDefinitionImport.defaultProps = {
  // error: {},
  showAlertModal: false,
  alertModalText: '',
  alertModalTitle: '',
  columns: [],
  ansiblePlaybookServices: [],
};

ApplicationDefinitionImport.propTypes = {
  hostgroups: PropTypes.object.isRequired,
  // error: PropTypes.object,
  ansiblePlaybookServices: PropTypes.array,
  // editMode: PropTypes.bool.isRequired,
  columns: PropTypes.array,
  showAlertModal: PropTypes.bool,
  alertModalText: PropTypes.string,
  alertModalTitle: PropTypes.string,
  changeEditApplicationDefinitionImportService: PropTypes.func.isRequired,
  closeAlertModal: PropTypes.func.isRequired,
  handleImportAnsiblePlaybook: PropTypes.func.isRequired,
  initApplicationDefinitionImport: PropTypes.func.isRequired,
};

export default ApplicationDefinitionImport;
