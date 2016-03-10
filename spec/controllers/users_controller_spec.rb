require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  before :each do
    create(:peter)
    create(:john)
  end

  it "should render users" do
    get :index
    expect_json_sizes 2
    expect_json('0', name: 'Peter')
    expect_json_types('0.accounts', :array)
  end

  it "should render single user" do
    user = create(:peter)
    get :show, {:id => user.id}
    expect_json(name: user.name, email: user.email)
  end

  it "should create user" do
    user = build(:peter)
    expect {
      post :create, {:user => user.attributes}
    }.to change(User, :count).by(1)
    expect_json(name: user.name, email: user.email)
  end

  it "should update user" do
    user = create(:peter)
    user.name = 'john'
    patch :update, {id: user.id, user: user.attributes}
    expect(User.find(user.id).name).to eq('john')
  end

  it "should delete user" do
    user = create(:peter)
    expect {
      delete :destroy, {:id => user.id}
    }.to change(User, :count).by(-1)
  end
end
