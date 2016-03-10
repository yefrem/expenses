class AddTimeToTransaction < ActiveRecord::Migration
  def change
    add_column :transactions, :time, :datetime, null: false
  end
end
