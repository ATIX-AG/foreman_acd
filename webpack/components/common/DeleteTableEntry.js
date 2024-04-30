import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon, Button, MessageDialog } from 'patternfly-react';
import { translate as __ } from 'foremanReact/common/I18n';

const DeleteTableEntry = ({
  hidden,
  disabled,
  onDeleteTableEntry,
  additionalData,
}) => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  if (hidden) {
    return null;
  }

  return (
    <span>
      <MessageDialog
        show={showModal}
        onHide={toggleModal}
        primaryAction={() => onDeleteTableEntry(additionalData)}
        secondaryAction={toggleModal}
        primaryActionButtonContent={__('Confirm')}
        secondaryActionButtonContent={__('Cancel')}
        title={__('Confirm action')}
        primaryContent={__('Are you sure you wish to delete this item?')}
      />
      <Button bsStyle="default" disabled={disabled} onClick={toggleModal}>
        <Icon type="pf" name="delete" title={__('Delete entry')} />
      </Button>
    </span>
  );
};

DeleteTableEntry.propTypes = {
  hidden: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  onDeleteTableEntry: PropTypes.func.isRequired,
  additionalData: PropTypes.object.isRequired,
};

export default DeleteTableEntry;
