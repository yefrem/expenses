require 'rails_helper'

RSpec.describe Transaction, type: :model do

  it "should round amount" do
    t = build(:transaction)
    t.amount = 3.4562
    t.save
    expect(t.amount).to eq(3.46)
  end

  it "should update sender acc when saved for one-acc" do
    t = build(:transaction)
    t.amount = 4.3

    expect{t.save}.to change{t.sender.reload.balance}.by(-4.3)
  end

  it "should update both accs when saved for multi-acc" do
    t = create(:transaction)
    john = create(:john)
    # todo: users and their IDs are not working in obvious way, there should be a clear way to do this
    bank = create(:john_bank, user: john)
    cash = create(:john_cash, user: john)
    t.sender = bank
    t.receiver = cash
    t.amount = 50
    t.save
    expect(bank.reload.balance).to eq(100)
    expect(cash.reload.balance).to eq(60)
  end

  it "should update accs when updated" do
    john = create(:john)
    bank = create(:john_bank, user: john, balance: 100)
    cash = create(:john_cash, user: john, balance: 60)
    t = create(:transaction)
    t.amount = 10
    t.sender = bank
    t.receiver = cash
    t.save
    expect(bank.reload.balance).to eq(90)
    expect(cash.reload.balance).to eq(70)

    t.amount = 15
    t.save
    expect(bank.reload.balance).to eq(85)
    expect(cash.reload.balance).to eq(75)
  end

  it "should update accs when deleted" do
    john = create(:john)
    bank = create(:john_bank, user: john, balance: 100)
    cash = create(:john_cash, user: john, balance: 60)
    t = create(:transaction)
    t.amount = 10
    t.sender = bank
    t.receiver = cash
    t.save

    t.destroy
    expect(bank.reload.balance).to eq(100)
    expect(cash.reload.balance).to eq(60)
  end

  it "should not allow accounts from different users" do
    t = build(:transaction)
    t.sender = create(:john_cash)
    t.receiver = create(:peter_bank)
    expect {t.save}.to raise_exception(ArgumentError)
  end

  it "should set current time if nothing passed" do
    date = DateTime.new(2016, 03, 15)
    Timecop.freeze(date) do
      t = build(:transaction)
      t.save
      expect(t.time).to eq(date)
    end
  end
end
