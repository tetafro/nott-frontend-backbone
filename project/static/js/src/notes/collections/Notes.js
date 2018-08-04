var $ = require('jquery');
var Backbone = require('backbone');
var Config = require('../../config');
var Note = require('../models/Note');

module.exports = Backbone.Collection.extend({
    model: Note,
    url: Config.urls.api.notes,
    urlSearch: Config.urls.api.search,

    notepad: null,

    initialize: function () {
        this.listenTo(this, 'add', this.onAdd);
    },

    parse: function (response) {
        return response.data;
    },

    sortByField: function (field) {
        var oldComparator = this.comparator;

        this.comparator = function (model) {
            return model.get(field);
        };
        this.sort();

        this.comparator = oldComparator;
    },

    onAdd: function (note) {
        note.open();
    },

    switchNotepad: function (notepad) {
        var that = this;

        that.notepad = notepad;
        that.fetch({
            reset: true,
            data: $.param({
                'notepad_id': notepad.get('id')
            }),
            // Synchronize models with EditorsCollection
            success: function () {
                var note;
                var openedNote;

                for (var i = 0; i < that.length; i++) {
                    note = that.at(i);
                    openedNote = window.App.collections.editors.get(note.get('id'));
                    if (openedNote) {
                        that.models[i] = openedNote;
                    }
                }

                // Event to render view
                that.trigger('rerender');
            }
        });
    },

    search: function (key) {
        var that = this;

        that.fetch({
            url: that.urlSearch,
            reset: true,
            data: $.param({
                'key': key
            }),
            success: function () {
                // Event to render view
                that.trigger('rerender');
            }
        });
    },

    sortByField: function (field) {
        var oldComparator = this.comparator;

        this.comparator = function (model) {
            return model.get(field);
        };
        this.sort();

        this.comparator = oldComparator;
    },

    createOne: function (title, notepadId) {
        var that = this;
        var note = new Note({
            title: title,
            notepad_id: notepadId
        });
        note.save(null, {
            success: function (model, response, options) {
                that.add(model);
            }
        });

        return note;
    },

    editOne: function (note, title, notepadId) {
        note.set({
            title: title,
            notepad_id: notepadId
        });
        note.save();
    },

    deleteOne: function (note) {
        note.destroy({wait: true});
    }
});
