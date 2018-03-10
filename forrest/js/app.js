$(document).ready(function() {

    //*******************************//
    //**** Variable Declarations****//
    //*******************************//

    var apiKey = '8PyTZKuJ1VEQWvDvoOsARLkT8f6N71db',
        baseURL = 'https://api.behance.net/v2/users/',
        designers = {
            forrest: 'codycobb',
            cam: 'ashthorp',
            ant: 'Filiphds'
        };

    //*******************//
    //**** Functions ****//
    //*******************//

    // Generic AJAX function. Increases reuseablility
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

    function getProjects() {
        getData(baseURL + designers.forrest + '/projects?client_id=' + apiKey, function(data) {
            console.log(data);

            var projects = data.projects;

            for (var i = 0; i < projects.length; i++) {
                var projectTemplate = $('#projectTemplate').html(),
                    compiledProjectTemplate = Template7.compile(projectTemplate),
                    projectInfo = {
                        coverImage: projects[i].covers[404],
                        projectName: projects[i].name,
                        likes: projects[i].stats.appreciations,
                        views: projects[i].stats.views,
                        comments: projects[i].stats.comments
                    },
                    toBeAppended = compiledProjectTemplate(projectInfo);
                
                $('body').append(toBeAppended);
            }
        });
    }

    getProjects();

    //*************************//
    //**** Event Listeners ****//
    //*************************//
});