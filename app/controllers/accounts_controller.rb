class AccountsController < ApplicationController
  load_and_authorize_resource :user
  load_and_authorize_resource :through => :user#, only: [:show, :update, :destroy]

  # before_action :set_user
  before_action :set_account, only: [:show, :update, :destroy]

  def show
    render json: @account
  end

  def create
    @account = Account.new(account_params)
    if @account.save
      render json: @account, status: :created, location: [@user, @account]
    else
      render json: @account.errors, status: :unprocessable_entity
    end
  end

  def update
    if @account.update(account_params)
      head :no_content
    else
      render json: @account.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @account.destroy

    head :no_content
  end

  def report
    @account = @user.accounts.find(params[:account_id])
    date_from = DateTime.parse(params.require(:date_from))
    date_to = DateTime.parse(params.require(:date_to))
    @report = Report.new(account: @account, date_from: date_from, date_to: date_to)
    render json: @report
  end

  private

    def set_user
      @user = User.find(params[:user_id])
    end

    def set_account
      @account = @user.accounts.find(params[:id])
    end

    def account_params
      params.require(:account).permit(:title, :user_id)
    end
end
