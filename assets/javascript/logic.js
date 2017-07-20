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

//function that creates a new div for each object
function jobSearchResults() {

  //loop through the array of objects and create divs
  for (var i = 0; i < jobListings.length; i++) {
    //assign id and class to new divs
    var jobResults = $("<div>");
    jobResults.attr("id", jobListings[i].jobName);
    jobResults.addClass("job-container");
          
    var jobNameDisplay = $("<div>");
    var JobDescripDisplay = $("<div>");
    var jobLocDisplay = $("<div>");
    var jobRateDisplay = $("<div>");

    jobNameDisplay.addClass("job-Name");
    JobDescripDisplay.addClass("job-descrip");
    jobLocDisplay.addClass("job-loc");
    jobRateDisplay.addClass("job-rate");

    jobNameDisplay.text(jobListings[i].jobName);
    JobDescripDisplay.text(jobListings[i].jobDescrip);
    jobLocDisplay.text(jobListings[i].jobLoc);
    jobRateDisplay.text(jobListings[i].jobRate);

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

 

     jobSearchResults();

// function newSearch(){
//   zip = $("")
// };


// function newSearch(){
      	
//       	zip = document.getElementById('zip').value;
//       	query = document.getElementById('query').value;
      	
//       	var queryURL = "http://service.dice.com/api/rest/jobsearch/v1/simple.json?sort=1&sd=d&city=" + zip + "&text=" + query;
//       	console.log(queryURL);
// 		$.ajax({
//       		url: queryURL,
//       		method: "GET"
//     	}).done(function(response) {
//     		jobsArr = response.resultItemList;
//     		console.log(jobsArr);
//       	initMap();
      		
//     	});

//       };