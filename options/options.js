/**
    Persist the current options from the ui.
*/
var saveOptions = function() {
    chrome.storage.sync.set({
        'mode': $('#mode').val(),
        'sites': $('#sites').val().split('\n').map(x => x.trim())
    });
};

/**
    Update the UI from the options object.
*/
var setOptions = function(options) {
    $('#mode').val(options.mode);
    $('#sites').val(options.sites.join('\n'))
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

