(function() {
  var callWithJQuery;

  callWithJQuery = function(pivotModule) {
    if (typeof exports === "object" && typeof module === "object") {
      return pivotModule(require("jquery"), require("plotly.js"));
    } else if (typeof define === "function" && define.amd) {
      return define(["jquery", "plotly.js"], pivotModule);
    } else {
      return pivotModule(jQuery, Plotly);
    }
  };

  callWithJQuery(function($, Plotly) {
    var makePlotlyChart, makePlotlyScatterChart;
    makePlotlyChart = function(traceOptions, layoutOptions, transpose) {
      if (traceOptions == null) {
        traceOptions = {};
      }
      if (layoutOptions == null) {
        layoutOptions = {};
      }
      if (transpose == null) {
        transpose = false;
      }
      return function(pivotData, opts) {
        var colKeys, columns, d, data, datumKeys, defaults, fullAggName, groupByTitle, hAxisTitle, i, layout, result, rowKeys, rows, titleText, traceKeys;
        defaults = {
          localeStrings: {
            vs: "vs",
            by: "by"
          },
          plotly: {},
          plotlyConfig: {'staticPlot': (window.innerWidth <= 480)}
        };
        opts = $.extend(true, {}, defaults, opts);
        rowKeys = pivotData.getRowKeys();
        colKeys = pivotData.getColKeys();
        traceKeys = transpose ? colKeys : rowKeys;
        if (traceKeys.length === 0) {
          traceKeys.push([]);
        }
        datumKeys = transpose ? rowKeys : colKeys;
        if (datumKeys.length === 0) {
          datumKeys.push([]);
        }
        fullAggName = pivotData.aggregatorName;
		fullAggName = fullAggName.replace(/Integer Sum/g, "Sum");
        if (pivotData.valAttrs.length) {
          fullAggName += "(" + (pivotData.valAttrs.join(", ")) + ")";
        }
        data = traceKeys.map(function(traceKey) {
          var datumKey, j, labels, len, trace, val, values;
          values = [];
          labels = [];
          for (j = 0, len = datumKeys.length; j < len; j++) {
            datumKey = datumKeys[j];
            val = parseFloat(pivotData.getAggregator(transpose ? datumKey : traceKey, transpose ? traceKey : datumKey).value());
            values.push(isFinite(val) ? val : null);
            labels.push(datumKey.join(' - ') || ' ');
          }
          trace = {
            name: traceKey.join(' - ') || fullAggName
          };
          if (traceOptions.type === "pie") {
            trace.values = values;
            trace.labels = labels.length > 1 ? labels : [fullAggName];
          } else {
            trace.x = transpose ? values : labels;
            trace.y = transpose ? labels : values;
          }
		  if (traceOptions.type === "pie") {
			trace.sort = false;
		  }
          return $.extend(trace, traceOptions);
        });
        if (transpose) {
          hAxisTitle = pivotData.rowAttrs.join(" - ");
          groupByTitle = pivotData.colAttrs.join(" - ");
        } else {
          hAxisTitle = pivotData.colAttrs.join(" - ");
          groupByTitle = pivotData.rowAttrs.join(" - ");
        }
        titleText = fullAggName;
        if (hAxisTitle !== "") {
          titleText += " " + opts.localeStrings.vs + " " + hAxisTitle;
        }
        if (groupByTitle !== "") {
          titleText += " " + opts.localeStrings.by + " " + groupByTitle;
        }
		var nCol;		
		if (traceOptions.type === "pie") {
		  nCol = data[0].labels.length;
        } else {
          nCol = data.length;
        }
        layout = {
          title: titleText,
          hovermode: 'closest',
          width: (window.innerWidth <= 480) ? 800 : window.innerWidth / 1.477,
          // height: window.innerHeight / 1.4 - 50
		  height: 600,
		  font: {
			  family:'"Lato", "Helvetica Neue", Helvetica, Arial, sans-serif'
		  },
		  hoverlabel: {
		    font: {
			    family:'"Lato", "Helvetica Neue", Helvetica, Arial, sans-serif'
		    }
      },
		  colorway: Array(nCol).fill().map((element, index) => d3.scale.linear().domain([0, 0.25, 0.5, 0.75, 1]).range(["#007c9d", "#03b1df", "#bbbbbb", "#ffb975", "#fd8542"])(index / (nCol - 1)))
        };
        if (traceOptions.type === 'pie') {
          columns = Math.ceil(Math.sqrt(data.length));
          rows = Math.ceil(data.length / columns);
          layout.grid = {
            columns: columns,
            rows: rows
          };
          for (i in data) {
            d = data[i];
            d.domain = {
              row: Math.floor(i / columns),
              column: i - columns * Math.floor(i / columns)
            };
            if (data.length > 1) {
              d.title = d.name;
            }
          }
		  layout.legend = {
			//traceorder: 'reversed',
			title: {
				text: pivotData.rowAttrs.join(' - ')
			}
		  };
          if (data[0].labels.length === 1) {
            layout.showlegend = false;
          }
		  for (var i = 0; i < data[0].values.length; i++) {
            if (data[0].values[i] === null) {
              data[0].values[i] = 0;
            }
          }
        } else {
          layout.xaxis = {
            title: transpose ? fullAggName : pivotData.colAttrs.join(' - '),
            automargin: true
          };
          layout.yaxis = {
            title: transpose ? pivotData.rowAttrs.join(' - ') : fullAggName,
            automargin: true
          };
		  layout.legend = {
			//traceorder: (traceOptions.type == 'area') ? 'reversed' : 'normal',
			traceorder: 'normal',
			title: {
				text: transpose ? pivotData.colAttrs.join(' - ') : pivotData.rowAttrs.join(' - ')
			}
		  };
        }
        result = $("<div>").appendTo($("body"));
		// console.log(pivotData);
        Plotly.newPlot(result[0], data, $.extend(layout, layoutOptions, opts.plotly), opts.plotlyConfig);
        return result.detach();
      };
    };
    makePlotlyScatterChart = function() {
      return function(pivotData, opts) {
        var colKey, colKeys, data, defaults, j, k, layout, len, len1, renderArea, result, rowKey, rowKeys, v;
        defaults = {
          localeStrings: {
            vs: "vs",
            by: "by"
          },
          plotly: {},
          plotlyConfig: {}
        };
        opts = $.extend(true, {}, defaults, opts);
        rowKeys = pivotData.getRowKeys();
        if (rowKeys.length === 0) {
          rowKeys.push([]);
        }
        colKeys = pivotData.getColKeys();
        if (colKeys.length === 0) {
          colKeys.push([]);
        }
        data = {
          x: [],
          y: [],
          text: [],
          type: 'scatter',
          mode: 'markers'
        };
        for (j = 0, len = rowKeys.length; j < len; j++) {
          rowKey = rowKeys[j];
          for (k = 0, len1 = colKeys.length; k < len1; k++) {
            colKey = colKeys[k];
            v = pivotData.getAggregator(rowKey, colKey).value();
            if (v != null) {
              data.x.push(colKey.join(' - '));
              data.y.push(rowKey.join(' - '));
              data.text.push(v);
            }
          }
        }
        layout = {
          title: pivotData.rowAttrs.join(" - ") + ' vs ' + pivotData.colAttrs.join(" - "),
          hovermode: 'closest',
          xaxis: {
            title: pivotData.colAttrs.join(' - '),
            automargin: true
          },
          yaxis: {
            title: pivotData.rowAttrs.join(' - '),
            automargin: true
          },
          //width: window.innerWidth / 1.5,
		  width : (window.innerWidth <= 480) ? 800 : window.innerWidth / 1.5,
          // height: window.innerHeight / 1.4 - 50
		  height: 600
        };
        renderArea = $("<div>", {
          style: "display:none;"
        }).appendTo($("body"));
        result = $("<div>").appendTo(renderArea);
        Plotly.newPlot(result[0], [data], $.extend(layout, opts.plotly), opts.plotlyConfig);
        result.detach();
        renderArea.remove();
        return result;
      };
    };
    return $.pivotUtilities.plotly_renderers = {
      "Horizontal Bar Chart": makePlotlyChart({
        type: 'bar',
        orientation: 'h',
      }, {
        barmode: 'group'
      }, true),
      "Horizontal Stacked Bar Chart": makePlotlyChart({
        type: 'bar',
        orientation: 'h'
      }, {
        barmode: 'relative'
      }, true),
      "Bar Chart": makePlotlyChart({
        type: 'bar'
      }, {
        barmode: 'group'
      }),
      "Stacked Bar Chart": makePlotlyChart({
        type: 'bar'
      }, {
        barmode: 'relative'
      }),
      "Line Chart": makePlotlyChart(),
      "Area Chart": makePlotlyChart({
		type: 'area',
        stackgroup: 1
      }),
      "Scatter Chart": makePlotlyScatterChart(),
      'Multiple Pie Chart': makePlotlyChart({
        type: 'pie',
        scalegroup: 1,
        hoverinfo: 'label+value',
        textinfo: 'none'
      }, {}, true)
    };
  });

}).call(this);

//# sourceMappingURL=plotly_renderers.js.map
