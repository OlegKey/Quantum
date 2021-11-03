function makeAnalyticsSessionId(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

window.Tracker = {
    getQueryParams: function () {
        if (this.query) {
            return this.query;
        }

        var queryParams = window.location.search.substring(1);
        var queryPairs = queryParams.split('&');

        var query = {};

        for (var i = 0; i < queryPairs.length; i++) {
            var queryPair = queryPairs[i]
            if (queryPair.indexOf('=') !== -1) {
                var parsedQueryPair = queryPair.split('=');
                query[parsedQueryPair[0]] = parsedQueryPair.slice(1).join('=')
            }
        }

        if (document.referrer) {
            query.utm_referrer = encodeURIComponent(document.referrer);
        }

        if (query.target && query.target[0] !== '/') {
            query.target = '/' + query.target;
        }

        this.query = query;
        return query;
    },

    getSessionId: function () {
        var ssid = window.localStorage.getItem('analytics_session_id');
        if (!ssid) {
            var queryParams = this.getQueryParams();
            ssid = queryParams['analytics_session_id'] || makeAnalyticsSessionId(10);
            window.localStorage.setItem('analytics_session_id', ssid);
        }

        return ssid;
    },

    pushEvent: function (event_name, context) {
        try {
            var session_id = this.getSessionId();

            var payload = {
                event: event_name,
                source: window.location.href,
                referer: document.referrer,
                click_token: window.localStorage.getItem('token') || null,
                context: context || {},
                frontend_version: window.appBuildVersion || null,
                analytics_session_id: session_id,
            }

            var _analyticXHR = new XMLHttpRequest()
            // _analyticXHR.withCredentials = true;
            _analyticXHR.open('POST', 'https://stat2trck.com/analytics' + window.location.search)
            _analyticXHR.setRequestHeader('Content-type', 'application/json')
            _analyticXHR.send(JSON.stringify(payload))
        } catch (e) {
            console.error('Unable to push data into analytics with error ', e);
        }
    },

    replaceUrls: function () {
        try {
            var analytics_session_id = this.getSessionId();
            var links = document.getElementsByTagName('a');
            for (var i = 0; i < links.length; i++) {
                links[i].href = links[i].href.indexOf('?') !== -1 ? links[i].href + '&analytics_session_id=' + analytics_session_id : links[i].href + '?analytics_session_id=' + analytics_session_id;
            }
        } catch (e) {
            console.error('Unable to replace document urls with error ' + e.message);
        }
    }
}
