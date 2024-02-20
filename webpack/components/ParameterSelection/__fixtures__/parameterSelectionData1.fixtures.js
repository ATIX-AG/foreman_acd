export const parameterSelectionData1 = {
  editMode: false,
  error: {
    errorMsg: '',
    status: '',
    statusText: '',
  },
  paramData: {
    hostgroup_id: 1,
    environments: [
      {
        id: 1,
        name: 'production',
      },
    ],
    lifecycle_environments: [
      {
        id: 1,
        name: 'Library',
      },
    ],
    domains: [
      {
        id: 1,
        name: 'deploy3.dev.atix',
      },
    ],
    computeprofiles: [
      {
        id: 1,
        name: '1-Small',
      },
      {
        id: 2,
        name: '2-Medium',
      },
      {
        id: 3,
        name: '3-Large',
      },
      {
        id: 4,
        name: 'Orchahosts-VM',
      },
    ],
    ptables: [
      {
        id: 125,
        name: 'Kickstart default',
      },
    ],
    dataType: 'PARAMETER_SELECTION_PARAM_TYPE_FOREMAN',
  },
  hostgroupId: 1,
  loading: false,
  sortingColumns: {
    name: {
      direction: 'asc',
      position: 0,
    },
  },
  paramDefinition: {
    id: 1,
    name: 'web',
    dataId: '1',
  },
  columns: [
    {
      property: 'name',
      header: {
        label: 'Name',
        props: {
          sort: true,
          style: {
            width: '25%',
          },
          index: 0,
        },
        transforms: [null],
        formatters: [null],
        customFormatters: [null],
      },
      cell: {
        formatters: [null],
      },
    },
    {
      property: 'description',
      header: {
        label: 'Description',
        props: {
          sort: true,
          style: {
            width: '25%',
          },
          index: 1,
        },
        transforms: [null],
        formatters: [null],
        customFormatters: [null],
      },
      cell: {
        props: {
          index: 1,
        },
        formatters: [null],
      },
    },
    {
      property: 'type',
      header: {
        label: 'Type',
        props: {
          sort: true,
          style: {
            width: '20%',
          },
          index: 2,
        },
        transforms: [null],
        formatters: [null],
        customFormatters: [null],
      },
      cell: {
        formatters: [null],
      },
    },
    {
      property: 'value',
      header: {
        label: 'Default value',
        props: {
          sort: true,
          style: {
            width: '20%',
          },
          index: 3,
        },
        transforms: [null],
        formatters: [null],
        customFormatters: [null],
      },
      cell: {
        formatters: [null],
      },
    },
    {
      property: 'actions',
      header: {
        label: 'Actions',
        props: {
          style: {
            width: '10%',
          },
          index: 4,
        },
        formatters: [null],
      },
      cell: {
        formatters: [null],
      },
    },
  ],
  parameters: [
    {
      id: 1,
      locked: false,
      name: 'CP',
      description: '',
      type: 'computeprofile',
      value: '1',
    },
    {
      id: 2,
      locked: true,
      name: 'LE',
      description: '',
      type: 'lifecycleenv',
      value: '1',
    },
  ],
  allowedParameterTypes: {
    domain: 'Domain',
    hostparam: 'Host parameter',
    ip: 'IP',
    ptable: 'Partition table',
    puppetenv: 'Puppet environment',
  },
  parameterTypes: {
    domain: 'Domain',
    hostparam: 'Host parameter',
    ip: 'IP',
    ptable: 'Partition table',
    puppetenv: 'Puppet environment',
    password: 'Root password',
  },
};
