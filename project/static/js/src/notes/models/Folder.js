var Backbone = require('backbone');
var Config = require('../../config');

module.exports = Backbone.Model.extend({
    defaults: {
        id: null,
        title: null,
        parent_id: null
    },
    // To be able to determine what object type is current model
    type: 'folder',
    idAttribute: 'id',
    urlRoot: Config.urls.api.folders,

    parse: function (response, options) {
        if (options.collection) {
            return response;
        }
        return response.data;
    },

    validate: function (attributes) {
        if (!attributes.title) {
            return 'Title cannot be empty';
        }
        if (attributes.title.length > 80) {
            return 'Title is too long';
        }
    }
});
