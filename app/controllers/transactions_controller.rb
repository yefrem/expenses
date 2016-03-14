class TransactionsController < ApiController
  include CleanPagination

  load_and_authorize_resource :user
  load_and_authorize_resource :account, :through => :user
  # before_action :set_user
  # before_action :set_account
  load_and_authorize_resource :transaction, :through => :account
  # before_action :set_transaction, only: [:show, :update, :destroy]

  # GET /transactions
  # GET /transactions.json
  def index
    @transactions = @account.transactions
    paginate @transactions.count, 20 do |limit, offset|
      render json: @transactions.limit(limit).offset(offset)
    end

    # render json: @transactions
  end

  # POST /transactions
  # POST /transactions.json
  def create
    @transaction = Transaction.new(transaction_params)

    if !passed_correct_accounts?
      return render :nothing => true, :status => 400 #todo: should return something readable
    end

    if @transaction.save
      render json: @transaction, status: :created
    else
      render json: @transaction.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /transactions/1
  # PATCH/PUT /transactions/1.json
  def update
    if !passed_correct_accounts?
      return render :nothing => true, :status => 400 #todo: should return something readable
    end
    if @transaction.update(transaction_params)
      head :no_content
    else
      render json: @transaction.errors, status: :unprocessable_entity
    end
  end

  # DELETE /transactions/1
  # DELETE /transactions/1.json
  def destroy
    @transaction.destroy

    head :no_content
  end

  private

  def passed_correct_accounts?
    !(@transaction.sender && @transaction.sender.user_id != @user.id) \
      && !(@transaction.receiver && @transaction.receiver.user_id != @user.id)
  end
  #
  # def set_user
  #   @user = User.find(params[:user_id])
  # end
  #
  # def set_account
  #   @account = @user.accounts.find(params[:account_id])
  # end
  #
  # def set_transaction
  #   @transaction = @account.transactions.find(params[:id])
  # end

  def transaction_params
    params.require(:transaction).permit(:amount, :comment, :sender_id, :receiver_id, :time)
  end
end
