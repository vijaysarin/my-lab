// requiring superagent-bluebird-promise plugin

var request = require('superagent-bluebird-promise');

// SuperAgent module

var superAgentRequestButton = document.getElementById("superAgentRequestButton");

// holds every request

var _superAgentAjaxRequests = [];

// superagent call - sending the request

var callToServer = function () {
    if (_superAgentAjaxRequests.length > 0) {
        var lastPromise = _superAgentAjaxRequests[0];
        _superAgentAjaxRequests = [];
        lastPromise.cancel();
    }
    var promise = request
        .get('/data/test-data.json')
        .timeout(600000)
        .query({
            format: 'json'
        })
        .set('X-Custom-Header', 'foobar')
        .set('Accept', 'application/json')
        .type('application/json')
        .accept('application/json')
        .then(function (res) {
            console.log(res);
        }, function (error) {
            console.log(error);
        });
    _superAgentAjaxRequests.push(promise);
}

// adding event listener here as we are using Browserify module system

superAgentRequestButton.addEventListener('click', callToServer);
