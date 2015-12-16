var React = require('react');

var SearchBar = React.createClass({
  /* Search form. This component lives at the top of the Archive component above the notes list, */
  getInitialState: function() {
      return {searchKey: ""};
  },
  doSearch:function(event){
    var query=event.target.value; // this is the search text
    this.props.doSearch(query);
  },
  searchHandler: function(event) {
      var searchKey = event.target.value;
      this.setState({searchKey: searchKey});
      this.props.searchHandler(searchKey);
  },
  render: function() {
    return (
      <form>
         <input type="search" value={this.state.symbol}  ref="searchInput" value={this.props.query} onChange={this.doSearch} />
      </form>
    )
  }
});

module.exports = SearchBar;