Rails.application.routes.draw do
  resources :users do
    resources :accounts do
      get 'report', action: :report
      resources :transactions
    end
  end
end
