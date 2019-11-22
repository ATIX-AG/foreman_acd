# Foreman Application Centric Deployment

A plugin to bring an user self service portal and application centric deployment to Foreman.

# Description

The target of this plugin is, to deploy whole applications which include multiple hosts 
and an Ansible Playbook / saltstack state to configure the application. 

This plugin follows the idea of different user types working together.
The administrative user creates application definitions including multiple servers and
configuration management items (Ansible Playbook, saltstack state).
The user can create and deploy new application instances with an easy to use self service portal. 

*Example Application Definition:*
To run a complex web application, a loadbalancer is required.
The loadbalancer routes the requests to 3 different web servers.
The web servers are using a database which is in high availability mode on 2 hosts.
=> 6 hosts are required.

This plugin aims to setup all 6 hosts and to deploy the application.

# Current State
In the current state the plugin can be used to provide an easy to use self service user portal 
to deploy new servers. 

# Road Map
- Self service portal for single host deployments (current version)
- Add application deployment with single host requirements 
- Add application deployment with multi host requirements 

## WARNING

This plugin is in development. 
In the current state, a self service portal to deploy single servers can be created.

## Installation

See [How_to_Install_a_Plugin](http://projects.theforeman.org/projects/foreman/wiki/How_to_Install_a_Plugin)
for how to install Foreman plugins

ATM, Katello plugin need to exist, too.

## Usage

Application Definition (Admin)
* Create an Application Definition (Configure -> Application Definition) first
* Select the Hostgroup you want to use. 
* Specifiy the values, a user could overwrite.
  (you can set a default value, if you want)

Application Instance (User)
* Create an Application Instance (Configure -> Application Instrane) 
* Select the Application Definition which should be used
* Set the values.
  Remember, all parameters need to have a value. 
* Save the Application Instance
* To Deploy the host, select "Deploy" in the Action selection dropdown field
  on the Application Instance index site

## TODO

- Add ansible playbook / saltstack support to configure the application
- Multi-host support
- Add validation to the different parameter types

## Contributing

Fork and send a Pull Request. Thanks!

## Copyright

Copyright (c) 2019 ATIX AG 

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

