$(document).ready(function() {

var apiKey = 'Iamkq0sRqOd6PqC7IEFwofD3YVs30ox9';
var apiKey2 = 'KxiDWLIreraa9YM633j8JQy3mRmU6Smh';
var ashThorpUrl = 'https://api.behance.net/v2/users/ashthorp?client_id=';
var codyCobbUrl = 'https://api.behance.net/v2/users/codycobb?client_id=';
var filipHodasUrl = 'https://api.behance.net/v2/users/Filiphds?client_id=';

var firstProfile  	= document.getElementsByClassName('profileUno')[0];
var secondProfile  	= document.getElementsByClassName('profileDos')[0];
var thirdProfile 	= document.getElementsByClassName('profileTres')[0];
var hiddenCard1		= document.getElementById('closebtn1');
var hiddenCard2		= document.getElementById('closebtn2');
var hiddenCard3		= document.getElementById('closebtn3');

firstProfile.addEventListener('click', displayDetail, false);
secondProfile.addEventListener('click', displayDetailSecondProfile, false);
thirdProfile.addEventListener('click', displayDetailThirdProfile, false);

function displayDetail() {
	firstProfile.classList.toggle("heightToggle");

	secondProfile.classList.toggle("smallToggle");
	thirdProfile.classList.toggle("smallToggle");
}

function displayDetailSecondProfile() {
	secondProfile.classList.toggle("heightToggle");

	firstProfile.classList.toggle("smallToggle");
	thirdProfile.classList.toggle("smallToggle");
}

function displayDetailThirdProfile() {
	thirdProfile.classList.toggle("heightToggle");

	secondProfile.classList.toggle("smallToggle");
	firstProfile.classList.toggle("smallToggle");

}

	$.ajax ({
		url: ashThorpUrl + apiKey,
		dataType: 'jsonp',
		success: function(behanceData) {
			if (behanceData) {
				console.log(behanceData);
				var profileImage = '';
				profileImage += '<img id="profilePhoto1" src= "' + behanceData.user.images[276] + '">';
				$(secondProfile).append(profileImage);

				for (var about in behanceData.user.sections) {

					$(secondProfile).append('<h2 id="ashThorpOccupation">' + behanceData.user.occupation + '</h2>');
					$(secondProfile).append('<h2 id="ashThorpLocation">' + behanceData.user.location + '</h2>');
					$(secondProfile).append('<h2 id="ashThorpWebsite">' + behanceData.user.website + '</h2>');
					$(secondProfile).append('<h3 id="ashThorpAbout">' + behanceData.user.sections[about] + '</h3>');
					$(secondProfile).append('<h2 id="ashThorpFields">' + 'Fields: ' + behanceData.user.fields['0'] + ',' + ' ' + behanceData.user.fields['1'] + ',' + ' ' + behanceData.user.fields['2'] + '</h2>');
					var statsList = '';

						statsList += '<ul><li>' + behanceData.user.stats.appreciations + '</li>' + '<li>' + behanceData.user.stats.comments + '</li>' + '<li>' + behanceData.user.stats.followers + '</li>' + '<li>' + behanceData.user.stats.following + '</li>' + '<li>' + behanceData.user.stats.views + '</li></ul>';
					$(secondProfile).append(statsList);
				}
			}
		},
		error: function(error) {
			console.log('error');
		}
	});

	$.ajax ({
		url: codyCobbUrl + apiKey,
		dataType: 'jsonp',
		success: function(behanceData) {
			if (behanceData) {
				console.log(behanceData);
				var profileImage = '';
				profileImage += '<img id="profilePhoto2" src= "' + behanceData.user.images[276] + '">';
				$(firstProfile).append(profileImage);

				for (var about in behanceData.user.sections) {

					$(firstProfile).append('<h2 id="codyCobbOccupation">' + behanceData.user.occupation + '</h2>');					
					$(firstProfile).append('<h2 id="codyCobbLocation">' + behanceData.user.location + '</h2>');
					$(firstProfile).append('<h2 id="codyCobbWebsite">' + behanceData.user.website + '</h2>');
					$(firstProfile).append('<h3 id="codyCobbAbout">' + behanceData.user.sections[about] + '</h3>');
					$(firstProfile).append('<h2 id="codyCobbFields">' + 'Fields: ' + behanceData.user.fields['0'] +  ',' + ' ' + behanceData.user.fields['1'] + ',' + ' ' + behanceData.user.fields['2'] + '</h2>');

				}
			}
		},
		error: function(error) {
			console.log('error');
		}
	});
	$.ajax ({
		url: filipHodasUrl + apiKey2,
		dataType: 'jsonp',
		success: function(behanceData) {
			if (behanceData) {
				console.log(behanceData);
				var profileImage = '';
				profileImage += '<img id="profilePhoto3" src= "' + behanceData.user.images[276] + '">';
				$(thirdProfile).append(profileImage);


				$(thirdProfile).append('<h2 id="filipHodasOccupation">' + behanceData.user.occupation + '</h2>');				
				$(thirdProfile).append('<h2 id="filipHodasLocation">' + behanceData.user.location + '</h2>');
				$(thirdProfile).append('<h2 id="filipHodasWebsite">' + behanceData.user.url + '</h2>');
				$(thirdProfile).append('<h3 id="filipHodasAbout">' + behanceData.user.sections['About Me'] + '</h3>');
				$(thirdProfile).append('<h2 id="filipHodasFields">' + 'Fields: ' + behanceData.user.fields['0'] + ',' + ' ' + behanceData.user.fields['1'] + ',' + ' ' + behanceData.user.fields['2'] + '</h2>');
			}
		},
		error: function(error) {
			console.log('error');
		}
	});


// + '<figcaption>' + behanceData.user.display_name + '</figcaption>'


}); // end ready function