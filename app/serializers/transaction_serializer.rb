class TransactionSerializer < ActiveModel::Serializer
  attributes :id, :comment, :amount, :time

  class AccountSerializer < ActiveModel::Serializer
    attributes :id, :title
  end

  has_one :sender, :class_name => Account, serializer: TransactionSerializer::AccountSerializer
  has_one :receiver, :class_name => Account, serializer: TransactionSerializer::AccountSerializer
end
