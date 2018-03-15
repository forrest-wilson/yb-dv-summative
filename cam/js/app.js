$(document).ready(function() {

var apiKey = 'Iamkq0sRqOd6PqC7IEFwofD3YVs30ox9';
var apiKey2 = 'KxiDWLIreraa9YM633j8JQy3mRmU6Smh';
var ashThorpUrl = 'https://api.behance.net/v2/users/ashthorp?client_id=KxiDWLIreraa9YM633j8JQy3mRmU6Smh';
var codyCobbUrl = 'https://api.behance.net/v2/users/codycobb?client_id=KxiDWLIreraa9YM633j8JQy3mRmU6Smh';
var filipHodasUrl = 'https://api.behance.net/v2/users/Filiphds?client_id=KxiDWLIreraa9YM633j8JQy3mRmU6Smh';

var firstProfile  	= document.getElementById('profileUno');
var secondProfile  	= document.getElementById('profileDos');
var thirdProfile 	= document.getElementById('profileTres');
var hiddenCard1		= document.getElementById('closebtn1');
var hiddenCard2		= document.getElementById('closebtn2');
var hiddenCard3		= document.getElementById('closebtn3');

firstProfile.addEventListener('click', displayDetail, false);
secondProfile.addEventListener('click', displayDetailSecondProfile, false);
thirdProfile.addEventListener('click', displayDetailThirdProfile, false);

function displayDetail() {
    $(firstProfile).animate({height: "600px", width: "1000px"});
    $('#profilePhoto2').css({float: 'left', width: '276px'});

    $(secondProfile).animate({height: "290px", width: "290px"});
    $(thirdProfile).animate({height: "290px", width: "290px"});
}

function displayDetailSecondProfile() {
    $(secondProfile).animate({height: "600px", width: "1000px"});
    $('#profilePhoto1').css({float: 'left', width: '276px'});

    $(firstProfile).animate({height: "290px", width: "290px"});
	$(thirdProfile).animate({height: "290px", width: "290px"});
}
function displayDetailThirdProfile() {
    $(thirdProfile).animate({height: "600px", width: "1000px"});
    $('#profilePhoto3').css({float: 'left', width: '276px'});

    $(secondProfile).animate({height: "290px", width: "290px"});
    $(firstProfile).animate({height: "290px", width: "290px"});
}

	$.ajax ({
		url: ashThorpUrl,
		dataType: 'jsonp',
		success: function(behanceData) {
			if (behanceData) {
				console.log(behanceData);
				var profileImage = '';
				profileImage += '<img id="profilePhoto1" src= "' + behanceData.user.images[276] + '">' + '<figcaption>' + behanceData.user.display_name + '</figcaption>';
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
				profileImage += '<img id="profilePhoto2" src= "' + behanceData.user.images[276] + '">' + behanceData.user.display_name;
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
				profileImage += '<img id="profilePhoto3" src= "' + behanceData.user.images[276] + '">' + '<figcaption>' + behanceData.user.display_name + '</figcaption>';
				$(thirdProfile).append(profileImage);
			}
		},
		error: function(error) {
			console.log('error');
		}
	});


}); // end ready function