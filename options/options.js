/**
    Persist the current options from the ui.
*/
var saveOptions = function() {
    chrome.storage.sync.set({
        'whitelist':  $('#whitelist').val().split(',').map(function(x) {
            return x.trim();
        }),
        'elements': $('#elements').val(),
        'excludedSites': $('#excluded-sites').val().split('\n').map(normalizeUrl)
    });
};

/**
    Update the UI from the options object.
*/
var setOptions = function(options) {
    $('#whitelist').val(options.whitelist.join(', '));
    $('#elements').val(options.elements);
    $('#excluded-sites').val(options.excludedSites.join('\n'))
};

/**
    Load and set the currently persisted options from storage.
*/
var restoreOptions = function() {
    chrome.storage.sync.get(DEFAULT_OPTIONS, setOptions);
};

/**
*/
var resetOptions = function() {
    chrome.storage.sync.set(DEFAULT_OPTIONS, setOptions);
};

document.addEventListener('DOMContentLoaded', restoreOptions);

$('#reset').click(resetOptions);
$('#save').click(saveOptions);

