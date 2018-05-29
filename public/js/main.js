var ContactForm = (function($) {

    var form = $("#contactForm");
    var submit = $("#submit");
    var error = false;

    function validate(msg) {
        form.find('.error').remove();
        try {
            if(msg.responseJSON.debugReason) {
                form.prepend('<p class="error" style="color: red;">'+ msg.responseJSON.debugReason +'</p>')
            }
        } catch(error) {
            submit.addClass("icon fa-check-circle");
            form.find("input, select, textarea").val("").css({
                'border-color': 'none'
            });
            return;
        }


        form.find("input").each(function(i, e) {
            if (!$(e).val()) {
                $(e).css({
                    'border-color': 'red'
                });
            }
        });
        form.find("select").each(function(i, e) {
            if (!$(e).val()) {
                $(e).css({
                    'border-color': 'red'
                });
            }
        });
        form.find("textarea").each(function(i, e) {
            if (!$(e).val()) {
                $(e).css({
                    'border-color': 'red'
                });
            }
        });
    }

    function process() {
        if (!error) {
            $.ajax({
                    url: "/",
                    method: "POST",
                    data: form.serializeArray()
                })
                .done(function(msg) {
                    validate(msg);
                })
                .fail(function(msg) {
                    validate(msg);
                })
                .always(function() {
                    // do something always
                });
        }
    }

    return {
        process: process
    };

})(jQuery);

var Drums = (function($) {

    var url = "/drums/instagram";

    function getFeed() {
        $.ajax({
            url: url,
            method: "GET"
        }).done(function(data) {
            if (data.data) {
                doGallery(data.data);
            }
        }).fail(function() {
            // fail here
        });
    }

    function doGallery(data) {
        var keys = Object.keys(data);
        $.each(keys.reverse(), function(i, e) {
            var article = '<article>';
            article += '<div onclick="window.open($(this).data(\'href\'));" data-href="' + data[e].link + '" class="image"><img style="" src="' + data[e].thumbnail + '" alt="" /></div>';
            article += '<div class="caption">';
            article += '<p>' + data[e].caption.substring(0, 64); + '...</p>';
            article += '<ul class="actions">';
            article += '<li><span class="button small">Details</span></li>';
            article += '</ul>';
            article += '</div>';
            article += '</article>';

            var gallery = $(".gallery >.inner");
            gallery.append(article);
        });

    }

    return {
        getFeed: getFeed
    };

})(jQuery);

// Doc ready general functions
(function($) {

    $("#submit").on("click", function(e) {
        e.preventDefault();
        ContactForm.process();
    });

})(jQuery);


