import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Button } from 'patternfly-react';

const AddTableEntry = ({ hidden, disabled, onAddTableEntry }) => {
  if (hidden) {
    return null;
  }

  return (
    <Button bsStyle="default" disabled={disabled} onClick={onAddTableEntry}>
      <Icon type="fa" name="plus" />
    </Button>
  );
};

AddTableEntry.propTypes = {
  hidden: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  onAddTableEntry: PropTypes.func.isRequired,
};

export default AddTableEntry;
