var $ = require('jquery');
require('bootstrap');
var Backbone = require('backbone');
require('backbone-route-filter');
var Config = require('./config');
var Router = require('./router');
var BaseView = require('./base/views/Base');

App = {
    collections: {},
    views: {},
    router: {},
    loggedIn: false,

    init: function () {
        var that = this;

        // Set timeout for all AJAX requests
        $.ajaxSetup({timeout: 5000});

        // Default AJAX error handler
        $(document).ajaxError(function (e, xhr, options) {
            // Unauthorized
            if (xhr.status == 401) {
                that.removeToken();
                that.loggedIn = false;
                Backbone.history.navigate(Config.urls.pages.login, true);
            }
        });

        var token = that.getToken();
        if (token != null) {
            that.setAuthHeader(token);
            that.loggedIn = true;
        }

        // Render app frame
        that.views.base = new BaseView(that);

        // Init routing system
        that.router = new Router();

        return that;
    },

    getToken: function () {
        return window.localStorage.getItem('token');
    },

    setToken: function (token) {
        window.localStorage.setItem('token', token);
    },

    removeToken: function () {
        window.localStorage.removeItem('token');
    },

    // Set token for all Backbone's requests
    setAuthHeader: function (token) {
        $.ajaxSetup({
            beforeSend: function (xhr, settings) {
                xhr.setRequestHeader(
                    'Authorization',
                    'Token token="' + token + '"'
                );
            }
        });
    },

    // Unset token for Backbone's requests
    unsetAuthHeader: function () {
        $.ajaxSetup({
            beforeSend: function (xhr, settings) {}
        });
    },

    login: function (token) {
        this.setToken(token);
        this.setAuthHeader(token);
        this.loggedIn = true;

        // Rerender frame to show navigation
        window.App.views.base.render();
    },

    logout: function () {
        this.removeToken();
        this.unsetAuthHeader();
        this.loggedIn = false;

        // Rerender frame to hide navigation
        window.App.views.base.render();
    }
};

$(document).ready(function () {
    window.App = App.init();
});
