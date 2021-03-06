var _ = require('underscore');
var $ = require('jquery');
var Backbone = require('backbone');
var Folder = require('../models/Folder');
var ModalView = require('../views/Modal');
var FolderTemplate = require('raw-loader!../templates/Folder.html');

module.exports = Backbone.View.extend({
    model: Folder,
    tagName: 'li',
    attributes: function () {
        return {
            'data-type': 'folder',
            'data-id': this.model.get('id')
        };
    },
    template: _.template(FolderTemplate),

    events: {
        'click .expand': 'expand',
        'click .add': 'showModal',
        'click .edit': 'showModal',
        'click .del': 'showModal'
    },

    initialize: function () {
        // NOTE: Sync, request and error events are propogated to
        // collection object and handled there to avoid double handling.
        // This is a valid logic since folders lives only inside a
        // collection in this app.
        this.listenTo(this.model, 'change:title', this.rename);
        this.listenTo(this.model, 'destroy', this.onDestroy);
        this.render();
    },

    onDestroy: function () {
        window.App.views.base.hideLoadIcon();
        this.remove();
    },

    // Open folder: show subfolder and change icon
    expand: function (event) {
        event.stopPropagation();
        this.$('> ul').collapse('toggle');
        this.$('> div > a > i')
            .toggleClass('glyphicon-folder-open')
            .toggleClass('glyphicon-folder-close');
    },

    // Modal window with details for CRUD operation
    showModal: function (event) {
        // Since lists are nested, clicking on child element
        // is propagating to all parents. It shouldn't happen.
        event.stopPropagation();

        if ($(event.currentTarget).hasClass('add')) {
            window.App.views.page.showModal({
                action: 'create',
                parentId: this.model.get('id'),
                type: 'folder'
            });
        } else if ($(event.currentTarget).hasClass('edit')) {
            window.App.views.page.showModal({
                model: this.model,
                action: 'edit'
            });
        } else if ($(event.currentTarget).hasClass('del')) {
            window.App.views.page.showModal({
                model: this.model,
                action: 'delete'
            });
        }
    },

    rename: function () {
        this.$('> div > a > span').html(this.model.get('title'));
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
    }
});
