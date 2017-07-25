// declare all global variables that will be used 
var map;
var infowindow;
var zip;
var city;
var query;
var submitBtn = $("#search-button");
var jobsArr = [];
// default center of Charlotte
var center = {lat: 35.2271, lng: -80.8431};
var incrementPlacesQuery;
var incrementPlacesCB;
var home;
var jobDestArr = [];
var googleQueryTimer;
var markedJobs = [];
var homeSet = false;

// Initialize Google Map display 
function initMap(){
    var mapDiv = $("#map");
    var input = $("#address");
    // create new instance of Google Maps -- Center defaults to Charlotte, and zoom set to show greater Charlotte area
    map = new google.maps.Map(mapDiv[0], {
        center: center,
        zoom:11
    });

    // create a new instance of autocomplete from the places library of Google Maps API
    var autocomplete = new google.maps.places.Autocomplete(input[0]);
    // sets autocomplete to look within the map viewport for addresses -- Will continue to look outside if nothing else found
    autocomplete.bindTo('bounds', map);

    // creates a new marker with a home icon
    var marker = new google.maps.Marker({
        map: map,
        icon: "assets/images/homeicon.png"
    });

    // event listener - Whenever the user selects a google place from auto complete we run this
    autocomplete.addListener('place_changed', function() {
        // hide the old marker
        marker.setVisible(false);

        // create a new instance of place services from places library
        service = new google.maps.places.PlacesService(map);
        
        // assigns chosen place to variable to use as a place object
        var place = autocomplete.getPlace();
          
        if (!place.geometry) {
                // user entered an address or location not found by places -- didn't choose an autocomplete suggestion
                homeSet = false;
                return;
            } else{
                homeSet = true;
            }

        // recheck form for valid input
        var form = $("#search-form");
        form.valid();
        
        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
            map.setZoom(11);  // Why 11? Because it looks good.            
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(11);  // Why 11? Because it looks good.
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
        
        home = place;

        for (var i = 0; i < home.address_components.length; i++) {
            for (var j = 0; j < home.address_components[i].types.length; j++) {
                if (home.address_components[i].types[j] === "postal_code"){
                    zip = home.address_components[i].long_name;
                }
                if (home.address_components[i].types[j] === "locality"){
                    city = home.address_components[i].long_name;
                }
            }
            home.address_components[i].types
        }


        marker.setPosition(home.geometry.location);
        marker.setVisible(true);

        // var address = '';
        // if (place.address_components) {
        //     address = [
        //         (place.address_components[0] && place.address_components[0].short_name || ''),
        //         (place.address_components[1] && place.address_components[1].short_name || ''),
        //         (place.address_components[2] && place.address_components[2].short_name || '')
        //     ].join(' ');
        // }

        // infowindowContent.children['place-icon'].src = place.icon;
        // infowindowContent.children['place-name'].textContent = place.name;
        // infowindowContent.children['place-address'].textContent = address;
        // infowindow.open(map, marker);
    });
    
    
    google.maps.event.addDomListener(window, 'resize', initMap);
}

// Create validation rule to look for place objects instead of meaningless input
jQuery.validator.addMethod("placeObj", function(){
    if (homeSet){
        return true;
    } else {
        return false;
    }
});

// Validate user input
$('#search-form').validate({ // initialize the plugin
  rules: {
    jobField: {
    required: true
    },
    addressField: {
    required: true,
    placeObj: true
    },
  },
  messages: {
    jobField: "Please indicate the job you would like to search for",
    addressField: {
        required: "You must set your home address",
        placeObj: "Please choose a valid address with Auto-Complete"
    }
  },
  errorPlacement: function(error, element) {
    $('#error-container').append(error);
  }
});

//function to display job search results and associated information
function jobSearchResults() {
    //clear out any old results
    $("#results").empty();
    //loop through the array of objects and create divs
    for (var i = 0; i < 10; i++) {
        
        // check for https and if not clean up URL to make it a https link
        if (jobsArr[i].detailUrl.slice(0, 5) === "http:"){
            jobsArr[i].detailUrl = jobsArr[i].detailUrl.slice(4);
            jobsArr[i].detailUrl = "https" + jobsArr[i].detailUrl;
        }
        //assign id and class to new divs
        var jobResults = $("<div>");
        jobResults.attr("id", jobsArr[i].jobTitle);
        jobResults.addClass("job-container");
        
        //create divs for each piece of information      
        var jobTitleDisplay = $("<div>");
        var companyDisplay = $("<div>");
        var locationDisplay = $("<div>");
        var urlDisplay = $("<div>");

        //give each piece of information its appropriate class for styling
        jobTitleDisplay.addClass("job-Name");
        companyDisplay.addClass("job-company");
        locationDisplay.addClass("job-loc");
        urlDisplay.addClass("job-url");

        //set each information container to display information appropriately
        jobTitleDisplay.html("<h4>" + jobsArr[i].jobTitle + "</h4>");
        companyDisplay.html("<h4>" + jobsArr[i].company + "</h4>");
        locationDisplay.text(jobsArr[i].location);
        urlDisplay.html("<a href='" + jobsArr[i].detailUrl + "' target='_blank'>" + jobsArr[i].detailUrl + "</a>");

        //append information to individual job container
        jobResults.append(jobTitleDisplay);
        jobResults.append(companyDisplay);
        jobResults.append(locationDisplay);
        jobResults.append(urlDisplay);

        //If the job was found by google, set it to display as a marked job
        if(jobsArr[i].destDist && jobsArr[i].destDist.value < 64000){
            jobResults.addClass("marked");
            
            // add commute time and distance to displayed information
            var commuteTime = $("<span>");
            commuteTime.text(jobsArr[i].destTime.text);
            var commuteDist = $("<span>");
            commuteDist.text(jobsArr[i].destDist.text);

            // set classes so commute info is displayed properly

            commuteDist.addClass("distance");
            commuteTime.addClass("time")

            // Append information to individual job
            jobResults.append(commuteTime);
            jobResults.append(commuteDist);
        }

        // append individual job & all related information to job results container
        $("#results").append(jobResults);
    }
};


