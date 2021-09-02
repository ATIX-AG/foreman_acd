[![Build Status master](https://travis-ci.org/ATIX-AG/foreman_acd.svg?branch=master)](https://travis-ci.org/ATIX-AG/foreman_acd)

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

See [Application Centric Deployment Guide](https://docs.theforeman.org/nightly/Application_Centric_Deployment/index-foreman-el.html)

## Installation

See the [installation](https://theforeman.org/plugins/#2.Installation) chapter of the Foreman plugins documentation on how to install Foreman plugins.

### TL;DR: 

    yum install tfm-rubygem-foreman_acd
    foreman-maintain service restart

In some cases, you need to manually run

    foreman-rake db:migrate
    foreman-rake db:seed

### Smart Proxy Installation

You will need to install [Smart Proxy ACD](https://github.com/ATIX-AG/smart_proxy_acd), too. 

    yum install tfm-rubygem-smart_proxy_acd tfm-rubygem-smart_proxy_acd_core
    foreman-maintain service restart

You need to refresh the smart proxy features in *Infrastructure > Smart Proxies > Your Smart-Proxy > Actions > Refresh* after the installation of the Smart Proxy ACD components.

### Tips

* Make sure you have the [Katello](https://theforeman.org/plugins/katello/) plugin installed.
* Make sure the Job Template `Run ACD Ansible Playbook - ACD Default` is part of your organization/location context.

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

* Add `git` support for the Ansible playbooks.
* Provide application templates which contains application definition and the required Ansible-playbook.
* Add Saltstack support to configure the application.
* Extend the Foreman parameter and value validation.

## Contributing

Fork and send a Pull Request.
Thanks!

## Copyright

Copyright (c) 2021 ATIX AG 

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program.
If not, see <http://www.gnu.org/licenses/>.
