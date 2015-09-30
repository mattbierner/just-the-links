var DEFAULT_OPTIONS = {
    'sites': [
        '*.wikipedia.org'],
    'mode': 'hyperlinks'
};


if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
} else {
    window.DEFAULT_OPTIONS = DEFAULT_OPTIONS;
}