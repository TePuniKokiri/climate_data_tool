<script>
  $(document).ready(function() {
  	setTimeout(function() {
  		var arrowEl = document.createElement("div");
  		arrowEl.setAttribute('style', 'position:absolute;bottom:calc(50% - 20px);left:-66px;-webkit-transform:rotate(-90deg);-webkit-backface-visibility:hidden;');
  		arrowEl.classList.add("bottom-arrow");
  		arrowEl.innerHTML = "Increasing Risk";

  		if (window.innerWidth <= 480) {
  		  leafletMap.setMinZoom(4.5);
  		  leafletMap._initialCenter = L.latLng(-41.5, 172.5)
  		  leafletMap._initialZoom = 5;
  		  leafletMap._resetView(leafletMap._initialCenter, leafletMap._initialZoom);
  		  /*
  		  var filterLi = $( "li:contains('Filter the attributes by categories')");
  		  if (filterLi.length != 0) {
  		    filterLi[0].style.display = 'none';
  		  }
  		  */
  		}

  		let observer = new MutationObserver(mutations =>
  			mutations.forEach(mutation => {
  				observer.disconnect();
  				document.getElementsByClassName('info legend leaflet-control')[0].appendChild(arrowEl);
  				observe();
  			})
  		);

      document.querySelector('a[data-toggle=\"tab\"]').addEventListener('click',
        function() {
          setTimeout(function() { leafletMap.invalidateSize(); }, 10);
        });
  	}, 20);
  });
</script>