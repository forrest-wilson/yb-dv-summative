$(document).ready(function() {

    //*******************************//
    //**** Variable Declarations****//
    //*******************************//

    var apiKey = '8PyTZKuJ1VEQWvDvoOsARLkT8f6N71db',
        usersURL = 'https://api.behance.net/v2/users/',
        projectsURL = 'https://www.behance.net/v2/projects/',
        designers = {
            forrest: 'codycobb',
            cam: 'ashthorp',
            ant: 'Filiphds'
        };

    //*******************************//
    //**** Plugin Initialisation ****//
    //*******************************//

    var masonryProjects = $('.projects').masonry({
        itemSelector: '.project',
        columnWidth: '.sizer',
        percentPosition: true
    });

    //************************//
    //**** Helper Methods ****//
    //************************//

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

    //*******************//
    //**** Functions ****//
    //*******************//

    function getProjects() {
        // for (var designer in designers) {
            getData(usersURL + designers.forrest + '/projects?client_id=' + apiKey, function(data) {
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
                            comments: projects[i].stats.comments,
                            projectID: projects[i].id,
                            creator: null
                        };
                    
                    // Checks the data to see whether there were multiple owners of the project
                    // If so, set the text to 'Multiple Owners'
                    if (projects[i].owners.length > 1) {
                        projectInfo.creator = 'Multiple Owners';
                    } else {
                        projectInfo.creator = projects[i].owners[0].display_name;
                    }

                    var toBeAppended = compiledProjectTemplate(projectInfo),
                        $toBeAppended = $(toBeAppended);

                    masonryProjects.append($toBeAppended).masonry('appended', $toBeAppended);

                    masonryProjects.imagesLoaded().progress(function() {
                        masonryProjects.masonry('layout');
                    });
                }
            });
        // }
    }

    getProjects();

    function getProjectDetails(projectID) {
        getData(projectsURL + projectID + '?api_key=' + apiKey, function(projectData) {
            console.log(projectData);
        });
    }

    //*************************//
    //**** Event Listeners ****//
    //*************************//

    $(document).on('click', '.projectInner', function(e) {
        e.preventDefault();
        getProjectDetails(this.parentNode.dataset.projectid);
    });
});