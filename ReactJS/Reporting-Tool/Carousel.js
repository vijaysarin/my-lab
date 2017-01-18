var React = require('react'),
    Slider = require('react-slick'),
    CarouselCard = require('./CarouselCard');

var Carousel = React.createClass({    
    render: function() {
        var carouselStyle = {
          height: "138px",
          margin: "0 auto",
          width: "90%",
          color: "#333",
          background: "#419be0"
        };
        var settings = {
          dots: true,
          arrows:true,	
          infinite: false,
          initialSlide:0,
          slidesToShow: 5,
          lazyLoad: false,
          centerMode:false,
          swipe:false,
          swipeToSlide:false,
          centerPadding:'60px',
          className:"center"
        }
        return (
          <div style={carouselStyle} id="carouselContainer">
          <Slider {...settings}>
          <CarouselCard name="0" id="CarouselCard-0"/>
          <CarouselCard name="1" id="CarouselCard-1"/>
          <CarouselCard name="2" id="CarouselCard-2"/>
          <CarouselCard name="3" id="CarouselCard-3"/>
          <CarouselCard name="4" id="CarouselCard-4"/>
          <CarouselCard name="5" id="CarouselCard-5"/>
          <CarouselCard name="6" id="CarouselCard-6"/>
          <CarouselCard name="7" id="CarouselCard-7"/>
          <CarouselCard name="8" id="CarouselCard-8"/>
          <CarouselCard name="9" id="CarouselCard-9"/>          
          <CarouselCard name="10" id="CarouselCard-10"/>
          <CarouselCard name="11" id="CarouselCard-11"/>
          </Slider>
          </div>
        );
    }
});

module.exports = Carousel;