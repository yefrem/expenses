FactoryGirl.define do
  factory :john, class: User do
    name "John"
    email "john@example.com"
  end

  factory :peter, class: User do
    name "Peter"
    email "peter@example.com"
  end
end
