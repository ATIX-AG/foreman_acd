export const newDefinition = {
  mode: "newDefinition",
  serviceDefinition: {
    id: 1,
    name: "Test123",
    hostgroup_id: 1
  },
};
export const editDefinition = {
  mode: "editDefinition",
  serviceDefinition: {
    id: 1,
    name: "Test123",
    hostgroup_id: 1
  },
  parameters: [
    {
      id: 1,
      name: "PuppetEnv",
      description: "",
      type: "puppetenv",
      value: "2"
    },
    {
      id: 2,
      name: "PW",
      description: "",
      type: "password",
      value: "rooot"
    },
    {
      id: 3,
      name: "Blub",
      description: "",
      type: "hostparam",
      value: "awesome"
    },
    {
      id: 4,
      name: "111allo",
      description: "",
      type: "ip",
      value: "1.1.1.1"
    },
    {
      id: 5,
      name: "1111aasdfasf",
      description: "",
      type: "hostname",
      value: "dername"
    },
    {
      id: 6,
      name: "222nocheiner",
      description: "",
      type: "hostparam",
      value: ""
    },
    {
      id: 7,
      name: "aaaaa",
      description: "aa",
      type: "ptable",
      value: ""
    },
    {
      id: 8,
      name: "aaa",
      description: "",
      type: "hostparam",
      value: "2134234"
    }
  ]
};

export const newInstance = {
  mode: "newInstance",
  applications: {
    "1": "Test123",
    "2": "sowasvonneu"
  },
  serviceDefinition: {
    id: 1,
    name: "Test123",
    hostgroup_id: 1
  },
};
export const editInstance = {
  mode: "editInstance",
  serviceDefinition: {
    id: 1,
    name: "Test123",
    hostgroup_id: 1
  },
  parameters: [
    {
      id: 1,
      name: "PuppetEnv",
      description: "",
      type: "puppetenv",
      value: "2"
    },
    {
      id: 2,
      name: "PW",
      description: "",
      type: "password",
      value: "rooot"
    },
    {
      id: 3,
      name: "Blub",
      description: "",
      type: "hostparam",
      value: "awesome"
    },
    {
      id: 4,
      name: "111allo",
      description: "",
      type: "ip",
      value: "1.1.1.1"
    },
    {
      id: 5,
      name: "1111aasdfasf",
      description: "",
      type: "hostname",
      value: "dername"
    },
    {
      id: 6,
      name: "222nocheiner",
      description: "",
      type: "hostparam",
      value: "adfasdf"
    },
    {
      id: 7,
      name: "aaaaa",
      description: "aa",
      type: "ptable",
      value: "104"
    },
    {
      id: 8,
      name: "aaa",
      description: "",
      type: "hostparam",
      value: "2134234"
    }
  ]
};
