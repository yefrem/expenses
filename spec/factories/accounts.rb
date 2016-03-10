FactoryGirl.define do
  factory :john_cash, class: Account do
    association :user, factory: :john
    title 'Cash'
    balance 10
  end

  factory :john_bank, class: Account do
    association :user, factory: :john
    title 'Bank'
    balance 150
  end

  factory :peter_cash, class: Account do
    association :user, factory: :peter
    title 'Cash'
    balance 10
  end

  factory :peter_bank, class: Account do
    association :user, factory: :peter
    title 'Bank'
    balance 150
  end
end
