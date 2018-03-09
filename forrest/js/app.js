$(document).ready(function() {

    //*******************************//
    //**** Variable Declarations****//
    //*******************************//

    var apiKey = '8PyTZKuJ1VEQWvDvoOsARLkT8f6N71db',
        designers = {
            forrest: 'codycobb',
            cam: 'ashthorp',
            ant: 'Filiphds'
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

    function getDesigners() {
        for (var designer in designers) {
            getData('https://api.behance.net/v2/users/' + designers[designer] + '?client_id=' + apiKey, function(data) {
                console.log(data);

                var user = data.user;

                var designerTemplate = $('#designerName').html();
                var compiledDesignerTemplate = Template7.compile(designerTemplate);
                var designerInfo = {
                    uid: user.username,
                    name: user.display_name,
                    job: user.occupation,
                    designerImage: user.images[100],
                    behance: user.url
                };
                var designers = compiledDesignerTemplate(designerInfo);

                $('body').append(designers);

                getData('https://api.behance.net/v2/users/' + user.username + '/projects?client_id=' + apiKey, function(projectResponse) {
                    console.log(projectResponse);

                    var projects = projectResponse.projects;

                    for (var i = 0; i < projects.length; i++) {
                        var proj = projects[i];
                        var projectTemplate = $('#designerProjects').html();
                        var compiledProjectTemplate = Template7.compile(projectTemplate);
                        var projectInfo = {
                            coverImage: proj.covers.original,
                            projectName: proj.name
                        };
                        var project = compiledProjectTemplate(projectInfo);

                        $('#' + user.username).append(project);
                    }
                });
            });
        }
    }

    getDesigners();

    //*************************//
    //**** Event Listeners ****//
    //*************************//
});