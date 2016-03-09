class CreateTransactions < ActiveRecord::Migration
  def change
    create_table :transactions do |t|
      t.belongs_to :account
      t.string :comment
      t.float :amount

      t.timestamps null: false
    end
  end
end
