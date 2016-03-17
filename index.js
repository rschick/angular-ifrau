angular.module('angular-ifrau', [
])

.provider('AppHost', function AppHostProvider() {

	var conf = {};
	var client;
	var ifrauClient;
	var connected = false;

	function connect(_ifrauClient) {
		ifrauClient = _ifrauClient;
	}

	this.connect = connect;

	this.$get = ['$q', function AppHostFactory($q) {

		function AppHost() {

			function connect() {

				if (connected) {
					return $q.when(conf);
				}

				var defer = $q.defer();
				client = new ifrauClient();
				client.onEvent('cabinet.frapps.config', function(config) {
					connected = true;
					conf = _.assign(conf, config);
					defer.resolve(conf);
				});
				client.connect();
				return defer.promise;
			}

			function sendEvent(eventName, payload) {
				client.sendEvent(eventName, payload);
			}

			function sendMessage(level, message) {
				sendEvent('message', {
					level: level,
					message: message
				});
			}

			function request(type, options) {
				return client.request(type, options);
			}

			function navigate(url) {
				client.navigate(url);
			}

			function getService(serviceType, version) {
				return client.getService(serviceType, version);
			}

			this.sendEvent = sendEvent;
			this.sendMessage = sendMessage;
			this.conf = conf;
			this.navigate = navigate;
			this.connect = connect;
			this.request = request;
			this.getService = getService;
		}

		return new AppHost();
	}];
});
