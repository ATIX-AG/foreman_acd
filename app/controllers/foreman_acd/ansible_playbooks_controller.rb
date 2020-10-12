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
      vars_files = Dir.glob("#{playbook_path}/group_vars/**/*")
      vars_files.each do |vars_file|
        loaded_yaml = {}
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
        basename = File.basename(vars_file, '.*')
        vars[basename] = loaded_yaml
      end
      return vars, errors
    end

    def import_vars
      logger.debug("Load ansible group vars for #{@ansible_playbook} from #{@ansible_playbook.path}")
      vars, errors = extract_variables(@ansible_playbook.path)
      @ansible_playbook.vars = vars.to_json
      @ansible_playbook.save
      if errors.empty?
        process_success :success_msg => _("Successfully loaded ansible variables from %s") % @ansible_playbook.name, :redirect => ansible_playbooks_path
      else
        process_error :error_msg => _(errors.join(' ')), :redirect => ansible_playbooks_path
      end
    end
  end
end