// Click event listener to search for jobs -- Submit button 
submitBtn.on("click", function(){
    event.preventDefault();
    var form = $("#search-form");
    
    // check for valid input
    if (form.valid()){    
        // Grab Job search text
        query = $("#search-input").val();

        // Set URL with job search text and zip from home address set
        var queryURL = "http://service.dice.com/api/rest/jobsearch/v1/simple.json?sort=1&sd=d&city=" + zip + "&text=" + query;
       
        // Ajax call to Dice Jobs API searching for "search-input" within 40 miles of "zip"
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response){
            //create array of returned jobs (50 returned)
            jobsArr = response.resultItemList;
            //set incrementPlacesQuery and incrementPlacesCB to use when pinging Google Maps API to avoid query limits
            incrementPlacesQuery = 0;
            incrementPlacesCB = 0;
            //set timer for pinging Google Maps API to avoid query limits
            findCompanies();
        });
    }
});

function findCompanies(){
    var service = new google.maps.places.PlacesService(map);
    if (incrementPlacesQuery<=10){    
        var request = {
            location: home.geometry.location,
            radius: '64373', // ~40mile radius
            query: jobsArr[incrementPlacesQuery].company + " " + city
        };  
    console.log(request);   
    service.textSearch(request, placeCallback);
    } else {
            commuteCalculator();
    }
    incrementPlacesQuery++;
}

function placeCallback(results, status) {
    console.log(results);
    console.log("jobsArr object number: " + incrementPlacesCB);
    console.log(status)
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        createMarker(results[0]);
        console.log("now pushing the following obj's loc to jobDestArr")
        console.log(results[0]);
        jobDestArr.push(results[0].geometry.location);
    }
    incrementPlacesCB++;
    findCompanies();
}

function createMarker(place) {
    console.log("createMarker called");
    var placeLoc = place.geometry.location; 
    var marker = new google.maps.Marker({ 
        map: map, 
        position: placeLoc 
        }); 
    jobsArr[incrementPlacesCB]["markerPlaced"] = true;
    // var commuteUrl = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=place_id:" + home + "&destinations=place_id:"+ place.place_id + "&key=AIzaSyBde53Rvo9H70BiGhQ36rTPe-u1V4ySCPQ";
    // console.log(commuteUrl);
    // $.ajax({
    //     url: commuteUrl,
    //     method: "GET"
    // }).done(function(response){
    //     console.log(response);
    // });
    google.maps.event.addListener(marker, 'click', function(){ 
        infowindow.setContent(place.name); 
        infowindow.open(map, this); 
    }); 
}

function commuteCalculator(){
var origin1 = home.geometry.location;
var service = new google.maps.DistanceMatrixService();
service.getDistanceMatrix(
  {
    origins: [origin1],
    destinations: jobDestArr,
    travelMode: 'DRIVING',
    // transitOptions: TransitOptions,
    // drivingOptions: DrivingOptions,
    unitSystem: google.maps.UnitSystem.IMPERIAL
    // avoidHighways: Boolean,
    // avoidTolls: Boolean,
  }, distanceCallback);
}

function distanceCallback(response, status) {
    if (status == 'OK') {
        console.log(response);
        var origins = response.originAddresses;
        var destinations = response.destinationAddresses;
        var responseCounter = 0
        for (var k = 0; k < jobsArr.length; k++) {
            if(jobsArr[k].markerPlaced && response.rows[0].elements[responseCounter].distance.value < 64000){
                console.log("jobsArr index of: " + k);
                console.log(jobsArr[k]);
                console.log(responseCounter);
                console.log(response.rows[0].elements[responseCounter].duration);
                jobsArr[k]["destTime"] = response.rows[0].elements[responseCounter].duration;
                jobsArr[k]["destDist"] = response.rows[0].elements[responseCounter].distance;
                responseCounter++;
            }
        }
        
        jobSearchResults();
        // for (var i = 0; i < jobDestArr.length; i++) {
        //   var results = response.rows[i].elements;
        //   for (var j = 0; j < results.length; j++) {
        //     var element = results[j];
        //     var distance = element.distance.text;
        //     var duration = element.duration.text;
        //     var from = origins[i];
        //     var to = destinations[j];
        //   }
    }
}


// function createHome(place) {
//     var placeLoc = place.geometry.location; 
//     var marker = new google.maps.Marker({ 
//         map: map,
//         icon: "assets/images/homeicon.png"
//         position: place.geometry.location 
//     }); 
//     google.maps.event.addListener(marker, 'click', function(){ 
//         infowindow.setContent(place.name); 
//         infowindow.open(map, this); 
//     }); 
// }

//INFO WINDOW CODE FROM AUTO COMPLETE STUFF
 // var infowindow = new google.maps.InfoWindow();
    // var infowindowContent = document.getElementById('infowindow-content');
    // console.log(infowindowContent);
    // console.log(infowindow);

    // infowindow.setContent(infowindowContent);