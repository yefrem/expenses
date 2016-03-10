class Report
  include ActiveModel::Model
  include ActiveModel::Serialization
  attr_accessor :account, :date_from, :date_to

  def total_received
    calculate
    @total_received
  end

  def total_spent
    calculate
    @total_spent
  end

  def average_spending_per_day
    calculate
    @average_spending_per_day
  end

  def transactions
    calculate
    @transactions
  end

  private
  def calculate
    if !@calculated
      @total_spent = 0
      @total_received = 0
      @transactions = account.transactions.where('time > ? AND time < ?', date_from.at_beginning_of_day, date_to.at_end_of_day)
      @transactions.each do |t|
        if t.sender_id == account.id
          @total_spent += t.amount
        else
          @total_received += t.amount
        end
      end
      @average_spending_per_day = @total_spent == 0 ? 0 : (@total_spent / (date_to - date_from + 1)).round(2)

      @calculated = true
    end
  end
end