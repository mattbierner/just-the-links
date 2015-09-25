var whitelist =  [
    'i', 'me', 'myself', 'my', 'mine',
    "i'm", "i'll", "i've",
    'we', 'us', 'ours', 'ourself', 'ourselves', 'us',
    'twitter', 'tweet', 'tweets', 'facebook',
    'instagram', 'instagrams', 'selfie'];

/**
    Combine the whitelist of words into a regular expression. 
*/
var createWhitelistRegexp = function(whitelist) {
    return new RegExp(
        '\\b(' + whitelist.sort().reverse().join('|') + ')\\b',
        'gi');
};

var whitelistRegexp = createWhitelistRegexp(whitelist);

var rewriteText = function(target, whitelistRegexp) {
    return $(target).val().split(whitelistRegexp).map(function(word) {
        if (word.match(whitelistRegexp)) {
            return '<span class="iiiii-reserved-word">' + word + '</span>';
        } else {
            return word.replace(/\w+/g, function(word) {
                return '<span class="iiiii-word"><span class="iiiii-word-inner">' + word + '</span></span>';
            });
        }
    });
};

var rewrite = function() {
    $('#example-out').html(rewriteText($('#example textarea'), whitelistRegexp));

};

$(function(){


$('#example textarea').bind('input propertychange', rewrite);
rewrite();
});