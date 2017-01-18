var React = require('react'),
    ReactDOM = require('react-dom'),
    ReactDnD = require('react-dnd'),
    ItemTypes = require('./ItemTypes');

var boxSource = {
    beginDrag: function(props) {
        return {
            name: props.name
        };
    },
    endDrag: function(props, monitor) {
        var item = monitor.getItem();
        var dropResult = monitor.getDropResult();
        if (dropResult) {  
            var node = ReactDOM.findDOMNode(document.getElementById(props.id));
            var reportView = document.getElementById(dropResult.id); 
            var clonedNode = node.cloneNode(true);
            clonedNode.id = "";
            clonedNode.style.height = "100%";
            clonedNode.style.width = "100%";
            clonedNode.style.display = "block";
            clonedNode.style.padding = "2px";
            clonedNode.childNodes[0].style.height = "100%";
            clonedNode.childNodes[0].style.width = "100%";
            clonedNode.childNodes[0].style.lineHeight = "normal";
            clonedNode.childNodes[0].style.margin = "0px";
            clonedNode.childNodes[0].style.padding = "0px";
            var deleteNodeButton = document.createElement("input");
            deleteNodeButton.type = "button";
            deleteNodeButton.value = "Remove";
            deleteNodeButton.style.cssText = "height:18px;width:55px;font-size:10px;margin:10px;position:absolute;top:0;right:0;border: 1px solid #B0B0B0;background-color: #000;font-weight: bold;color: #FFF;";
            deleteNodeButton.addEventListener('click', function(event){
              deleteNodeButton.parentNode.remove();
            });
            clonedNode.appendChild(deleteNodeButton);
            reportView.appendChild(clonedNode);
        }
    }
};

var CarouselCard = React.createClass({
    propTypes: {
        connectDragSource: React.PropTypes.func.isRequired,
        isDragging: React.PropTypes.bool.isRequired,
        name: React.PropTypes.string.isRequired
    },
    render: function() {        
        return (
            this.props.connectDragSource(
                <div {...this.props}><h3>{this.props.name}</h3></div>
            )
        );
    }
});

module.exports = ReactDnD.DragSource(ItemTypes.BOX, boxSource, function (connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
})(CarouselCard);