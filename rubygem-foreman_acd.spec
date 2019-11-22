%{?scl:%scl_package rubygem-%{gem_name}}
%{!?scl:%global pkg_name %{name}}

%global gem_name foreman_acd
%global plugin_name acd

Name: %{?scl_prefix}rubygem-%{gem_name}
Version: 0.0.1
Release: 1%{?foremandist}%{?dist}
Summary: Application Centric Deployment plugin for foreman / katello
Group: Applications/Systems
License: GPL-3.0
URL: https://www.orcharhino.com/
Source0: https://rubygems.org/downloads/%{gem_name}-%{version}.gem
Requires: foreman >= 1.22.0
Requires: %{?scl_prefix_ruby}ruby
Requires: %{?scl_prefix_ruby}ruby(rubygems)
Requires: %{?scl_prefix}rubygem(foreman-tasks)
Requires: %{?scl_prefix}rubygem(katello) >= 3.12
BuildRequires: foreman-assets
BuildRequires: foreman-plugin >= 1.22
BuildRequires: %{?scl_prefix}rubygem(katello) >= 3.12
BuildRequires: %{?scl_prefix}rubygem(foreman-tasks)
BuildRequires: %{?scl_prefix_ruby}ruby(release)
BuildRequires: %{?scl_prefix_ruby}ruby
BuildRequires: %{?scl_prefix_ruby}rubygems-devel
BuildArch: noarch
Provides: %{?scl_prefix}rubygem(%{gem_name}) = %{version}
Provides: foreman-plugin-%{plugin_name}

# start package.json devDependencies BuildRequires
BuildRequires: npm(babel-plugin-lodash) >= 3.3.2
BuildRequires: npm(babel-plugin-lodash) < 4.0.0
BuildRequires: npm(babel-plugin-transform-class-properties) >= 6.24.1
BuildRequires: npm(babel-plugin-transform-class-properties) < 7.0.0
BuildRequires: npm(babel-plugin-transform-object-assign) >= 6.22.0
BuildRequires: npm(babel-plugin-transform-object-assign) < 7.0.0
BuildRequires: npm(babel-plugin-transform-object-rest-spread) >= 6.26.0
BuildRequires: npm(babel-plugin-transform-object-rest-spread) < 7.0.0
BuildRequires: npm(babel-preset-env) >= 1.6.0
BuildRequires: npm(babel-preset-env) < 2.0.0
BuildRequires: npm(babel-preset-react) >= 6.24.1
BuildRequires: npm(babel-preset-react) < 7.0.0
BuildRequires: npm(identity-obj-proxy) >= 3.0.0
BuildRequires: npm(identity-obj-proxy) < 4.0.0
BuildRequires: npm(react-redux) >= 5.0.7
BuildRequires: npm(react-redux) < 6.0.0
BuildRequires: npm(redux) >= 3.7.2
BuildRequires: npm(redux) < 4.0.0
BuildRequires: npm(redux-thunk) >= 2.3.0
BuildRequires: npm(redux-thunk) < 3.0.0
BuildRequires: npm(reactabular-table) >= 8.14.0
BuildRequires: npm(reactabular-table) < 9.0.0
BuildRequires: npm(sortabular) >= 1.5.1
BuildRequires: npm(sortabular) < 2.0.0
BuildRequires: npm(table-resolver) >= 3.2.0
BuildRequires: npm(table-resolver) < 4.0.0
# end package.json devDependencies BuildRequires

# start package.json dependencies BuildRequires
BuildRequires: npm(babel-polyfill) >= 6.26.0
BuildRequires: npm(babel-polyfill) < 7.0.0
BuildRequires: npm(classnames) >= 2.2.5
BuildRequires: npm(classnames) < 3.0.0
BuildRequires: npm(lodash) >= 4.17.11
BuildRequires: npm(lodash) < 5.0.0
BuildRequires: npm(patternfly) >= 3.58.0
BuildRequires: npm(patternfly) < 4.0.0
BuildRequires: npm(patternfly-react) >= 2.25.4
BuildRequires: npm(patternfly-react) < 3.0.0
BuildRequires: npm(prop-types) >= 15.6.2
BuildRequires: npm(prop-types) < 16.0.0
BuildRequires: npm(react) >= 16.6.3
BuildRequires: npm(react) < 17.0.0
BuildRequires: npm(react-bootstrap) >= 0.32.1
BuildRequires: npm(react-bootstrap) < 1.0.0
BuildRequires: npm(react-dom) >= 16.6.3
BuildRequires: npm(react-dom) < 17.0.0
BuildRequires: npm(react-json-tree) >= 0.11.0
BuildRequires: npm(react-json-tree) < 1.0.0
BuildRequires: npm(reselect) >= 3.0.1
BuildRequires: npm(reselect) < 4.0.0
BuildRequires: npm(seamless-immutable) >= 7.1.3
BuildRequires: npm(seamless-immutable) < 8.0.0
# end package.json dependencies BuildRequires

%description
Foreman plugin to deploy and control hosts in a application centric manner.


%package doc
Summary: Documentation for %{pkg_name}
Group: Documentation
Requires: %{?scl_prefix}%{pkg_name} = %{version}-%{release}
BuildArch: noarch

%description doc
Documentation for %{pkg_name}.

%prep
%{?scl:scl enable %{scl} - << \EOF}
gem unpack %{SOURCE0}
%{?scl:EOF}

%setup -q -D -T -n  %{gem_name}-%{version}

%{?scl:scl enable %{scl} - << \EOF}
gem spec %{SOURCE0} -l --ruby > %{gem_name}.gemspec
%{?scl:EOF}

%build
# Create the gem as gem install only works on a gem file
%{?scl:scl enable %{scl} - << \EOF}
gem build %{gem_name}.gemspec
%{?scl:EOF}

# %%gem_install compiles any C extensions and installs the gem into ./%%gem_dir
# by default, so that we can move it into the buildroot in %%install
%{?scl:scl enable %{scl} - << \EOF}
%gem_install
%{?scl:EOF}

%install
mkdir -p %{buildroot}%{gem_dir}
cp -pa .%{gem_dir}/* \
        %{buildroot}%{gem_dir}/

%foreman_bundlerd_file
%foreman_precompile_plugin -s

%files
%dir %{gem_instdir}
%license %{gem_instdir}/LICENSE
%{gem_instdir}/app
%{gem_instdir}/config
%{gem_instdir}/db
%{gem_libdir}
%{gem_instdir}/locale
%exclude %{gem_instdir}/package.json
%exclude %{gem_instdir}/webpack
%exclude %{gem_cache}
%{gem_spec}
%{foreman_bundlerd_plugin}
#%{foreman_apipie_cache_foreman}
#%{foreman_apipie_cache_plugin}
%{foreman_assets_plugin}
%{foreman_webpack_plugin}
%{foreman_webpack_foreman}

%files doc
%doc %{gem_docdir}
%doc %{gem_instdir}/README.md
%{gem_instdir}/Rakefile
%{gem_instdir}/test

%posttrans
%{foreman_db_migrate}
%{foreman_db_seed}
%{foreman_apipie_cache}
%{foreman_restart}
exit 0

%changelog
* Fri Nov 22 2019 Bernhard Suttner <suttner@atix.de> 0.0.1-1
- First release
