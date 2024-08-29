<script>
  $(document).ready(function() {
  	setTimeout(function() {
  		$(".navbar-brand")[0].removeAttribute("href");
  		var navbar = document.getElementById("navbar");
  		var logo = document.createElement("a");
  		logo.setAttribute("href", "https://www.tpk.govt.nz/en");
  		logo.setAttribute("target", "_blank");
  		logo.innerHTML = '<img class="logo" style="height:50px;top:5px;right:15px;position:absolute;">';
  		navbar.appendChild(logo);
  		var localLinks = document.querySelectorAll('a[href^="maps');
  		for (var i = 0; i < localLinks.length; i++) {
  			localLinks[i].setAttribute('target', '_blank');
  		}
  		document.querySelector(".main-container")
  			.insertAdjacentHTML('afterend', '<div id="footer" style="left:0;bottom:0;width:calc(100% - 15px)"><h6 style="background-color:#333333;color:white;margin-top: 3px;margin-bottom: 0px;line-height: 60px;margin-left: 0px;margin-right: -15px;padding-left: 15px;font-size: 0.8em;"> Te Puni Kōkiri <span style="color:gray"> Te Puni Whakahaere Tikanga, <a href="mailto:matawhanui@tpk.govt.nz" style="color:gray">Data & Insights</a> - May 2024 </span><a href="https://www.tpk.govt.nz/" target="_blank"><img id="footer-img" src="img/footer_logo.svg" style="height:22px;float:right;margin-top:19px;margin-right:15px;" /></a></h6></div>');
  	}, 20);
  });
</script>