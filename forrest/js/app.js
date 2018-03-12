$(document).ready(function() {

    //*******************************//
    //**** Variable Declarations ****//
    //*******************************//

    var apiKey = '8PyTZKuJ1VEQWvDvoOsARLkT8f6N71db',
        usersURL = 'https://api.behance.net/v2/users/',
        projectsURL = 'https://www.behance.net/v2/projects/',
        designers = ['codycobb', 'ashthorp', 'Filiphds'],
        pagination = {
            projectsPerPage: 3,
            nextPageNumber: 1
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

    //**** Data Getter methods ****//

    // Gets the projects using a specified page number
    function getProjects(pageNum) {
        // Commented to reduce AJAX requests during development
        // for (var i = 0; i < designers.length; i++) {
        //     getData(usersURL + designers[i] + '/projects?client_id=' + apiKey + '&per_page=' + pagination.projectsPerPage + '&page=' + pageNum, populateProjects);
        // }

        getData(usersURL + designers[0] + '/projects?client_id=' + apiKey + '&per_page=' + pagination.projectsPerPage + '&page=' + pageNum, populateProjects);

        // Increases the page number to send with the next getProjects AJAX request
        pagination.nextPageNumber += 1;
    }

    getProjects(pagination.nextPageNumber);

    function getProjectDetails(projectID, callback) {
        getData(projectsURL + projectID + '?api_key=' + apiKey, function(data) {
            populateModal(data);
            if (callback) callback();
        });        
    }

    //**** Data Parser methods ****//

    function populateProjects(data) {
        console.log(data);

        var projects = data.projects,
            counter = $('.project').length;

        if (projects.length > 0) {
            for (var i = 0; i < projects.length; i++) {
                counter = counter + 1;
                var projectTemplate = $('#projectTemplate').html(),
                    compiledProjectTemplate = Template7.compile(projectTemplate),
                    projectInfo = {
                        coverImage: projects[i].covers.original,
                        projectName: projects[i].name,
                        likes: projects[i].stats.appreciations,
                        views: projects[i].stats.views,
                        comments: projects[i].stats.comments,
                        projectID: projects[i].id,
                        creator: null,
                        counter: counter
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
            }

            masonryProjects.imagesLoaded().progress(function() {
                masonryProjects.masonry('layout');
            });
        }
    }

    function populateModal(data) {
        console.log(data);
    }

    //*************************//
    //**** Event Functions ****//
    //*************************//

    // Shows the AJAX loading GIF
    function toggleLoader() {
        $('#loader').fadeToggle({
            duration: 300,
            easing: 'swing'
        });
    }

    function showMask() {
        $('#modalMask').fadeIn({
            duration: 300,
            easing: 'swing'
        });
    }

    //*************************//
    //**** Event Listeners ****//
    //*************************//

    // Event listener for projects being clicked
    $(document).on('click', '.projectInner', function(e) {
        e.preventDefault();
        toggleLoader();
        showMask();
        getProjectDetails(this.parentNode.dataset.projectid, toggleLoader);
    });

    //*******************//
    //**** Dummy API ****//
    //*******************//

    // var dummy = {
    //     project: 'json/project.json',
    //     projects: 'json/projects.json',
    //     comments: {
    //         page1: 'json/projectCommentsP1-10.json',
    //         page2: 'json/projectCommentsP2-10.json',
    //         page3: 'json/projectCommentsP3-7.json',
    //         all: 'json/projectCommentsAll.json'
    //     }
    // };

    // $.get(dummy.comments.page1, function(data) {
    //     console.log(data);
    // });
});