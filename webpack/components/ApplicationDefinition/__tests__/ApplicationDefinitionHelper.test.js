import { transformAnsiblePlaybook } from '../ApplicationDefinitionHelper';

describe('transformAnsiblePlaybook()', () => {
  const playbook = {
    id: 42,
    name: "Don't Panic",
  };

  it('returns empty playbook for invalid input', () => {
    expect(transformAnsiblePlaybook(playbook)).toEqual({
      id: playbook.id,
      name: playbook.name,
      groups: {},
    });
  });
});
