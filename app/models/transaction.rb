class Transaction < ActiveRecord::Base
  validates :comment, :amount, :time, presence: true

  default_scope {
    order('created_at DESC')
  }

  # has two account field for transactions between accounts
  # for one account transaction only sender is used
  belongs_to :sender, :class_name => Account
  belongs_to :receiver, :class_name => Account

  before_validation :format_fields

  # todo: should we also override save! method?
  def save
    if self.receiver && self.sender && (self.sender.user_id != self.receiver.user_id)
      raise ArgumentError.new('Transactions between users are not allowed')
    end

    self.transaction do
      raise ActiveRecord::Rollback if !super
      if self.sender
        self.sender.balance -= self.amount
        self.sender.save!
      end
      if self.receiver
        self.receiver.balance += self.amount
        self.receiver.save!
      end
    end

    true
  end

  private
  def format_fields
    self.amount = self.amount.round(2)
    if self.time.nil?
      self.time = DateTime.now
    end
  end

end
