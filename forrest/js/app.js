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
        },
        commentPagination = {
            commentsPerPage: 5,
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
            getProjectComments(projectID);
            commentPagination.nextPageNumber++;
            if (callback) callback();
        });        
    }

    function getProjectComments(projectID) {
        getData(projectsURL + projectID + '/comments?client_id=' + apiKey + '&per_page=' + commentPagination.commentsPerPage + '&page=' + commentPagination.nextPageNumber, function(data) {
            populateComments(data);
        });
    }

    //**** Data Parser methods ****//

    function populateProjects(data) {
        console.log(data);

        var projects = data.projects,
            counter = $('.project').length;

        if (projects.length > 0) {
            for (var i = 0; i < projects.length; i++) {
                // Counter for data-order in template
                counter = counter + 1;
                var projectTemplate = $('#projectTemplate').html(),
                    compiledProjectTemplate = Template7.compile(projectTemplate),
                    projectInfo = {
                        coverImage: projects[i].covers.original,
                        projectName: projects[i].name,
                        stats: {
                            likes: projects[i].stats.appreciations,
                            views: projects[i].stats.views,
                            comments: projects[i].stats.comments,
                        },
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

        var project = data.project,
            projectTemplate = $('#projectDetailsTemplate').html(),
            compiledProjectDetailsTemplate = Template7.compile(projectTemplate),
            info = {
                images: [],
                fields: [],
                fieldsString: '',
                description: project.description,
                creationDate: moment.unix(project.published_on).format('Do MMM YYYY'),
                projectName: project.name,
                stats: {
                    likes: project.stats.appreciations,
                    views: project.stats.views,
                    comments: project.stats.comments
                },
                projectID: project.id
            };

        for (var i = 0; i < project.modules.length; i++) {
            if (project.modules[i].type == 'image') {
                info.images.push(project.modules[i].sizes.max_1200);
            }
        }

        // Concatenates all fields into a string to pass to the template
        for (var j = 0; j < project.fields.length; j++) {
            info.fields.push(project.fields[j]);
            info.fieldsString += info.fields[j];

            if (j < project.fields.length - 1) {
                info.fieldsString += ', ';
            }
        }

        var compiledTemplate = compiledProjectDetailsTemplate(info);

        $('#modalContent').append(compiledTemplate);

        $('#images').slick({
            initialSlide: 1,
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            adaptiveHeight: true
        });
    }

    function populateComments(data) {
        console.log(data);

        var comments = data.comments,
            commentElements = [];

        if (data.comments.length > 0) {
            for (var i = 0; i < comments.length; i++) {
                var comment = comments[i],
                    commentTemplate = $('#commentTemplate').html(),
                    compiledCommentTemplate = Template7.compile(commentTemplate),
                    commentInfo = {
                        commenter: {
                            name: comment.user.display_name,
                            image: comment.user.images[100],
                            link: comment.user.url
                        },
                        comment: comment.comment
                    },
                    compiled = compiledCommentTemplate(commentInfo);

                commentElements.push(compiled);

                if (comments.length == commentElements.length) {
                    $('#comments').append(commentElements);
                }
            }

            console.log(commentElements);
        }
    }

    //*************************//
    //**** Event Functions ****//
    //*************************//

    // Toggles the AJAX loading GIF
    function toggleLoader() {
        $('#loader').fadeToggle({
            duration: 300,
            easing: 'swing'
        });
    }

    // Toggles the mask
    function toggleMask(callback) {
        $('#modalMask').fadeToggle({
            duration: 300,
            easing: 'swing',
            complete: callback
        });
    }

    // Toggles scrolling on the body element
    function toggleBodyScroll() {
        $('body').toggleClass('modalShowing');
    }

    //*************************//
    //**** Event Listeners ****//
    //*************************//

    // Event listener for projects being clicked
    $(document).on('click', '.projectInner', function(e) {
        e.preventDefault();
        toggleLoader();
        toggleMask();
        getProjectDetails(this.parentNode.dataset.projectid, toggleLoader);
        toggleBodyScroll();
    });

    $(document).on('click', '#modalMask', function(e) {
        if (e.target == e.currentTarget) {
            toggleBodyScroll();
            toggleMask(function() {
                $('#modalContent').empty();
            });
        }
    });

    $('.closeWrapper').on('click', function() {
        toggleBodyScroll();
        toggleMask(function() {
            $('#modalContent').empty();
        });
    });

    $(document).on('click', '.loadMoreComments', function(e) {
        e.preventDefault();

        console.log(this);

        getProjectComments(this.dataset.projectid);
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