$(document).ready(function() {

	var apiKey = 'nnHT2gNBLBc7MnBAi0G0pGrwuFHmhXzi';
		usersURL = 'https://api.behance.net/v2/users/',
		projectsURL = 'https://www.behance.net/v2/projects/',
		statsAll = [],
		statsToday = [];


	// Function for grabbing data from AJAX
	function getData(url, designer) {
        $.ajax({
            method: 'GET',
            dataType: 'jsonp',
            url: url,
            success: function(behanceData) {
            	if (behanceData) {
            		console.log(behanceData);
            		var stats = 'https://api.behance.net/v2/users/' + designer + '/stats?client_id=' + apiKey;
            		console.log(stats);
            		statsAll.push(stats);
            	}
        	},
            error: function(error) {
               console.log(error);
            }
        });
    }

    
    getData(usersURL + 'codycobb' + '?client_id=' + apiKey, 'codycobb');
    console.log(statsAll);


});
