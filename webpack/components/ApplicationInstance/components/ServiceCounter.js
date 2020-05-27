import React from 'react';
import PropTypes from 'prop-types';
import Service from './Service';
import { arrayToObjectObj } from '../../../helper';
import { cloneDeep } from 'lodash';


const ServiceCounter= ({
  label,
  serviceList,
  hostList,
}) =>{
  if (serviceList == undefined || serviceList.length == 0) {
    return null;
  }

  const services = cloneDeep(arrayToObjectObj(serviceList, "id"));

  hostList.map((host, index) => {
    const serviceElem = Number(host.service);
    if ('currentCount' in services[serviceElem]) {
      services[serviceElem]['currentCount'] += 1;
    } else {
      services[serviceElem]['currentCount'] = 1;
    }
  });

  return (
    <div>
    <label>{label}</label>
    {Object.keys(services).map(key => (
      <Service
        key={services[key].index}
        label={services[key].name}
        currentCount={services[key].currentCount}
        maxCount={Number(services[key].count)}
      />)
    )}
    </div>
  );
};

ServiceCounter.propTypes = {
  label: PropTypes.string.isRequired,
  serviceList: PropTypes.array,
  hostList: PropTypes.array,
};

export default ServiceCounter;
