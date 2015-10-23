### How to approach the development of a Rails-based URL shortener

The URL shortener application needs to serve two use cases:
- shortening an URL
- redirecting the user's browser to something useful when a previously generated short URL is invoked

We store the data for the application in a CSV file:
```
$ cat /tmp/urldata.txt
dcba1c,http://rubyonrails.org/
ee07d9,http://en.wikipedia.org/wiki/Ruby_on_Rails
b247ac,https://github.com/rails/rails
cf62a3,http://stackoverflow.com/
e80cb3,http://fmi.unibuc.ro/
af6de7,https://www.facebook.com/
e4053f,https://twitter.com/

$
```
**IMPORTANT:** Notice that there is an empty line at the end of the file. Our application needs to be able to properly handle not only one, but several empty lines which could be anywhere in the file. Further down below in this tutorial, we cover how to deal with empty lines when parsing CSV data into Ruby data structures.

We are going to parse this file into Ruby hashes on two distinct occasions during the development of our URL shortener:
- when generating the short URL we need to check whether or not the original (long) URL has already been processed and stored for future reference (if it has, then the application's response should be the already existing short URL);
- when responding to a short URL we need the original (long) URL obviously; moreover, if the record doesn't exist, we need to redirect to an error page.

As you can imagine, we are going to perform lookups both from long to short and from short to long, so we need to build two hashes from the CSV-formatted data.  
Let's look at the specific steps for how to do that.

If the file `urldata.txt` is not already in the `/tmp` directory, place a copy of it there.  
Then try the following in the Ruby interactive console:
```
$ irb
001 > require 'csv'
 => true
002 > urldata = CSV.read('/tmp/urldata.txt')
 => [["dcba1c", "http://rubyonrails.org/"], ["ee07d9", "http://en.wikipedia.org/wiki/Ruby_on_Rails"], ["b247ac", "https://github.com/rails/rails"], ["cf62a3", "http://stackoverflow.com/"], ["e80cb3", "http://fmi.unibuc.ro/"], ["af6de7", "https://www.facebook.com/"], ["e4053f", "https://twitter.com/"], []]
003 > urldata.each { |innerlist| p innerlist }
["dcba1c", "http://rubyonrails.org/"]
["ee07d9", "http://en.wikipedia.org/wiki/Ruby_on_Rails"]
["b247ac", "https://github.com/rails/rails"]
["cf62a3", "http://stackoverflow.com/"]
["e80cb3", "http://fmi.unibuc.ro/"]
["af6de7", "https://www.facebook.com/"]
["e4053f", "https://twitter.com/"]
[]
 => [["dcba1c", "http://rubyonrails.org/"], ["ee07d9", "http://en.wikipedia.org/wiki/Ruby_on_Rails"], ["b247ac", "https://github.com/rails/rails"], ["cf62a3", "http://stackoverflow.com/"], ["e80cb3", "http://fmi.unibuc.ro/"], ["af6de7", "https://www.facebook.com/"], ["e4053f", "https://twitter.com/"], []]
004 > urldata.each { |innerlist| puts "#{ innerlist[0] } points to #{ innerlist[1] }" }
dcba1c points to http://rubyonrails.org/
ee07d9 points to http://en.wikipedia.org/wiki/Ruby_on_Rails
b247ac points to https://github.com/rails/rails
cf62a3 points to http://stackoverflow.com/
e80cb3 points to http://fmi.unibuc.ro/
af6de7 points to https://www.facebook.com/
e4053f points to https://twitter.com/
 points to
 => [["dcba1c", "http://rubyonrails.org/"], ["ee07d9", "http://en.wikipedia.org/wiki/Ruby_on_Rails"], ["b247ac", "https://github.com/rails/rails"], ["cf62a3", "http://stackoverflow.com/"], ["e80cb3", "http://fmi.unibuc.ro/"], ["af6de7", "https://www.facebook.com/"], ["e4053f", "https://twitter.com/"], []] 
005 > urldata.each do |innerlist| puts "#{ innerlist[0] } points to #{ innerlist[1] }" end
dcba1c points to http://rubyonrails.org/
ee07d9 points to http://en.wikipedia.org/wiki/Ruby_on_Rails
b247ac points to https://github.com/rails/rails
cf62a3 points to http://stackoverflow.com/
e80cb3 points to http://fmi.unibuc.ro/
af6de7 points to https://www.facebook.com/
e4053f points to https://twitter.com/
 points to
 => [["dcba1c", "http://rubyonrails.org/"], ["ee07d9", "http://en.wikipedia.org/wiki/Ruby_on_Rails"], ["b247ac", "https://github.com/rails/rails"], ["cf62a3", "http://stackoverflow.com/"], ["e80cb3", "http://fmi.unibuc.ro/"], ["af6de7", "https://www.facebook.com/"], ["e4053f", "https://twitter.com/"], []]
```
As you can see, empty lines in the CSV file result in empty inner arrays in the resulting array-of-arrays. We need to filter those out and we do that by using the `.empty?` predicate that is available on any array. Here is a simplified example:
```
006 > [].empty?
 => true
007 > [[1, 11], [2, 22], [3, 33], []].select { |list| !list.empty? }
 => [[1, 11], [2, 22], [3, 33]]
```
Finally, we convert the newly cleaned-up array-of-arrays into a hash by using `.to_h`, here's the same example as before:
```
008 > [[1, 11], [2, 22], [3, 33]].to_h
 => {1=>11, 2=>22, 3=>33}
```
So far we've built the hash going from left to right.  
When building the hash that goes from right to left, we simply begin by iterating through the array-of-arrays and reversing each inner list in turn, like this:
```
009 > [[1, 11], [2, 22], [3, 33]].map(&:reverse)
 => [[11, 1], [22, 2], [33, 3]]
```
When writing a new record into the CSV file, use this syntax:
```
CSV.open('/tmp/urldata.txt', 'a') do |csv|
  csv << ['da82c6', 'https://www.pinterest.com/']
end
```
Another ingredient we are going to need for our application is a snippet of code that generates random six-character strings that will become endings for short URLs:
```
010 > require 'securerandom'
 => true
011 > random_six_character_string = SecureRandom.hex[0..5]
 => "7cfe2d"
```
Note that if you insist on your random six-character string starting with a letter, one possibility would be to first pick a letter from the alphabet at random with `('a'..'z').to_a[rand(26)]`, then prepend the result to a random five-character string.
