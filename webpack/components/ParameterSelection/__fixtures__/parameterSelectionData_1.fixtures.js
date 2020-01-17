export const parameterSelectionData_1 = {
  editMode: false,
  error: {
    errorMsg: '',
    status: '',
    statusText: ''
  },
  foremanData: {
    hostgroup_id: 1,
    environments: [
      {
        id: 1,
        name: 'production'
      },
      {
        id: 2,
        name: 'test'
      }
    ],
    lifecycle_environments: [],
    domains: [],
    computeprofiles: [],
    ptables: [
      {
        id: 105,
        name: 'Kickstart default'
      },
      {
        id: 104,
        name: 'Kickstart default thin'
      }
    ]
  },
  hostgroupId: 1,
  loading: false,
  sortingColumns: {
    name: {
      direction: 'asc',
      position: 0
    }
  },
  appDefinition: {
    id: 1,
    name: 'Test123',
    hostgroup_id: 1
  },
  columns: [
    {
      property: 'name',
      header: {
        label: 'Name',
        props: {
          index: 0,
          sort: true,
          style: {
            width: '20%'
          }
        },
      },
    },
    {
      property: 'description',
      header: {
        label: 'Description',
        props: {
          index: 1,
          sort: true,
          style: {
            width: '25%'
          }
        },
      },
      cell: {
        props: {
          index: 1
        },
      }
    },
    {
      property: 'type',
      header: {
        label: 'Type',
        props: {
          index: 2,
          sort: true,
          style: {
            width: '20%'
          }
        },
      },
      cell: {
        props: {
          index: 2
        },
      }
    },
    {
      property: 'value',
      header: {
        label: 'Default value',
        props: {
          index: 3,
          sort: true,
          style: {
            width: '25%'
          }
        },
      },
      cell: {
        props: {
          index: 3
        },
      }
    },
    {
      property: 'actions',
      header: {
        label: 'Actions',
        props: {
          index: 4
        },
      },
      cell: {
        props: {
          index: 4
        },
      }
    }
  ],
  parameters: [
    {
      id: 1,
      name: 'PuppetEnv',
      description: '',
      type: 'puppetenv',
      value: '2'
    },
    {
      id: 2,
      name: 'PW',
      description: '',
      type: 'password',
      value: 'rooot'
    },
    {
      id: 3,
      name: 'Blub',
      description: '',
      type: 'hostparam',
      value: 'awesome'
    },
    {
      id: 4,
      name: '111allo',
      description: '',
      type: 'ip',
      value: '1.1.1.1'
    },
    {
      id: 5,
      name: '1111aasdfasf',
      description: '',
      type: 'hostname',
      value: 'dername'
    },
    {
      id: 6,
      name: '222nocheiner',
      description: '',
      type: 'hostparam',
      value: ''
    },
    {
      id: 7,
      name: 'aaaaa',
      description: 'aa',
      type: 'ptable',
      value: ''
    },
    {
      id: 8,
      name: 'aaa',
      description: '',
      type: 'hostparam',
      value: '2134234'
    }
  ],
  parameterTypes: {
    computeprofile: 'Compute profile',
    domain: 'Domain',
    hostparam: 'Host parameter',
    lifecycleenv: 'Lifecycle environment'
  }
};
