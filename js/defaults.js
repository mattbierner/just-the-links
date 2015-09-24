var DEFAULT_OPTIONS = {
    'whitelist': [
        'i', 'me', 'myself', 'my', 'mine',
        "i'm", "i'll", "i've",
        'we', 'us', 'ours', 'ourself', 'ourselves', 'us',
        'twitter', 'tweet', 'tweets', 'facebook',
        'instagram', 'instagrams', 'selfie'],
        
    'elements': 'p, h1, h2, h3, h4, h5, h6, article ul, article ol',
    
    'excludedSites': [
        'stackoverflow.com/*']
};

var normalizeUrl = function(url) {
    url = url.trim();
    url = url.replace(/^www\./, '');
    if (url.substr(-1) !== '/' && url.substr(-1) !== '*')
        return url + '/';
    return url;
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
    module.normalizeUrl = normalizeUrl;
} else {
    window.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
    window.normalizeUrl = normalizeUrl;
}