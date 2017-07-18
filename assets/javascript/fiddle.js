
// var queryURL = "http://api.glassdoor.com/api/api.htm?v=1&format=json&t.p=172218&t.k=vkeqkMTFC7&action=employers&q=pharmaceuticals&userip=192.168.43.42&useragent=Mozilla/%2F4.0"

var queryURL = "http://service.dice.com/api/rest/jobsearch/v1/simple.json?sort=1&sd=d&city=" + zipCode + "&text=" + searchParam

var zipCode = 
var searchParam = 

$.ajax({
      url: queryURL,
      method: "GET"
    }).done(function(response) {
      console.log(response)
    });


$("#submit").on("click", function(){
	event.preventDefault();
	zipCode = $("#zipCodeInput").val().trim()
	searchParam = $("#searchInput").val().trim();
});