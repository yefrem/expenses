class ApplicationController < ActionController::API
  include DeviseTokenAuth::Concerns::SetUserByToken
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  # protect_from_forgery with: :exception

  include ActionController::Serialization

  before_action :configure_permitted_parameters, if: :devise_controller?

  def default_serializer_options
    {root: false}
  end

  rescue_from CanCan::AccessDenied do |exception|
    render :nothing => true, :status => 403 # todo: errors in json
  end

  protected

  def configure_permitted_parameters
    # devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    devise_parameter_sanitizer.for(:sign_up) << :name#, :email, :password, :password_confirmation) }
  end
end
