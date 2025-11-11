# Foreman Application Centric Deployment

A Foreman plugin providing application centric deployment and a self-service portal.

# Introduction

The target of this plugin is to deploy whole applications which include multiple hosts and configure them using an Ansible playbook.

This plugin follows the idea of different user types working together.
The _administrative user_ creates Application Definitions including multiple servers and configuration management items (Ansible Playbooks).
The _user_ can create and deploy new Application Instances with an easy to use self-service portal.

*Example Application Definition*
To run a complex web application, a load balancer is required.
The load balancer routes the requests to three different web servers.
The web servers are using a database which runs in high availability mode on two hosts.
Therefore, six hosts in total are required.

This plugin aims to setup all six hosts and to deploy the application.

# Architecture

## Ansible Playbooks

* Specify the path on your Foreman server to the Ansible playbook and playfile
* Read groups configured in the Ansible playbook

## Application Definitions

* Use the configured Ansible playbook in an Application Definition
* Overwrite group variables of the Ansible playbook for the Application Definition
* Set Foreman parameters in the Application Definition
* Setup various services like web servers, database servers, etc.

## Application Instances

* Use an Application Definition for your Application Instance
* Configure specific hosts which use the Application Definition's services
* Deploy these hosts
* Configure the hosts using the configured Ansible playbook

# How It Works

* Configure an Ansible playbook, an Application Definition, and create an Application Instance.
* All hosts are created when deploying the Application Instance.
* After provisioning, the hosts are configured with the linked Ansible playbook.
* This uses the [Smart Proxy ACD](https://github.com/ATIX-AG/smart_proxy_acd) component.
* The job to configure the hosts will be send to the Smart Proxy ACD component which will
    * download the Ansible playbook from your Foreman server (provided by an foreman_acd API);
    * extract the Ansible playbook on the Smart Proxy;
    * and run the Ansible playbook on the Smart Proxy.
* You can see the output of the Ansible playbook run on the *Monitor > Job* page.

:warning: This plugin is still in development.

## Documentation

See [Deploying hosts by using application centric approach](https://docs.theforeman.org/3.16/Deploying_Hosts_AppCentric/index-katello.html)

## Installation

Check out the [Foreman documentation](https://docs.theforeman.org/nightly/Deploying_Hosts_AppCentric/index-katello.html#Installing_ACD_on_Server_application_centric_deployment) on how to install the foreman_acd plugin.

### Smart Proxy Installation

You need to install [Smart Proxy ACD](https://github.com/ATIX-AG/smart_proxy_acd), too.
Check out the [Foreman documentation](https://docs.theforeman.org/nightly/Deploying_Hosts_AppCentric/index-katello.html#Installing_ACD_on_Smart_Proxy_application_centric_deployment) on how to install the smart_proxy_acd plugin.

### Tips

* Make sure you have the [Katello](https://theforeman.org/plugins/katello/) plugin installed.
* Make sure the Job Template `Run ACD Ansible Playbook - ACD Default` is part of your organization/location context.

### Deinstallation

To remove the plugin from foreman you must do the following:

1. stop foreman all services except PostgreSQL
1. revert database migrations `foreman-rake foreman-rake db:migrate VERSION=0 "SCOPE=foreman_acd"` (this command only works with the latest version from git).
1. remove RPM packages, if plugin had been installed via RPM
1. remove relics from foreman database, e.g. permissions
1. disable plugin in foreman-installer (either directly in the `answers.yml` or via foreman-installer parameters)

## Usage

### Ansible Playbook

* Copy (or checkout a git repository) an Ansible playbook.
Store it in `/var/lib/foreman/foreman_acd/ansible-playbooks/` so that SELinux is able to read it.
* Add a new Ansible Playbook via *Applications > Ansible Playbooks*.
* Specify the path to the Ansible playbook and name of the playbook file. (e.g. `site.yml`).
* Save it and press *Import group variables* for this newly created Ansible playbook.

### Application Definition (for Admins)

* Create an Application Definition via *Applications > Application Definitions*.
* Select the Ansible Playbook you want to use.
* Add new services and specify the host group you want to use.
* Specify any values a user will be allowed to overwrite.
You may also set a default value.

### Application Instance (for Users)

* Create an Application Instance via *Applications > Application Instances*.
* Select the Application Definition you want to use.
* Overwrite desired values.
All Foreman parameters require a value.
* Save the Application Instance.

### Deploy and Configure the Application Instance (for Users)

* Select *Deploy* in the action drop down menu via *Applications > Application Instance* to deploy a host.
* Verify if the hosts are deployed via the *Report* button from the action drop down menu.
* Run the Ansible playbook via *Run Ansible playbook* from the action drop down menu after all hosts are deployed.

## TODO

* Add Saltstack support to configure the application.
* Extend the Foreman parameter and value validation.

## Contributing

Fork and send a Pull Request. Thank you.

## Copyright

Copyright (c) 2024 ATIX AG

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.
If not, see <http://www.gnu.org/licenses/>.
