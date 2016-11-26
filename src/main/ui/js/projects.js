+function ($) {
    "use strict";
    var DevCarousel = function (element, options) {
        this.$element    = $(element);
        this.$element    = $(element);
        this.$indicators = this.$element.find(".carousel-indicators");
        this.options     = options;
        this.paused      = null;
        this.sliding     = null;
        this.interval    = null;
        this.$active     = null;
        this.$items      = null;
        // field added by me
        this.data        = null;
        this.grid        = 4;
        this.index       = -1;
        this.currentDirection   = "next";

        this.requestProjects(this.setData.bind(this));
        this.options.keyboard && this.$element.on("keydown.devcarousel", $.proxy(this.keydown, this));

        this.options.pause == "hover" && !("ontouchstart" in document.documentElement) && this.$element
            .on("mouseenter.devcarousel", $.proxy(this.pause, this))
            .on("mouseleave.devcarousel", $.proxy(this.cycle, this));
    };

    DevCarousel.TRANSITION_DURATION = 600;

    DevCarousel.DEFAULTS = {
        interval: 5000,
        pause: "hover",
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
        this.$items = item.parent().children(".item");
        return this.$items.index(item || this.$active);
    };

    DevCarousel.prototype.getItemForDirection = function (direction, active) {
        var activeIndex = this.getItemIndex(active);
        var willWrap = (direction == "prev" && activeIndex === 0)
            || (direction == "next" && activeIndex == (this.$items.length - 1));
        if (willWrap && !this.options.wrap) return active;
        var delta = direction == "prev" ? -1 : 1;
        var itemIndex = (activeIndex + delta) % this.$items.length;
        return this.$items.eq(itemIndex);
    };

    DevCarousel.prototype.to = function (pos) {
        var that        = this;
        var activeIndex = this.getItemIndex(this.$active = this.$element.find(".item.active"));

        if (pos > (this.$items.length - 1) || pos < 0) return;

        if (this.sliding)       return this.$element.one("slid.devcarousel", function () { that.to(pos); }); // yes, "slid"
        if (activeIndex == pos) return this.pause().cycle();

        return this.slide(pos > activeIndex ? "next" : "prev", this.$items.eq(pos));
    };

    DevCarousel.prototype.pause = function (e) {
        e || (this.paused = true);

        if (this.$element.find(".next, .prev").length && $.support.transition) {
            this.$element.trigger($.support.transition.end);
            this.cycle(true);
        }

        this.interval = clearInterval(this.interval);

        return this;
    };

    DevCarousel.prototype.next = function () {
        if (this.sliding) return;
        return this.slide("next");
    };

    DevCarousel.prototype.prev = function () {
        if (this.sliding) return;
        return this.slide("prev");
    };

    // method override by me
    DevCarousel.prototype.slide = function (type, next) {
        var $active   = this.$element.find(".item.active");
        var $inner   = this.$element.find(".carousel-inner");
        var $next     = next || this.getItemForDirection(type, $active);
        var isCycling = this.interval;
        var direction = type == "next" ? "left" : "right";
        var that      = this;

        if ($next.hasClass("active")) return (this.sliding = false);



        var relatedTarget = $next[0];
        var slideEvent = $.Event("slide.devcarousel", {
            relatedTarget: relatedTarget,
            direction: direction
        });
        this.$element.trigger(slideEvent);
        if (slideEvent.isDefaultPrevented()) return;

        this.sliding = true;

        isCycling && this.pause();

        if (this.$indicators.length) {
            this.$indicators.find(".active").removeClass("active");
            var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)]);
            $nextIndicator && $nextIndicator.addClass("active");
        }
        that.setNextItem(type, $next );
        var slidEvent = $.Event("slid.devcarousel", { relatedTarget: relatedTarget, direction: direction }); // yes, "slid"
        if ($.support.transition && this.$element.hasClass("slide")) {
            $inner.css("overflow", "hidden");

            $next.addClass(type);
            $next[0].offsetWidth;// force reflow
            $active.addClass(direction);
            $next.addClass(direction);
            $active
                .one("bsTransitionEnd", function () {
                    $next.removeClass([type, direction].join(" ")).addClass("active");
                    $active.removeClass(["active", direction].join(" "));
                    that.sliding = false;
                    setTimeout(function () {
                        that.$element.trigger(slidEvent);
                        $inner.css("overflow", "visible");
                    }, 0);
                })
                .emulateTransitionEnd(DevCarousel.TRANSITION_DURATION);

        } else {
            $active.removeClass("active");
            $next.addClass("active");
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
        var $container = this.$element.find(".active");
        this.setNextItem("next",$container);
    };

    DevCarousel.prototype.generateSlideItem= function (container) {
        var $container = container;
        var $component = this.slideComponent().template;
        var item = $.parseHTML($component);
        var slideItem  = [];
        for (var i = 0;  i <  this.grid; i++ ){
            var clone = $(item).clone();
            slideItem.push(clone);
        }
        return slideItem;
    };

    DevCarousel.prototype.slideComponent = function () {
        var obj = {};
        obj.template = '<div class="col-sm-6 col-xs-12 flex_col" href="#project-carousel" role="button" data-action="view">'+
                            '<div class="item-container" >'+
                                '<div class="project-slide-item">'+
                                    '<a><img class="project-photo" data-src="link_url" alt=""></a>'+
                                '</div>'+
                                '<span class="action hidden-xs"></span>'+
                                '<a class="btn btn-primary btn-dev" >Подивитися вакансії</a>'+
                            '</div>'+
                        '</div>' ;
        return obj;
    };

    DevCarousel.prototype.setNextItem = function (type, $next) {
        var that = this;
        var data = that.data;
        var direction = type;
        var $nextItem = $next.find("[data-repeate]");
        var $children = $nextItem.children();
        var index;
        var $slide;
        if($($nextItem.children()).length < 4) {
            var $slideItems =  this.generateSlideItem($nextItem);
            $nextItem.append($slideItems);
            $children = $nextItem.children();
        }
        if(direction == "next"){
            index = (that.currentDirection == "next") ? this.getIndex(1, direction) : this.getIndex(0, direction);
        } else {
            index = (that.currentDirection =="next") ? this.getIndex(4, direction)  : this.getIndex(0, direction);
        }
        if(direction == "next"){
            for (var i = 0;  i <  that.grid; i++, index++ ){
                index = this.checkIndex(index);
                 $slide =  $children[i];
                this.initSlideComponent($slide, index);
                if(data.length <= that.grid ) {
                    that.sliding = true;
                    break;
                }
            }
        }else {
            for (var j = that.grid-1;  j >=  0;  j--, index-- ){
                index = this.checkIndex(index);
                 $slide =  $children[j];
                this.initSlideComponent($slide, index);
                if(data.length <= that.grid ) {
                    that.sliding = true;
                    break;
                }
            }
        }
        that.currentDirection = direction;
        that.index = (direction == "next") ? index-1 : index;
    };

    DevCarousel.prototype.initSlideComponent  = function (item, i) {
        var $slide = item, index = i;
        var that = this;
        var data = that.data;
        var $img =  $($slide).find("[data-src]")[0];
        var dataSrc = $($($img)[0]).attr("data-src");
        $img.src = data[index][dataSrc];
        $($slide).data("data",data[index]);
    }

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

    DevCarousel.prototype.requestProjects = function (func) {
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

    // CAROUSEL PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var devcarousel    = $this.data("devcarousel");
            var options = $.extend({}, DevCarousel.DEFAULTS, $this.data(), typeof option == "object" && option);
            var action  = typeof option == "string" ? option : options.action;

            if (!devcarousel) {
                $this.data("devcarousel", (devcarousel = new DevCarousel(this, options)));
            }
            if (typeof option == "number") devcarousel.to(option);
            else if (action) devcarousel[action](option);
            if(action === "view"){
                var selectProject = option.data;
                var projectData = devcarousel.data;
                var $viewer = devcarousel.$element.parents(".projects").find("#project-view");
                var projects    = $viewer.data("dev.projects");
                if (!projects) {
                    $viewer.data("dev.projects", (new ProjectViwer($viewer, projectData, selectProject)));
                }else {
                    projects.currentProject = selectProject;
                    projects.viewProject();
                    $viewer.toggle();
                }
            }
            else if (options.interval) devcarousel.pause().cycle();
        });
    }
    
    function ProjectPlugin(option) {
        return this.each(function () {
            var $this   = $(this);
            var data    = $this.data("dev.projects");
            var options = $.extend({},  $this.data(), typeof option == "object" && option);
            var action  = typeof option == "string" ? option : options.action;
            if (action) data[action](option);
            if(action === "view"){
                var $devcarousel = data.$element.parents(".projects").find(".carousel");
                var devcarousel    = $devcarousel.data("devcarousel");
                devcarousel.$element.toggle();
            }
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
        var $target = $($this.attr("data-target") || (href = $this.attr("href")) && href.replace(/.*(?=#[^\s]+$)/, "")); // strip for ie7
        var options = $.extend({item: $this}, $target.data(), $this.data());
        if ($target.hasClass("carousel")) {
            var slideIndex = $this.attr("data-slide-to");
            if (slideIndex) options.interval = false;
            Plugin.call($target, options);
            if (slideIndex) {
                $target.data("devcarousel").to(slideIndex);
            }
        }else if($target.hasClass("project-view")){
            ProjectPlugin.call($target,options);
        }else {
            return;
        }
        e.preventDefault();
    };

    $("#projects")
        .on("click", "[data-action]", clickHandler);

    $(window).on("load", function () {
        $("[data-ride='carousel']").each(function () {
            var $carousel = $(this);
            Plugin.call($carousel, $carousel.data());
        });
    });


    var ProjectViwer = function (element, data, currentProject) {
        this.$element = element;
        this.currentProject= currentProject;
        this.data = data;
        this.createListProjects(this.data);
        this.vacancy = null;
        this.view();
    };
    //
    ProjectViwer.prototype.checkSend = function (option) {
        var $checked = $(this.$element[0]).find("." + option.vacancy);
        var $sendResume = $(this.$element[0]).find(".sendResume");
        if(option.vacancy == this.vacancy){
            $checked.toggle();
            $sendResume.hide();
            this.vacancy = null;
        }else {
            $sendResume.hide();
            $checked.toggle();
            this.vacancy = option.vacancy;
        }
    }

    // select project in list
    ProjectViwer.prototype.select = function (option) {
        var that = this;
        that.currentProject = option.data;
        this.viewProject();
        this.hideSelectedItemList(option);
    };

      // toggle into carousel
    ProjectViwer.prototype.view = function (option) {
        this.$element.toggle();
    };

    // change html value
    ProjectViwer.prototype.viewProject = function () {
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

    // creat list projects
    ProjectViwer.prototype.createListProjects = function () {
        var that = this;
        var data = this.data;
        var $element = this.$element;
        var $list = $element.find(" #list-projects")[0];

        for(var i = 0; i< data.length; i++){
                var li = $('<li  data-target="#project-view" role="button" data-action="select"><a></a></li>');
                $(li).find("a").text(data[i].project_name);
                li.data("data" ,data[i]);
                $($list).append(li);
                if(data[i].id === this.currentProject.id) {li.toggle();}
        }
        this.viewProject();
    };

    // hide selected item list
    ProjectViwer.prototype.hideSelectedItemList = function (option) {
        var list = this.$element.find("#list-projects>li");
        list.show();
        option.item.hide();
    }
}(jQuery);




