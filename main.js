javascript:(function () {

  // Remove previous overlay if exists
  var old = document.getElementById("xq-live-ui");
  if (old) old.remove();

  // Replace DEMO text with LIVE (visual only)
  document.querySelectorAll("span,div").forEach(el=>{
    if(el.innerText && el.innerText.trim()==="DEMO"){
      el.innerText="LIVE";
      el.style.color="#22c55e";
      el.style.fontWeight="bold";
    }
  });

  // Floating LIVE badge (top-left like real)
  var live = document.createElement("div");
  live.id="xq-live-ui";
  live.innerHTML="LIVE";
  live.style.cssText=
    position:fixed;
    top:10px;
    left:10px;
    background:#16a34a;
    color:white;
    padding:6px 14px;
    border-radius:20px;
    font-weight:bold;
    font-size:14px;
    z-index:999999;
    box-shadow:0 0 20px rgba(34,197,94,.9);
  ;
  document.body.appendChild(live);

})();
