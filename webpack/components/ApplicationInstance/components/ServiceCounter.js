import React from 'react';
import PropTypes from 'prop-types';
import Service from './Service';
import { arrayToObjectObj } from '../../../helper';
import { cloneDeep } from 'lodash';

const ServiceCounter= ({
  title,
  serviceList,
}) =>{
  if (serviceList == undefined || serviceList.length == 0) {
    return null;
  }
  const services = cloneDeep(arrayToObjectObj(serviceList, "id"));

  return (
    <div>
      <label class="service-counter-title">{title}</label>
    {Object.keys(services).map(key => (
      <Service
        key={services[key].id}
        name={services[key].name}
        currentCount={services[key].currentCount}
        minCount={Number(services[key].minCount)}
        maxCount={Number(services[key].maxCount)}
      />)
    )}
    </div>
  );
};

ServiceCounter.propTypes = {
  title: PropTypes.string.isRequired,
  serviceList: PropTypes.array,
};

export default ServiceCounter;
