var React = require('react');

var NoteList = React.createClass({
  /* This compenent contains the list of individual notes */
  mixins: [ReactFireMixin],
  componentWillMount: function() {
    /* Grab the DB from firebase. Set the results as an array of notes. */
    firebaseRef = new Firebase("https://scrtchpd.firebaseio.com/notes");
    this.bindAsArray(firebaseRef, "notes");
  },
  componentDidMount: function() {
    this.setState({
      displayedNotes: this.state.notes
    })
  },
  activateNote: function(i, item) { 
    /* This takes the clicked note, and displays it's full content in the main text window */
    console.log('full note:' + item);
    this.props.updateNoteArea(item);
    /* this.props.updateNoteArea(item.note); */
  },
  render: function() {
    console.log(this.state.notes);
    return (
      <ul className="notes-list" >
        {this.state.notes.map(function(item, i) {
          /* Take the full note and cut it down to 50 characters */
          var note = item.note.substring(0,50);
          return (
            /* Using this li element here, because the onClick function doesn't want to work on the Note compenent below */
            <li onClick={this.activateNote.bind(this, i, item)} key={i}><strong>{item.updated_at}</strong>{note}</li>
            /* <Note onClick={this.activateNote.bind(this, i, item)} item={item} key={i} /> */ 
          );
        }, this)}
      </ul>
    );
  }
});

module.exports = NoteList;