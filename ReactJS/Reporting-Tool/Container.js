var React = require('react'),    
    ReactDnD = require('react-dnd'),
    HTML5Backend = require('react-dnd-html5-backend'),
    ReactWidgets = require('react-widgets'),
    ReportDesigner = require('./ReportDesigner'),
    Carousel = require('./Carousel');

var DropdownList = ReactWidgets.DropdownList;

var options = [
    { value: 'OneColStretch', label: '1 Column - Stretched' },
    { value: 'TwoColEqual', label: '2 Column - Equal Width' },
    { value: 'ThreeColEqual', label: '3 Column - Equal Width' },
    { value: 'TwoColOneIsToTwo', label: '2 Column - 1:2 Width' },
    { value: 'TwoColTwoIsToOne', label: '2 Column - 2:1 Width' }
];

var layoutCreatorFormStyle = {
  height:"50px",
  width:"400px",
  paddingLeft:"10px"
};

var ListItem = React.createClass({
  render(){
    var style={paddingLeft:"5px", fontSize:"11px"};
    var label = this.props.text;
    var value = this.props.value;
    var imagePath = "/images/layout-icons/" + value + ".png";
    return(
      <div>
      <img src={imagePath}/>
      <span style={style}>{label}</span>
      </div>
    )
  }
});

var Container = React.createClass({
    getInitialState:function(){
      return {
        layoutId : 0,
        rowNumber : 0
      }
    },
    layoutData : [],
    dropDownData : {},
    onAddRowButtonClick: function(){
      var layoutFound = true;
      var layoutId = this.state.layoutId;
      var rowNumber = this.state.rowNumber;
      switch(this.dropDownData.value){
        case "OneColStretch":
          this.layoutData.push({
            i: layoutId + "",
            x:0,
            y:rowNumber,
            w:3,
            h:2,
            isResizable:true,
            isDraggable:true,
            static:false
          });
          layoutId++;
          break;
        case "TwoColEqual" :
          this.layoutData.push({
            i: layoutId + "",
            x:0,
            y:rowNumber,
            w:1.5,
            h:2,
            isResizable:true,
            isDraggable:true,
            static:false
          });
          layoutId++;
          this.layoutData.push({
            i: layoutId + "",
            x:1.5,
            y:rowNumber,
            w:1.5,
            h:2,
            isResizable:true,
            isDraggable:true,
            static:false
          });
          layoutId++;
          break;
        case "ThreeColEqual" :
          this.layoutData.push({
            i: layoutId + "",
            x:0,
            y:rowNumber,
            w:1,
            h:2,
            isResizable:true,
            isDraggable:true,
            static:false
          });
          layoutId++;
          this.layoutData.push({
            i: layoutId + "",
            x:1,
            y:rowNumber,
            w:1,
            h:2,
            isResizable:true,
            isDraggable:true,
            static:false
          });
          layoutId++;
          this.layoutData.push({
            i: layoutId + "",
            x:2,
            y:rowNumber,
            w:1,
            h:2,
            isResizable:true,
            isDraggable:true,
            static:false
          });
          layoutId++;
          break;
        case "TwoColTwoIsToOne" :
          this.layoutData.push({
            i: layoutId + "",
            x:0,
            y:rowNumber,
            w:2,
            h:2,
            isResizable:true,
            isDraggable:true,
            static:false
          });
          layoutId++;
          this.layoutData.push({
            i: layoutId + "",
            x:2,
            y:rowNumber,
            w:1,
            h:2,
            isResizable:true,
            isDraggable:true,
            static:false
          });
          layoutId++;
          break;
        case "TwoColOneIsToTwo" :
          this.layoutData.push({
            i: layoutId + "",
            x:0,
            y:rowNumber,
            w:1,
            h:2,
            isResizable:true,
            isDraggable:true,
            static:false
          });
          layoutId++;
          this.layoutData.push({
            i: layoutId + "",
            x:1,
            y:rowNumber,
            w:2,
            h:2,
            isResizable:true,
            isDraggable:true,
            static:false
          });
          layoutId++; 
          break;
        default:
          layoutFound = false;
          alert("Please select a layout.");
          break;
      }
      if (layoutFound) {
        rowNumber+=2;
        this.setState({layoutId : layoutId,rowNumber : rowNumber}); // updates 'Container' fully
      }
    },
    onDropdownListValueChange : function(data){
      this.dropDownData = data;
    },
    render: function() {
        var dropDownStyle = {height: "30px", fontSize:"11px", width:"200px", float:"left", borderRadius: "0px"}
        var buttonStyle = {float:"left", marginLeft:"10px",color:"#FFF", backgroundColor:"#00558B",border:"1px solid #B0B0B0", height:"30px", width:"100px", fontSize:"12px",fontWeight:"bold" };
        return (
            <div>
                <div style={{ overflow: 'hidden', clear: 'both' }}>
                    <Carousel name='CAROUSEL' />
                </div>
                <br/><br/>
                <div id="layoutCreator" style={layoutCreatorFormStyle}>
                <DropdownList 
                    valueField="value" 
                    textField="label"
                    data={options}
                    itemComponent={ListItem}
                    style={dropDownStyle}
                    onChange={this.onDropdownListValueChange}
                />
                <input type="button" value="Add Row" style={buttonStyle} onClick={this.onAddRowButtonClick}/>
                </div>
                <div>
                    <ReportDesigner layoutData={this.layoutData}/>
                </div>                
            </div>
        );
    }
});

module.exports = ReactDnD.DragDropContext(HTML5Backend)(Container);
