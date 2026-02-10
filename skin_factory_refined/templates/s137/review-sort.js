(function(){
  var toolbar=document.querySelector("#tab-review .review-toolbar");
  if(!toolbar) return;
  var buttons=Array.prototype.slice.call(toolbar.querySelectorAll("span"));
  var list=document.querySelector("#tab-review .review-list");
  var items=Array.prototype.slice.call(list.querySelectorAll(".review-item"));
  function parseDate(it){var m=it.querySelector(".review-meta span:last-child");return m?m.textContent.trim():"";}
  function parseRating(it){var m=it.querySelector(".review-meta span:first-child");return m?parseFloat(m.textContent.replace(/[^0-9.]/g,""))||0:0;}
  function sortBy(mode){
    var sorted=items.slice();
    if(mode==="평점순"){sorted.sort(function(a,b){return parseRating(b)-parseRating(a);});}
    else {sorted.sort(function(a,b){return parseDate(b).localeCompare(parseDate(a));});}
    sorted.forEach(function(it){list.appendChild(it);});
  }
  buttons.forEach(function(btn){
    btn.addEventListener("click", function(){
      buttons.forEach(function(b){b.classList.remove("is-active");});
      btn.classList.add("is-active");
      sortBy(btn.textContent.trim());
    });
  });
})();
