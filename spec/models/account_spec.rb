require 'rails_helper'

RSpec.describe Account, type: :model do
  before :each do
    @user = create(:john)
    @cash = create(:john_cash, user: @user)
    @bank = create(:john_bank, user: @user)
    @transactions = [
        create(:transaction, sender: @bank, receiver: @cash),
        create(:transaction, sender: @cash),
        create(:transaction, sender: @cash),
        create(:transaction, sender: @cash),
        create(:transaction, sender: @cash),
        create(:transaction, sender: @bank, receiver: @cash),
        create(:transaction, sender: @cash),
        create(:transaction, receiver: @cash),
        create(:transaction, sender: @cash),
        create(:transaction, sender: @cash),
        create(:transaction, sender: @cash),
    ]
  end

  it "should return transactions" do
    expect(@bank.transactions.count).to eq(2)
    expect(@cash.transactions.count).to eq(11)
  end

  it "should return last transactions" do
    limit = 3
    expect(@cash.latest_transactions(limit)).to eq(@transactions.last(limit))
  end
end