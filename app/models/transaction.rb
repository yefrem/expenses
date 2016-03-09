class Transaction < ActiveRecord::Base
  validates :comment, :amount, :receiver, presence: true

  # has two account field for transactions between accounts
  # for one account transaction only receiver is used
  belongs_to :sender, :class_name => Account
  belongs_to :receiver, :class_name => Account
end
