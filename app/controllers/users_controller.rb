class UsersController < ApplicationController
  def index
    @users = paginate User.all
    render json: @users
  end
end
