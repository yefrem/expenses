Rails.application.routes.draw do
  resources :users do
    resources :accounts
  end
  resources :transactions
end
