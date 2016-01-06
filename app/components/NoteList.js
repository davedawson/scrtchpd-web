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
    usersNotesRefTest = new Firebase("https://scrtchpd.firebaseio.com/users/" + this.props.auth.uid + "/notes");
    this.bindAsArray(usersNotesRefTest, "userNotesTest2");
    // fetch a list of user's notes
     usersNotesRefTest.on('child_added', function(snapshot) {
      // for each note, fetch the key and log it.
      // console.log(snapshot.key());
    });

    base = Rebase.createClass('https://scrtchpd.firebaseio.com');
    var testArray = ['a','b','c','4'];

    base.syncState('notes', {
      context: this,
      state: 'notesListBase',
      asArray: true,
      queries: {
        limitToLast: 20
      }
    });



    

/*     firebaseRef = new Firebase("https://scrtchpd.firebaseio.com/");
    this.props.userNotes.map(function(item, i) {         
      console.log('original map');
      firebaseRef.child("notes/" + item['.key'] + "/note").on('value', function(snapshot) {
        console.log("Mary is a member of this group: " + item['.key'])
      });      
    });
*/

  },
  loadedFromFirebase: function(){
    this.state.notesListBase.map(function(item, i) {         
      console.log('note from long list');
    });
  },
  componentDidMount: function() {
    console.log(this.state.notesListBase);
  },
  activateNote: function(i, item) { 
    /* This takes the clicked note, and displays it's full content in the main text window */
    console.log('full note:' + item);
    this.props.updateNoteArea(item, this.state.notes);
    /* this.props.updateNoteArea(item.note); */
  },
  render: function() {

    return (
      <ul className="notes-list" >      
      Notes:{this.state.notesListBase.length} 
        {this.props.userNotes.map(function(item, i) {          
          return (
            <li><strong>{i} - {item['.key']}</strong></li>
          );
          {firebaseRef.child("notes/" + item['.key'] + "/note").once('value', function(snapshot) {
            return (
              "Mary is a member of this group: "
              )
          }, this)}          
        }, this)}

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