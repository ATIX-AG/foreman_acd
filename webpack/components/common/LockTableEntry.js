import React from 'react';
import PropTypes from 'prop-types';
import {
  Icon,
  Button,
} from 'patternfly-react';

const LockTableEntry = ({
  hidden,
  disabled,
  onLockTableEntry,
  additionalData,
}) =>{
  if (hidden) {
    return null;
  }

  let lockButton;
  let lockButtonTitle;

  if (additionalData.rowData.locked === true) {
    lockButton = 'locked';

    if (disabled === true) {
      lockButtonTitle = 'this entry is locked';
    } else {
      lockButtonTitle = 'unlock this entry';
    }
  } else {
    lockButton = 'unlocked';

    if (disabled === true) {
      lockButtonTitle = 'this entry is unlocked';
    } else {
      lockButtonTitle = 'lock this entry';
    }
  }

  return (
    <span>
      <Button
        bsStyle="default"
        disabled={disabled}
        onClick={() => onLockTableEntry(additionalData) }
      >
        <Icon type="pf" name={lockButton} title={lockButtonTitle} />
      </Button>
    </span>
  );
};

LockTableEntry.propTypes = {
  hidden: PropTypes.bool,
  disabled: PropTypes.bool.isRequired,
  onLockTableEntry: PropTypes.func.isRequired,
  additionalData: PropTypes.object.isRequired,
};

export default LockTableEntry;
