require 'rails_helper'

RSpec.describe AccountsController, type: :controller do
  before :each do

  end

  it "should render single account with latest transactions" do
    acc = create(:peter_cash)
    get :show, {:id => acc.id, user_id: acc.user_id}
    expect_json(title: acc.title, balance: acc.balance)
    expect_json_types('latest_transactions', :array)
  end

  it "should create account" do
    acc = build(:peter_cash)
    expect {
      post :create, {:account => acc.attributes, user_id: acc.user_id}
    }.to change(Account, :count).by(1)
    expect_json(title: acc.title, balance: 0)
  end

  it "should update account" do
    acc = create(:peter_cash)
    acc.title = 'smth'
    patch :update, {id: acc.id, account: acc.attributes, user_id: acc.user_id}
    expect(Account.find(acc.id).title).to eq('smth')
  end

  it "should delete account" do
    acc = create(:peter_cash)
    expect {
      delete :destroy, {id: acc.id, user_id: acc.user_id}
    }.to change(Account, :count).by(-1)
  end

end
