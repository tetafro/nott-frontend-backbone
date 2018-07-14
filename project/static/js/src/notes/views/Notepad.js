var _ = require('underscore');
var Backbone = require('backbone');
var Notepad = require('../models/Notepad');
var NotesCollection = require('../collections/Notes');
var NotesCollectionView = require('../views/NotesCollection');
var ModalView = require('../views/Modal');
var NotepadTemplate = require('raw-loader!../templates/Notepad.html');

module.exports = Backbone.View.extend({
    model: Notepad,
    tagName: 'li',
    attributes: function () {
        return {
            'data-type': 'notepad',
            'data-id': this.model.get('id')
        };
    },
    template: _.template(NotepadTemplate),

    events: {
        'click .item': 'open',
        'click .edit': 'showModal',
        'click .del': 'showModal'
    },

    initialize: function () {
        // NOTE: Sync, request and error events are propogated to
        // collection object and handled there to avoid double handling.
        // This is a valid logic since notepads lives only inside a
        // collection in this app.
        this.listenTo(this.model, 'change:title', this.rename);
        this.listenTo(this.model, 'change:active', this.onOpen);
        this.listenTo(this.model, 'destroy', this.onDestroy);
        this.render();
    },

    onDestroy: function () {
        window.App.views.base.hideLoadIcon();
        this.remove();
    },

    // Open notepad
    open: function () {
        this.model.open();
    },

    // Change view when element activated/deactivated
    onOpen: function () {
        this.$el.toggleClass('active');
    },

    // Modal window with details for CRUD operation
    showModal: function (event) {
        // Since lists are nested, clicking on child element
        // is propagating to all parents. It shouldn't happen.
        event.stopPropagation();

        if ($(event.currentTarget).hasClass('edit')) {
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
