<script>
  $(document).ready(function() {
  	setTimeout(function() {

  		var arrowEl = document.createElement("div");
  		arrowEl.setAttribute('style', 'position:absolute;bottom:calc(50% - 20px);left:-66px;-webkit-transform:rotate(-90deg);-webkit-backface-visibility:hidden;');
  		arrowEl.classList.add("bottom-arrow");
  		arrowEl.innerHTML = "Increasing Risk";

  		var pvtRenderer = document.getElementsByClassName('pvtRenderer');
  		if (document.getElementsByClassName('pvtRenderer').length > 0) {
  		  var optionsToHide = pvtRenderer[0].querySelectorAll('option[value="Scatter Chart"],option[value="Treemap"],option[value="TSV Export"]');
  		  document.getElementsByClassName('pvtUi')[0].rows[0].cells[0].style.verticalAlign = 'bottom';
  		  optionsToHide.forEach((function(x) {
  			  x.style.display = 'none';
  		  }));
  		}

  		var pvtAttrNames = ["SA2 Name", "Territorial Authority", "Regional Council", "TPK Region", "Overall Climate Risk Index", "Historic Flood Hazard Area", "Wet Spells", "Extreme Rainfall", "Heatwave", "Extreme Hot Days", "Probability of PED", "Coastal Inundation Hazard Area", "Overall Socio-economic Risk Index", "Poverty Risk Index", "Health Risk Index (Adult Version)", "Health Risk Index (Child Version)", "Justice Risk Index (Adult Version)", "Justice Risk Index (Child Version)", "Adaptability Risk Index"],
  			  pvtAttrDesc = ["Statistical area 2 (SA2) boundaries for 2022", "Territorial authority boundaries for 2022", "Regional council boundaries for 2022", "Te Puni Kōkiri regional boundaries", "The overall climate risk index is derived by combining all seven climate indicators based on percentage rank. The index is presented here in five equal groups, each representing 20% of all SA2s in the country.", "Percentage of an area that is known or potential flood-prone land. The estimation is based on modelled and historic flood hazard and flood prone soil maps. Future flooding projections were not available in the definition for flood-prone land.", "Number of days per year when rainfall exceeds 1 mm for 5 or more consecutive days. The event is estimated for mid-century period (2031-2051) based on RCP 4.5 projection.", "Number of days per year when rainfall exceeds 30 mm. The event is estimated for mid-century period (2031-2051) based on RCP 4.5 projection.", "Number of days per year when maximum temperature exceeds 25°C for three or more consecutive days. The event is estimated for mid-century period (2031-2051) based on RCP 4.5 projection.", "Number of days per year when maximum temperature exceeds 30°C. The event is estimated for mid-century period (2031-2051) based on RCP 4.5 projection.", "Probability of Potential Evapotranspiration Deficit (PED) exceeding 200 mm. PED represents the difference between potential soil water loss through evapotranspiration and the actual available water. The event is estimated for mid-century period (2031-2051) based on RCP 4.5 projection.", "Percentage of an area that will be inundated at extreme coastal sea levels, based on the 1% Annual Exceedance Probability (1 in 100-year event) and adding 50 cm of sea level rise. The coastal inundation data does not include vertical land motion.", "The overall socioeconomic risk index is derived by combining all six socioeconomic indicators based on percentage rank and dividing it into five equal groups. Each quintile represents 20% of all SA2s in the country.", "The index represents how households are vulnerable to poverty risks. Each quintile represents 20% of all SA2s in the country.", "The index represents how households are vulnerable to adult health risks. Each quintile represents 20% of all SA2s in the country.", "The index represents how households are vulnerable to child health risks. Each quintile represents 20% of all SA2s in the country.", "The index represents how households are vulnerable to adult justice and protection-related risks. Each quintile represents 20% of all SA2s in the country.", "The index represents how resident children are vulnerable to justice and protection-related risks. Each quintile represents 20% of all SA2s in the country.", "The index represents the vulnerability of households in adapting to climate change. It is based on factors that are not already included in other socio-economic risk indices. Each quintile represents 20% of all SA2s in the country."],
  			  climateVars = ["Coastal Inundation Hazard Area", "Wet Spells", "Extreme Hot Days", "Heatwave", "Probability of PED", "Extreme Rainfall", "Historic Flood Hazard Area", "Overall Climate Risk Index"],
  			  sesVars = ["Health Risk Index (Adult Version)", "Health Risk Index (Child Version)", "Poverty Risk Index", "Justice Risk Index (Adult Version)", "Justice Risk Index (Child Version)", "Adaptability Risk Index", "Overall Socio-economic Risk Index"];
  		var pvtAttrSpan = document.getElementsByClassName('pvtAttr');
  		for (var i = 0; i < pvtAttrSpan.length; i++) {
  			pvtAttrSpan[i].setAttribute('tooltip', pvtAttrDesc[pvtAttrNames.indexOf(pvtAttrSpan[i].firstChild.textContent)]);
  			pvtAttrSpan[i].setAttribute('flow', 'right');
  			if (climateVars.indexOf(pvtAttrSpan[i].firstChild.textContent) > -1) {
  				pvtAttrSpan[i].style.background = 'rgb(208 233 239)';
  			} else if (sesVars.indexOf(pvtAttrSpan[i].firstChild.textContent) > -1) {
  				pvtAttrSpan[i].style.background = 'rgb(245 226 205)';
  			}
  		}
  		var pvtAggregator = document.getElementsByClassName('pvtAggregator')[0];
  		pvtAggregator.addEventListener('change', changeMargin);

  		function changeMargin() {
  			if (pvtAggregator.value.includes('Count') && !pvtAggregator.value.includes('Unique')) {
  				pvtAggregator.setAttribute('style', 'margin-bottom:0px;');
  			} else {
  				pvtAggregator.setAttribute('style', 'margin-bottom:5px;');
  			}
  		} // Moving down the second dropdown attrbute (if exists):

  		var breakSpan = document.createElement('span');
  		breakSpan.innerHTML = '<br>';
  		var pvtAttrDropdown = document.getElementsByClassName('pvtAttrDropdown');

  		let observer = new MutationObserver(mutations =>
  			mutations.forEach(mutation => {
  				if (pvtAttrDropdown.length == 2) {
  					observer.disconnect();
  					pvtAttrDropdown[1].before(breakSpan);
  					pvtAttrDropdown[0].setAttribute('style', 'margin-bottom:5px;')
  					observe();
  				} else if (pvtAttrDropdown.length == 1) {
  					pvtAttrDropdown[0].setAttribute('style', 'margin-bottom:0px;');
  					breakSpan.remove();
  				} else {
  					breakSpan.remove();
  				}
  				observer.disconnect();
  				document.getElementsByClassName('info legend leaflet-control')[0].appendChild(arrowEl);
  				observe();
  			})
  		);

  		const observe = () => {
  			observer.observe(document, {
  				childList: true,
  				subtree: true,
  			});
  		};
  		observe();

  		var sumAgg = document.querySelectorAll('option[value="Integer Sum"]');
  		if (sumAgg.length == 1) {
  			document.querySelectorAll('option[value="Integer Sum"]')[0]
  				.text = 'Sum';
  		}

  		if (document.getElementsByClassName('pvtRowOrder')[0] != null) {
  			document.getElementsByClassName('pvtRowOrder')[0]
  				.setAttribute("title", "Sort Rows");
  			document.getElementsByClassName('pvtColOrder')[0]
  				.setAttribute("title", "Sort Columns");
  		}

  		function insertAfter(referenceNode, newNode) {
  			referenceNode.parentNode
  				.insertBefore(newNode, referenceNode.nextSibling);
  		}
  		var el = document.createElement("a");
  		el.setAttribute("id", "toggle_fullscreen");
  		el.setAttribute("role", "button");
  		el.setAttribute("title", "Toggle Fullscreen");
  		el.classList.add("pvtRowOrder");
  		el.innerHTML = "🗖";

  		var pvtRenderer = document.getElementsByClassName('pvtRenderer')[0];
  		if (pvtRenderer != null) {
  			insertAfter(pvtRenderer, el);
  		}

  		var pvtRenderer = document.getElementsByClassName('pvtRenderer')[0];
  		if (pvtRenderer != null) {
  			insertAfter(pvtRenderer, el);
  		}

  		$('#toggle_fullscreen').on('click', function() {
  			var theTable = $("#the_table")[0];
  			var tableContent = $("#data-table")[0];
  			if (theTable.offsetHeight == 762) {
  				theTable.style.position = "absolute";
  				theTable.style.width = "100vw";
  				theTable.style.height = "100vh";
  				theTable.style.left = "0";
  				theTable.style.top = "0";
  				theTable.style.background = "white";
  				theTable.style.zIndex = "10000";
  				el.innerHTML = "🗗︎";
  				document.getElementsByClassName('navbar navbar-default navbar-fixed-top')[0].style.display = "none";
  				document.getElementsByClassName('col-md-3')[1].style.display = "none";
  				document.getElementById("footer").style.display = "none";
  			} else {
  				theTable.style.position = "relative";
  				theTable.style.width = "revert-layer";
  				theTable.style.height = "762px";
  				theTable.style.zIndex = "auto";
  				el.innerHTML = "🗖";
  				document.getElementsByClassName('navbar navbar-default navbar-fixed-top')[0].style.display = "block";
  				document.getElementsByClassName('col-md-3')[1].style.display = "block";
  				document.getElementById("footer").style.display = "block";
  			}
  			if (tableContent != null) {
  				var content = tableContent.innerHTML;
  				tableContent.innerHTML= content; 
  			}
  		});

  		var el2 = document.createElement("a");
  		el2.setAttribute("id", "sheetjsexport");
  		el2.setAttribute("role", "button");
  		el2.setAttribute("title", "Download Table");
  		el2.classList.add("pvtRowOrder");
  		el2.innerHTML = "↓";
  		
  		if (el != null) {
  			insertAfter(el, el2);
  		}

      // https://github.com/nicolaskruchten/pivottable/issues/851
      document.getElementById("sheetjsexport").addEventListener('click', function() {
			  var wb = XLSX.utils.table_to_book(document.getElementById("data-table"));
        XLSX.writeFile(wb, "pivot_table.xlsx");
      });

      var visRenderer = ["Table", "Table Barchart", "Heatmap", "Row Heatmap", "Col Heatmap"];
      pvtRenderer.addEventListener('input', function (evt) {
        if (visRenderer.indexOf(this.value) >= 0) {
          el2.style.visibility = "visible";
        } else {
          el2.style.visibility = "hidden";
        }
      });

  	}, 20);
  });
</script>