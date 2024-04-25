export function transformAnsiblePlaybook(playbook) {
  const ansiblePlaybook = {
    id: playbook.id,
    name: playbook.name,
    groups: {},
  };

  if (playbook.hasOwnProperty('groups')) {
    Object.entries(playbook.groups).forEach(([groupName, groupVars]) => {
      ansiblePlaybook.groups[groupName] = [];

      let id = 0;
      Object.entries(groupVars).forEach(([varName, varValue]) => {
        const entry = {
          id,
          name: varName,
          value: varValue,
        };
        ansiblePlaybook.groups[groupName].push(entry);
        id += 1;
      });
    });
  }

  return ansiblePlaybook;
}
