class AccountSerializer < ActiveModel::Serializer
  attributes :id, :balance, :title, :latest_transactions
  # has_many :transactions
  has_many :latest_transactions
end
