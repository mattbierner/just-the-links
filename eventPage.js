chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.method) {
    case 'getOptions':
        chrome.storage.sync.get(DEFAULT_OPTIONS, sendResponse);
        return true;
    }
});

