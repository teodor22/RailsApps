class AdditionController < ActionController::Base
  def showinputfields
    render 'showinputfields'
  end

  def performaddition
    firstnumber = params[:firstnumber].to_i
    secondnumber = params[:secondnumber].to_i
    result = firstnumber + secondnumber

    f = open('/tmp/result.txt', 'w')
    f.puts result.to_s
    f.close
    redirect_to '/displayresult'
  end

  def displayresult
    f = open('/tmp/result.txt', 'r')
    @result = f.read.strip
    f.close
    render 'displayresult'
  end
end

