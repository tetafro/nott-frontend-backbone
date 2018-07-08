var _ = require('underscore');
var Backbone = require('backbone');
var Config = require('../../config');

module.exports = Backbone.Model.extend({
    defaults: {
        id: null,
        title: null,
        folder_id: null,
        created: null,
        updated: null,

        active: false
    },
    // Interface fields, not stored in DB
    dontSync: [
        'active'
    ],
    // To be able to determine what object type is current model
    type: 'notepad',
    idAttribute: 'id',
    urlRoot: Config.urls.api.notepads,

    validate: function (attributes) {
        if (!attributes.title) {
            return 'Title cannot be empty';
        }
        if (attributes.title.length > 80) {
            return 'Title is too long';
        }
    },

    open: function () {
        this.collection.setActive(this);
        window.App.collections.notes.switchNotepad(this);
    },

    // Filter the data to send to the server
    save: function (attrs, options) {
        attrs || (attrs = _.clone(this.attributes));
        options || (options = {});

        attrs = _.omit(attrs, this.dontSync);
        options.data = JSON.stringify(attrs);

        // Proxy the call to the original save function
        return Backbone.Model.prototype.save.call(this, attrs, options);
    }
});
