class ApiController < ApplicationController
  include CanCan::ControllerAdditions

  before_action :authenticate_user!
end