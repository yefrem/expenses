class CreateAccounts < ActiveRecord::Migration
  def change
    create_table :accounts do |t|
      t.belongs_to :user
      t.float :balance, :default => 0
      t.string :title

      t.timestamps null: false
    end
  end
end
