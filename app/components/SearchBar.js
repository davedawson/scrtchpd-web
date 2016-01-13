var React = require('react');
var fuzzy = require('fuzzy');
var ReactDOM = require('react-dom');

var SearchBar = React.createClass({
  /* Search form. This component lives at the top of the Archive component above the notes list, */
  getInitialState: function() {
      return {searchKey: ""};
  },
  componentDidMount: function(){
    
  },
  focusField: function(){
    ReactDOM.findDOMNode(this.refs.searchInput).focus(); 
  },
  doSearch:function(event){
    var query=event.target.value; // this is the search text
    this.props.doSearch(query);
    console.log(fuzzy)
  },
  searchHandler: function(event) {
      var searchKey = event.target.value;
      this.setState({searchKey: searchKey});
      this.props.searchHandler(searchKey);
  },
  render: function() {
    if(this.props.focus){
      
    }
    console.log('focus', this.props.focus);
    return (
      <form>
         <input type="text" ref="searchInput" className="search-box" placeholder="Search your notes" value={this.props.query} onChange={this.doSearch}  />
      </form>
    )
  }
});

module.exports = SearchBar;