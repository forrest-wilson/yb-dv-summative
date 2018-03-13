$(document).ready(function() {

var firstProfile  	= document.getElementById('profileUno');
var secondProfile  	= document.getElementById('profileDos');
var thirdProfile 	= document.getElementById('profileTres');

firstProfile.addEventListener('click', displayDetail, false);
secondProfile.addEventListener('click', displayDetailSecondProfile, false);
thirdProfile.addEventListener('click', displayDetailThirdProfile, false);

function displayDetail() {
	firstProfile.classList.remove('col-lg-3');
	firstProfile.classList.add('col-lg-12');
	// $(firstProfile).css({'pointer-events': 'none'});
	$(firstProfile).css({'height': '550px'});

	secondProfile.classList.remove('col-lg-3');
	secondProfile.classList.add('col-lg-12');
	$(secondProfile).css({'height': '80px'});

	thirdProfile.classList.remove('col-lg-3');
	thirdProfile.classList.add('col-lg-12');
	$(thirdProfile).css({'height': '80px'});
}
function displayDetailSecondProfile() {
	secondProfile.classList.remove('col-lg-3');
	secondProfile.classList.add('col-lg-12');
	// $(secondProfile).css({'pointer-events': 'none'});
	$(secondProfile).css({'height': '550px'});
	
	firstProfile.classList.remove('col-lg-3');
	firstProfile.classList.add('col-lg-12');
	$(firstProfile).css({'height': '80px'});

	thirdProfile.classList.remove('col-lg-3');
	thirdProfile.classList.add('col-lg-12');
	$(thirdProfile).css({'height': '80px'});
}
function displayDetailThirdProfile() {
	thirdProfile.classList.remove('col-lg-3');
	thirdProfile.classList.add('col-lg-12');
	// $(thirdProfile).css({'pointer-events': 'none'});
	$(thirdProfile).css({'height': '550px'});
	
	secondProfile.classList.remove('col-lg-3');
	secondProfile.classList.add('col-lg-12');
	$(secondProfile).css({'height': '80px'});

	firstProfile.classList.remove('col-lg-3');
	firstProfile.classList.add('col-lg-12');
	$(firstProfile).css({'height': '80px'});
}











}); // end ready function