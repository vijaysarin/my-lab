var React = require('react'),
    ReactDOM = require('react-dom'),
    Container = require('./Container');

var App = React.createClass({
    render: function() {
        return (
            <div>                
                <Container />
            </div>
        );
    }
});

ReactDOM.render(
  <App/>,
  document.getElementById("reportingTool")
);
