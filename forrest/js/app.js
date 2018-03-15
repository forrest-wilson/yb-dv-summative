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
        },
        activeXhrRequests = [],
        moreProjectsToLoad = [];

    //*******************************//
    //**** Plugin Initialisation ****//
    //*******************************//

    var masonryProjects = $('.projects').masonry({
        itemSelector: '.project',
        columnWidth: '.sizer',
        percentPosition: true
    });

    var mixer = mixitup('.projects', {
        selectors: {
            target: '.project'
        }
    });

    //************************//
    //**** Helper Methods ****//
    //************************//

    // Generic AJAX function. Increases reuseablility
    function getData(url, successFunction) {
        var xhr = $.ajax({
            method: 'GET',
            dataType: 'jsonp',
            url: url,
            success: function(data) {
                // Deleting the request that has just finished
                for (var i = 0; i < activeXhrRequests.length; i++) {
                    if (activeXhrRequests[i] == xhr) {
                        activeXhrRequests.splice(i, 1);
                    }
                }

                successFunction(data);
            },
            error: function(err) {
                throw new Error('Unhandled AJAX Error: ', err);
            }
        });

        activeXhrRequests.push(xhr);
    }

    // Generic function to render Template7 Scripts
    function renderTemplate(el, context) {
        var template = $(el).html(),
            compiledTemplate = Template7.compile(template),
            _context = context,
            templateToRender = compiledTemplate(_context);

        return templateToRender;
    }

    // Refreshes the grid project layout
    function refreshLayout() {
        masonryProjects.masonry();
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
                hideMoreCommentsButton();
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
                console.log('no more projects to load');
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
                    coverImage: project.covers.original,
                    projectName: project.name,
                    stats: {
                        likes: project.stats.appreciations,
                        views: project.stats.views,
                        comments: project.stats.comments,
                    },
                    projectID: project.id,
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
                var template = renderTemplate('#projectTemplate', projectInfo),
                    $template = $(template);
                
                // Appends the project to DOM and let the masonry plugin do its thing
                masonryProjects.append($template).masonry('appended', $template);
            }

            // Masonry workaround for arranging items with dynamic images
            masonryProjects.imagesLoaded().progress(function() {
                masonryProjects.masonry('layout');
            });

            mixer.forceRefresh();
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
                projectID: project.id,
                behanceURL: project.url
            };

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
                    console.log('No support has been added for this data type: ' + mod.type);
                    break;
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

    // Hides the more comments button
    function hideMoreCommentsButton() {
        $('#loadMoreComments').hide();
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

    //**** Testing MixItUp ****//

    $('#testOrdering').on('click', function(e) {
        e.preventDefault();
        mixer.filter($('.544146')).then(refreshLayout);
    });

    $('#showAll').on('click', function(e) {
        e.preventDefault();

        mixer.show().then(refreshLayout);
    });

    //***********************************************//
    //**** Functions to run on initial page load ****//
    //***********************************************//

    getProjects(pagination.nextPageNumber);

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