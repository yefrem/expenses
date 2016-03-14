require 'rails_helper'

RSpec.describe Report, type: :model do
  before(:each) do
    @user = create(:john)
    @cash = create(:john_cash, user: @user)
    @bank = create(:john_bank, user: @user)
    @transactions = [
        create(:transaction, sender: @bank, receiver: @cash, amount:500,  time: DateTime.parse('2016-03-01 15:30:00')),
        create(:transaction, sender: @cash, amount:5,                     time: DateTime.parse('2016-03-01 15:30:00')),
        create(:transaction, sender: @cash, amount:15,                    time: DateTime.parse('2016-03-02 15:30:00')),
        create(:transaction, sender: @cash, amount:50,                    time: DateTime.parse('2016-03-03 15:30:00')),
        create(:transaction, sender: @cash, amount:10,                    time: DateTime.parse('2016-03-04 15:30:00')),
        create(:transaction, sender: @cash, amount:23,                    time: DateTime.parse('2016-03-04 18:00:00')),
        create(:transaction, receiver: @cash, amount:200,                 time: DateTime.parse('2016-03-05 10:45:00')),
        create(:transaction, sender: @cash, amount:20,                    time: DateTime.parse('2016-03-05 15:30:00')),
        create(:transaction, sender: @cash, amount:2,                     time: DateTime.parse('2016-03-07 11:35:00')),
        create(:transaction, sender: @cash, amount:1,                     time: DateTime.parse('2016-03-09 15:30:00')),
    ]
  end

  it "should calculate average per day" do
    r = Report.new(account: @cash, date_from: DateTime.new(2016, 3, 2), date_to: DateTime.new(2016, 3, 4))
    expect(r.average_spending_per_day).to eq(32.67)

    r = Report.new(account: @cash, date_from: DateTime.new(2016, 3, 1), date_to: DateTime.new(2016, 3, 10))
    expect(r.average_spending_per_day).to eq(12.6)
  end

  it "should calculate spent and received" do
    r = Report.new(account: @cash, date_from: DateTime.new(2016, 3, 1), date_to: DateTime.new(2016, 3, 4))
    expect(r.total_spent).to eq(103)
    expect(r.total_received).to eq(500)

    r = Report.new(account: @cash, date_from: DateTime.new(2016, 3, 1), date_to: DateTime.new(2016, 3, 9))
    expect(r.total_spent).to eq(126)
    expect(r.total_received).to eq(700)

    r = Report.new(account: @cash, date_from: DateTime.new(2016, 3, 10), date_to: DateTime.new(2016, 3, 11))
    expect(r.total_spent).to eq(0)
    expect(r.total_received).to eq(0)
  end

  it "should return correct transactions" do
    r = Report.new(account: @cash, date_from: DateTime.new(2016, 3, 1), date_to: DateTime.new(2016, 3, 5))
    expect(r.transactions).to eq(@transactions.slice(0..7).reverse)

    r = Report.new(account: @cash, date_from: DateTime.new(2016, 2, 1), date_to: DateTime.new(2016, 2, 15))
    expect(r.transactions).to be_empty

    r = Report.new(account: @cash, date_from: DateTime.new(2016, 3, 5), date_to: DateTime.new(2016, 3, 10))
    expect(r.transactions).to eq(@transactions.slice(6..9).reverse)
  end
end
