/*
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
    'use strict';
    var DevCarousel = function (element, options) {
        this.$element    = $(element);
        this.$element    = $(element);
        this.$indicators = this.$element.find('.carousel-indicators');
        this.options     = options;
        this.paused      = null;
        this.sliding     = null;
        this.interval    = null;
        this.$active     = null;
        this.$items      = null;
        // field added by me
        this.data        = null;
        this.grid        = 4;
        this.index       = this.grid - 1;
        this.currentDirection   = "next";

        this.options.keyboard && this.$element.on('keydown.devcarousel', $.proxy(this.keydown, this));

        this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
            .on('mouseenter.devcarousel', $.proxy(this.pause, this))
            .on('mouseleave.devcarousel', $.proxy(this.cycle, this));
    };

    DevCarousel.TRANSITION_DURATION = 600;

    DevCarousel.DEFAULTS = {
        interval: 5000,
        pause: 'hover',
        wrap: true,
        keyboard: true
    };

    DevCarousel.prototype.keydown = function (e) {
        if (/input|textarea/i.test(e.target.tagName)) return;
        switch (e.which) {
            case 37: this.prev(); break;
            case 39: this.next(); break;
            default: return;
        }
        e.preventDefault();
    };

    DevCarousel.prototype.cycle = function (e) {
        e || (this.paused = false);

        this.interval && clearInterval(this.interval);

        this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval));

        return this;
    };

    DevCarousel.prototype.getItemIndex = function (item) {
        this.$items = item.parent().children('.item');
        return this.$items.index(item || this.$active);
    };

    DevCarousel.prototype.getItemForDirection = function (direction, active) {
        var activeIndex = this.getItemIndex(active);
        var willWrap = (direction == 'prev' && activeIndex === 0)
            || (direction == 'next' && activeIndex == (this.$items.length - 1));
        if (willWrap && !this.options.wrap) return active;
        var delta = direction == 'prev' ? -1 : 1;
        var itemIndex = (activeIndex + delta) % this.$items.length;
        return this.$items.eq(itemIndex);
    };

    DevCarousel.prototype.to = function (pos) {
        var that        = this;
        var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'));

        if (pos > (this.$items.length - 1) || pos < 0) return;

        if (this.sliding)       return this.$element.one('slid.devcarousel', function () { that.to(pos); }); // yes, "slid"
        if (activeIndex == pos) return this.pause().cycle();

        return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos));
    };

    DevCarousel.prototype.pause = function (e) {
        e || (this.paused = true);

        if (this.$element.find('.next, .prev').length && $.support.transition) {
            this.$element.trigger($.support.transition.end);
            this.cycle(true);
        }

        this.interval = clearInterval(this.interval);

        return this;
    };

    DevCarousel.prototype.next = function () {
        if (this.sliding) return;
        return this.slide('next');
    };

    DevCarousel.prototype.prev = function () {
        if (this.sliding) return;
        return this.slide('prev');
    };

    // method override by me
    DevCarousel.prototype.slide = function (type, next) {
        var $active   = this.$element.find('.item.active');
        var $next     = next || this.getItemForDirection(type, $active);
        var isCycling = this.interval;
        var direction = type == 'next' ? 'left' : 'right';
        var that      = this;

        if ($next.hasClass('active')) return (this.sliding = false);



        var relatedTarget = $next[0];
        var slideEvent = $.Event('slide.devcarousel', {
            relatedTarget: relatedTarget,
            direction: direction
        });
        this.$element.trigger(slideEvent);
        if (slideEvent.isDefaultPrevented()) return;

        this.sliding = true;

        isCycling && this.pause();

        if (this.$indicators.length) {
            this.$indicators.find('.active').removeClass('active');
            var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)]);
            $nextIndicator && $nextIndicator.addClass('active');
        }

        var slidEvent = $.Event('slid.devcarousel', { relatedTarget: relatedTarget, direction: direction }); // yes, "slid"
        if ($.support.transition && this.$element.hasClass('slide')) {
            that.setNextItem(type, $next );
            $next.addClass(type);
            $next[0].offsetWidth ;// force reflow
            $active.addClass(direction);
            $next.addClass(direction);
            $active
                .one('bsTransitionEnd', function () {
                    $next.removeClass([type, direction].join(' ')).addClass('active');
                    $active.removeClass(['active', direction].join(' '));
                    that.sliding = false;
                    setTimeout(function () {
                        that.$element.trigger(slidEvent);
                    }, 0);
                })
                .emulateTransitionEnd(DevCarousel.TRANSITION_DURATION);
        } else {
            $active.removeClass('active');
            $next.addClass('active');
            this.sliding = false;
            this.$element.trigger(slidEvent);
        }
        isCycling && this.cycle();
        return this;
    };

    // method added by me
    DevCarousel.prototype.setData = function (data) {
        this.data = data;
        this.initCarouselItem();
    };

    DevCarousel.prototype.initCarouselItem= function () {
        var that = this;
        var data = that.data;
        var activeItem = that.$element.find(".item.active .item-container");
        for (var i = 0, index=0;  i <  that.grid; i++, index++ ){
            if(index > data.length-1){ index = 0;}
            $(activeItem[i]).find(".project-photo")[0].src = data[index].link_url;
            $(activeItem[i]).data("data",data[index]);
            if(data.length <= that.grid && data.length-1 == i) {
                that.sliding = true;
                break;
            }
        }
    };

    DevCarousel.prototype.setNextItem = function (type, $next) {
        var that = this;
        var data = that.data;
        var direction = type;
        var nextItem = $next.find(".item-container");
        var index;
        if(direction == "next"){
            index = (that.currentDirection == "next") ? this.getIndex(1, direction) : this.getIndex(5, direction);
        } else {
            index = (that.currentDirection == "next") ? this.getIndex(4, direction)  : this.getIndex(0, direction);
        }
        if(direction == "next"){
            for (var i = 0;  i <  that.grid; i++, index++ ){
                index = this.checkIndex(index);
                $(nextItem[i]).find(".project-photo")[0].src = data[index].link_url;
                $(nextItem[i]).data("data",data[index]);
            }
        }else {
            for (var j = that.grid-1;  j >=  0; j--, index-- ){
                index = this.checkIndex(index);
                $(nextItem[j]).find(".project-photo")[0].src = data[index].link_url;
                $(nextItem[j]).data("data",data[index]);
            }
        }
        that.currentDirection = direction;
        that.index = (direction == "next") ? index-1 : index;
    };

    DevCarousel.prototype.getIndex = function (num, direction) {
        var that = this;
        var index = that.index;
        for(var i=0; i< num; i++ ){
            if(direction === "next"){
                index = this.checkIndex(index);
                index++;
            }else{
                index = this.checkIndex(index);
                index--;
            }
        }
           return index;
    };

    DevCarousel.prototype.checkIndex = function (index) {
        var checkedIndex = index;
        if(checkedIndex > this.data.length-1){ checkedIndex = 0;}
        if(checkedIndex < 0){checkedIndex = this.data.length - 1;}
        return checkedIndex;
    };

    DevCarousel.prototype.view = function (option) {
        this.$element.toggle();
    };

    DevCarousel.prototype.getData = function () {
        return this.data;
    };

    // CAROUSEL PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var devcarousel    = $this.data('devcarousel');
            var options = $.extend({}, DevCarousel.DEFAULTS, $this.data(), typeof option == 'object' && option);
            var action  = typeof option == 'string' ? option : options.action;

            if (!devcarousel) {
                $this.data('devcarousel', (devcarousel = new DevCarousel(this, options)));
                requestProjects(devcarousel.setData.bind(devcarousel));
            }
            if (typeof option == 'number') devcarousel.to(option);
            else if (action) devcarousel[action](option);
            if(action === "view"){
                var selectProject = option.data;
                var projectData = devcarousel.data;
                var $viewer = devcarousel.$element.parents(".projects").find("#project-view");
                var projects    = $viewer.data('dev.projects');

                if (!projects) {
                    $viewer.data('dev.projects', (new ProjectViwer($viewer, projectData, selectProject)));
                }else {
                    projects.currentProject = selectProject;
                    projects.selectProject();
                }
                $viewer.toggle();
            }
            else if (options.interval) devcarousel.pause().cycle();
        });
    }
    
    function ProjectPlugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data('dev.projects');
            var options = $.extend({},  $this.data(), typeof option == 'object' && option);
            var action  = typeof option == 'string' ? option : options.action;
            if (action) data[action](option);
            if(action === "view"){
                var $devcarousel = data.$element.parents(".projects").find(".carousel");
                var devcarousel    = $devcarousel.data('devcarousel');
                devcarousel.$element.toggle();
            }
        });
    }

    // callback function added by me
    function requestProjects (func) {
        var callback = func;
        $.ajax({
            type: "GET",
            url: "js/data.json",
            success: function (result) {
                callback(result);
            },
            dataType: "json",
            contentType: "application/json"
        });
    }

    var old = $.fn.devcarousel;

    $.fn.devcarousel             = Plugin;
    $.fn.devcarousel.Constructor = DevCarousel;

    // CAROUSEL NO CONFLICT
    // ====================

    $.fn.devcarousel.noConflict = function () {
        $.fn.devcarousel = old;
        return this;
    };

    // CAROUSEL DATA-API
    // =================

    var clickHandler = function (e) {
        var href;
        var $this   = $(this);
        var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')); // strip for ie7
        var options = $.extend({}, $target.data(), $this.data());
        if ($target.hasClass('carousel')) {
            var slideIndex = $this.attr('data-slide-to');
            if (slideIndex) options.interval = false;
            Plugin.call($target, options);
            if (slideIndex) {
                $target.data('devcarousel').to(slideIndex);
            }
        }else if($target.hasClass('project-view')){
            ProjectPlugin.call($target,options);
        }else {
            return;
        }
        e.preventDefault();
    };

    $("#projects")
        .on('click', '[data-action]', clickHandler);

    $(window).on('load', function () {
        $('[data-ride="carousel"]').each(function () {
            var $carousel = $(this);
            Plugin.call($carousel, $carousel.data());
        });
    });


    var ProjectViwer = function (element, data, currentProject) {
        this.$element = element;
        this.currentProject= currentProject;
        this.data = data;
        this.createListProjects(this.data);
    };

    ProjectViwer.prototype.select = function (option) {
        var that = this;
        that.currentProject = option.data;
        this.selectProject();
    };

    ProjectViwer.prototype.view = function (option) {
        this.$element.toggle();
    };

    ProjectViwer.prototype.selectProject = function () {
        var $element = this.$element;
        var selectedProject = this.currentProject;
        var $items = $element.find("[data-model]");
        var text =  /^(?:p|a|h1|h2|h3|h4|h5|h6|span|div)$/i;
        $items.each(function () {
            var that = this;
            var model;
            var tag = that.tagName.toLowerCase();
            if( text.test(tag)){
                 model = $(that).attr("data-model");
                that.innerHTML = selectedProject[model];
            }else if(that.tagName == "img".toUpperCase()){
                 model = $(that).attr("data-model");
                that.src = selectedProject[model];
            }
        });
    };

    ProjectViwer.prototype.createListProjects = function () {
        var that = this;
        var data = this.data;
        var $element = this.$element;
        var $list = $element.find("#list-projects")[0];
        this.selectProject();

        for(var i = 0; i< data.length; i++){
            var li = $('<li><a  href="#project-view" role="button" data-action="select"></a></li>');
            $(li).find("a").text(data[i].project_name).data("data",data[i]);
            $($list).append(li);
        }
    };
}(jQuery);





// +function ($) {
//     var BsCarousel = $().carousel.Constructor;
//
//     var DevCarousel = function () {
//         this.data        = null
//         this.grid        = 4
//         this.index       = this.grid - 1
//         this.currentDirection   = "next";
//         BsCarousel.apply(this, arguments);
//     }
//
//     DevCarousel.TRANSITION_DURATION = 600
//
//     DevCarousel.DEFAULTS = {
//         interval: 5000,
//         pause: 'hover',
//         wrap: true,
//         keyboard: true
//     }
//
//     DevCarousel.prototype = Object.create(BsCarousel.prototype);
//     DevCarousel.prototype.constructor = DevCarousel;
//
//     DevCarousel.prototype.next = function () {
//         this.setNextItem("next");
//         BsCarousel.prototype.next.apply(this);
//     }
//
//     DevCarousel.prototype.prev = function () {
//         this.setNextItem("prev");
//         BsCarousel.prototype.prev.apply(this);
//     }
//
//     // method added by me
//     DevCarousel.prototype.initCarouselItem= function () {
//         var that = this;
//         var data = that.data;
//         var activeItem = that.$element.find(".item.active img");
//         for (var i = 0, index=0;  i <  that.grid; i++, index++ ){
//             if(index > data.length-1){ index = 0;}
//             activeItem[i].src = data[index].link_url;
//             if(data.length <= that.grid && data.length-1 == i) {
//                 that.sliding = true;
//                 break;
//             }
//         }
//     }
//     DevCarousel.prototype.setData = function (data) {
//         this.data = data;
//         this.initCarouselItem();
//     }
//     DevCarousel.prototype.setNextItem = function (type) {
//         console.log(this);
//         var $active   = this.$element.find('.item.active')
//         var $next     =  this.getItemForDirection(type, $active)
//         var that = this;
//         var data = that.data;
//         var direction = type;
//         var nextItem = $next.find("img");
//         var index;
//
//         if(direction == "next"){
//             index = (that.currentDirection == "next") ? that.index + 1 : that.index + 5;
//         } else {
//             index = (that.currentDirection == "next") ? that.index - 4  : that.index;
//         }
//         if(direction == "next"){
//             for (var i = 0;  i <  that.grid; i++, index++ ){
//                 if(index > data.length-1){ index = 0;}
//                 if(index < 0){index = data.length - 1}
//                 nextItem[i].src = data[index].link_url;
//             }
//         }else {
//             for (var i = that.grid-1;  i >=  0; i--, index-- ){
//                 if(index > data.length-1){ index = 0;}
//                 if(index < 0){index = data.length - 1}
//                 nextItem[i].src = data[index].link_url;
//             }
//         }
//         that.currentDirection = direction;
//         that.index = (direction == "next") ? index-1 : index;
//     }
//
//
//     // callback function added by me
//     function requestProjects (func) {
//         var callback = func;
//         $.ajax({
//             type: "GET",
//             url: "js/data.json",
//             success: function (result) {
//                 callback(result);
//             },
//             dataType: "json",
//             contentType: "application/json"
//         });
//     }
//
//     // CAROUSEL PLUGIN DEFINITION
//     // ==========================
//
//     function Plugin(option) {
//         return this.each(function () {
//             var $this   = $(this)
//             var data    = $this.data('bs.carousel')
//             var options = $.extend({}, DevCarousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
//             var action  = typeof option == 'string' ? option : options.project
//
//             if (!data) {
//                 $this.data('bs.carousel', (data = new DevCarousel(this, options)))
//                 requestProjects(data.setData.bind(data));
//             }
//             if (typeof option == 'number') data.to(option)
//             else if (action) data[action]()
//             else if (options.interval) data.pause().cycle()
//         })
//     }
//
//     $.fn.devcarousel             = Plugin
//     $.fn.devcarousel.Constructor = DevCarousel
//
//     var clickHandler = function (e) {
//         var href
//         var $this   = $(this)
//         var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
//         if (!$target.hasClass('carousel')) return
//         var options = $.extend({}, $target.data(), $this.data())
//         var slideIndex = $this.attr('data-project-to')
//         if (slideIndex) options.interval = false
//
//         Plugin.call($target, options)
//
//         if (slideIndex) {
//             $target.data('bs.carousel').to(slideIndex)
//         }
//
//         e.preventDefault()
//     }
//
//     $(document)
//         .on('click.bs.carousel.data-api', '[data-project]', clickHandler)
//         .on('click.bs.carousel.data-api', '[data-project-to]', clickHandler)
//
//     $(window).on('load', function () {
//         $('[data-ride="project-carousel"]').each(function () {
//             var $carousel = $(this)
//             Plugin.call($carousel, $carousel.data())
//         })
//     })
// }

