export const applicationInstanceConfData_1 = {
  name: false,
  error: {
    errorMsg: '',
    status: '',
    statusText: '',
  },
  loading: false,
  columns: [
    {
      property: 'hostname',
      header: {
        label: 'Hostname',
        formatters: [null],
        props: {
          index: 0,
          style: {
            width: '30%',
          },
        },
      },
      cell: {
        formatters: [null],
      },
    },
    {
      property: 'description',
      header: {
        label: 'Description',
        formatters: [null],
        props: {
          index: 1,
          style: {
            width: '30%',
          },
        },
      },
      cell: {
        formatters: [null],
      },
    },
    {
      property: 'service',
      header: {
        label: 'Service',
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
    {
      property: 'actions',
      header: {
        label: 'Actions',
        formatters: [null],
        props: {
          index: 4,
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
  appDefinition: {
    id: 1,
    name: 'LAMP',
    description: '',
    services:
      '[{"id":1,"name":"web","description":"","hostgroup":"1","ansibleGroup":"webservers","minCount":"2","maxCount":"","foremanParameters":[{"id":1,"locked":false,"name":"CP","description":"","type":"computeprofile","value":"1"},{"id":2,"locked":true,"name":"LE","description":"","type":"lifecycleenv","value":"1"}],"ansibleParameters":[{"id":0,"name":"dummy_var","value":"0"}]},{"id":2,"name":"db","description":"","hostgroup":"1","ansibleGroup":"dbservers","minCount":"1","maxCount":"","foremanParameters":[],"ansibleParameters":[{"id":0,"name":"mysqlservice","value":"mysqld"},{"id":1,"name":"mysql_port","value":"3306","locked":true},{"id":2,"name":"dbuser","value":"webapp"},{"id":3,"name":"dbname","value":"ANSAP01"},{"id":4,"name":"upassword","value":"Bond@007"},{"id":5,"name":"masterpassword","value":"MySQL@007"}]}]',
    ansible_vars_all:
      '[{"id":0,"name":"repository","value":"https://github.com/bennojoy/mywebapp.git"}]',
    location_ids: [2],
    organization_ids: [1],
    created_at: '2021-03-11 12:51:34 +0100',
    updated_at: '2021-03-13 00:06:12 +0100',
  },
  hosts: [
    {
      id: 4,
      hostname: 'great-web-app-db-1',
      service: '2',
      description: '',
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
    {
      id: 1,
      hostname: 'great-web-app-web-1',
      service: '1',
      description: '',
      foremanParameters: [],
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
      hostname: 'great-web-app-web-2',
      service: '1',
      description: '',
      foremanParameters: [],
      ansibleParameters: [
        {
          id: 0,
          name: 'dummy_var',
          value: '0',
        },
      ],
    },
  ],
  ansibleVarsAll: [
    {
      id: 0,
      name: 'repository',
      value: 'https://github.com/bennojoy/mywebapp.git',
    },
  ],
  services: [
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
      currentCount: 2,
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
      currentCount: 1,
    },
  ],
};
