class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  include CanCan::ControllerAdditions
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception

  include ActionController::Serialization

  before_action :authenticate_user!

  def default_serializer_options
    {root: false}
  end

  rescue_from CanCan::AccessDenied do |exception|
    render :nothing => true, :status => 403 # todo: errors in json
  end
end
