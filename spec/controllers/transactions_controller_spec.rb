require 'rails_helper'

RSpec.describe TransactionsController, type: :controller do
  context "as owner" do
    user :peter

    before :each do
      @acc = create(:peter_cash, user: @user)
    end

    it "should render paginated account transactions" do
      # todo: use factory sequences
      create(:transaction, sender: @acc)
      create(:transaction, sender: @acc)
      create(:transaction, sender: @acc)
      get :index, {account_id: @acc.id, user_id: @acc.user_id, per_page: 2}
      expect_json_sizes(2)

      get :index, {account_id: @acc.id, user_id: @acc.user_id}
      expect_json_sizes(3)
    end

    it "should create transaction" do
      t = build(:transaction, sender: @acc)
      expect {
        post :create, {:account_id => @acc.id, user_id: @acc.user_id, :transaction => t.attributes}
      }.to change {@acc.transactions.count}.by(1)
      expect_json(comment: t.comment, amount: t.amount)
    end

    it "should not create with fake account id" do
      @acc2 = create(:john_cash)
      t = build(:transaction, sender: @acc2)
      post :create, {:account_id => @acc.id, user_id: @acc.user_id, :transaction => t.attributes}
      expect_status(403)
    end

    it "should update transaction" do
      t = create(:transaction, sender: @acc)
      t.comment = 'new comment'
      t.amount = 150.57
      patch :update, {id: t.id, transaction: t.attributes, user_id: @acc.user_id, account_id: @acc.id}
      expect(Transaction.find(t.id).comment).to eq('new comment')
      expect(Transaction.find(t.id).amount).to eq(150.57)
    end

    it "should delete transaction" do
      t = create(:transaction, receiver: @acc)
      expect {
        delete :destroy, {account_id: @acc.id, user_id: @acc.user_id, id: t.id}
      }.to change {@acc.transactions.count}.by(-1)
    end
  end

  context "as hacker" do
    user :peter, hack: true

    before :each do
      @acc = create(:peter_cash, user: @user)
    end

    it "should not allow anything" do
      t = build(:transaction, sender: @acc)
      post :create, {:account_id => @acc.id, user_id: @acc.user_id, :transaction => t.attributes}
      expect_status(403)

      create(:transaction, sender: @acc)
      create(:transaction, sender: @acc)
      create(:transaction, sender: @acc)
      get :index, {account_id: @acc.id, user_id: @acc.user_id, per_page: 2}
      expect_status(403)
    end
  end
end
