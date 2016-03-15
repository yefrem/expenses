class User < ActiveRecord::Base
  # Include default devise modules.
  default_scope {
    order('created_at ASC')
  }

  devise :database_authenticatable, :registerable, :rememberable
        #:recoverable, :trackable, :validatable, :confirmable, :omniauthable
  include DeviseTokenAuth::Concerns::User
  validates :name, :email, presence: true, uniqueness: true
  validates :password, confirmation: true

  #todo: will start with one default account but possible add multi account feature
  has_many :accounts
end
