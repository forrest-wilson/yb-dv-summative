$(document).ready(function() {

var apiKey = 'Iamkq0sRqOd6PqC7IEFwofD3YVs30ox9';
var apiKey2 = 'KxiDWLIreraa9YM633j8JQy3mRmU6Smh';
var ashThorpUrl = 'https://api.behance.net/v2/users/ashthorp?client_id=KxiDWLIreraa9YM633j8JQy3mRmU6Smh';
var codyCobbUrl = 'https://api.behance.net/v2/users/codycobb?client_id=KxiDWLIreraa9YM633j8JQy3mRmU6Smh';
var filipHodasUrl = 'https://api.behance.net/v2/users/Filiphds?client_id=KxiDWLIreraa9YM633j8JQy3mRmU6Smh';

var firstProfile  	= document.getElementById('profileUno');
var secondProfile  	= document.getElementById('profileDos');
var thirdProfile 	= document.getElementById('profileTres');

firstProfile.addEventListener('click', displayDetail, false);
secondProfile.addEventListener('click', displayDetailSecondProfile, false);
thirdProfile.addEventListener('click', displayDetailThirdProfile, false);

function displayDetail() {
	firstProfile.classList.remove('col-lg-3');
	firstProfile.classList.remove('col-md-3');
	firstProfile.classList.add('col-lg-12');
	firstProfile.classList.add('col-md-9');
	// $(firstProfile).css({'pointer-events': 'none'});
	$(firstProfile).css({'height': '600px'});
	$('img').css({'width': '25%'});

	secondProfile.classList.remove('col-lg-3');
	secondProfile.classList.remove('col-md-3');
	secondProfile.classList.add('col-lg-12');
	secondProfile.classList.add('col-md-9');
	$(secondProfile).css({'height': '60px'});

	thirdProfile.classList.remove('col-lg-3');
	thirdProfile.classList.remove('col-md-3');
	thirdProfile.classList.add('col-lg-12');
	thirdProfile.classList.add('col-md-9');
	$(thirdProfile).css({'height': '60px'});
}
function displayDetailSecondProfile() {
	secondProfile.classList.remove('col-lg-3');
	secondProfile.classList.remove('col-md-3');
	secondProfile.classList.add('col-lg-12');
	secondProfile.classList.add('col-md-9');
	// $(secondProfile).css({'pointer-events': 'none'});
	$(secondProfile).css({'height': '600px'});
	$('img').css({'width': '25%'});
	
	firstProfile.classList.remove('col-lg-3');
	firstProfile.classList.remove('col-md-3');
	firstProfile.classList.add('col-lg-12');
	firstProfile.classList.add('col-md-9');
	$(firstProfile).css({'height': '60px'});

	thirdProfile.classList.remove('col-lg-3');
	thirdProfile.classList.remove('col-md-3');
	thirdProfile.classList.add('col-lg-12');
	thirdProfile.classList.add('col-md-9');
	$(thirdProfile).css({'height': '60px'});
}
function displayDetailThirdProfile() {
	thirdProfile.classList.remove('col-lg-3');
	thirdProfile.classList.remove('col-md-3');
	thirdProfile.classList.add('col-lg-12');
	thirdProfile.classList.add('col-md-9');
	// $(thirdProfile).css({'pointer-events': 'none'});
	$(thirdProfile).css({'height': '600px'});
	$('img').css({'width': '25%'});
	
	secondProfile.classList.remove('col-lg-3');
	secondProfile.classList.remove('col-md-3');
	secondProfile.classList.add('col-lg-12');
	secondProfile.classList.add('col-md-9');
	$(secondProfile).css({'height': '60px'});

	firstProfile.classList.remove('col-lg-3');
	firstProfile.classList.remove('col-md-3');
	firstProfile.classList.add('col-lg-12');
	firstProfile.classList.add('col-md-9');
	$(firstProfile).css({'height': '60px'});
}


$.ajax ({
	url: ashThorpUrl,
	dataType: 'jsonp',
	success: function(behanceData) {
		if (behanceData) {
			console.log(behanceData);
			var profileImage = '';
			profileImage += '<img src= "' + behanceData.user.images[276] + '">' + '<figcaption>' + behanceData.user.display_name + '</figcaption>';
			$(secondProfile).append(profileImage);
		}
	},
	error: function(error) {
		console.log('error');
	}
});

$.ajax ({
	url: codyCobbUrl,
	dataType: 'jsonp',
	success: function(behanceData) {
		if (behanceData) {
			console.log(behanceData);
			var profileImage = '';
			profileImage += '<img src= "' + behanceData.user.images[276] + '">' + '<figcaption>' + behanceData.user.display_name + '</figcaption>';
			$(firstProfile).append(profileImage);
		}
	},
	error: function(error) {
		console.log('error');
	}
});
$.ajax ({
	url: filipHodasUrl,
	dataType: 'jsonp',
	success: function(behanceData) {
		if (behanceData) {
			console.log(behanceData);
			var profileImage = '';
			profileImage += '<img src= "' + behanceData.user.images[276] + '">' + '<figcaption>' + behanceData.user.display_name + '</figcaption>';
			$(thirdProfile).append(profileImage);
		}
	},
	error: function(error) {
		console.log('error');
	}
});













































}); // end ready function