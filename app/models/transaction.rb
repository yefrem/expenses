class Transaction < ActiveRecord::Base
  validates :comment, :amount, :sender, presence: true

  # has two account field for transactions between accounts
  # for one account transaction only sender is used
  belongs_to :sender, :class_name => Account
  belongs_to :receiver, :class_name => Account

  before_save :format_amount

  # todo: should we also override save! method?
  def save
    if self.receiver && (self.sender.user_id != self.receiver.user_id)
      raise ArgumentError.new('Transactions between users are not allowed')
    end

    self.transaction do
      raise ActiveRecord::Rollback if !super
      self.sender.balance -= self.amount
      self.sender.save!
      if self.receiver
        self.receiver.balance += self.amount
        self.receiver.save!
      end
    end
  end

  private
  def format_amount
    self.amount = self.amount.round(2)
  end

end
