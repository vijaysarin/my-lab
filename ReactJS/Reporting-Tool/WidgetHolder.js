var React = require('react'),
    ItemTypes = require('./ItemTypes'),
    ReactDnD = require('react-dnd');

var boxTarget = {
    drop: function() {    
        return { id: arguments[0].id, name: 'WidgetHolder' };
    }
};

var WidgetHolder = React.createClass({
    propTypes: {
        connectDropTarget: React.PropTypes.func.isRequired,
        isOver: React.PropTypes.bool.isRequired,
        canDrop: React.PropTypes.bool.isRequired
    },
    render: function() {
        var isActive = this.props.canDrop && this.props.isOver;
        if (isActive) {
            this.props.style.backgroundColor = 'darkgreen';
            this.props.style.color = 'white';
            this.props.style.border = '1px dotted #B0B0B0';
        } else if (this.props.canDrop) {
            this.props.style.backgroundColor = '#FFF';
            this.props.style.border = '2px dashed #B0B0B0';
            this.props.style.color = '#333';
        } else {
            this.props.style.backgroundColor = '#F8F8FF';
            this.props.style.color = '#333';
            this.props.style.border = '1px dotted #B0B0B0';
        }
        return this.props.connectDropTarget(
            <div {...this.props}></div>
        );
    }
});

module.exports = ReactDnD.DropTarget(ItemTypes.BOX, boxTarget, function(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
})(WidgetHolder);