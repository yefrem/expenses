require 'rails_helper'

RSpec.describe AccountsController, type: :controller do
  context "as hacker" do
    user :peter, :hack => true

    it "should not allow any actions" do
      acc = create(:peter_cash, user: @user)
      get :show, {:id => acc.id, user_id: acc.user_id}
      expect_status(403)

      acc = build(:peter_cash, user: @user)
      post :create, {:account => acc.attributes, user_id: acc.user_id}
      expect_status(403)
    end
  end

  context "as owner or admin" do
    user :peter

    it "should render single account with latest transactions" do
      acc = create(:peter_cash, user: @user)
      get :show, {:id => acc.id, user_id: acc.user_id}
      expect_json(title: acc.title, balance: acc.balance)
      expect_json_types(latest_transactions: :array)
    end

    it "should create account" do
      acc = build(:peter_cash, user: @user)
      expect {
        post :create, {:account => acc.attributes, user_id: acc.user_id}
      }.to change(Account, :count).by(1)
      expect_json(title: acc.title, balance: 0)
    end

    it "should update account" do
      acc = create(:peter_cash, user: @user)
      acc.title = 'smth'
      patch :update, {id: acc.id, account: acc.attributes, user_id: acc.user_id}
      expect(Account.find(acc.id).title).to eq('smth')
    end

    it "should delete account" do
      acc = create(:peter_cash, user: @user)
      expect {
        delete :destroy, {id: acc.id, user_id: acc.user_id}
      }.to change(Account, :count).by(-1)
    end

    it "should generate report" do
      acc = create(:peter_cash, user: @user)
      create(:transaction, sender: acc)
      get :report, {account_id: acc.id, user_id: acc.user_id, date_from: DateTime.new.to_s, date_to: DateTime.new.to_s}
      expect_json_types(transactions: :array, total_spent: :float, total_received: :float, date_to: :string, date_from: :string)
    end
  end
end
