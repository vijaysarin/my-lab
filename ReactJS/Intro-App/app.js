var React = require('react');
var ReactDOM = require('react-dom');

var Hello = React.createClass({
		render : function () {
			return  < h3 > Hello {
				this.props.name
			}
			 <  / h3 > ;
		}
	});
ReactDOM.render(
	 < h1 > Hello, world! <  / h1 > ,
	document.getElementById('example1'));
ReactDOM.render(
	 < Hello name = "World" /  > ,
	document.getElementById('example2'));

var Hello = React.createClass({
		displayName : 'Hello',
		render : function () {
			return React.createElement("div", null, "Hello ", this.props.name + "?");
		}
	});

var el = React.createElement(Hello, {
		name : "World"
	});

ReactDOM.render(
	el,
	document.getElementById('example3'));
