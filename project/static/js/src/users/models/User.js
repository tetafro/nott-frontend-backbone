var Backbone = require('backbone');
var Config = require('../../config');

module.exports = Backbone.Model.extend({
    defaults: {
        id: null,
        email: null,
        password: null
    },
    idAttribute: 'id',
    url: function () {
        return Config.urls.api.profile;
    },
    parse: function (response) {
        return response.data;
    }
});
