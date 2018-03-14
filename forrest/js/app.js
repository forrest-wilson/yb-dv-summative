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
        activeXhrRequests = [];

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
        pagination.nextPageNumber++;
    }

    getProjects(pagination.nextPageNumber);

    function getProjectDetails(projectID, callback) {
        getData(projectsURL + projectID + '?api_key=' + apiKey, function(data) {
            populateModal(data);
            getProjectComments(projectID);
            if (callback) callback();
        });        
    }

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

        var compiledTemplate = compiledProjectDetailsTemplate(info);

        $('#modalContent').append(compiledTemplate);

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
                            image: comment.user.images[115],
                            link: comment.user.url
                        },
                        comment: comment.comment,
                        publishedOn: moment.unix(comment.created_on).format('Do MMM YYYY')
                    },
                    compiled = compiledCommentTemplate(commentInfo);

                commentElements.push(compiled);

                if (comments.length == commentElements.length) {
                    $('#comments').append(commentElements);
                }
            }
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

    function hideMoreCommentsButton() {
        $('#loadMoreComments').hide();
    }

    function resetCounters() {
        pagination.nextPageNumber = 1;
        commentPagination.nextPageNumber = 1;
    }

    function closeModal() {
        resetCounters();
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

    $(document).on('click', '#modalMask', function(e) {
        if (e.target == e.currentTarget) {
            closeModal();
        }
    });

    $('.closeWrapper').on('click', function() {
        closeModal();
    });

    $(document).on('click', '#loadMoreComments', function(e) {
        e.preventDefault();
        if (!$(this).hasClass('disabledButton')) {
            $('#loadMoreComments').addClass('disabledButton');
            getProjectComments(this.dataset.projectid);
        }
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