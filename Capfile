# load 'deploy' if respond_to?(:namespace) # cap2 differentiator
# Dir['vendor/plugins/*/recipes/*.rb'].each { |plugin| load(plugin) }
# load 'config/deploy'

load 'deploy' if respond_to?(:namespace) # cap2 differentiator

default_run_options[:pty] = true

# be sure to change these
set :domain, 'atlassian.com'
set :application, 'aui'

# the rest should be good
# set :repository,  "#{user}@#{domain}:git/#{application}.git" 
set :repository,  "https://svn.atlassian.com/svn/private/atlassian/ui/aui-rb"
set :deploy_to, "/var/www/domains/#{domain}/#{application}" 
# set :deploy_via, :remote_cache
#set :scm, 'svn'
set :branch, 'trunk'
set :scm_verbose, true
set :use_sudo, false
set :group, "deploy"
set :ssh_options, { :forward_agent => true } # this is so we don't need a appdeploy key

server "aui.atlassian.com", :app

namespace :deploy do
  task :restart do
    run "touch #{current_path}/tmp/restart.txt" 
  end
end