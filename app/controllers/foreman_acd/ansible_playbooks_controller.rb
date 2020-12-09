# frozen_string_literal: true

module ForemanAcd
  # Ansible Playbook Controller
  class AnsiblePlaybooksController < ::ForemanAcd::ApplicationController
    include Foreman::Controller::AutoCompleteSearch
    include ::ForemanAcd::Concerns::AnsiblePlaybookParameters

    before_action :find_resource, :only => [:edit, :update, :destroy, :import_vars]

    def index
      @ansible_playbooks = resource_base.search_for(params[:search], :order => params[:order]).paginate(:page => params[:page])
    end

    def new
      @ansible_playbook = AnsiblePlaybook.new
    end

    def create
      @ansible_playbook = AnsiblePlaybook.new(ansible_playbook_params)
      if @ansible_playbook.save
        process_success
      else
        process_error
      end
    end

    def edit
    end

    def update
      if @ansible_playbook.update(ansible_playbook_params)
        process_success
      else
        process_error
      end
    end

    def destroy
      if @ansible_playbook.destroy
        process_success
      else
        process_error
      end
    end

    def action_permission
      case params[:action]
      when 'import_vars'
        :import_vars
      else
        super
      end
    end

    # We need to move these to a smart_proxy_acd
    def extract_variables(playbook_path)
      errors = []
      vars = {}

      unless File.directory?(playbook_path) || File.directory?("#{playbook_path}/group_vars")
        errors << "Playbook path '#{playbook_path}' or '#{playbook_path}/group_vars' doesn't exist"
        return vars, errors
      end

      everything_empty = true

      vars_files = Dir.glob("#{playbook_path}/group_vars/**/*")
      vars_files.each do |vars_file|
        loaded_yaml = {}
        next if File.directory?(vars_file)

        begin
          loaded_yaml = YAML.load_file(vars_file)
        rescue Psych::SyntaxError
          err = "#{vars_file} is not YAML file"
          logger.error(err)
          errors << err
        end
        unless loaded_yaml.is_a? Hash
          err = "Could not parse YAML file #{vars_file}"
          logger.error(err)
          errors << err
        end
        everything_empty = false unless loaded_yaml.empty?

        # We need to support: group_vars/group_file and group_vars/group_dir/yaml_files
        dir_and_file = File.split(vars_file)

        if File.basename(dir_and_file[0]) == 'group_vars' # in case of group_vars/group_file
          group_name = File.basename(dir_and_file[1], '.*')
        else # in case of group_vars/group_dir/yaml_files
          group_name = File.basename(dir_and_file[0])
        end

        logger.debug("Add ansible vars from file #{vars_file} to group #{group_name}")

        if vars.has_key?(group_name)
          vars[group_name].merge!(loaded_yaml)
        else
          vars[group_name] = loaded_yaml
        end
      end

      errors << "No ansible group variable in #{playbook_path} defined." if everything_empty

      return vars, errors
    end

    def import_vars
      logger.debug("Load ansible group vars for #{@ansible_playbook} from #{@ansible_playbook.path}")
      vars, errors = extract_variables(@ansible_playbook.path)
      @ansible_playbook.vars = vars.to_json
      @ansible_playbook.save
      if errors.empty?
        process_success :success_msg => _("Successfully loaded ansible group variables from %s") % @ansible_playbook.name, :redirect => ansible_playbooks_path
      else
        process_error :error_msg => _(errors.join(' ')), :redirect => ansible_playbooks_path
      end
    end
  end
end
