/**
 * Created by jochen on 16/03/14.
 */
var YELP = require("yelp");


exports.createYelpWebService = function createYelpWebService(consumer_key, consumer_secret,token,token_secret, searchTerm, callback)
{
   var yelp=YELP.createClient({
        consumer_key: consumer_key,
        consumer_secret: consumer_secret,
        token: token,
        token_secret: token_secret
    });

    // See http://www.yelp.com/developers/documentation/v2/search_api
    yelp.search(searchTerm, function(error, data) {
      callback(data);
    });
}

