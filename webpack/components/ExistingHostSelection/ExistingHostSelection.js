import React from 'react';
import PropTypes from 'prop-types';
import { orderBy, cloneDeep } from 'lodash';
import ServiceSelector from './components/ServiceSelector';
import { arrayToObject } from '../../helper';

import { Icon, Button, DualListControlled } from 'patternfly-react';

class ExistingHostSelection extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {
      location,
      organization,
      services,
      initExistingHostSelection,
      allHosts,
    } = this.props;

    initExistingHostSelection(allHosts);
  }

  render() {
    const {
      location,
      organization,
      services,
      serviceId,
      availableHosts,
      alreadyUsedHosts,
      loadHostsOfHostgroup,
      hostSelectionChanged,
    } = this.props;

    const serviceList = arrayToObject(services, 'id', 'name');
    const load_hostgroup_url = '/api/v2/hostgroups/__hostgroup_id__/hosts';

    return (
      <div>
        <div className="row">
          <ServiceSelector
            label="Service"
            hidden={false}
            selectValue={
              this.props.serviceId ? this.props.serviceId.toString() : '0'
            }
            options={serviceList}
            onChange={loadHostsOfHostgroup}
            additionalData={{ url: load_hostgroup_url, services }}
          />
        </div>
        <div className="row">
          <label className="col-md-2 control-label">{__('Hosts')}</label>
          {this.props.serviceId != undefined ? (
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
  serviceId: undefined,
  hostsInHostgroup: {},
  availableHosts: [],
  alreadyUsedHosts: [],
  selectedHosts: [],
};

ExistingHostSelection.propTypes = {
  location: PropTypes.string.isRequired,
  organization: PropTypes.string.isRequired,
  services: PropTypes.array.isRequired,
  initExistingHostSelection: PropTypes.func,
  serviceId: PropTypes.number,
  hostsInHostgroup: PropTypes.object,
  availableHosts: PropTypes.array,
  alreadyUsedHosts: PropTypes.array,
  selectedHosts: PropTypes.array,
  loadHostsOfHostgroup: PropTypes.func,
  hostSelectionChanged: PropTypes.func,
};

export default ExistingHostSelection;
