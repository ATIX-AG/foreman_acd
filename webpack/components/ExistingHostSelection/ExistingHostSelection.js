import React from 'react';
import PropTypes from 'prop-types';
import { cloneDeep } from 'lodash';
import { DualListControlled } from 'patternfly-react';
import { translate as __ } from 'foremanReact/common/I18n';
import ServiceSelector from './components/ServiceSelector';
import { arrayToObject } from '../../helper';

class ExistingHostSelection extends React.Component {
  componentDidMount() {
    const { allHosts, initExistingHostSelection } = this.props;

    initExistingHostSelection(allHosts);
  }

  render() {
    const {
      services,
      serviceId,
      availableHosts,
      alreadyUsedHosts,
      loadHostsOfHostgroup,
      hostSelectionChanged,
    } = this.props;

    const serviceList = arrayToObject(services, 'id', 'name');
    const loadHostgroupUrl = '/api/v2/hostgroups/__hostgroup_id__/hosts';

    return (
      <div>
        <div className="row">
          <ServiceSelector
            label="Service"
            hidden={false}
            selectValue={serviceId ? serviceId.toString() : '0'}
            options={serviceList}
            onChange={loadHostsOfHostgroup}
            additionalData={{ url: loadHostgroupUrl, services }}
          />
        </div>
        <div className="row">
          <label className="col-md-2 control-label">{__('Hosts')}</label>
          {serviceId !== undefined ? (
            <div className="col-md-6">
              <DualListControlled
                onChange={hostSelectionChanged}
                left={{
                  items: cloneDeep(availableHosts),
                }}
                right={{
                  items: cloneDeep(alreadyUsedHosts),
                }}
                allowHiddenInputs={false}
              />
            </div>
          ) : (
            <span>{__('Please select service first.')}</span>
          )}
        </div>
      </div>
    );
  }
}

ExistingHostSelection.defaultProps = {
  allHosts: [],
  serviceId: undefined,
  availableHosts: [],
  alreadyUsedHosts: [],
};

ExistingHostSelection.propTypes = {
  allHosts: PropTypes.array,
  services: PropTypes.array.isRequired,
  initExistingHostSelection: PropTypes.func.isRequired,
  serviceId: PropTypes.number,
  availableHosts: PropTypes.array,
  alreadyUsedHosts: PropTypes.array,
  loadHostsOfHostgroup: PropTypes.func.isRequired,
  hostSelectionChanged: PropTypes.func.isRequired,
};

export default ExistingHostSelection;
