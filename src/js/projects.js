/*
 * Copyright 2011-2016 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */

+function ($) {
    'use strict';
    var Carousel = function (element, options) {
        this.$element    = $(element)
        this.$element    = $(element)
        this.$indicators = this.$element.find('.carousel-indicators')
        this.options     = options
        this.paused      = null
        this.sliding     = null
        this.interval    = null
        this.$active     = null
        this.$items      = null
        // field added by me
        this.data        = null
        this.grid        = 4
        this.index       = this.grid - 1
        this.currentDirection   = "next";

        this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

        this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
            .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
            .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
    }

    Carousel.TRANSITION_DURATION = 600

    Carousel.DEFAULTS = {
        interval: 5000,
        pause: 'hover',
        wrap: true,
        keyboard: true
    }

    Carousel.prototype.keydown = function (e) {
        if (/input|textarea/i.test(e.target.tagName)) return
        switch (e.which) {
            case 37: this.prev(); break
            case 39: this.next(); break
            default: return
        }

        e.preventDefault()
    }

    Carousel.prototype.cycle = function (e) {
        e || (this.paused = false)

        this.interval && clearInterval(this.interval)

        this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

        return this
    }

    Carousel.prototype.getItemIndex = function (item) {
        this.$items = item.parent().children('.item')
        return this.$items.index(item || this.$active)
    }

    Carousel.prototype.getItemForDirection = function (direction, active) {
        var activeIndex = this.getItemIndex(active)
        var willWrap = (direction == 'prev' && activeIndex === 0)
            || (direction == 'next' && activeIndex == (this.$items.length - 1))
        if (willWrap && !this.options.wrap) return active
        var delta = direction == 'prev' ? -1 : 1
        var itemIndex = (activeIndex + delta) % this.$items.length
        return this.$items.eq(itemIndex)
    }

    Carousel.prototype.to = function (pos) {
        var that        = this
        var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

        if (pos > (this.$items.length - 1) || pos < 0) return

        if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
        if (activeIndex == pos) return this.pause().cycle()

        return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
    }

    Carousel.prototype.pause = function (e) {
        e || (this.paused = true)

        if (this.$element.find('.next, .prev').length && $.support.transition) {
            this.$element.trigger($.support.transition.end)
            this.cycle(true)
        }

        this.interval = clearInterval(this.interval)

        return this
    }

    Carousel.prototype.next = function () {
        if (this.sliding) return
        return this.slide('next')
    }

    Carousel.prototype.prev = function () {
        if (this.sliding) return
        return this.slide('prev')
    }

    // method override by me
    Carousel.prototype.slide = function (type, next) {
        var $active   = this.$element.find('.item.active')
        var $next     = next || this.getItemForDirection(type, $active)
        var isCycling = this.interval
        var direction = type == 'next' ? 'left' : 'right'
        var that      = this

        if ($next.hasClass('active')) return (this.sliding = false)

        that.setNextItem(type, $next )

        var relatedTarget = $next[0]
        var slideEvent = $.Event('slide.bs.carousel', {
            relatedTarget: relatedTarget,
            direction: direction
        })
        this.$element.trigger(slideEvent)
        if (slideEvent.isDefaultPrevented()) return

        this.sliding = true

        isCycling && this.pause()

        if (this.$indicators.length) {
            this.$indicators.find('.active').removeClass('active')
            var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
            $nextIndicator && $nextIndicator.addClass('active')
        }

        var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
        if ($.support.transition && this.$element.hasClass('slide')) {
            $next.addClass(type)
            $next[0].offsetWidth // force reflow
            $active.addClass(direction)
            $next.addClass(direction)
            $active
                .one('bsTransitionEnd', function () {
                    $next.removeClass([type, direction].join(' ')).addClass('active')
                    $active.removeClass(['active', direction].join(' '))
                    that.sliding = false
                    setTimeout(function () {
                        that.$element.trigger(slidEvent)
                    }, 0)
                })
                .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
        } else {
            $active.removeClass('active')
            $next.addClass('active')
            this.sliding = false
            this.$element.trigger(slidEvent)
        }

        isCycling && this.cycle()

        return this
    }

    // method added by me
    Carousel.prototype.setData = function (data) {
        this.data = data;
        this.initCarouselItem();
    }

    Carousel.prototype.initCarouselItem= function () {
        var that = this;
        var data = that.data;
        var activeItem = that.$element.find(".item.active img");
        for (var i = 0, index=0;  i <  that.grid; i++, index++ ){
            if(index > data.length-1){ index = 0;}
            activeItem[i].src = data[index].link_url;
            if(data.length <= that.grid && data.length-1 == i) {
                that.sliding = true;
                break;
            }
        }
    }

    Carousel.prototype.setNextItem = function (type, $next) {
        var that = this;
        var data = that.data;
        var direction = type;
        var nextItem = $next.find("img");
        var index;

        if(direction == "next"){
            index = (that.currentDirection == "next") ? that.index + 1 : that.index + 5;
        } else {
            index = (that.currentDirection == "next") ? that.index - 4  : that.index;
        }
        if(direction == "next"){
            for (var i = 0;  i <  that.grid; i++, index++ ){
                if(index > data.length-1){ index = 0;}
                if(index < 0){index = data.length - 1}
                nextItem[i].src = data[index].link_url;
            }
        }else {
            for (var i = that.grid-1;  i >=  0; i--, index-- ){
                if(index > data.length-1){ index = 0;}
                if(index < 0){index = data.length - 1}
                nextItem[i].src = data[index].link_url;
            }
        }


        that.currentDirection = direction;
        that.index = (direction == "next") ? index-1 : index;
    }

    // CAROUSEL PLUGIN DEFINITION
    // ==========================

    function Plugin(option) {
        return this.each(function () {
            var $this   = $(this)
            var data    = $this.data('bs.carousel')
            var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var action  = typeof option == 'string' ? option : options.project

            if (!data) {
                $this.data('bs.carousel', (data = new Carousel(this, options)))
                requestProjects(data.setData.bind(data));
            }
            if (typeof option == 'number') data.to(option)
            else if (action) data[action]()
            else if (options.interval) data.pause().cycle()
        })
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

    var old = $.fn.devcarousel

    $.fn.devcarousel             = Plugin
    $.fn.devcarousel.Constructor = Carousel

    // CAROUSEL NO CONFLICT
    // ====================

    $.fn.devcarousel.noConflict = function () {
        $.fn.devcarousel = old
        return this
    }

    // CAROUSEL DATA-API
    // =================

    var clickHandler = function (e) {
        var href
        var $this   = $(this)
        var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
        if (!$target.hasClass('carousel')) return
        var options = $.extend({}, $target.data(), $this.data())
        var slideIndex = $this.attr('data-slide-to')
        if (slideIndex) options.interval = false

        Plugin.call($target, options)

        if (slideIndex) {
            $target.data('bs.carousel').to(slideIndex)
        }

        e.preventDefault()
    }

    $(document)
        .on('click.bs.carousel.data-api', '[data-project]', clickHandler)
        .on('click.bs.carousel.data-api', '[data-project-to]', clickHandler)

    $(window).on('load', function () {
        $('[data-ride="carousel"]').each(function () {
            var $carousel = $(this)
            Plugin.call($carousel, $carousel.data())
        })
    })

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

