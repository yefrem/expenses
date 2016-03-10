FactoryGirl.define do
  factory :transaction do
    association :sender, factory: :john_cash
    comment "some expense"
    amount 4.3
  end
end
