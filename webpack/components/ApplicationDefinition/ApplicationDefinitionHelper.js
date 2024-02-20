export function transformAnsiblePlaybook(playbook) {
  const ansiblePlaybook = new Object();
  ansiblePlaybook.id = playbook.id;
  ansiblePlaybook.name = playbook.name;
  ansiblePlaybook.groups = {};

  if (playbook.hasOwnProperty('groups')) {
    Object.entries(playbook.groups).forEach(([group_name, group_vars]) => {
      ansiblePlaybook.groups[group_name] = [];

      let id = 0;
      Object.entries(group_vars).forEach(([var_name, var_value]) => {
        const entry = {
          id,
          name: var_name,
          value: var_value,
        };
        ansiblePlaybook.groups[group_name].push(entry);
        id += 1;
      });
    });
  }

  return ansiblePlaybook;
}
