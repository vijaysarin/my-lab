function initGridView(rootNode) {
  document.addEventListener("DOMContentLoaded", function () {

    var columns = [];
    var multiSelect = true;

    var columnDefs = [
      {
        label: "URL",
        field: "url"
      },
      {
        label: "Crawl URLs in Text",
        field: "crawlCount"
      },
      {
        label: "Action",
        field: "action"
      }
    ];

    var rows = [
      {
        url: "http://www.google.com/",
        crawlCount: 2,
        action: "Edit | Delete"
      },
      {
        url: "http://www.yahoo.com/",
        crawlCount: 3,
        action: "Edit | Delete"
      },
      {
        url: "http://www.facebook.com/",
        crawlCount: 2,
        action: "Edit | Delete"
      },
      {
        url: "http://www.linkedin.com/",
        crawlCount: 2,
        action: "Edit | Delete"
      },
      {
        url: "http://www.twitter.com/",
        crawlCount: 3,
        action: "Edit | Delete"
      },
      {
        url: "http://www.gmail.com/",
        crawlCount: 2,
        action: "Edit | Delete"
      }
    ];


    // Add the selector column.
    if (multiSelect)
      columnDefs.unshift({
        field: "CheckColumn",
        label: "",
        cellRenderer: "checkbox",
        width: 31,
        resizable: false
      });    

    columnDefs.forEach(function (column) {      
      columns.push({
        field: column.field,
        headerName: column.label,
        width: column.width,
        checkboxSelection: multiSelect && column.field === "CheckColumn" ? true : false,
        suppressSorting: column.field === "CheckColumn" ? true : false,
        suppressMenu: column.field === "CheckColumn" ? true : false,
        cellClass: column.className,
        suppressSizeToFit: true,
        unSortIcon: false,
        headerCellRenderer: function (params) {
          var gridApi = params.api;
          var eHeader = document.createElement('label');
          var eTitle = document.createTextNode(params.colDef.headerName);
          if (params.colDef.field === "CheckColumn") {
            var cb = document.createElement('input');
            cb.setAttribute('type', 'checkbox');
            cb.setAttribute('class', 'gridHeaderCheckBox');
            cb.lastState = 'unchecked';
            eHeader.appendChild(cb);
            cb.addEventListener('change', function (e) {
              if (this.lastState === "indeterminate") {
                gridApi.deselectAll();
                this.lastState = 'unchecked';
                this.checked = false;
              } else if (this.checked) {
                gridApi.selectAll();
              } else {
                gridApi.deselectAll();
              }
            });
            gridApi.gridOptionsWrapper.gridOptions.appSpecific.headerSelectAllCheckBox = cb;
          }
          eHeader.appendChild(eTitle);
          return eHeader;
        }
      });
    });

    var gridOptions = {
      appSpecific: {},
      rowHeight: 36,
      headerHeight: 36,
      columnDefs: columns,
      rowData: rows,
      rowSelection: multiSelect ? 'multiple' : 'single',
      rowDeselection: multiSelect ? true : false,
      enableColResize: true,
      enableSorting: true,
      enableFilter: true,
      suppressMovableColumns: true,
      suppressCellSelection: true,
      onRowClicked: function (row) {
        var lastSelectedRow = this.appSpecific.lastSelectedRow;
        var shiftKey = row.event.shiftKey,
          ctrlKey = row.event.ctrlKey;
        if (lastSelectedRow !== undefined) {
          if (shiftKey) {
            var startIndex, endIndex;
            if (row.rowIndex < lastSelectedRow.rowIndex) {
              startIndex = row.rowIndex;
              endIndex = lastSelectedRow.rowIndex;
            } else {
              startIndex = lastSelectedRow.rowIndex;
              endIndex = row.rowIndex;
            }
            for (var i = startIndex; i < endIndex; i++) {
              this.api.selectIndex(i, true, true);
            }

            this.api.selectIndex(i, true, false);
          }
        }
        this.appSpecific.lastSelectedRow = row;
      },
      onBeforeSortChanged: function () {
        this.api.deselectAll();
        this.appSpecific.lastSelectedRow = undefined;
      },
      onSelectionChanged: function () {
        var totalRecordCount = this.rowData.length;
        var selectedNodeCount = this.api.getSelectedNodes().length;
        var headerSelectAllCheckBox = this.appSpecific.headerSelectAllCheckBox;
        if (selectedNodeCount === 0) {
          headerSelectAllCheckBox.lastState = 'unchecked';
          headerSelectAllCheckBox.indeterminate = false;
          headerSelectAllCheckBox.checked = false;
        } else if (selectedNodeCount < totalRecordCount) {
          headerSelectAllCheckBox.lastState = 'indeterminate';
          headerSelectAllCheckBox.indeterminate = true;
          headerSelectAllCheckBox.checked = false;
        } else if (selectedNodeCount === totalRecordCount) {
          headerSelectAllCheckBox.lastState = 'checked';
          headerSelectAllCheckBox.indeterminate = false;
          headerSelectAllCheckBox.checked = true;
        }
      }
    };

    var grid = new agGrid.Grid(rootNode, gridOptions);

    gridOptions.api.sizeColumnsToFit();

    rootNode.addEventListener('keydown', function (objEvent) {
      if (objEvent.ctrlKey) {
        if (objEvent.keyCode == 65) {
          event.preventDefault();
          gridOptions.api.selectAll();
          return false;
        }
      }
      if (objEvent.keyCode === 27) {
        event.preventDefault();
        gridOptions.api.deselectAll();
        gridOptions.appSpecific.headerSelectAllCheckBox.checked = false;
        return false;
      }
    });

    var downloadText = function (filename, text) {
      var a = document.createElement("a");
      if (typeof a.download != "undefined") {
        document.body.appendChild(a);
        a.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
        a.setAttribute("download", filename);

        a.click();
        document.body.removeChild(a);
      } else {
        var form = document.body.appendChild(document.createElement("form"));
        form.action = babelstreet.getAppPath("Ajax.aspx?=Download");
        form.method = "POST";

        var input1 = form.appendChild(document.createElement("input"));
        input1.type = "text";
        input1.name = "filename";
        input1.value = filename;

        var input2 = form.appendChild(document.createElement("textarea"));
        input2.name = "text";
        input2.value = text;

        form.submit();
        document.body.removeChild(form);
      }
    };


    var downloadBinary = function (filename, data) {
      var a = document.createElement("a");
      if (typeof a.download != "undefined") {
        document.body.appendChild(a);
        a.setAttribute("href", "data:text/plain;base64," + encodeURIComponent(data));
        a.setAttribute("download", filename);

        a.click();
        document.body.removeChild(a);
      } else {
        var form = document.body.appendChild(document.createElement("form"));
        form.action = babelstreet.getAppPath("Ajax.aspx?=Download");
        form.method = "POST";

        var input1 = form.appendChild(document.createElement("input"));
        input1.type = "text";
        input1.name = "filename";
        input1.value = filename;

        var input2 = form.appendChild(document.createElement("textarea"));
        input2.name = "data";
        input2.value = data;

        form.submit();
        document.body.removeChild(form);
      }
    };


    var downloadSpreadsheet = function (filename, cells) {
      var form = document.body.appendChild(document.createElement("form"));
      form.action = babelstreet.getAppPath("Ajax.aspx?=Download");
      form.method = "POST";

      var input1 = form.appendChild(document.createElement("input"));
      input1.type = "text";
      input1.name = "filename";
      input1.value = filename;

      var input2 = form.appendChild(document.createElement("textarea"));
      input2.name = "cells";
      input2.value = JSON.stringify(cells);

      form.submit();
      document.body.removeChild(form);
    };

    gridOptions.api.downloadAsCsv = function (fields, filename, delimiter) {
      if (!filename)
        filename = "data.csv";
      if (!delimiter)
        delimiter = ",";

      var labels = [];
      var funcs = {};
      fields.forEach(function (field) {
        if (field.field !== "CheckColumn" && field.field !== "action" && field.field !== "") {
          var label = field.headerName;
          if (label == null)
            label = field.field;

          labels.push(label);
          if (typeof field.getValue == "string")
            funcs[field.field] = doc.defaultView.eval("(function () { " + field.getValue + " })");
          else if (typeof field.getValue == "function")
            funcs[field.field] = field.getValue;
        }
      });

      var csv = toCsvRow(labels);
      rows.forEach(function (row, index) {
        var values = [];
        fields.forEach(function (field) {
          if (field.field !== "CheckColumn" && field.field !== "action" && field.field !== "") {
            var value = row[field.field];
            if (funcs[field.field])
              value = funcs[field.field](value);
            values.push(value);
          }
        });
        csv += "\r\n" + toCsvRow(values);
      });

      downloadText(filename, csv);

      function toCsvRow(values) {
        var array = [];

        values.forEach(function (value) {
          value = (value != null ? String(value) : "");
          if (value.includes('"') || value.includes(delimiter))
            value = '"' + value.replace(/"/g, '""') + '"';
          array.push(value != null ? value : "");
        });

        return array.join(delimiter);
      }
    };

    document.getElementById("exportGridData").addEventListener('click', function (event) {
      gridOptions.api.downloadAsCsv(gridOptions.columnDefs, "MyGridExport.csv", ",");
    });

  });

};
