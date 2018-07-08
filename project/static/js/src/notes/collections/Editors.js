var Backbone = require('backbone');
var Note = require('../models/Note');

module.exports = Backbone.Collection.extend({
    model: Note,

    initialize: function () {
        this.listenTo(this, 'remove', this.onRemove);
    },

    // This fires when tab is closed and when model is destroyed
    onRemove: function (note) {
        // Make active first of remaining opened notes
        if (this.length && note.get('active')) {
            this.at(0).set('active', true);
        }

        note.set({active: false, opened: false});
    },

    openOne: function (note) {
        this.each(function (eachNote) {
            eachNote.set('active', false);
        });
        note.set({active: true, opened: true});

        if (!this.contains(note)) {
            window.App.collections.editors.add(note);
        }
    },

    sortByField: function (field) {
        var oldComparator = this.comparator;

        this.comparator = function (model) {
            return model.get(field);
        };
        this.sort();

        this.comparator = oldComparator;
    },

    closeOne: function (note) {
        // Remove from opened
        this.remove(note);
    }
});
