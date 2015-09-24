var flatten = Function.prototype.apply.bind(Array.prototype.concat, []);

var didExecute = false;

var escapeRegexp = function(word) {
  return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}; 

/**
    Combine the whitelist of words into a regular expression. 
*/
var createWhitelistRegexp = function(whitelist) {
    return new RegExp(
        '\\b(' + whitelist.map(escapeRegexp).sort().reverse().join('|') + ')\\b',
        'gi');
};

var toPercent = function(x) {
    return Math.round(x * 100);
};

/**
*/                                               
var forEachTextNode = function(base, f) {
    return base.contents().each(function() {                          
        switch (this.nodeType) {
        case 1:     return forEachTextNode($(this), f);
        case 3:     return f($(this));
        }
    });
};

var commonWords = {
    'a': true,
    's': true,
    'and': true,
    'for': true,
    'in': true,
    'of': true,
    'or': true,
    'the': true,
    'with': true,
};

var common = function(x) {
    if (x.length <= 2)
        return true;
    return commonWords[x.trim().toLowerCase()];
};

var notCommon = function(x) {
    return !common(x);
};

var rewritePage = function(targets) {
    didExecute = true;
    links = [];
    $('#mw-content-text').addClass('JTL');
       
    $('#mw-content-text p a').each(function() {
        var text = $(this).text();
        links.push(text);
    });
    
    links = flatten(links.map(function(link) {
        var words = link.match(/\S+/g);
        return words ? words.filter(notCommon) : [];
    }));
    
    var whitelistRegexp = createWhitelistRegexp(links);
    $('#mw-content-text p').each(function() {
        var total = 0;
        var reserved = 0;
        forEachTextNode($(this), function(node) {
            node.replaceWith(
                node.text().split(whitelistRegexp).map(function(word) {
                    if (word.match(whitelistRegexp)) {
                        ++reserved;
                        ++total;
                        return '<span class="iiiii-reserved-word">' + word + '</span>';
                    } else {
                        return '<span class="iiiii-word"><span class="iiiii-word-inner">' + word + '</span></span>';
                    }
                }))
        });
        $(this).attr('title', toPercent(reserved / total));
    });
};

var rewrite = function () {
    chrome.runtime.sendMessage({method: "getOptions"}, function(options) {
        $(function() {
            rewritePage(options.elements, options.whitelist);
        });
    });
};

/**
    Toggle rewrites on or off. 
    
    Does not persist anything. Can override excluded sites.
*/
var toggle = function() {
    if (didExecute) {
        $('body').toggleClass('iiiii-override');
    } else {
        rewrite();
    }
};

/**
    List for events from popup
*/
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.method) {
    case 'toggle':
        toggle();
        sendResponse({});
        break;
    
    case 'disable':
        $('body').addClass('iiiii-override');
        sendResponse({});
        break;
    
    default:
        sendResponse({});
        break;
    }
});

/**
    Should the page be rewritten?
*/
var isTargetedPage = function(options, location) {
    var url = normalizeUrl(location.hostname + location.pathname);
    return location.hostname.match(/\w+\.wikipedia\.org/);
};

var tryRewrite = function(options) {
    if (isTargetedPage(options, window.location)) {
        rewrite(options);
    }
};

chrome.runtime.sendMessage({method: "getOptions"}, tryRewrite);


