+function ($) {
    'use strict';

    var Carousel = function (element, options) {
        this.$element    = $(element)
        this.$component = this.$element.find('.item img');
        this.options     = options;
        this.paused      = null
        this.sliding     = null
        this.interval    = null
        this.$active     = null
        this.$items      = null
        this.data        = null
        this.grid        = 4
        this.index       = this.grid - 1
        this.currentDirection   = "next";

        this.options.keyboard && this.$element.on('keydown', $.proxy(this.keydown, this))

        this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
            .on('mouseenter', $.proxy(this.pause, this))
            .on('mouseleave', $.proxy(this.cycle, this))
    }

    Carousel.TRANSITION_DURATION = 600

    Carousel.DEFAULTS = {
        interval: 5000,
        pause: 'hover',
        wrap: true,
        keyboard: true
    }

    Carousel.prototype.setData = function (data) {
        this.data = data;
        this.initialize();
    }

    Carousel.prototype.getData = function (data) {
        return this.data;
    }

    Carousel.prototype.initialize = function () {
        var self = this;
        var data = self.getData();
        var activeItem = self.$element.find(".item.active img");
        for (var i = 0, index=0;  i <  self.grid; i++, index++ ){
            if(index > data.length-1){ index = 0;}
            activeItem[i].src = data[index].link_url;
            if(data.length <= self.grid && data.length-1 == i) {
                this.sliding = true;
                break;
            }
        }
    }

    Carousel.prototype.setNextItem = function (type, $next) {
        var self = this;
        var data = self.getData();
        var direction = type;
        var nextItem = $next.find("img");
        var index;

        if(direction == "next"){
            index = (this.currentDirection == "next") ? this.index + 1 : this.index + 5;
        } else {
            index = (this.currentDirection == "next") ? this.index - 4  : this.index;
        }
        if(direction == "next"){
            for (var i = 0;  i <  self.grid; i++ ){
                if(index > data.length-1){ index = 0;}
                if(index < 0){index = data.length - 1}
                nextItem[i].src = data[index].link_url;
                index = (direction == "next") ? ++index : --index;
            }
        }else {
            for (var i = self.grid-1;  i >=  0; i-- ){
                if(index > data.length-1){ index = 0;}
                if(index < 0){index = data.length - 1}
                nextItem[i].src = data[index].link_url;
                index = (direction == "next") ? ++index : --index;
            }
        }


        this.currentDirection = direction;
        self.index = (direction == "next") ? index-1 : index;
    }

    Carousel.prototype.next = function () {
        if (this.sliding) return
        return this.slide('next')
    }

    Carousel.prototype.prev = function () {
        if (this.sliding) return
        return this.slide('prev')
    }

    Carousel.prototype.slide = function (type, next) {
        var $active   = this.$element.find('.item.active')
        var $next     = next || this.getItemForDirection(type, $active)
        var isCycling = this.interval
        var direction = type == 'next' ? 'left' : 'right'
        var that      = this

        if ($next.hasClass('active')) return (this.sliding = false)
        this.setNextItem(type, $next )

        var relatedTarget = $next[0]
        var slideEvent = $.Event('slide.dev.carousel', {
            relatedTarget: relatedTarget,
            direction: direction
        })
        this.$element.trigger(slideEvent)
        if (slideEvent.isDefaultPrevented()) return

        this.sliding = true

        isCycling && this.pause()

        var slidEvent = $.Event('slid.dev.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
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

    Carousel.prototype.to = function (pos) {
        var that        = this
        var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

        if (pos > (this.$items.length - 1) || pos < 0) return

        if (this.sliding)       return this.$element.one('.carousel', function () { that.to(pos) }) // yes, "slid"
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

    var clickHandler = function (e) {
        var href;
        var $this   = $(this);
        var $target = $((href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, ''));

        if (!$target.hasClass('carousel')) return
        var options = $.extend({}, $target.data(), $this.data())
        var slideIndex = $this.attr('data-slide-to')

        if (slideIndex) options.interval = false

        Plugin.call($target, options)

        if (slideIndex) {
            $target.data('.carousel').to(slideIndex)
        }

        e.preventDefault()
    }

    $("[data-slide]").on("click", clickHandler)

    function Plugin(option) {
            var $this   = $(this);
            var data    = $this.data('dev.carousel')
            var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
            var action  = typeof option == 'string' ? option : options.slide

            if (!data){
                $this.data('dev.carousel', (data = new Carousel(this, options)));
                run(data.setData.bind(data));
            }

            if (typeof option == 'number') data.to(option)
            else if (action) data[action]()
            else if (options.interval) data.pause().cycle()
    }



    var old = $.fn.carousel

    $.fn.carousel             = Plugin
    $.fn.carousel.Constructor = Carousel

    var run = function (func) {
        var self = func;
        $.ajax({
            type: "GET",
            url: "js/data.json",
            success: function (result) {
                self(result);
            },
            dataType: "json",
            contentType: "application/json"
        });
    }

    $(window).on('load', function () {
        $('[data-ride="carousel"]').each(function () {
            var $carousel = $(this)
            Plugin.call($carousel, $carousel.data())
        })
    })
}(jQuery);

    $('.carousel').carousel({
        interval: 2000
    });

