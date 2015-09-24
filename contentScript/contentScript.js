"use strict";

const flatten = Function.prototype.apply.bind(Array.prototype.concat, []);

const ROOT = '#mw-content-text';
const TOP_LEVEL_ELEMENTS = ['p', 'ul'];

const COMMON_WORDS = [
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

const escapeRegexp = (word) =>
    word.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

/**
    Combine the whitelist of words into a regular expression. 
*/
const createWhitelistRegexp = (whitelist) =>
    new RegExp(
        '\\b(' + whitelist
            .map(escapeRegexp)
            .sort()
            .reverse()
            .join('|') + ')\\b',
        'gi');

/**
*/                                               
const forEachTextNode = (base, f) =>
    base.contents().each(function() {                          
        switch (this.nodeType) {
        case 1:     return forEachTextNode($(this), f);
        case 3:     return f($(this));
        }
    });


const common = x =>
    x.length <= 2 || COMMON_WORDS.indexOf(x.trim().toLowerCase()) >= 0;

const notCommon = x => !common(x);

const isReservedWord = (word, whitelistRegexp) =>
    word.match(whitelistRegexp);
    
const rewritePage = function() {
    didExecute = true;
    var links = [];
    $(ROOT).addClass('JTL');
      
    const targets = TOP_LEVEL_ELEMENTS.map(x => ROOT + " " + x); 
    $(targets.map(x => x + ' a').join()).each(function() {
        const text = $(this).text();
        links.push(text);
    });
    
    // Normalize and remove common words
    links = flatten(links.map(link => {
        const words = link.match(/\S+/g);
        return words ? words.filter(notCommon) : [];
    }));


    const whitelistRegexp = createWhitelistRegexp(links);
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
const rewrite = (options) =>
    $(() => rewritePage(options.elements, options.whitelist));

/**
    Toggle rewrites on or off. 
    
    Does not persist anything. Can override excluded sites.
*/
const toggle = () => {
    if (didExecute) {
        $(ROOT).toggleClass('JTL');
    } else {
        rewrite();
    }
};

/**
    Should the page be rewritten?
*/
const isTargetedPage = (options, location) => 
    location.hostname.match(/\w+\.wikipedia\.org/);

/**
    Try to rewrite the current page.
*/
const tryRewrite = (options) => {
    if (isTargetedPage(options, window.location))
        rewrite(options);
};

/**
    List for events from popup
*/
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
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

chrome.runtime.sendMessage({method: "getOptions"}, tryRewrite);


