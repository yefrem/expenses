require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  before :each do
    create(:peter)
    create(:john)
  end

  it "should render users" do
    get 'index', type: :json
    expect_json_sizes 2
    expect_json('0', name: 'Peter')
  end

  it "should render single user" do

  end

  it "should create user" do

  end

  it "should delete user" do

  end
end
