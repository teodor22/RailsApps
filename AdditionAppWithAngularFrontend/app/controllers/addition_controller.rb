class AdditionController < ActionController::Base
  def performaddition
    sleep 1

    render :json => { 'result' => params[:firstnumber].to_i + params[:secondnumber].to_i }
  end
end

