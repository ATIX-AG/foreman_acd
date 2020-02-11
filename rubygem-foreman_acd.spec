# template: foreman_plugin
%{?scl:%scl_package rubygem-%{gem_name}}
%{!?scl:%global pkg_name %{name}}

%global gem_name foreman_acd
%global plugin_name acd
%global foreman_min_version 1.24.0

Name: %{?scl_prefix}rubygem-%{gem_name}
Version: 0.1.0
Release: 1%{?foremandist}%{?dist}
Summary: Foreman plugin to provide application centric deployment and self service portal
Group: Applications/Systems
License: GPLv3
URL: https://www.orcharhino.com
Source0: https://rubygems.org/gems/%{gem_name}-%{version}.gem

# start specfile generated dependencies
Requires: foreman >= %{foreman_min_version}
Requires: %{?scl_prefix_ruby}ruby(release)
Requires: %{?scl_prefix_ruby}ruby
Requires: %{?scl_prefix_ruby}ruby(rubygems)
BuildRequires: foreman-assets >= %{foreman_min_version}
BuildRequires: foreman-plugin >= %{foreman_min_version}
BuildRequires: %{?scl_prefix_ruby}ruby(release)
BuildRequires: %{?scl_prefix_ruby}ruby
BuildRequires: %{?scl_prefix_ruby}rubygems-devel
BuildArch: noarch
Provides: %{?scl_prefix}rubygem(%{gem_name}) = %{version}
Provides: foreman-plugin-%{plugin_name} = %{version}
# end specfile generated dependencies

# start package.json devDependencies BuildRequires
BuildRequires: %{?scl_prefix}npm(babel-plugin-syntax-dynamic-import) >= 6.18.0
BuildRequires: %{?scl_prefix}npm(babel-plugin-syntax-dynamic-import) < 7.0.0
BuildRequires: %{?scl_prefix}npm(babel-plugin-transform-class-properties) >= 6.24.1
BuildRequires: %{?scl_prefix}npm(babel-plugin-transform-class-properties) < 7.0.0
BuildRequires: %{?scl_prefix}npm(babel-plugin-transform-object-assign) >= 6.22.0
BuildRequires: %{?scl_prefix}npm(babel-plugin-transform-object-assign) < 7.0.0
BuildRequires: %{?scl_prefix}npm(babel-plugin-transform-object-rest-spread) >= 6.26.0
BuildRequires: %{?scl_prefix}npm(babel-plugin-transform-object-rest-spread) < 7.0.0
BuildRequires: %{?scl_prefix}npm(babel-preset-env) >= 1.6.0
BuildRequires: %{?scl_prefix}npm(babel-preset-env) < 2.0.0
BuildRequires: %{?scl_prefix}npm(babel-preset-react) >= 6.24.1
BuildRequires: %{?scl_prefix}npm(babel-preset-react) < 7.0.0
BuildRequires: %{?scl_prefix}npm(identity-obj-proxy) >= 3.0.0
BuildRequires: %{?scl_prefix}npm(identity-obj-proxy) < 4.0.0
BuildRequires: %{?scl_prefix}npm(lodash) >= 4.17.11
BuildRequires: %{?scl_prefix}npm(lodash) < 5.0.0
BuildRequires: %{?scl_prefix}npm(sortabular) >= 1.5.1
BuildRequires: %{?scl_prefix}npm(sortabular) < 1.6.0
BuildRequires: %{?scl_prefix}npm(table-resolver) >= 3.2.0
BuildRequires: %{?scl_prefix}npm(table-resolver) < 3.3.0
# end package.json devDependencies BuildRequires

# start package.json dependencies BuildRequires
BuildRequires: %{?scl_prefix}npm(@theforeman/vendor) >= 1.7.0
BuildRequires: %{?scl_prefix}npm(@theforeman/vendor) < 2.0.0
BuildRequires: %{?scl_prefix}npm(react-intl) >= 2.8.0
BuildRequires: %{?scl_prefix}npm(react-intl) < 3.0.0
# end package.json dependencies BuildRequires

%description
A plugin to bring an user self service portal and application centric deployment to Foreman.

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
%foreman_precompile_plugin -a -s

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
%{foreman_apipie_cache_foreman}
%{foreman_apipie_cache_plugin}
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
* Tue Feb 11 2020 Bernhard Suttner <suttner@atix.de> 0.1.0-1
- Update to 0.1.0

* Wed Nov 27 2019 Bernhard Suttner <suttner@atix.de> 0.0.6-1
- Update to 0.0.6

* Wed Nov 27 2019 Bernhard Suttner <suttner@atix.de> 0.0.4-1
- Update to 0.0.4

* Mon Nov 25 2019 Bernhard Suttner <suttner@atix.de> 0.0.3-1
- Update to 0.0.3

* Fri Nov 22 2019 Bernhard Suttner <suttner@atix.de> 0.0.2-1
- Update to 0.0.2

* Fri Nov 22 2019 Bernhard Suttner <suttner@atix.de> 0.0.1-1
- Add rubygem-foreman_acd generated by gem2rpm using the foreman_plugin template
