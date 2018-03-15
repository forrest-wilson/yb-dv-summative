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
            commentsPerPage: 10,
            nextPageNumber: 1
        },
        moreProjectsToLoad = [];

    //*******************************//
    //**** Plugin Initialisation ****//
    //*******************************//

    var mixer = mixitup('.projects', {
        selectors: {
            target: '.project'
        },
        animation: {
            enable: true,
            duration: 300,
            easing: 'ease-in-out'
        },
        behavior: {
            liveSort: true
        }
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

    // Generic function to render Template7 Scripts
    function renderTemplate(el, context) {
        var template = $(el).html(),
            compiledTemplate = Template7.compile(template),
            _context = context,
            templateToRender = compiledTemplate(_context);

        return templateToRender;
    }

    //*******************//
    //**** Functions ****//
    //*******************//

    //**** Data Getter methods ****//

    // Gets the projects using a specified page number
    function getProjects(pageNum) {
        // Commented to reduce AJAX requests during development
        for (var i = 0; i < designers.length; i++) {
            getData(usersURL + designers[i] + '/projects?client_id=' + apiKey + '&per_page=' + pagination.projectsPerPage + '&page=' + pageNum, populateProjects);
        }

        // getData(usersURL + designers[0] + '/projects?client_id=' + apiKey + '&per_page=' + pagination.projectsPerPage + '&page=' + pageNum, populateProjects);

        // Increases the page number to send with the next getProjects AJAX request
        pagination.nextPageNumber++;
    }

    // Gets the details on a specific behance project and passes the API data to a population method
    function getProjectDetails(projectID, callback) {
        getData(projectsURL + projectID + '?api_key=' + apiKey, function(data) {
            populateModal(data);
            getProjectComments(projectID);
            if (callback) callback();
        });        
    }

    // Gets the comments associated with a specific project
    function getProjectComments(projectID) {
        getData(projectsURL + projectID + '/comments?client_id=' + apiKey + '&per_page=' + commentPagination.commentsPerPage + '&page=' + commentPagination.nextPageNumber, function(data) {
            if (data.comments.length > 0) {
                populateComments(data);
                commentPagination.nextPageNumber++;
                $('#loadMoreComments').removeClass('disabledButton');
            } else {
                $('#loadMoreComments').hide();
            }
        });
    }

    //**** Data Parser methods ****//

    // Compiles a project template and appends it to the DOM
    function populateProjects(data) {
        console.log(data);

        var projects = data.projects,
            counter = $('.project').length;

        // Performs a check on whether or not there will be more projects to load
        if (projects.length < pagination.projectsPerPage) {
            // If there are less than pagination.projectsPerPage projects to load, push false to an array
            moreProjectsToLoad.push(false);

            // If the array has more than or the same amount of items that the designers array has, hide the loadMoreProjects button 
            if (moreProjectsToLoad.length >= designers.length) {
                $('#loadMoreProjects').hide();
            }
        }

        // Only run this block of code if there are more than 0 projects in the data object
        if (projects.length > 0) {
            for (var i = 0; i < projects.length; i++) {
                // Counter for data-order in template
                counter = counter + 1;

                // Context to pass to the Template7 template
                var project = projects[i],
                    projectInfo = {
                    coverImage: project.covers[404],
                    projectName: project.name,
                    stats: {
                        likes: project.stats.appreciations,
                        views: project.stats.views,
                        comments: project.stats.comments,
                    },
                    projectID: project.id,
                    publishedOn: project.published_on,
                    creator: null,
                    creatorID: [],
                    counter: counter
                };
                
                // Checks the data to see whether there were multiple owners of the project
                // If so, set the text to 'Multiple Owners'
                if (project.owners.length > 1) {
                    projectInfo.creator = 'Multiple Owners';
                } else {
                    projectInfo.creator = project.owners[0].display_name;
                }

                for (var ii = 0; ii < project.owners.length; ii++) {
                    var owner = project.owners[ii];
                    projectInfo.creatorID.push(owner.id);
                }
    
                // These variables must be declared after 
                var template = renderTemplate('#projectTemplate', projectInfo);

                mixer.append(template, false);
            }
        }

        // Enables the loadMoreProjects button to be clicked again
        $('#loadMoreProjects').removeClass('disabledButton');
    }

    // Populates the modal with info being passed to a template
    function populateModal(data) {
        console.log(data);

        var project = data.project,
            info = {
                articles: [],
                creators: [],
                fieldsString: '',
                description: null,
                creationDate: moment.unix(project.published_on).format('Do MMM YYYY'),
                projectName: project.name,
                stats: {
                    likes: project.stats.appreciations,
                    views: project.stats.views,
                    comments: project.stats.comments
                },
                projectID: project.id,
                behanceURL: project.url
            };

        // If a description exists, replace the null value with the description
        if (project.description != '') {
            info.description = project.description;
        }

        // Loops through each 'module' and appends useable content to info.articles
        for (var i = 0; i < project.modules.length; i++) {
            var mod = project.modules[i];
            
            // Only allow certain 'types' to be appendable to the DOM
            switch(mod.type) {
                case('image'):
                    info.articles.push(mod.sizes.max_1200);
                    break;
                case('media_collection'):
                    var component = mod.components;

                    for (var ii = 0; ii < component.length; ii++) {
                        info.articles.push(component[ii].sizes.max_1200);
                    }

                    break;
                default:
                    break;
            }
        }

        // Loops through each owner of the project and adds their name and url to the context passed to the template renderer
        for (var j = 0; j < project.owners.length; j++) {
            var owner = project.owners[j],
                ownerDetails = {};

            ownerDetails.url = owner.url;
            ownerDetails.name = owner.display_name;

            if (j != project.owners.length - 1) {
                ownerDetails.name += ',';
            }

            info.creators.push(ownerDetails);
        }

        info.fieldsString = project.fields.join(', ');

        // Compiles the template using the info being passed
        var compiledTemplate = renderTemplate('#projectDetailsTemplate', info);

        $('#modalContent').append(compiledTemplate);

        // Initializes the slick slideshow
        $('#images').slick({
            initialSlide: 1,
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            adaptiveHeight: false,
            arrows: true,
            prevArrow: '<i class=\'slick-prev fa fa-angle-left\'>Previous</i>',
            nextArrow: '<i class=\'slick-next fa fa-angle-right\'>Right</i>',
            responsive: [
                {
                    breakpoint: 1000,
                    settings: {
                        adaptiveHeight: true,
                        arrows: false
                    }
                }
            ]
        });

        // Forces slick to re-calculate parent image elements
        $(window).trigger('resize');
    }

    // Populates the comments of a specific project
    function populateComments(data) {
        console.log(data);

        var comments = data.comments,
            commentElements = [];

        // Only run this block if there are more than 0 comments in the data
        if (comments.length > 0) {
            for (var i = 0; i < comments.length; i++) {
                var comment = comments[i],
                    commentInfo = {
                        commenter: {
                            name: comment.user.display_name,
                            image: comment.user.images[115],
                            link: comment.user.url
                        },
                        comment: comment.comment,
                        publishedOn: moment.unix(comment.created_on).format('Do MMM YYYY')
                    },
                    compiled = renderTemplate('#commentTemplate', commentInfo);

                // Pushes each rendered comment to an array
                commentElements.push(compiled);
            }

            // Append each item in the array to the DOM
            $('#comments').append(commentElements);
        }

        // Removes the loadMoreComments button if there are less than a predetermined amount to load
        if (comments.length < commentPagination.commentsPerPage) {
            $('#loadMoreComments').hide();
        }
    }

    //******************************//
    //**** Event Helper Methods ****//
    //******************************//

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

    // When the modal needs to be closed, call this method
    function closeModal() {
        commentPagination.nextPageNumber = 1;
        toggleBodyScroll();
        toggleMask(function() {
            $('#modalContent').empty();
        });
    }

    //*************************//
    //**** Event Listeners ****//
    //*************************//

    // Event listener for projects being clicked
    $(document).on('click', '.projectInner', function(e) {
        e.preventDefault();
        toggleLoader();
        toggleMask();
        getProjectDetails(this.dataset.projectid, toggleLoader);
        toggleBodyScroll();
    });

    // Event listener for closing the modal by clicking on the modal mask
    $(document).on('click', '#modalMask', function(e) {
        if (e.target == e.currentTarget) {
            closeModal();
        }
    });

    // Event listener for closing the modal using the close button
    $('.closeWrapper').on('click', function() {
        closeModal();
    });

    // Event listener for loadMoreComments button
    $(document).on('click', '#loadMoreComments', function(e) {
        e.preventDefault();

        // Checks to see whether the button is disabled
        if (!$(this).hasClass('disabledButton')) {
            $('#loadMoreComments').addClass('disabledButton');
            getProjectComments(this.dataset.projectid);
        }
    });

    // Event listener for loadMoreProjects button
    $('#loadMoreProjects').on('click', function(e) {
        e.preventDefault();

        // Checks to see whether the button is disabled
        if (!$(this).hasClass('disabledButton')) {
            $('#loadMoreProjects').addClass('disabledButton');
            getProjects(pagination.nextPageNumber);
        }
    });

    //***********************************************//
    //**** Functions to run on initial page load ****//
    //***********************************************//

    getProjects(pagination.nextPageNumber);
});