// Skel and layout code
(function($) {

    skel.breakpoints({
        xlarge: '(max-width: 1680px)',
        large: '(max-width: 1280px)',
        medium: '(max-width: 980px)',
        small: '(max-width: 736px)',
        xsmall: '(max-width: 480px)',
        xxsmall: '(max-width: 360px)'
    });

    $(function() {

        var $window = $(window),
            $body = $('body'),
            $wrapper = $('#wrapper');

        // Disable animations/transitions until the page has loaded.
        $body.addClass('is-loading');

        $window.on('load', function() {
            window.setTimeout(function() {
                $body.removeClass('is-loading');
            }, 100);
        });

        // Fix: Placeholder polyfill.
        $('form').placeholder();

        // Prioritize "important" elements on medium.
        skel.on('+medium -medium', function() {
            $.prioritize(
                '.important\\28 medium\\29',
                skel.breakpoint('medium').active
            );
        });

        // Browser fixes.

        // IE: Flexbox min-height bug.
        if (skel.vars.browser == 'ie')
            (function() {

                var flexboxFixTimeoutId;

                $window.on('resize.flexbox-fix', function() {

                    var $x = $('.fullscreen');

                    clearTimeout(flexboxFixTimeoutId);

                    flexboxFixTimeoutId = setTimeout(function() {

                        if ($x.prop('scrollHeight') > $window.height())
                            $x.css('height', 'auto');
                        else
                            $x.css('height', '100vh');

                    }, 250);

                }).triggerHandler('resize.flexbox-fix');

            })();

        // Object fit workaround.
        if (!skel.canUse('object-fit'))
            (function() {

                $('.banner .image, .spotlight .image').each(function() {

                    var $this = $(this),
                        $img = $this.children('img'),
                        positionClass = $this.parent().attr('class').match(/image-position-([a-z]+)/);

                    // Set image.
                    $this
                        .css('background-image', 'url("' + $img.attr('src') + '")')
                        .css('background-repeat', 'no-repeat')
                        .css('background-size', 'cover');

                    // Set position.
                    switch (positionClass.length > 1 ? positionClass[1] : '') {

                        case 'left':
                            $this.css('background-position', 'left');
                            break;

                        case 'right':
                            $this.css('background-position', 'right');
                            break;

                        default:
                        case 'center':
                            $this.css('background-position', 'center');
                            break;

                    }

                    // Hide original.
                    $img.css('opacity', '0');

                });

            })();

        // Smooth scroll.
        $('.smooth-scroll').scrolly();
        $('.smooth-scroll-middle').scrolly({
            anchor: 'middle'
        });

        // Wrapper.
        $wrapper.children()
            .scrollex({
                top: '30vh',
                bottom: '30vh',
                initialize: function() {
                    $(this).addClass('is-inactive');
                },
                terminate: function() {
                    $(this).removeClass('is-inactive');
                },
                enter: function() {
                    $(this).removeClass('is-inactive');
                },
                leave: function() {

                    var $this = $(this);

                    if ($this.hasClass('onscroll-bidirectional'))
                        $this.addClass('is-inactive');

                }
            });

        // Items.
        $('.items')
            .scrollex({
                top: '30vh',
                bottom: '30vh',
                delay: 50,
                initialize: function() {
                    $(this).addClass('is-inactive');
                },
                terminate: function() {
                    $(this).removeClass('is-inactive');
                },
                enter: function() {
                    $(this).removeClass('is-inactive');
                },
                leave: function() {

                    var $this = $(this);

                    if ($this.hasClass('onscroll-bidirectional'))
                        $this.addClass('is-inactive');

                }
            })
            .children()
            .wrapInner('<div class="inner"></div>');

        // Gallery.
        $('.gallery')
            .wrapInner('<div class="inner"></div>')
            .prepend(skel.vars.mobile ? '' : '<div class="forward"></div><div class="backward"></div>')
            .scrollex({
                top: '30vh',
                bottom: '30vh',
                delay: 50,
                initialize: function() {
                    $(this).addClass('is-inactive');
                },
                terminate: function() {
                    $(this).removeClass('is-inactive');
                },
                enter: function() {
                    $(this).removeClass('is-inactive');
                },
                leave: function() {

                    var $this = $(this);

                    if ($this.hasClass('onscroll-bidirectional'))
                        $this.addClass('is-inactive');

                }
            })
            .children('.inner')
            //.css('overflow', 'hidden')
            .css('overflow-y', skel.vars.mobile ? 'visible' : 'hidden')
            .css('overflow-x', skel.vars.mobile ? 'scroll' : 'hidden')
            .scrollLeft(0);

        // Style #1.
        // ...

        // Style #2.
        $('.gallery')
            .on('wheel', '.inner', function(event) {

                var $this = $(this),
                    delta = (event.originalEvent.deltaX * 10);

                // Cap delta.
                if (delta > 0)
                    delta = Math.min(25, delta);
                else if (delta < 0)
                    delta = Math.max(-25, delta);

                // Scroll.
                $this.scrollLeft($this.scrollLeft() + delta);

            })
            .on('mouseenter', '.forward, .backward', function(event) {

                var $this = $(this),
                    $inner = $this.siblings('.inner'),
                    direction = ($this.hasClass('forward') ? 1 : -1);

                // Clear move interval.
                clearInterval(this._gallery_moveIntervalId);

                // Start interval.
                this._gallery_moveIntervalId = setInterval(function() {
                    $inner.scrollLeft($inner.scrollLeft() + (5 * direction));
                }, 10);

            })
            .on('mouseleave', '.forward, .backward', function(event) {

                // Clear move interval.
                clearInterval(this._gallery_moveIntervalId);

            });

        // Lightbox.
        $('.gallery.lightbox')
            .on('click', 'a', function(event) {

                var $a = $(this),
                    $gallery = $a.parents('.gallery'),
                    $modal = $gallery.children('.modal'),
                    $modalImg = $modal.find('img'),
                    href = $a.attr('href');

                // Not an image? Bail.
                if (!href.match(/\.(jpg|gif|png|mp4)$/))
                    return;

                // Prevent default.
                event.preventDefault();
                event.stopPropagation();

                // Locked? Bail.
                if ($modal[0]._locked)
                    return;

                // Lock.
                $modal[0]._locked = true;

                // Set src.
                $modalImg.attr('src', href);

                // Set visible.
                $modal.addClass('visible');

                // Focus.
                $modal.focus();

                // Delay.
                setTimeout(function() {

                    // Unlock.
                    $modal[0]._locked = false;

                }, 600);

            })
            .on('click', '.modal', function(event) {

                var $modal = $(this),
                    $modalImg = $modal.find('img');

                // Locked? Bail.
                if ($modal[0]._locked)
                    return;

                // Already hidden? Bail.
                if (!$modal.hasClass('visible'))
                    return;

                // Lock.
                $modal[0]._locked = true;

                // Clear visible, loaded.
                $modal
                    .removeClass('loaded')

                // Delay.
                setTimeout(function() {

                    $modal
                        .removeClass('visible')

                    setTimeout(function() {

                        // Clear src.
                        $modalImg.attr('src', '');

                        // Unlock.
                        $modal[0]._locked = false;

                        // Focus.
                        $body.focus();

                    }, 475);

                }, 125);

            })
            .on('keypress', '.modal', function(event) {

                var $modal = $(this);

                // Escape? Hide modal.
                if (event.keyCode == 27)
                    $modal.trigger('click');

            })
            .prepend('<div class="modal" tabIndex="-1"><div class="inner"><img src="" /></div></div>')
            .find('img')
            .on('load', function(event) {

                var $modalImg = $(this),
                    $modal = $modalImg.parents('.modal');

                setTimeout(function() {

                    // No longer visible? Bail.
                    if (!$modal.hasClass('visible'))
                        return;

                    // Set loaded.
                    $modal.addClass('loaded');

                }, 275);

            });

    });

})(jQuery);
