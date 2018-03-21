google.charts.load('current', {'packages':['corechart', 'bar']});
google.charts.setOnLoadCallback(drawChart);

// Code wrapper function
function drawChart() {
	
	var apiKey = 'nnHT2gNBLBc7MnBAi0G0pGrwuFHmhXzi', /*'uASQiBZVNZdHoFeil4ZlXU3USDC0rfV8',*/
		usersURL = 'https://api.behance.net/v2/users/',
		userIds = ['codycobb', 'ashthorp', 'Filiphds'],
		statsAll = {};
	
	// Grabs data from behance API
	function dataGrab(url, success) {

		$.ajax({
            dataType: 'jsonp',
            url: url,
            success: function(data) {
				success(data);
			},
            error:function(error) {
	            alert(error + 'something went wrong');
	        }
        });

	}

	// Draws google chart and diplays daily stats
	function countObj(obj) {

		if (Object.keys(obj).length >= userIds.length) {
			var data = google.visualization.arrayToDataTable([
				['Designers', 'Project Views', { role: 'style' }, 'Profile Views', { role: 'style' }, 'Project Appreciations', { role: 'style' }],
				['Cody Cobb', obj.codycobb.stats.all_time.project_views, '#eb0d30', obj.codycobb.stats.all_time.profile_views, '#cff074', obj.codycobb.stats.all_time.project_appreciations, '#a9e6ec'],
				['Ash Thorp', obj.ashthorp.stats.all_time.project_views, '#eb0d30', obj.ashthorp.stats.all_time.profile_views, '#cff074', obj.ashthorp.stats.all_time.project_appreciations, '#a9e6ec'],
				['Filip Hodas', obj.Filiphds.stats.all_time.project_views, '#eb0d30', obj.Filiphds.stats.all_time.profile_views, '#cff074', obj.Filiphds.stats.all_time.project_appreciations, '#a9e6ec']
			]);
			var options = {
				title: 'Profile Statistics Comparison',
				height: 494,
				width: 694,
				legend: { position: 'top', maxLines: 3 },
				colors: ['#eb0d30', '#cff074', '#a9e6ec'],
				minorTicks: 10
			};
			var chart = new google.visualization.ColumnChart(document.getElementById('chartLocation'));
			chart.draw(data, options);

			document.getElementById('cody').addEventListener('click', function() {

				document.getElementById('projectVInfo').innerHTML = '';
				document.getElementById('profileVInfo').innerHTML = '';
				document.getElementById('appreciationsInfo').innerHTML = '';
				document.getElementById('projectCInfo').innerHTML = '';
		
				hideProjs();
		
				var elementAsh = document.getElementById('ash');
				elementAsh.classList.remove('active');
				var elementFilip = document.getElementById('filip');
				elementFilip.classList.remove('active');
		
				$('#codyProj').show();
	
				var elementCody = document.getElementById('cody');
				elementCody.classList.add('active');
	
				var numAnim1 = new CountUp('projectVInfo', 0, obj.codycobb.stats.today.project_views);
					if (!numAnim1.error) {
						numAnim1.start();
					} else {
						console.error(numAnim1.error);
				}
				var numAnim2 = new CountUp('profileVInfo', 0, obj.codycobb.stats.today.profile_views);
					if (!numAnim2.error) {
						numAnim2.start();
					} else {
						console.error(numAnim2.error);
				}
				var numAnim3 = new CountUp('appreciationsInfo', 0, obj.codycobb.stats.today.project_appreciations);
					if (!numAnim3.error) {
						numAnim3.start();
					} else {
						console.error(numAnim3.error);
				}
				var numAnim4 = new CountUp('projectCInfo', 0, obj.codycobb.stats.today.project_comments);
					if (!numAnim4.error) {
						numAnim4.start();
					} else {
						console.error(numAnim4.error);
				}
	
				var element = document.getElementById('graphContainer');
				element.classList.add('flip');
		
			});

			document.getElementById('ash').addEventListener('click', function() {

				document.getElementById('projectVInfo').innerHTML = '';
		    	document.getElementById('profileVInfo').innerHTML = '';
		    	document.getElementById('appreciationsInfo').innerHTML = '';
		    	document.getElementById('projectCInfo').innerHTML = '';
		    	hideProjs();

		    	var elementCody = document.getElementById('cody');
		    	elementCody.classList.remove('active');
		    	var elementFilip = document.getElementById('filip');
		    	elementFilip.classList.remove('active');

				$('#ashProj').show();

				var elementAsh = document.getElementById('ash');
	    		elementAsh.classList.add('active');

				var numAnim1 = new CountUp('projectVInfo', 0, obj.ashthorp.stats.today.project_views);
					if (!numAnim1.error) {
					    numAnim1.start();
					} else {
					    console.error(numAnim1.error);
				}
				var numAnim2 = new CountUp('profileVInfo', 0, obj.ashthorp.stats.today.profile_views);
					if (!numAnim2.error) {
					    numAnim2.start();
					} else {
					    console.error(numAnim2.error);
				}
				var numAnim3 = new CountUp('appreciationsInfo', 0, obj.ashthorp.stats.today.project_appreciations);
					if (!numAnim3.error) {
					    numAnim3.start();
					} else {
					    console.error(numAnim3.error);
				}
				var numAnim4 = new CountUp('projectCInfo', 0, obj.ashthorp.stats.today.project_comments);
					if (!numAnim4.error) {
					    numAnim4.start();
					} else {
					    console.error(numAnim4.error);
				}

				var element = document.getElementById('graphContainer');
				element.classList.add('flip');
			
		    });

		    document.getElementById('filip').addEventListener('click', function() {

		    	document.getElementById('projectVInfo').innerHTML = '';
		    	document.getElementById('profileVInfo').innerHTML = '';
		    	document.getElementById('appreciationsInfo').innerHTML = '';
		    	document.getElementById('projectCInfo').innerHTML = '';
		    	hideProjs();

		    	var elementAsh = document.getElementById('ash');
		    	elementAsh.classList.remove('active');
		    	var elementCody = document.getElementById('cody');
		    	elementCody.classList.remove('active');
				
				$('#filipProj').show();

				var elementFilip = document.getElementById('filip');
	    		elementFilip.classList.add('active');

				var numAnim1 = new CountUp('projectVInfo', 0, obj.Filiphds.stats.today.project_views);
					if (!numAnim1.error) {
					    numAnim1.start();
					} else {
					    console.error(numAnim1.error);
				}
				var numAnim2 = new CountUp('profileVInfo', 0, obj.Filiphds.stats.today.profile_views);
					if (!numAnim2.error) {
					    numAnim2.start();
					} else {
					    console.error(numAnim2.error);
				}
				var numAnim3 = new CountUp('appreciationsInfo', 0, obj.Filiphds.stats.today.project_appreciations);
					if (!numAnim3.error) {
					    numAnim3.start();
					} else {
					    console.error(numAnim3.error);
				}
				var numAnim4 = new CountUp('projectCInfo', 0, obj.Filiphds.stats.today.project_comments);
					if (!numAnim4.error) {
					    numAnim4.start();
					} else {
					    console.error(numAnim4.error);
				}

				var element = document.getElementById('graphContainer');
				element.classList.add('flip');

		    });
			
		}
	}

	// Calls dataGrab for a specified user id 
	// and passes it the success function which contains a call to countObj
	function populateData(id) {

		dataGrab(usersURL + id + '/stats?client_id=' + apiKey, function(res) {
			statsAll[id] = res;
			countObj(statsAll);
		});
          	
    }

    // Hides all profile specific daily elements
    function hideProjs() {

        $('#codyProj').hide();
        $('#ashProj').hide();
        $('#filipProj').hide();
        $('#profTitle').hide();
        $('#projTitle').hide();

    }

    // Flips the card back to the google chart on back button click
    document.getElementById('backBtn').addEventListener('click', function() {

    	var elementAsh = document.getElementById('ash');
    	elementAsh.classList.remove('active');
    	var elementCody = document.getElementById('cody');
    	elementCody.classList.remove('active');
   		var elementFilip = document.getElementById('filip');
    	elementFilip.classList.remove('active');

   		var element = document.getElementById('graphContainer');
		element.classList.toggle('flip');

	});

    // Hover effect for project and profile names
    $('.profLink').hover(
	  function () {
	    $('#profTitle').fadeIn();
	  }, 
	  function () {
	    $('#profTitle').fadeOut();
	  }
	);

    $('.projLink').hover(
	  function () {
	    $('#projTitle').fadeIn();
	  }, 
	  function () {
	    $('#projTitle').fadeOut();
	  }
	);

    // Calls populateData for each user
	for (var i = 0; i < userIds.length; i++) {
		populateData(userIds[i]);
	}

}