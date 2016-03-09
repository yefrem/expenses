class AddMultiAccToTransaction < ActiveRecord::Migration
  def change
    change_table :transactions do |t|
      t.belongs_to :sender, class_name: Account
      t.belongs_to :receiver, class_name: Account
      t.remove :account_id
    end
  end
end
