class Account < ActiveRecord::Base
  validates :title, presence: true

  belongs_to :user

  def transactions
    Transaction.where('sender_id = ? OR receiver_id = ?', id, id)
  end
end
