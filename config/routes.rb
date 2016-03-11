Rails.application.routes.draw do
  mount_devise_token_auth_for 'User', at: 'auth'
  resources :users do
    resources :accounts do
      get 'report', action: :report
      resources :transactions
    end
  end
end
