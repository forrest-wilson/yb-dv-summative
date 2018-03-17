$(document).ready(function() {
	google.charts.load('current', {'packages':['corechart', 'bar']});
	// google.charts.setOnLoadCallback(drawChart);

	var apiKey = 'nnHT2gNBLBc7MnBAi0G0pGrwuFHmhXzi';
		usersURL = 'https://api.behance.net/v2/users/',
		projectsURL = 'https://www.behance.net/v2/projects/',
		userIds = ['codycobb', 'ashthorp', 'Filiphds'],
		statsAll = [],
		statsToday = [];
	
	// Grabs data from behance
	function dataGrab(url) {

		$.ajax({
            dataType: 'jsonp',
            url: url,
            success: function(behanceData) {
            	if(behanceData){
            		statsAll.push(behanceData);
            		console.log(statsAll);
            	} else {
                	$('#graphContainer').empty().append('<h2>Cannot get data from Behance</h2>');
            	}
        	},
            error:function(error) {
	            console.log(error);
	            console.log('something went wrong');
	        }
        });

	}

	// Pushes data to array
	function populateData() {

		// statsAll = [];

		for (var i = 0; i < userIds.length; i++) {
			dataGrab(usersURL + userIds[i] + '/stats?client_id=' + apiKey);
		};
            	
    }

    // Draw bar chart
	function drawChart() {
        
        populateData();
        
		var data = google.visualization.arrayToDataTable([
		  ['Designers', 'Project Views', 'Profile Views', 'Project Appreciations', 'Project Comments'],
		  ['Cody Cobb', statsAll[0].stats.all_time.project_views, statsAll[0].stats.all_time.project_views],
		  ['Ash Thorp', behanceData.with[0].content.temp],
		  ['Filip Hodas', behanceData.with[0].content.temp]
		]);

		console.log(statsAll[0].stats.all_time.project_views);
               	
    }

    
	// console.log(statsAll[0].stats.all_time.project_views);
    

    // Container Flip
    document.getElementById('graphContainer').addEventListener('click', function() {
		var element = document.getElementById('graphContainer');
		element.classList.toggle('flip');
    });
    

});
