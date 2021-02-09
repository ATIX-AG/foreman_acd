[![Build Status master](https://travis-ci.org/ATIX-AG/foreman_acd.svg?branch=master)](https://travis-ci.org/ATIX-AG/foreman_acd)

# Foreman Application Centric Deployment

A plugin to bring an user self service portal and application centric deployment to Foreman.


# Description

The target of this plugin is, to deploy whole applications which include multiple hosts and 
configure them using an Ansible Playbook / saltstack state.

This plugin follows the idea of different user types working together.
The administrative user creates Application Definition including multiple servers and
configuration management items (Ansible Playbook, saltstack state).
The user can create and deploy new Application Instaces with an easy to use self service portal. 

*Example Application Definition:* To run a complex web application, a loadbalancer is required.
The loadbalancer routes the requests to 3 different web servers.
The web servers are using a database which is in high availability mode on 2 hosts.
=> 6 hosts are required.

This plugin aims to setup all 6 hosts and to deploy the application.


# Current State

## Ansible Playbooks

- Specifiy the path to the ansible playbook and playfile
- Read groups configured in the ansible playbook

## Application Definition

- Use the configured ansible playbook in a Application Definition
- Overwrite ansible playbook's group variables for the Application Definition
- Set foreman parameters in the Application Definition
- Setup various services like webservers, database-servers, etc.

## Application Instance

- Use an Application Definition for your Application Instance
- Configure specific hosts which uses the Application Definitions services
- Deploy these hosts
- Configure the hosts using the configured ansible playbook

# How it works

- Configure ansible playbook, application definition and create an instance.
- If you deploy the application instance, all hosts are created.
- When done, you can configure the hosts with the linked ansible-playbook.
- To do so, the [Smart Proxy ACD](https://github.com/ATIX-AG/smart_proxy_acd) is used.
- The job to configure the hosts will be send to the Smart Proxy ACD which will
    - download the ansible playbook from foreman (provided by an foreman_acd API)
    - extract the ansible playbook on the Smart Proxy
    - run the ansible-playbook on the Smart Proxy
- On the Monitor -> Job page you see the output of the ansible-playbook run.


## WARNING

This plugin is in development. 

## Installation

See [How_to_Install_a_Plugin](https://theforeman.org/plugins/#2.Installation)
for how to install Foreman plugins. 

### TL;DR: 

    yum install tfm-rubygem-foreman_acd
    foreman-maintain service restart

In some cases you need to do manally

    foreman-rake db:migrate
    foreman-rake db:seed

### Smart Proxy installation

You will need to install [Smart Proxy ACD](https://github.com/ATIX-AG/smart_proxy_acd), too. 

    yum install tfm-rubygem-smart_proxy_acd tfm-rubygem-smart_proxy_acd_core
    foreman-maintain service restart

After the installation of the smart proxy acd components, you need to refresh the smart proxy features in
Infrastructure > Smart Proxies > Your Smart-Proxy > Actions > Refresh


### Hints

* Katello plugin need to exist, too.
* Make sure the Job Template 'Run ACD Ansible Playbook - ACD Default' is in your organization / location.

## Usage

**Important:** Use /etc/foreman/plugins/foreman_acd/ansible-playbooks/ to 
store the ansible-playbooks. Otherwise SELinux may deny the access to it.

### Ansible Playbook

* Copy (or checkout a git repository) a ansible-playbook. Store them in 
  /etc/foreman/plugins/foreman_acd/ansible-playbooks/ so that SELinux is able to read it.
* Add a new Ansible Playbook via Configure -> Ansible Playbook
* Set the path to the ansible-playbook and name the playbook file. (e.g. site.yml)
* Save it and press "Import group variables" for this newly created ansible playbook.

### Application Definition (Admin)

* Create an Application Definition (Configure -> Application Definition) first
* Select the Ansible Playbook you want to use. 
* Add new services and specifiy the host group you want to use.
* Specifiy the values, a user could overwrite.
  (you can set a default value, if you want)

### Application Instance (User)

* Create an Application Instance (Configure -> Application Instance) 
* Select the Application Definition which should be used
* Set the values.
  Remember, all parameters need to have a value. 
* Save the Application Instance

### Deploy & Configure the Application Instance (User)

* To Deploy the host, select "Deploy" in the action selection dropdown field
  on the Application Instance index site.
* See if the hosts are deployed via action selection dropdown -> report.
* After all hosts are deployed, run the ansible playbook via 
  action selection dropdown -> Run ansible playbook


## TODO

- "git" support for the ansible playbooks
- Provide application templates which contains application definition and 
  the required ansible-playbook.
- Add saltstack support to configure the application
- More parameter / value validation


## Contributing

Fork and send a Pull Request. Thanks!

## Copyright

Copyright (c) 2021 ATIX AG 

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
