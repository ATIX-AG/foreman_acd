# frozen_string_literal: true

module ForemanAcd
  # Ansible Playbook Controller
  class AnsiblePlaybooksController < ::ForemanAcd::ApplicationController
    include Foreman::Controller::AutoCompleteSearch
    include ::ForemanAcd::Concerns::AnsiblePlaybookParameters

    before_action :find_resource, :only => [:edit, :update, :destroy, :import_vars]
    after_action :delete_synced_repo, :only => [:new, :edit, :create, :update, :destroy, :index]

    def index
      @ansible_playbooks = resource_base.search_for(params[:search], :order => params[:order]).paginate(:page => params[:page])
    end

    def new
      @ansible_playbook = AnsiblePlaybook.new
    end

    def create
      @ansible_playbook = AnsiblePlaybook.new(ansible_playbook_params)
      if session[:git_path]
        @ansible_playbook.update(:path => ansible_playbook_full_path(ansible_playbook_rename(@ansible_playbook[:name])))
        FileUtils.mv(session[:git_path], @ansible_playbook[:path])
        session[:git_path] = nil
      end
      if @ansible_playbook.save
        process_success :success_msg => _("Successfully created %s. You need to press the \"Import groups\" button
                                           before this ansible playbook can be used in App Definitions!") % @ansible_playbook
      else
        process_error
      end
    end

    def edit; end

    def update
      # Move synced repo to new path if ansible_playbook name is changed
      if !session[:git_path].nil? && ansible_playbook_params[:name] != @ansible_playbook[:name]
        FileUtils.mv(@ansible_playbook[:path], ansible_playbook_full_path(ansible_playbook_rename(ansible_playbook_params[:name])))
        @ansible_playbook.update(:path => ansible_playbook_full_path(ansible_playbook_rename(ansible_playbook_params[:name])))
        session[:git_path] = nil

      # Remove old version and copy new version of synced repository
      elsif !session[:git_path].nil? && ansible_playbook_params[:name] == @ansible_playbook.name
        remove_ansible_dir(@ansible_playbook[:path]) if @ansible_playbook.path
        @ansible_playbook.update(:path => ansible_playbook_full_path(ansible_playbook_rename(@ansible_playbook[:name])))
        FileUtils.mv(session[:git_path], @ansible_playbook[:path])
        session[:git_path] = nil
      end

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

    def sync_git_repo
      @ansible_playbook = AnsiblePlaybook.new
      sync_params = params[:ansible_playbook]
      dir = Dir.mktmpdir

      begin
        git = Git.init(dir)

        if ForemanAcd.proxy_setting.present?
          git.config('http.proxy', ForemanAcd.proxy_setting)
          logger.info("HTTP Proxy used: #{git.config['http.proxy']}")
        end

        git.add_remote('origin', sync_params[:git_url])
        commit = Git.ls_remote(sync_params[:git_url])['head'][:sha]
        git.fetch
        git.checkout(sync_params[:git_commit] != '' ? sync_params['git_commit'] : commit)

        session[:git_path] = git.dir.path
      rescue StandardError => e
        logger.error("Failed to sync git repository: #{e}")
        render :json => { :status => 'error', :message => e }, :status => :internal_server_error
      end
    end

    # Remove abandoned synced git repositories
    def delete_synced_repo
      names = []
      AnsiblePlaybook.all.each do |ansible_playbook|
        names.push(ansible_playbook_rename(ansible_playbook.name))
      end
      names.push('.', '..')
      return unless Dir.exist?(ForemanAcd.ansible_playbook_path)
      Dir.foreach(ForemanAcd.ansible_playbook_path) do |dirname|
        next if names.include? dirname
        remove_ansible_dir(ansible_playbook_full_path(dirname))
        logger.info("Successfully removed #{dirname}")
      end
    end

    def action_permission
      case params[:action]
      when 'import_vars'
        :import_vars
      when 'sync_git_repo'
        :sync_git_repo
      when 'grab'
        :grab
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

        group_name = if File.basename(dir_and_file[0]) == 'group_vars' # in case of group_vars/group_file
                       File.basename(dir_and_file[1], '.*')
                     else # in case of group_vars/group_dir/yaml_files
                       File.basename(dir_and_file[0])
                     end

        logger.debug("Add ansible vars from file #{vars_file} to group #{group_name}")

        if vars.key?(group_name)
          vars[group_name].merge!(loaded_yaml)
        else
          vars[group_name] = loaded_yaml
        end
      end

      errors << "No ansible group variable in #{playbook_path} defined." if everything_empty

      [vars, errors]
    end

    def import_vars
      logger.debug("Load ansible group vars for #{@ansible_playbook} from #{@ansible_playbook.path}")
      vars, errors = extract_variables(@ansible_playbook.path)
      @ansible_playbook.vars = vars.to_json
      @ansible_playbook.save
      if errors.empty?
        process_success :success_msg => _('Successfully loaded ansible group variables from %s') % @ansible_playbook.name, :redirect => ansible_playbooks_path
      else
        process_error :error_msg => _(errors.join(' ')), :redirect => ansible_playbooks_path
      end
    end

    private

    def ansible_playbook_rename(name)
      name.split(/\W+/).join('_')
    end

    def remove_ansible_dir(dirpath)
      FileUtils.remove_dir(dirpath) if Dir.exist?(dirpath)
    end

    def ansible_playbook_full_path(dirname)
      File.join(ForemanAcd.ansible_playbook_path, dirname)
    end
  end
end
