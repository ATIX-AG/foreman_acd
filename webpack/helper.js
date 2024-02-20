import React from 'react';
import { Table } from 'patternfly-react';

// Some small helper methods

function arrayToObject(arr, id, value) {
  const rv = {};
  for (let i = 0; i < arr.length; ++i) rv[arr[i][id]] = arr[i][value];
  return rv;
}

function arrayToObjectObj(arr, id) {
  const rv = {};
  for (let i = 0; i < arr.length; ++i) rv[arr[i][id]] = arr[i];
  return rv;
}

function shortHostname(fqdn) {
  return fqdn.split('.')[0];
}

function EasyHeaderFormatter(value, { column }) {
  return (
    <Table.Heading aria-label={column.header.label} {...column.header.props}>
      {value}
    </Table.Heading>
  );
}

function supportedPluginsToHiddenParameterTypes(supportedPlugins) {
  const hiddenParameterTypes = [];

  if (supportedPlugins.puppet == false) {
    hiddenParameterTypes.push('puppetenv');
  }

  if (supportedPlugins.katello == false) {
    hiddenParameterTypes.push('lifecycleenv');
  }

  return hiddenParameterTypes;
}

export {
  arrayToObject,
  arrayToObjectObj,
  shortHostname,
  EasyHeaderFormatter,
  supportedPluginsToHiddenParameterTypes,
};
