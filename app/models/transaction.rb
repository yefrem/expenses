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
      if self.persisted?
        old = {
            amount: self.amount_was,
            sender_id: sender_id_was,
            receiver_id: receiver_id_was,
        }
        new = {
            amount: self.amount,
            sender_id: self.sender_id,
            receiver_id: self.receiver_id,
        }

        self.attributes = old
        revert
        self.attributes = new
        apply
      else
        apply
      end
      raise ActiveRecord::Rollback if !super
    end

    true
  end

  def destroy
    self.transaction do
      revert
      super
    end
  end

  def delete
    self.transaction do
      revert
      super
    end
  end

  private
  def format_fields
    self.amount = self.amount.round(2)
    if self.time.nil?
      self.time = DateTime.now
    end
  end

  def apply
    if self.sender
      self.sender.balance -= self.amount
      self.sender.save!
    end
    if self.receiver
      self.receiver.balance += self.amount
      self.receiver.save!
    end
  end

  def revert
    if self.sender
      self.sender.balance += self.amount
      self.sender.save!
    end
    if self.receiver
      self.receiver.balance -= self.amount
      self.receiver.save!
    end
  end

end
