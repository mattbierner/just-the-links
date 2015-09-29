"use strict";

var flatten = Function.prototype.apply.bind(Array.prototype.concat, []);

var ROOT = 'article';
var TOP_LEVEL_ELEMENTS = ['p', 'ul'];

var COMMON_WORDS = [
    'a',
    'also',
    'and',
    'for',
    'has',
    'in',
    'of',
    'or',
    'the',
    'with'];


var didExecute = false;

var escapeRegexp = function(word) {
    return word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

/**
    Combine the whitelist of words into a regular expression. 
*/
var createWhitelistRegexp = function(whitelist) {
    return new RegExp(
        '\\b(' + whitelist
            .map(escapeRegexp)
            .sort()
            .reverse()
            .join('|') + ')\\b',
        'gi');
}

/**
*/                                               
var forEachTextNode = function(base, f) {
    return base.contents().each(function() {                          
        switch (this.nodeType) {
        case 1:     return forEachTextNode($(this), f);
        case 3:     return f($(this));
        }
    });
}


var common = function(x) {
    return x.length <= 2 || COMMON_WORDS.indexOf(x.trim().toLowerCase()) >= 0;
};

var notCommon = function(x) { return !common(x); };

var isReservedWord = function(word, whitelistRegexp) {
    return word.match(whitelistRegexp);
};
    
var rewritePage = function() {
    didExecute = true;
    var links = [];
    $(ROOT).addClass('JTL');
      
    var targets = TOP_LEVEL_ELEMENTS.map(function(x) {
        return ROOT + " " + x;
    });
     
    $(targets.map(function(x) { return x + ' a'; }).join()).each(function() {
        var text = $(this).text();
        links.push(text);
    });
    
    // Normalize and remove common words
    links = flatten(links.map(function(link){
        var words = link.match(/\S+/g);
        return [link.trim()].concat(words ? flatten(words.filter(notCommon).map(function(x) { return [x, x + 's']; })) : []);
    }));


    var whitelistRegexp = createWhitelistRegexp(links);
    $(targets.join()).each(function() {
        forEachTextNode($(this), function(node) {
            node.replaceWith(
                node.text().split(whitelistRegexp).map(function(word) {
                    if (isReservedWord(word, whitelistRegexp)) {
                        return `<span class="iiiii-reserved-word">${word}</span>`;
                    } else {
                        return `<span class="iiiii-word"><span class="iiiii-word-inner">${word}</span></span>`;
                    }
                }))
        });
    });
};

/**
    Rewrite the current page.
*/
var rewrite = function() {
    return rewritePage();
};
/**
    Toggle rewrites on or off. 
    
    Does not persist anything. Can override excluded sites.
*/
var toggle = function() {
    if (didExecute) {
        $(ROOT).toggleClass('JTL');
    } else {
        rewrite();
    }
};


$(function() {

    $('#jtl, #logo').on('click', toggle);
});
