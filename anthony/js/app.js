google.charts.load('current', {'packages':['corechart', 'bar']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
	
	var apiKey = 'nnHT2gNBLBc7MnBAi0G0pGrwuFHmhXzi',/* 'uASQiBZVNZdHoFeil4ZlXU3USDC0rfV8',*/
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

		statsAll = [];

		for (var i = 0; i < userIds.length; i++) {
			dataGrab(usersURL + userIds[i] + '/stats?client_id=' + apiKey);
		}
        
        setTimeout(function() {
			var data = google.visualization.arrayToDataTable([
				['Designers', 'Project Views', { role: 'style' }, 'Profile Views', { role: 'style' }, 'Project Appreciations', { role: 'style' }],
				['Cody Cobb', statsAll[0].stats.all_time.project_views, '#eb0d30', statsAll[0].stats.all_time.profile_views, '#cff074', statsAll[0].stats.all_time.project_appreciations, '#a9e6ec'],
				['Ash Thorp', statsAll[1].stats.all_time.project_views, '#eb0d30', statsAll[1].stats.all_time.profile_views, '#cff074', statsAll[1].stats.all_time.project_appreciations, '#a9e6ec'],
				['Filip Hodas', statsAll[2].stats.all_time.project_views, '#eb0d30', statsAll[2].stats.all_time.profile_views, '#cff074', statsAll[2].stats.all_time.project_appreciations, '#a9e6ec']
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
			console.log(statsAll[0].stats.all_time.project_views);
		}, 500);
          	
    }
	// $('#cody').click(function(){
 //        $('#codyProj').hide();
 //        $('#ashProj').hide();
 //        $('#filipProj').hide();
 //    });

    function hideProjs() {
        $('#codyProj').hide();
        $('#ashProj').hide();
        $('#filipProj').hide();
        $('#profTitle').hide();
        $('#projTitle').hide();
    }

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

    // Container Flips
    document.getElementById('cody').addEventListener('click', function() {

    	document.getElementById('projectVInfo').innerHTML = '';
    	document.getElementById('profileVInfo').innerHTML = '';
    	document.getElementById('appreciationsInfo').innerHTML = '';
    	document.getElementById('projectCInfo').innerHTML = '';

    	hideProjs();

    	var element = document.getElementById('ash');
    	element.classList.remove('active');
    	var element = document.getElementById('filip');
    	element.classList.remove('active');
	
		setTimeout(function() {

			$('#codyProj').show();

			var element = document.getElementById('cody');
    		element.classList.add('active');

			var numAnim1 = new CountUp('projectVInfo', 0, statsAll[0].stats.today.project_views);
				if (!numAnim1.error) {
				    numAnim1.start();
				} else {
				    console.error(numAnim1.error);
			}
			var numAnim2 = new CountUp('profileVInfo', 0, statsAll[0].stats.today.profile_views);
				if (!numAnim2.error) {
				    numAnim2.start();
				} else {
				    console.error(numAnim2.error);
			}
			var numAnim3 = new CountUp('appreciationsInfo', 0, statsAll[0].stats.today.project_appreciations);
				if (!numAnim3.error) {
				    numAnim3.start();
				} else {
				    console.error(numAnim3.error);
			}
			var numAnim4 = new CountUp('projectCInfo', 0, statsAll[0].stats.today.project_comments);
				if (!numAnim4.error) {
				    numAnim4.start();
				} else {
				    console.error(numAnim4.error);
			}

			var element = document.getElementById('graphContainer');
			element.classList.add('flip');

		}, 100);
		

    });

    document.getElementById('ash').addEventListener('click', function() {

		document.getElementById('projectVInfo').innerHTML = '';
    	document.getElementById('profileVInfo').innerHTML = '';
    	document.getElementById('appreciationsInfo').innerHTML = '';
    	document.getElementById('projectCInfo').innerHTML = '';
    	hideProjs();

    	var element = document.getElementById('cody');
    	element.classList.remove('active');
    	var element = document.getElementById('filip');
    	element.classList.remove('active');

		setTimeout(function() {

			$('#ashProj').show();

			var element = document.getElementById('ash');
    		element.classList.add('active');

			var numAnim1 = new CountUp('projectVInfo', 0, statsAll[1].stats.today.project_views);
				if (!numAnim1.error) {
				    numAnim1.start();
				} else {
				    console.error(numAnim1.error);
			}
			var numAnim2 = new CountUp('profileVInfo', 0, statsAll[1].stats.today.profile_views);
				if (!numAnim2.error) {
				    numAnim2.start();
				} else {
				    console.error(numAnim2.error);
			}
			var numAnim3 = new CountUp('appreciationsInfo', 0, statsAll[1].stats.today.project_appreciations);
				if (!numAnim3.error) {
				    numAnim3.start();
				} else {
				    console.error(numAnim3.error);
			}
			var numAnim4 = new CountUp('projectCInfo', 0, statsAll[1].stats.today.project_comments);
				if (!numAnim4.error) {
				    numAnim4.start();
				} else {
				    console.error(numAnim4.error);
			}

			var element = document.getElementById('graphContainer');
			element.classList.add('flip');
		}, 100);
		

    });

    document.getElementById('filip').addEventListener('click', function() {

    	document.getElementById('projectVInfo').innerHTML = '';
    	document.getElementById('profileVInfo').innerHTML = '';
    	document.getElementById('appreciationsInfo').innerHTML = '';
    	document.getElementById('projectCInfo').innerHTML = '';
    	hideProjs();

    	var element = document.getElementById('ash');
    	element.classList.remove('active');
    	var element = document.getElementById('cody');
    	element.classList.remove('active');
		
		setTimeout(function() {

			$('#filipProj').show();

			var element = document.getElementById('filip');
    		element.classList.add('active');

			var numAnim1 = new CountUp('projectVInfo', 0, statsAll[2].stats.today.project_views);
				if (!numAnim1.error) {
				    numAnim1.start();
				} else {
				    console.error(numAnim1.error);
			}
			var numAnim2 = new CountUp('profileVInfo', 0, statsAll[2].stats.today.profile_views);
				if (!numAnim2.error) {
				    numAnim2.start();
				} else {
				    console.error(numAnim2.error);
			}
			var numAnim3 = new CountUp('appreciationsInfo', 0, statsAll[2].stats.today.project_appreciations);
				if (!numAnim3.error) {
				    numAnim3.start();
				} else {
				    console.error(numAnim3.error);
			}
			var numAnim4 = new CountUp('projectCInfo', 0, statsAll[2].stats.today.project_comments);
				if (!numAnim4.error) {
				    numAnim4.start();
				} else {
				    console.error(numAnim4.error);
			}

			var element = document.getElementById('graphContainer');
			element.classList.add('flip');

		}, 100);
		

    });
    
    document.getElementById('backBtn').addEventListener('click', function() {

    	var element = document.getElementById('ash');
    	element.classList.remove('active');
    	var element = document.getElementById('cody');
    	element.classList.remove('active');
   		var element = document.getElementById('filip');
   		
    	element.classList.remove('active');
   		var element = document.getElementById('graphContainer');
		element.classList.toggle('flip');

	});

	populateData();

	// Chart update
	// setInterval(function() {
	//     drawChart();
	// }, 10000);
}
