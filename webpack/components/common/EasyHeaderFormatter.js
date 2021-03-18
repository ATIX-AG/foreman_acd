import React from 'react';
import PropTypes from 'prop-types';
import {
  Table,
} from 'patternfly-react';

const EasyHeaderFormatter = (value, { column }) => {
  return
  (
    <Table.Heading aria-label={column.header.label} {...column.header.props}>
    {value}
    </Table.Heading>
  );
};

EasyHeaderFormatter.propTypes = {
  value: PropTypes.string.isRequired,
  column: PropTypes.object.isRequired,
};

export default EasyHeaderFormatter;
