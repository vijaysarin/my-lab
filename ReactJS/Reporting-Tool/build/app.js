var React = require('react');
var ReactDOM = require('react-dom');
var Slider = require('react-slick');
var ReactSlickDemo = React.createClass({
  displayName: 'ReactSlickDemo',

  render: function () {
    var settings = {
      dots: true,
      arrows: true,
      slidesToShow: 3,
      centerMode: true,
      centerPadding: '200px'
    };
    return React.createElement(
      Slider,
      settings,
      React.createElement(
        'div',
        null,
        React.createElement(
          'h3',
          null,
          '1'
        )
      ),
      React.createElement(
        'div',
        null,
        React.createElement(
          'h3',
          null,
          '2'
        )
      ),
      React.createElement(
        'div',
        null,
        React.createElement(
          'h3',
          null,
          '3'
        )
      ),
      React.createElement(
        'div',
        null,
        React.createElement(
          'h3',
          null,
          '4'
        )
      ),
      React.createElement(
        'div',
        null,
        React.createElement(
          'h3',
          null,
          '5'
        )
      ),
      React.createElement(
        'div',
        null,
        React.createElement(
          'h3',
          null,
          '6'
        )
      )
    );
  }
});

ReactDOM.render(React.createElement(
  'h1',
  null,
  'Hello, world!'
), document.getElementById("widgetCarousel"));