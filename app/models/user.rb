class User < ActiveRecord::Base
  validates :name, :email, presence: true

  # will start with one default account but possible add multi account feature
  has_many :accounts
end
