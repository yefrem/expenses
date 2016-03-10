class ReportSerializer < ActiveModel::Serializer
  attributes :date_from, :date_to, :transactions, :average_spending_per_day, :total_spent, :total_received
end
