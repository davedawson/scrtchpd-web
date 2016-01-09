var React = require('react');
var TimeAgo = require('react-timeago');
var Rebase = require('re-base');

var NoteList = React.createClass({
  /* This compenent contains the list of individual notes */
  mixins: [ReactFireMixin],

  getInitialState: function(){
    return {
      notesListBase: ['a','b','v', '4']
    };
  },
  componentWillMount: function() {
    this.setState({
      displayedNotes: this.props.notes
    });
  },
  componentDidMount: function() {
    /*
    // I don't think I should have to use both Re-base and Firebase. But Re-base doesn't have the child functions to traverse
    // through the object tree (unless I'm missing something). And Firebase doesn't have the `then` function to only run
    // once the data has been returned. TODO
    firebaseRef = new Firebase("https://scrtchpd.firebaseio.com/");
    base = Rebase.createClass('https://scrtchpd.firebaseio.com');
    base.syncState('users/' + this.props.auth.uid + '/notes', {
      context: this,
      state: 'usersNoteKeys',
      asArray: false,
      queries: {
        limitToLast: 20
      },
      then: function() {
        // Iterate through the user's keys
        usersNotesList = [];
        Object.keys(this.state.usersNoteKeys).map(function(value, key, index) {
          
          // For each Note key, go and grab the Note record of the same key.
          firebaseRef.child("notes/" + value).on('value', function(snapshot) {
            // Add this full note record to our array.
            usersNotesList.push(snapshot.val());
          }); 
        });

        this.setState({
          // Add the full array of notes to state
          usersFullNotes: usersNotesList
        });
      }
    });
*/
  },
  activateNote: function(i, item) { 
    /* This takes the clicked note, and displays it's full content in the main text window */
    console.log('full note:' + item);
    this.props.updateNoteArea(item, this.state.usersNotesList);
    /* this.props.updateNoteArea(item.note); */
  },
  render: function() {    
    return (
      <ul className="notes-list" >      
        {this.props.notes.map(function(item, i) {
          /* Take the full note and cut it down to 50 characters */
          var note = item.note.substring(0,50);
          return (
            /* Using this li element here, because the onClick function doesn't want to work on the Note compenent below */
            <li onClick={this.activateNote.bind(this, i, item)} key={i}><strong><TimeAgo date={item.updated_at} /></strong>{note} {item['.key']}</li>
            /* <Note onClick={this.activateNote.bind(this, i, item)} item={item} key={i} /> */ 
          );
        }, this)}

      </ul>
    );
  }
});

module.exports = NoteList;