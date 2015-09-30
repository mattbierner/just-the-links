/**
    Send a message to the active tab.
*/
var sendMessage = function(msg, response) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, msg, response);
    });
};

/**
    Toggle the content script on or off.
*/
var toggleContentScript = function() {
    sendMessage({method: "toggle"});
};


/**
    Toggle the effect on or off.
*/
var toggle = function() {
    toggleContentScript();
};

$(function(){

$('#toggle').click(toggle);

$('#options').click(function(){
    chrome.runtime.openOptionsPage();
});

});