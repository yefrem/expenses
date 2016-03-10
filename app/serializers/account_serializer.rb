class AccountSerializer < ActiveModel::Serializer
  attributes :id, :balance, :title, :latest_transactions
end
