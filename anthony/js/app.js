$(document).ready(function() {

	var apiKey = 'nnHT2gNBLBc7MnBAi0G0pGrwuFHmhXzi';
		usersURL = 'https://api.behance.net/v2/users/',
		projectsURL = 'https://www.behance.net/v2/projects/',
		userIds = ['codycobb', 'ashthorp', 'Filiphds' ],
		statsAll = [],
		statsToday = [];


	// Function for grabbing data from behance
	function getData(url) {
        $.ajax({
            dataType: 'jsonp',
            url: url,
            success: function(behanceData) {
            	statsAll.push(behanceData);
            	
        	},
            error: function(error) {
               console.log(error);
            }
        });
    }

    // data grab test
    getData(usersURL + userIds[0] + '/stats?client_id=' + apiKey);
    console.log(statsAll);


});
