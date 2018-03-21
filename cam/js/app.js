
$(document).ready(function() {

var apiKey = 'Iamkq0sRqOd6PqC7IEFwofD3YVs30ox9'; // behance api key
var apiKey2 = 'KxiDWLIreraa9YM633j8JQy3mRmU6Smh';

var ashThorpUrl = 'https://api.behance.net/v2/users/ashthorp?client_id=';
var codyCobbUrl = 'https://api.behance.net/v2/users/codycobb?client_id=';
var filipHodasUrl = 'https://api.behance.net/v2/users/Filiphds?client_id=';

var firstProfile  	= document.getElementsByClassName('profileUno')[0];
var secondProfile  	= document.getElementsByClassName('profileDos')[0];
var thirdProfile 	= document.getElementsByClassName('profileTres')[0];

// listen to each profile card for a click event
firstProfile.addEventListener('click', displayDetail, false);
secondProfile.addEventListener('click', displayDetailSecondProfile, false);
thirdProfile.addEventListener('click', displayDetailThirdProfile, false);

// when first profile is clicked run function displayDetail
function displayDetail() {
  	firstProfile.classList.toggle('heightToggle');
	secondProfile.classList.toggle('smallToggle');
	thirdProfile.classList.toggle('smallToggle');
}

// when second profile is clicked run function displayDetailSecondProfile
function displayDetailSecondProfile() {
	secondProfile.classList.toggle('heightToggle');
	firstProfile.classList.toggle('smallToggle');
	thirdProfile.classList.toggle('smallToggle');
}

// when third profile is clicked run function displayDetailThirdProfile
function displayDetailThirdProfile() {
	thirdProfile.classList.toggle('heightToggle');
	secondProfile.classList.toggle('smallToggle');
	firstProfile.classList.toggle('smallToggle');

}
	// ajax request to get behance profile data 
	$.ajax ({
		url: ashThorpUrl + apiKey,
		dataType: 'jsonp',
		success: function(behanceData) {
			if (behanceData) {
				var profileImage = '';
				// grab behance user profile picture and append it to the DOM
				profileImage += '<img id="profilePhoto1" src= "' + behanceData.user.images[276] + '">';
				$(secondProfile).append(profileImage);

				for (var about in behanceData.user.sections) {
					// append users display name
					$(secondProfile).append('<h1 id="ashThorp">' + behanceData.user.display_name + '</h1>');
					// append users occupation
					$(secondProfile).append('<h2 id="ashThorpOccupation">' + behanceData.user.occupation + '</h2>');
					// append users location
					$(secondProfile).append('<h2 id="ashThorpLocation">' + behanceData.user.location + '</h2>');
					// append users url to website
					$(secondProfile).append('<h2 id="ashThorpWebsite">' + behanceData.user.website + '</h2>');
					// append users 'about me' section
					$(secondProfile).append('<h3 id="ashThorpAbout">' + behanceData.user.sections[about] + '</h3>');
					// append users 'fields'
					$(secondProfile).append('<h2 id="ashThorpFields">' + behanceData.user.fields[0] + ',' + '&nbsp' + behanceData.user.fields[1] + ',' + '&nbsp' + behanceData.user.fields[2] + '</h2>');
					var statsList = '';
					// append users individual statistics
					statsList += '<ul><li>' + 'Appreciations ' + '</br>' + behanceData.user.stats.appreciations + '</li>' + '<li>' + 'Comments ' + '</br>' + behanceData.user.stats.comments + '</li>' + '<li>' + 'Followers ' + '</br>' + behanceData.user.stats.followers + '</li>' + '<li>' + 'Following ' + '</br>' + behanceData.user.stats.following + '</li>' + '<li>' + 'Views ' + '</br>' + behanceData.user.stats.views + '</li></ul>';
					$(secondProfile).append(statsList);
				}
			}
		},
		// if an error in recieving api data run function and console log error
		error: function(error) {
			console.log(error);
		}
	});

	// ajax request to get behance profile data 
	$.ajax ({
		url: codyCobbUrl + apiKey,
		dataType: 'jsonp',
		success: function(behanceData) {
			if (behanceData) {
				var profileImage = '';
				// grab behance user profile picture and append it to the DOM
				profileImage += '<img id="profilePhoto2" src= "' + behanceData.user.images[276] + '">';
				$(firstProfile).append(profileImage);

				for (var about in behanceData.user.sections) {
					// append users display name
					$(firstProfile).append('<h1 id="codyCobb">' + behanceData.user.display_name + '</h1>');
					// append users occupation
					$(firstProfile).append('<h2 id="codyCobbOccupation">' + behanceData.user.occupation + '</h2>');	
					// append users location				
					$(firstProfile).append('<h2 id="codyCobbLocation">' + behanceData.user.location + '</h2>');
					// append users url to website
					$(firstProfile).append('<h2 id="codyCobbWebsite">' + behanceData.user.website + '</h2>');
					// append users 'about me' section
					$(firstProfile).append('<h3 id="codyCobbAbout">' + behanceData.user.sections[about] + '</h3>');
					// append users 'fields'
					$(firstProfile).append('<h2 id="codyCobbFields">' + behanceData.user.fields[0] +  ',' + ' ' + behanceData.user.fields[1] + ',' + ' ' + behanceData.user.fields[2] + '</h2>');
					var statsList = '';
					// append users individual statistics
					statsList += '<ul><li>' + 'Appreciations ' + '</br>' + behanceData.user.stats.appreciations + '</li>' + '<li>' + 'Comments ' + '</br>' + behanceData.user.stats.comments + '</li>' + '<li>' + 'Followers ' + '</br>' + behanceData.user.stats.followers + '</li>' + '<li>' + 'Following ' + '</br>' + behanceData.user.stats.following + '</li>' + '<li>' + 'Views ' + '</br>' + behanceData.user.stats.views + '</li></ul>';
					$(firstProfile).append(statsList);

				}
			}
		},
		// if an error in recieving api data run function and console log error
		error: function(error) {
			console.log(error);
		}
	});

	// ajax request to get behance profile data 
	$.ajax ({
		url: filipHodasUrl + apiKey2,
		dataType: 'jsonp',
		success: function(behanceData) {
			if (behanceData) {
				var profileImage = '';
				// grab behance user profile picture and append it to the DOM
				profileImage += '<img id="profilePhoto3" src= "' + behanceData.user.images[276] + '">';
				$(thirdProfile).append(profileImage);
				// append users display name
				$(thirdProfile).append('<h1 id="filipHodas">' + behanceData.user.display_name + '</h1>');
				// append users occupation
				$(thirdProfile).append('<h2 id="filipHodasOccupation">' + behanceData.user.occupation + '</h2>');
				// append users location				
				$(thirdProfile).append('<h2 id="filipHodasLocation">' + behanceData.user.location + '</h2>');
				// append users url to website
				$(thirdProfile).append('<h2 id="filipHodasWebsite">' + behanceData.user.url + '</h2>');
				// append users 'about me' section
				$(thirdProfile).append('<h3 id="filipHodasAbout">' + behanceData.user.sections['About Me'] + '</h3>');
				// append users 'fields'
				$(thirdProfile).append('<h2 id="filipHodasFields">' + behanceData.user.fields[0] + ',' + ' ' + behanceData.user.fields[1] + ',' + ' ' + behanceData.user.fields[2] + '</h2>');
				var statsList = '';
				// append users individual statistics
				statsList += '<ul><li>' + 'Appreciations ' + '&nbsp' + '</br>' + behanceData.user.stats.appreciations + '</li>' + '<li>' + 'Comments ' + '&nbsp' + '</br>' + behanceData.user.stats.comments + '</li>' + '<li>' + 'Followers ' + '&nbsp' + '</br>' + behanceData.user.stats.followers + '</li>' + '<li>' + 'Following ' + '&nbsp' + '</br>' + behanceData.user.stats.following + '</li>' + '<li>' + 'Views ' + '&nbsp' + '</br>' + behanceData.user.stats.views + '</li></ul>';
				$(thirdProfile).append(statsList);
			}
		},
		// if an error in recieving api data run function and console log error
		error: function(error) {
			console.log(error);
		}
	});


}); // end ready function