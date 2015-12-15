var React = require('react');

var SearchBar = React.createClass({
  /* Search form. This component lives at the top of the Archive component above the notes list, */
  getInitialState: function() {
      return {searchKey: ""};
  },
  searchHandler: function(event) {
      var searchKey = event.target.value;
      this.setState({searchKey: searchKey});
      this.props.searchHandler(searchKey);
  },
  render: function() {
    return (
      <form>
         <input type="search" value={this.state.symbol} onChange={this.searchHandler}/>
      </form>
    )
  }
});

module.exports = SearchBar;