var Backbone = require('backbone');
var Config = require('../../config');

module.exports = Backbone.Model.extend({
    defaults: {
        id: null,
        title: null,
        parent_id: null,
        created: null,
        updated: null
    },
    // To be able to determine what object type is current model
    type: 'folder',
    idAttribute: 'id',
    urlRoot: Config.urls.api.folders,

    validate: function (attributes) {
        if (!attributes.title) {
            return 'Title cannot be empty';
        }
        if (attributes.title.length > 80) {
            return 'Title is too long';
        }
    }
});
