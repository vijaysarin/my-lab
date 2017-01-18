var React = require('react'),
    ItemTypes = require('./ItemTypes'),
    ReactGridLayout = require('react-grid-layout'),
    WidgetHolder = require('./WidgetHolder'),
    Dimensions = require('react-dimensions'),  
    ReactDnD = require('react-dnd');

var ReportDesigner = React.createClass({        
    render: function() {        
        var baseContainerStyle = {            
            margin: '10px',
            padding: '10px',  
            color: '#333',
            textAlign: 'center',
            fontSize: '1rem',
            backgroundColor:"#F8F8FF",
            border: "1px solid #B0B0B0",
            minHeight: '380px'
        };
        var reportViewStyle = {
          width:'100%'
        };       
        var style = {
          border:"1px dotted #B0B0B0"
        };
        if(this.props.layoutData && this.props.layoutData.length>0){
          return (
              <div style={baseContainerStyle}>            
              <div id="reportView" style={reportViewStyle}>
              <ReactGridLayout className="layout" cols={3} rowHeight={30} width={this.props.containerWidth-40}>
                {
                  this.props.layoutData.map(function (data) {
                         var widgetId = "WidgetHolder-" + data.i;
                         return <WidgetHolder _grid={data} key={data.i} style={style} name='BOX' id={widgetId}/>;
                  })
                }              
              </ReactGridLayout>
              </div>
              </div>
          );
        } else {
          return (
            <div style={baseContainerStyle}>            
            <div id="reportView" style={reportViewStyle}>
            </div>
            </div>                           
          );
        }
    }
});

module.exports = Dimensions()(ReportDesigner);