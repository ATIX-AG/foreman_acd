import React from 'react';
import PropTypes from 'prop-types';
import Service from './Service';

const ServiceCounter = ({ title, serviceList }) => {
  if (serviceList === undefined || serviceList.length === 0) {
    return null;
  }
  const services = serviceList.map(service => (
    <Service
      key={service.id}
      name={service.name}
      currentCount={service.currentCount}
      minCount={Number(service.minCount)}
      maxCount={Number(service.maxCount)}
    />
  ));

  return (
    <div>
      <label className="service-counter-title">{title}</label>
      {services}
    </div>
  );
};

ServiceCounter.propTypes = {
  title: PropTypes.string.isRequired,
  serviceList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      currentCount: PropTypes.number.isRequired,
      minCount: PropTypes.string.isRequired,
      maxCount: PropTypes.string.isRequired,
    })
  ),
};

ServiceCounter.defaultProps = {
  serviceList: undefined,
};

export default ServiceCounter;
