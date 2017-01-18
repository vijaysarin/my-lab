var React = require('react');
var ReactDOM = require('react-dom');

var Hello = React.createClass({
	displayName: 'Hello',

	render: function () {
		return React.createElement(
			'h3',
			null,
			' Hello ',
			this.props.name
		);
	}
});
ReactDOM.render(React.createElement(
	'h1',
	null,
	' Hello, world! '
), document.getElementById('example1'));
ReactDOM.render(React.createElement(Hello, { name: 'World' }), document.getElementById('example2'));

var Hello = React.createClass({
	displayName: 'Hello',
	render: function () {
		return React.createElement("div", null, "Hello ", this.props.name + "?");
	}
});

var el = React.createElement(Hello, {
	name: "World"
});

ReactDOM.render(el, document.getElementById('example3'));