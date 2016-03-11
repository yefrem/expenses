FactoryGirl.define do
  factory :john, class: User do
    name 'John'
    sequence(:email) { |n| "john#{n}@example.com" }
    password 'somepass'
  end

  factory :peter, class: User do
    name 'Peter'
    sequence(:email) { |n| "peter#{n}@example.com" }
    password 'somepass'
  end

  factory :admin, class: User do
    name 'Admin'
    email 'admin@example.com'
    password 'adminpass'
    admin true
  end

  factory :hacker, class: User do
    name 'Hacker'
    email 'hacker@example.com'
    password 'hackpass'
  end
end
