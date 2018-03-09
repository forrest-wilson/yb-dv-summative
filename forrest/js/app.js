$(document).ready(function() {

    //*******************************//
    //**** Variable Declarations****//
    //*******************************//

    var apiKey = '8PyTZKuJ1VEQWvDvoOsARLkT8f6N71db',
        designers = {
            forrest: 'codycobb',
            cam: 'ashthorp',
            // ant: ''
        };

    //*******************//
    //**** Functions ****//
    //*******************//

    function getData(url, successFunction) {
        $.ajax({
            method: 'GET',
            dataType: 'jsonp',
            url: url,
            success: successFunction,
            error: function(err) {
                throw new Error('Unhandled AJAX Error: ', err);
            }
        });
    }

    for (designer in designers) {
        getData('https://api.behance.net/v2/users/' + designers[designer]+ '/projects?client_id=' + apiKey, function(data) {
            console.log(data);
        });
    }

    //*************************//
    //**** Event Listeners ****//
    //*************************//
});