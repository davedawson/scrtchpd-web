// var React = require('react');
// var Autosuggest = require('react-autosuggest');
// const languages = [
//   {
//     name: 'C',
//     year: 1972
//   },
//   {
//     name: 'C#',
//     year: 2000
//   },
//   {
//     name: 'C++',
//     year: 1983
//   },
//   {
//     name: 'Clojure',
//     year: 2007
//   },
//   {
//     name: 'Elm',
//     year: 2012
//   },
//   {
//     name: 'Go',
//     year: 2009
//   },
//   {
//     name: 'Haskell',
//     year: 1990
//   },
//   {
//     name: 'Java',
//     year: 1995
//   },
//   {
//     name: 'Javascript',
//     year: 1995
//   },
//   {
//     name: 'Perl',
//     year: 1987
//   },
//   {
//     name: 'PHP',
//     year: 1995
//   },
//   {
//     name: 'Python',
//     year: 1991
//   },
//   {
//     name: 'Ruby',
//     year: 1995
//   },
//   {
//     name: 'Scala',
//     year: 2003
//   }
// ];

// // https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
// function escapeRegexCharacters(str) {
//   return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// }

// function getSuggestions(value) {
//   const escapedValue = escapeRegexCharacters(value.trim());
  
//   if (escapedValue === '') {
//     return [];
//   }

//   const regex = new RegExp('^' + escapedValue, 'i');

//   // return languages.filter(language => regex.test(language.name));
//   return languages.filter(language => regex.test(language.name));

//   // ---- This isn't working because This isn't defined, because this is outside of the Basic component. How do we transfer?
// }

// function getSuggestionValue(suggestion) {
//   return suggestion.name;
// }

// function renderSuggestion(suggestion) {
//   return (
//     <span>{suggestion.name}</span>
//   );
// }

// class Basic extends React.Component {
//   componentWillMount(){
//     var notesList = this.props.noteList;
//     console.log(notesList);
//   }
//   constructor() {
//     super();

//     this.state = {
//       value: '',
//       suggestions: getSuggestions('')
//     };
    
//     this.onChange = this.onChange.bind(this);
//     this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
//   }

//   onChange(event, { newValue, method }) {
//     this.setState({
//       value: newValue
//     });
//   }
  
//   onSuggestionsUpdateRequested({ value }) {
//     this.setState({
//       suggestions: getSuggestions(value)
//     });
//   }

//   render() {
//     const { value, suggestions } = this.state;
//     const inputProps = {
//       placeholder: "Type 'c'",
//       value,
//       onChange: this.onChange
//     };

//     return (
//       <Autosuggest suggestions={suggestions}
//                    onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
//                    getSuggestionValue={getSuggestionValue}
//                    renderSuggestion={renderSuggestion}
//                    inputProps={inputProps} />
//     );
//   }
// }

// module.exports = Basic;


var React = require('react');
var Autosuggest = require('react-autosuggest');
var AutosuggestHighlight = require('autosuggest-highlight');
const languages = [
  {
    name: 'C',
    year: 1972
  },
  {
    name: 'C#',
    year: 2000
  },
  {
    name: 'C++',
    year: 1983
  },
  {
    name: 'Clojure',
    year: 2007
  },
  {
    name: 'Elm',
    year: 2012
  },
  {
    name: 'Go',
    year: 2009
  },
  {
    name: 'Haskell',
    year: 1990
  },
  {
    name: 'Java',
    year: 1995
  },
  {
    name: 'Javascript',
    year: 1995
  },
  {
    name: 'Perl',
    year: 1987
  },
  {
    name: 'PHP',
    year: 1995
  },
  {
    name: 'Python',
    year: 1991
  },
  {
    name: 'Ruby',
    year: 1995
  },
  {
    name: 'Scala',
    year: 2003
  }
];

var testData = [
  {
    name: 'testing 1',
    note: 'Testing 1 note'
  },
  {
    name: 'testing 2',
    note: 'Testing 2 note'
  },
  {
    name: 'testing 3',
    note: 'Testing 3 note'
  },
  {
    name: 'testing 4',
    note: 'Testing 4 note'
  }
]

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// function getSuggestions(value) {
//   const escapedValue = escapeRegexCharacters(value.trim());
  
//   if (escapedValue === '') {
//     return [];
//   }

//   const regex = new RegExp('^' + escapedValue, 'i');

//   // return languages.filter(language => regex.test(language.name));
//   return languages.filter(language => regex.test(language.name));

//   // ---- This isn't working because This isn't defined, because this is outside of the Basic component. How do we transfer?
// }

function getSuggestionValue(suggestion) {
  return suggestion.note;
}

function renderSuggestion(suggestion, { value, valueBeforeUpDown }) {
  // return (
  //   <span>{suggestion.note}</span>
  // );
  const suggestionText = `${suggestion.updated_at} ${suggestion.note}`;
  const query = (valueBeforeUpDown || value).trim();
  const matches = AutosuggestHighlight.match(suggestionText, query);
  const parts = AutosuggestHighlight.parse(suggestionText, matches);
  // var top = parts[0][text];
  // var bottom = parts[2].text.substr(0, parts[2].text.length-50); 
  console.log(parts);
  return (
    <span className={'suggestion-content ' + suggestion.twitter}>
      <span className="name">
        {
          parts.map((part, index) => {
            const className = part.highlight ? 'highlight' : null;
            // var shortPart = part.text.substring(0,10);
            var shortPart = part.text.substr(part.text.length - 5);

            if (index == 0) {
              var first = part.text.substr(part.text.length - 70);
              return (
                <span className={className} key={index}>{first}</span>
              );
            } else if (index == 1) {
              console.log('not first');
              return (
                <span className={className} key={index}>{part.text}</span>
              );  
            } else {
                var last = part.text.substring(0, 70);
                
                return (
                  <span className={className} key={index}>{last}</span>
                );  
            }
            
          })
        }
      </span>
    </span>
  );
}

var Basic = React.createClass({

  getSuggestions: function(value) {
    const escapedValue = escapeRegexCharacters(value.trim());
    
    if (escapedValue === '') {
      return [];
    }

    // const regex = new RegExp('^' + escapedValue, 'i');
    const regex = new RegExp(escapedValue, 'i');
    
    // return languages.filter(language => regex.test(language.name));
    var notes = this.props.noteList
    // console.log(notes);
    // console.log(languages);
    
    return this.props.noteList.filter(note => regex.test(note.note));
    // return notes.filter(note => regex.test(note.note));
  },

  getInitialState: function(){
    return {
      value: '',
      suggestions: this.getSuggestions(''),
      testData: testData
    }
  },
  componentWillMount: function(){
    var notesList = this.props.noteList;
    console.log(notesList);
  },
  onInputChange: function(event, { newValue, method }){
    this.setState({
      value: newValue
    });
  },
  // constructor() {
  //   super();

  //   this.state = {
  //     value: '',
  //     suggestions: getSuggestions('')
  //   };
    
  //   this.onChange = this.onChange.bind(this);
  //   this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
  // }

  // onChange(event, { newValue, method }) {
  //   this.setState({
  //     value: newValue
  //   });
  // }
  
  onSuggestionsUpdateRequested: function({ value }) {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
  },

  render: function() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Search your notes",
      value,
      type: 'search',
      onChange: this.onInputChange
    };

    return (
      <Autosuggest suggestions={suggestions}
                   onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
                   getSuggestionValue={getSuggestionValue}
                   renderSuggestion={renderSuggestion}
                   inputProps={inputProps} />
    );
  }
});

module.exports = Basic;
