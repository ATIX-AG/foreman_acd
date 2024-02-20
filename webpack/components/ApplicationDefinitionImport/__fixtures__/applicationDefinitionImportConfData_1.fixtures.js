export const applicationDefinitionImportConfData_1 = {
  name: false,
  error: {
    errorMsg: '',
    status: '',
    statusText: '',
  },
  columns: [
    {
      property: 'name',
      header: {
        label: 'Service name',
        formatters: [null],
        props: {
          index: 3,
          style: {
            width: '20%',
          },
        },
      },
      cell: {
        formatters: [null],
      },
    },
    {
      property: 'hostgroup',
      header: {
        label: 'Hostgroup',
        formatters: [null],
        props: {
          index: 2,
          style: {
            width: '20%',
          },
        },
      },
      cell: {
        formatters: [null],
      },
    },
  ],
  ansiblePlaybookServices: [
    {
      id: 1,
      name: 'web',
      description: '',
      hostgroup: '1',
      ansibleGroup: 'webservers',
      minCount: '2',
      maxCount: '',
      foremanParameters: [
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
      ansibleParameters: [
        {
          id: 0,
          name: 'dummy_var',
          value: '0',
        },
      ],
    },
    {
      id: 2,
      name: 'db',
      description: '',
      hostgroup: '1',
      ansibleGroup: 'dbservers',
      minCount: '1',
      maxCount: '',
      foremanParameters: [],
      ansibleParameters: [
        {
          id: 0,
          name: 'mysqlservice',
          value: 'mysqld',
        },
        {
          id: 1,
          name: 'mysql_port',
          value: '3306',
          locked: true,
        },
        {
          id: 2,
          name: 'dbuser',
          value: 'webapp',
        },
        {
          id: 3,
          name: 'dbname',
          value: 'ANSAP01',
        },
        {
          id: 4,
          name: 'upassword',
          value: 'Bond@007',
        },
        {
          id: 5,
          name: 'masterpassword',
          value: 'MySQL@007',
        },
      ],
    },
  ],
};
