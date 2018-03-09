$(document).ready(function() {

    //*******************************//
    //**** Variable Declarations****//
    //*******************************//

    var apiKey = '8PyTZKuJ1VEQWvDvoOsARLkT8f6N71db',
        xhr = null; // Needed in order to abort the current AJAX request should another one come along

    //*******************//
    //**** Functions ****//
    //*******************//

    function getData(url, successFunction, completionHandler) {
        if (xhr !== null && xhr.readyState != 4) {
            xhr.abort();
        }

        xhr = $.ajax({
            method: 'GET',
            dataType: 'json',
            url: url,
            success: successFunction,
            error: function(err) {
                throw new Error('Unhandled AJAX Error: ', err);
            },
            always: completionHandler
        });
    }

    //*************************//
    //**** Event Listeners ****//
    //*************************//
});