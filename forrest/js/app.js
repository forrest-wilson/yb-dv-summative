$(document).ready(function() {

    //*******************************//
    //**** Variable Declarations ****//
    //*******************************//

    // var apiKey = 'bkY4tooDFiYTkMp6XERO1F9ZEyRdTbNJ',
    // var apiKey = 'z8OjkjKiNmjfHT2A68DFrSojrYTtlCRE',
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
        slick,
        moreProjectsToLoad = {};

    //*******************************//
    //**** Plugin Initialisation ****//
    //*******************************//

    var mixer = mixitup('.projects', {
        selectors: {
            target: '.project',
            control: '[data-mixitup-control]'
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
    function getData(url, successFunction, designer) {
        $.ajax({
            method: 'GET',
            dataType: 'jsonp',
            url: url,
            success: function(data) {
                successFunction(data, designer);
            },
            error: function(err) {
                if (err.statusText === 'error' || err.statusText === 404) {
                    $('#errorModal').show();
                    $('body').addClass('modalShowing');
                    throw new Error('No More API Requests');
                }
            }
        });
    }

    // Generic function to render Template7 Scripts
    function renderTemplate(el, context) {
        var template = $(el).html(),
            compiledTemplate = Handlebars.compile(template);

        return compiledTemplate(context);
    }

    // Helper method for formatting time
    function unixTimeFormatter(time) {
        return moment.unix(time).format('Do MMM YYYY');
    }

    //*******************//
    //**** Functions ****//
    //*******************//

    //**** Data Getter methods ****//

    // Gets the projects using a specified page number
    function getProjects(pageNum) {
        // Commented to reduce AJAX requests during development
        for (var i = 0; i < designers.length; i++) {
            getData(usersURL + designers[i] + '/projects?client_id=' + apiKey + '&per_page=' + pagination.projectsPerPage + '&page=' + pageNum, populateProjects, designers[i]);
        }

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
            populateComments(data);
            commentPagination.nextPageNumber++;
        });
    }

    //**** Data Parser methods ****//

    // Compiles a project template and appends it to the DOM
    function populateProjects(data, forDesigner) {
        var projects = data.projects,
            counter = $('.project').length,
            buttonDisabled = false;

        // Performs a check on whether or not there will be more projects to load
        if (projects.length < pagination.projectsPerPage) {
            
            // If there are less than pagination.projectsPerPage projects to load, add a key-value pair to the object
            if (!moreProjectsToLoad[forDesigner]) {
                moreProjectsToLoad[forDesigner] = false;

                // For loop must be in reverse order in order to not skip indexes when splicing items
                for (var i = designers.length - 1; i >= 0; i--) {
                    if (designers[i] === forDesigner) {
                        designers.splice(i, 1);
                        break; // No point continuing the loop if the designer reference doesn't exist anymore
                    }
                }
            }

            // If the array has more than or the same amount of items that the designers array has, hide the loadMoreProjects button 
            if (Object.keys(moreProjectsToLoad).length >= 3) {
                $('#loadMoreProjects').text('No more projects to load').css('cursor', 'not-allowed');
                buttonDisabled = true;
            }
        }

        // Only run this block of code if there are more than 0 projects in the data object
        if (projects.length > 0) {
            for (var j = 0; j < projects.length; j++) {
                // Counter for data-order in template
                counter = counter + 1;

                // Context to pass to the Template7 template
                var project = projects[j],
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

                for (var jj = 0; jj < project.owners.length; jj++) {
                    var owner = project.owners[jj];
                    projectInfo.creatorID.push(owner.id);
                }
    
                // These variables must be declared after 
                var template = renderTemplate('#projectTemplate', projectInfo);

                mixer.append(template, false);
            }
        }

        if (!buttonDisabled) {
            // Enables the loadMoreProjects button to be clicked again
            $('#loadMoreProjects').removeClass('disabledButton');
        }
    }

    // Populates the modal with info being passed to a template
    function populateModal(data) {
        var project = data.project,
            info = {
                articles: [],
                creators: [],
                fieldsString: '',
                description: null,
                creationDate: unixTimeFormatter(project.published_on),
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
        if (project.description !== '') {
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
        slick = $('#images').slick({
            lazyLoad: 'progressive',
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

        slick.on('lazyLoaded', function() {
            slick.slick('setPosition');
        });
    }

    // Populates the comments of a specific project
    function populateComments(data) {
        var comments = data.comments,
            commentElements = [],
            buttonDisabled = false;

        // Check for whether there is at least more than 0 comments in the array
        if (comments.length > 0) {
            // Loop through each comment, compile, and append each comment to the commentElements array
            for (var i = 0; i < comments.length; i++) {
                var comment = comments[i],
                    commentInfo = {
                        commenter: {
                            name: comment.user.display_name,
                            image: comment.user.images[115],
                            link: comment.user.url
                        },
                        comment: comment.comment,
                        publishedOn: unixTimeFormatter(comment.created_on)
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
            $('#loadMoreComments').text('No more comments to load').css('cursor', 'not-allowed');
            buttonDisabled = true;
        }

        if (!buttonDisabled) {
            $('#loadMoreComments').removeClass('disabledButton');
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
            slick.slick('unslick');
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

    // Event listener for closing the modal using the close button
    $('.closeIcon').on('click', closeModal);

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

    //**** Filtering Event Listeners ****//

    // Event listener for mobile filter 'drawer'
    $('#drawerOpener').on('click', function() {
        $('#sortingControls').slideToggle(300);
        $('#drawerOpener p i').toggleClass('rotationalInvert');
    });

    // Triggers a MixItUp API event to sort projects
    $('.sortButton').on('click', function() {
        var order = $('.orderButton.active')[0].dataset.sortonly;

        $('#sortingTopic').text(this.innerText);

        $('.sortButton').removeClass('active');
        $(this).addClass('active');

        mixer.sort(this.dataset.sortonly + ':' + order);
    });

    // Triggers a MixItUp API event to order projects
    $('.orderButton').on('click', function() {
        var sort = $('.sortButton.active')[0].dataset.sortonly;

        $('.orderButton').removeClass('active');
        $(this).addClass('active');

        mixer.sort(sort + ':' + this.dataset.sortonly);
    });

    // Triggers a MixItUp API event to filter projects
    $('.filterButton').on('click', function() {
        $('#filteringTopic').text(this.innerText);
        $('.filterButton').removeClass('active');
        $(this).addClass('active');
    });

    //*****************************************//
    //**** Function/Element Initialization ****//
    //*****************************************//

    getProjects(pagination.nextPageNumber);

    $('[data-toggle=\'tooltip\']').tooltip({
        trigger: 'hover'
    });
});