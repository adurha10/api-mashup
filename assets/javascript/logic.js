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
    for (var i = 0; i < jobsArr.length; i++) {
        //assign id and class to new divs
        var jobResults = $("<div>");
        jobResults.attr("id", jobsArr[i].jobName);
        jobResults.addClass("job-container");
              
        var jobNameDisplay = $("<div>");
        var JobDescripDisplay = $("<div>");
        var jobLocDisplay = $("<div>");
        var jobRateDisplay = $("<div>");

        jobNameDisplay.addClass("job-Name");
        JobDescripDisplay.addClass("job-descrip");
        jobLocDisplay.addClass("job-loc");
        jobRateDisplay.addClass("job-rate");

        jobNameDisplay.text(jobsArr[i].jobName);
        JobDescripDisplay.text(jobsArr[i].jobDescrip);
        jobLocDisplay.text(jobsArr[i].jobLoc);
        jobRateDisplay.text(jobsArr[i].jobRate);

        jobResults.append(jobNameDisplay);
        jobResults.append(JobDescripDisplay);
        jobResults.append(jobLocDisplay);
        jobResults.append(jobRateDisplay);

        //display objects in new divs
        //jobResults.html(jobListings[i].jobName)
        //jobResults.append(jobListings[i]this.jobLoc);
        //jobResults.append(jobListings[i]this.jobDescrip);
        //jobResults.append(jobListings[i]this.jobRate);

        //display divs in html
        $(".results").append(jobResults);
    }
};

var map;
var infowindow;
var zip;
var query;
var submitBtn = $("#search-button");
var jobsArr = [];

submitBtn.on("click", function(){
    console.log("Clicked submitBtn")
    event.preventDefault();

    zip = $("zip-input").val();
    query = $("search-input").val();

    var queryURL = "http://service.dice.com/api/rest/jobsearch/v1/simple.json?sort=1&sd=d&city=" + zip + "&text=" + query;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response){
        jobsArr = response.resultItemList;
        console.log(jobsArr);
        initMap();
    });
});

function initMap(){
    jobSearchResults();
    var center = {lat: 35.2271, lng: -80.8431};
    var mapDiv = $("#map");
    map = new google.maps.Map(mapDiv, {
        center: center,
        zoom:13
    });

    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    for (var i = 0; i <= 10; i++) {
        var request = {
            location: center,
            radius: '500',
            query: jobsArr[i].company
        };
        service.textSearch(request, callback);
    };
};

function callback(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        createMarker(results[0]);
    };
};

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