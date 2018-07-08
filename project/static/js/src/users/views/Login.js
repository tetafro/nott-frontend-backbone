var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
var Config = require('../../config');
var LoginTemplate = require('raw-loader!../templates/Login.html');

module.exports = Backbone.View.extend({
    el: function () {
        return $('#content');
    },
    template: _.template(LoginTemplate),

    events: {
        'click a.goto': 'goto',
        'click [type="submit"]': 'login',
        'keypress input': 'login'
    },

    initialize: function () {
        window.App.views.page = this;
        this.render();
    },

    goto: function (event) {
        event.preventDefault();
        var href = event.currentTarget.getAttribute('href');
        Backbone.history.navigate(href, true);
    },

    addError: function (msg, $element) {
        if (typeof $element !== 'undefined') {
            $element.closest('.form-group').addClass('has-error');
        }
        this.$('.auth-errors').html(
            this.$('.auth-errors').html() +
            '<p>' + msg + '</p>'
        );
    },

    clearErrors: function () {
        this.$('.form-group').removeClass('has-error');
        this.$('.auth-errors').text('');
    },

    validate: function () {
        var $email = this.$('input[name="email"]');
        var $password = this.$('input[name="password"]');

        var hasErrors = false;
        if ($email.val() == '') {
            this.addError($email, 'Email cannot be empty');
            hasErrors = true;
        }
        if ($password.val() == '') {
            this.addError($password, 'Password cannot be empty');
            hasErrors = true;
        }
        return hasErrors;
    },

    login: function (event) {
        var that = this;

        // Catch only pressing Enter
        if (event.type == 'keypress' && event.keyCode != 13) {
            return;
        }
        event.preventDefault();

        // Validate
        that.clearErrors();
        var hasErrors = that.validate();
        if (hasErrors) {
            return;
        }

        var email = that.$('input[name="email"]').val();
        var password = that.$('input[name="password"]').val();

        // Login on backend, get auth token in response
        // and save it to local storage
        $.ajax({
            url: Config.urls.api.login,
            contentType: 'application/json',
            dataType: 'json',
            method: 'POST',
            data: JSON.stringify({
                'email': email,
                'password': password
            }),
            success: function (response) {
                // Invalid response
                if (!('data' in response && 'string' in response.data)) {
                    that.addError('Invalid response from server');
                    return;
                }
                window.App.login(response.data.string);
                Backbone.history.navigate('/', true);
            },
            error: function (response) {
                var data = response.responseJSON;

                // Invalid responses
                if (typeof data === 'undefined' || !('error' in data)) {
                    that.addError('Unexpected error');
                    return;
                }

                that.addError('Authentication error: ' + data.error);
            }
        });
    },

    render: function () {
        this.$el.html(this.template());
    }
});
