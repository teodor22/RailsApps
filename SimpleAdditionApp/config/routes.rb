Rails.application.routes.draw do

  get '/showinputfields' => 'addition#showinputfields'
  get '/displayresult' => 'addition#displayresult'

  post '/performaddition' => 'addition#performaddition'

end
