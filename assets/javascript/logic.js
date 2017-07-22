document.ready
var jobListings = [
    { 
    jobName: "Company X",
    jobLoc: "Charlotte, NC",
    jobDescrip: "Web-developer Ninja",
    jobRate: "5 Stars"
    }, 
     
    {
    jobName: "Company Y",
    jobLoc: "San Francisco",
    jobDescrip: "Front-end Developer",
    jobRate: "5 Stars"
    }, 
      
    {
    jobName: "Company Z",
    jobLoc: "New York City, NY",
    jobDescrip: "Back-end Developer",
    jobRate: "5 Stars"
    }];
console.log("JS running");
//function that creates a new div for each object
function jobSearchResults() {

    //loop through the array of objects and create divs
    for (var i = 0; i < 10; i++) {
        //assign id and class to new divs
        console.log("jobsearch called")
        var jobResults = $("<div>");
        jobResults.attr("id", jobsArr[i].jobTitle);
        jobResults.addClass("job-container");
              
        var jobTitleDisplay = $("<div>");
        var companyDisplay = $("<div>");
        var locationDisplay = $("<div>");
        var urlDisplay = $("<div>");

        jobTitleDisplay.addClass("job-Name");
        companyDisplay.addClass("job-company");
        locationDisplay.addClass("job-loc");
        urlDisplay.addClass("job-url");

        jobTitleDisplay.text(jobsArr[i].jobTitle);
        companyDisplay.text(jobsArr[i].company);
        locationDisplay.text(jobsArr[i].location);
        urlDisplay.text(jobsArr[i].detailUrl);

        jobResults.append(jobTitleDisplay);
        jobResults.append(companyDisplay);
        jobResults.append(locationDisplay);
        jobResults.append(urlDisplay);

        //display objects in new divs
        //jobResults.html(jobListings[i].jobTitle)
        //jobResults.append(jobListings[i]this.location);
        //jobResults.append(jobListings[i]this.jobCompany);
        //jobResults.append(jobListings[i]this.jobRate);

        //display divs in html
        $("#results").append(jobResults);
    }
};

var map;
var infowindow;
var zip;
var query;
var submitBtn = $("#search-button");
var jobsArr = [];
var center = {lat: 35.2271, lng: -80.8431};
var i;

submitBtn.on("click", function(){
    console.log("Clicked submitBtn")
    event.preventDefault();

    zip = $("#zip-input").val();
    query = $("#search-input").val();

    var queryURL = "https://service.dice.com/api/rest/jobsearch/v1/simple.json?sort=1&sd=d&city=" + zip + "&text=" + query;
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response){
        jobsArr = response.resultItemList;
        i = 0
        console.log(jobsArr);
        jobSearchResults();
        var googleQueryTimer = setInterval(findCompanies,100);
    });
});

function initMap(){
    console.log("initMap called")
    center = {lat: 35.2271, lng: -80.8431};
    var mapDiv = $("#map");
    map = new google.maps.Map(mapDiv[0], {
        center: center,
        zoom:13
    });

    infowindow = new google.maps.InfoWindow();
    
    google.maps.event.addDomListener(window, 'resize', initMap);
}

function findCompanies(){
    var service = new google.maps.places.PlacesService(map);
    if (i<=10){    
        var request = {
            location: center,
            radius: '5000',
            query: jobsArr[i].company
        };
        service.textSearch(request, callback);
        i++;
    }
}

function callback(results, status) {
    console.log(results);
    console.log(status);
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        createMarker(results[0]);
    }
}

function createMarker(place) {
    var placeLoc = place.geometry.location; 
    var marker = new google.maps.Marker({ 
        map: map, 
        position: place.geometry.location 
    }); 
    google.maps.event.addListener(marker, 'click', function(){ 
        infowindow.setContent(place.name); 
        infowindow.open(map, this); 
    }); 
}

 // var map;
 //      var infowindow;
 //      var zip;
 //      var query;
 //      var submitBtn = document.getElementById('new-search');
 //      var jobsArr=[];

 //      function newSearch(){
        
 //        zip = document.getElementById('zip').value;
 //        query = document.getElementById('query').value;
        
 //        var queryURL = "http://service.dice.com/api/rest/jobsearch/v1/simple.json?sort=1&sd=d&city=" + zip + "&text=" + query;
 //        console.log(queryURL);
 //    $.ajax({
 //          url: queryURL,
 //          method: "GET"
 //      }).done(function(response) {
 //        jobsArr = response.resultItemList;
 //        console.log(jobsArr);
 //        initMap();
          
 //      });

 //      };

 //      function initMap() {
 //                console.log("called initMap");

 //        var center = {lat: 35.2271, lng: -80.8431};

 //        map = new google.maps.Map(document.getElementById('map'), {
 //          center: center,
 //          zoom: 13
 //        });

 //        infowindow = new google.maps.InfoWindow();
 //        var service = new google.maps.places.PlacesService(map);
        
 //        for (var i = 30; i >= 0; i--) {
          
 //          var request = {
 //          location: center,
 //          radius: '500',
 //          query: jobsArr[i].company
 //        };
 //        console.log("r", request)
 //          service.textSearch(request, callback);
 //        }
 //      }

 //      function callback(results, status) {
 //        console.log("cb", results);
 //        console.log(status);
 //        if (status === google.maps.places.PlacesServiceStatus.OK) {
 //          createMarker(results[0]);
 //        }
 //      }

 //      function createMarker(place) {
 //        var placeLoc = place.geometry.location;
 //        var marker = new google.maps.Marker({
 //          map: map,
 //          position: place.geometry.location
 //        });

 //        google.maps.event.addListener(marker, 'click', function() {
 //          infowindow.setContent(place.name);
 //          infowindow.open(map, this);
 //        });
 //      }