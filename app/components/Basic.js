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

// https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_Special_Characters
function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());
  
  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('^' + escapedValue, 'i');

  // return languages.filter(language => regex.test(language.name));
  return languages.filter(language => regex.test(language.name));

  // ---- This isn't working because This isn't defined, because this is outside of the Basic component. How do we transfer?
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  );
}

var Basic = React.createClass({
  getInitialState: function(){
    return {
      value: '',
      suggestions: 'getSuggestions'
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
      suggestions: getSuggestions(value)
    });
  },

  render: function() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Type 'c'",
      value,
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
