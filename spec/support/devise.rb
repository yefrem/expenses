module ControllerMacros
  def user (user, opts = {})
    before :each do
      @user = create(user)
      login = opts[:hack] ? create(:hacker) : @user
      request.headers.merge!(login.create_new_auth_token)
    end
  end
end