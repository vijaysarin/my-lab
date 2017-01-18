// request prerequisites
var requestConfig = {
  method: 'get',
  timeout: 600000,
  headers: {
    'X-Custom-Header': 'foobar'
  },
  responseType: 'json'
};

// setting BlueBird promise as cancellable 
Promise.config({
  cancellation: true
});

// holds every request
var _axiosAjaxRequests = [];

// axios call - sending the request
function callToServer() {
  if (_axiosAjaxRequests.length > 0) {
    var lastPromise = _axiosAjaxRequests[0];
    _axiosAjaxRequests = [];
    lastPromise.cancel();
  }
  var promise = axios.get('/data/test-data.json', null, requestConfig).then(function (response) {
    console.log(response.status + " : " + response.statusText);
  }).catch(function (response) {
    if (response instanceof Error) {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', response.message);
    } else {
      // The request was made, but the server responded with a status code
      // that falls out of the range of 2xx
      console.log(response.status + " : " + response.statusText);
    }
  });
  _axiosAjaxRequests.push(promise);
}
