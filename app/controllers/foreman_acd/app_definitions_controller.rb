# frozen_string_literal: true

module ForemanAcd
  # Application Definition Controller
  class AppDefinitionsController < ::ForemanAcd::ApplicationController
    include Foreman::Controller::AutoCompleteSearch
    include ::ForemanAcd::Concerns::AppDefinitionParameters

    before_action :find_resource, :only => [:edit, :update, :destroy, :export]
    before_action :read_hostgroups, :only => [:edit, :new, :import]
    before_action :read_ansible_playbooks, :only => [:edit, :new]
    before_action :assign_ansible_playbook, :only => [:create]

    def index
      @app_definitions = resource_base.search_for(params[:search], :order => params[:order]).paginate(:page => params[:page])
    end

    def read_ansible_playbooks
      # Only use ansible playbooks for which the user pressed import group vars once.
      @ansible_playbooks = AnsiblePlaybook.where.not(:vars => nil).map { |elem| { elem.id => elem.name } }.reduce({}) { |h, v| h.merge v }
    end

    def read_hostgroups
      @hostgroups = Hostgroup.all.map { |elem| { elem.id => elem.name } }.reduce({}) { |h, v| h.merge v }
    end

    def new
      @app_definition = AppDefinition.new
    end

    def create
      @app_definition = AppDefinition.new(app_definition_params)
      begin
        if @app_definition.save!
          process_success
        else
          process_error
        end
      rescue StandardError, ValidationError => e
        if params[:foreman_acd_app_definition_import].present?
          AnsiblePlaybook.find(params[:foreman_acd_app_definition][:acd_ansible_playbook_id]).delete if params[:foreman_acd_app_definition][:acd_ansible_playbook_id].present?
        end
        redirect_to new_app_definition_path, :flash => { :error => _(e.message) }
      end
    end

    def edit; end

    def update
      if @app_definition.update(app_definition_params)
        process_success
      else
        process_error
      end
    end

    def destroy
      if @app_definition.destroy
        process_success
      else
        process_error
      end
    end

    def action_permission
      case params[:action]
      when 'export'
        :export
      when 'import'
        :import
      else
        super
      end
    end

    def import
      @app_definition = AppDefinition.new
    end

    def export
      dir_path = "#{Dir.mktmpdir}/#{@app_definition.name}.tar"
      `tar -cvf "#{dir_path}" "#{@app_definition.ansible_playbook.path}" #{export_app_template_data.path}`
      logger.info("Successfully created application template tar file for #{@app_definition.name}")
      send_file dir_path
    rescue StandardError => e
      logger.info("Export of #{@app_definition.name} failed with the error: #{e}")
      redirect_to app_definitions_path, :flash => { :error => _(e.message) }
    end

    def handle_file_upload
      return unless params[:app_definition_file] && (raw_directory = params[:app_definition_file])
      begin
        dir = Dir.mktmpdir
        untar_import_directory(raw_directory, dir)
        ansible_file = Dir.glob("#{dir}/tmp/*.yaml")
        data = JSON.parse(YAML.load_file(ansible_file[0]).to_json) if ansible_file
        ansible_playbook_import = data.find { |d| d if d['ansible_playbook'] }

        session[:ansible_playbook_params] = { :dir => dir, :ansible_playbook => ansible_playbook_import['ansible_playbook'] }
        render :json => { :ansible_services => create_ansible_services(data, ansible_playbook_import) }, :status => :ok
      rescue StandardError => e
        render :json => { :status => 'error', :message => e }, :status => :internal_server_error
      end
    end

    private

    def export_app_template_data
      file = Tempfile.open([@app_definition.name, '.yaml'])
      data = JSON.parse(@app_definition.services).append(:ansible_playbook => @app_definition.ansible_playbook.attributes.except('id', 'created_at', 'updated_at').as_json).to_yaml
      file.write(data)
      file.close
      logger.info("Successfully created yaml file for app_template data: #{file.path}")
      file
    rescue StandardError => e
      logger.info("Creation of app template data failed: #{e}")
      redirect_to app_definitions_path, :flash => { :error => _(e.message) }
    end

    def rename_path_name(dir_path)
      return dir_path unless Dir.exist?(dir_path)
      ind = 1
      loop do
        path = dir_path
        path += ind.to_s
        return path unless Dir.exist?(path)
        ind += 1
      end
    end

    def create_ansible_playbook(dir, ansible_playbook, dir_path)
      FileUtils.cp_r "#{dir}/#{ansible_playbook['path']}/.", dir_path
      ansible_playbook['path'] = dir_path
      ansible_playbook['name'] = File.basename(dir_path)
      new_playbook = AnsiblePlaybook.create(ansible_playbook)
      new_playbook
    rescue StandardError => e
      logger.info("Error while creating AnsiblePlaybook: #{e}")
    end

    def create_ansible_services(data, ansible_playbook_import)
      ansible_services = []
      session[:data_services] = data - [ansible_playbook_import]
      session[:data_services].each do |d|
        ansible_services.append({ :id => d['id'], :value => d['name'] })
      end
      ansible_services
    end

    def untar_import_directory(directory, dir)
      `tar -xvf  #{directory.path} -C #{dir}`
    rescue StandardError => e
      logger.info("Failed to untar imported directory: #{e}")
    end

    def assign_ansible_playbook
      return unless params[:foreman_acd_app_definition_import]
      dir_path = "#{ForemanAcd.ansible_playbook_path}/#{session[:ansible_playbook_params][:ansible_playbook]['name'].split(/\W+/).join('_')}"

      # Append path and name of ansible with n + 1 if ansible_playbook with same name or name[n] exists
      ansible_playbook = create_ansible_playbook(session[:ansible_playbook_params][:dir], session[:ansible_playbook_params][:ansible_playbook], rename_path_name(dir_path))
      params[:foreman_acd_app_definition][:acd_ansible_playbook_id] = ansible_playbook.id

      begin
        services = JSON.parse(params[:foreman_acd_app_definition_import][:services])
        flag = 0
        session[:data_services].each do |d|
          hostgroup = services.find { |service| service['name'] == d['name'] }['hostgroup']
          if hostgroup == ''
            flag += 1
            break
          else
            d['hostgroup'] = hostgroup
          end
        end
        params[:foreman_acd_app_definition][:services] = session[:data_services].to_json
      rescue StandardError => e
        redirect_to({ :action => 'import' }, :error => _("Hostgroups are not configured properly: #{e}"))
      else
        redirect_to({ :action => 'import' }, :error => _('Some services are not assigned Hostgroups')) if flag.positive?
      end
      session[:data_services] = nil
    end
  end
end
