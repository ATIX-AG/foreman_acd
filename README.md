# Foreman Application Centric Deployment

The target of this plugin is, to deploy whole applications which includes multiple hosts 
and a ansible playbook / saltstack state to configure the application. 

Currently, with Foreman its possible to setup a single host.
Later on, its possible to assign puppet classes, ansible roles or salt states to configure 
the services of this single host. 
If you want to run a cluster, or other complex application its often necessary to have
multiple hosts which are running different services.

Example:
To run a complex web application, a loadbalancer is required.
The loadbalancer routes the requests to 3 different web servers.
The web servers are using a database which is in high availability mode on 2 hosts.
=> 6 hosts are required.

This plugin aims to setup all 6 hosts if you deploy the application. 

## WARNING

This plugin is in development. 
Currently, only deployment of a single host works - without running a ansible playbook etc!

## Installation

See [How_to_Install_a_Plugin](http://projects.theforeman.org/projects/foreman/wiki/How_to_Install_a_Plugin)
for how to install Foreman plugins

ATM, Katello plugin need to exist, too.

## Usage

Application Definition
* Create a Application Definition (Configure -> Application Definition) first
* Select the Hostgroup you want to use. 
* Specifiy the values, a administrator could overwrite.
  (you can set a default value, if you want)

Application Instance
* Create a Application Instance (Configure -> Application Instrane) 
* Select the Application Definition which should be used
* Set the values.
  Remember, all parameters need to have a value. 
* Save the Application Instance
* To Deploy the host, select "Deploy" in the Action selection dropdown field
  on the Application Instance index site

## TODO

- Add ansible playbook / saltstack support to configure the applicatin
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

