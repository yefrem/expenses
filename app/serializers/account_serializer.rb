class AccountSerializer < ActiveModel::Serializer
  attributes :id, :balance, :title
end
