class Account < ActiveRecord::Base
  validates :title, presence: true

  belongs_to :user

  def transactions
    Transaction.where('sender_id = ? OR receiver_id = ?', id, id).order('time asc')
  end

  def latest_transactions(limit = 10)
    transactions.reorder('time desc').limit(limit).reverse
  end
end
