+function ($) {
    "use strict";
    var DevCarousel = function ( element, api, options) {
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
        this.data        = [];
        this.grid = 4;
        this.index       = -1;
        this.currentDirection   = "next";
        this.api = api;

        // this.requestProjects(this.setData.bind(this));
        this.api.getProjects(this.setData.bind(this));
        this.resize();
        this.options.keyboard && this.$element.on("keydown.devcarousel", $.proxy(this.keydown, this));
        $(window).on("resize", $.proxy(this.resize, this));

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

    DevCarousel.prototype.resize = function (e) {
        if(window.innerWidth >= 768){
            this.grid = 4;
        }else if(window.innerWidth < 768){
            this.grid = 2;
        }
    };

    DevCarousel.prototype.cycle = function (e) {
        e || (this.paused = false);

        this.interval && clearInterval(this.interval);

        !(this.data.length > 0) && this.options.interval
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
        if((this.data.length > 0)){
            that.setNextItem(type, $next );
        }
        if ($next.hasClass("active")) return (this.sliding = false);
        var relatedTarget = $next[0]
        var slideEvent = $.Event("slide.devcarousel", {
            relatedTarget: relatedTarget,
            direction: direction
        });
        this.$element.trigger(slideEvent);
        if (slideEvent.isDefaultPrevented()) return;

        this.sliding = true;
        isCycling && this.pause();
        !(this.data.length > 0) && this.pause();

        if (this.$indicators.length) {
            this.$indicators.find(".active").removeClass("active");
            var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)]);
            $nextIndicator && $nextIndicator.addClass("active");
        }
        
        var slidEvent = $.Event("slide.devcarousel", { relatedTarget: relatedTarget, direction: direction }); // yes, "slid"
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
        !(this.data.length > 0) && isCycling && this.cycle();
        !(this.data.length > 0) && this.pause();
        

        return this;
    };

    // method added by me
    DevCarousel.prototype.setData = function (data) {
        for(var i = 0; i<data.length; i++){
            if(!data[i].draft){
                this.data.push(data[i]);
            }
        }
        if(this.data.length > 0){
            this.initCarouselItem();
            
        }else{
            this.$element.css("display", "none");
            !(this.data.length > 0) && this.$element
            .on("mouseenter.devcarousel", $.proxy(this.pause, this))
        }
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
        obj.template = '<div class="col-sm-6 col-xs-12 flex_col" data-target="#project-carousel" role="button" data-action="view">'+
                            '<div class="item-container" >'+
                                '<div class="project-slide-item">'+
                                    '<a><img class="project-photo" data-src="mainImg" alt=""></a>'+
                                '</div>'+

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
        if($($nextItem.children()).length < this.grid) {
            var $slideItems =  this.generateSlideItem($nextItem);
            $nextItem.append($slideItems);
            $children = $nextItem.children();
        }
        if(direction == "next"){
            index = (that.currentDirection == "next") ? this.getIndex(1, direction) : this.getIndex(1, direction);
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

    DevCarousel.prototype.setImage = function(data){
        // console.log(data);
        this.itemImg = data;
    };

    DevCarousel.prototype.initSlideComponent  = function (item, i) {
        var $slide = item, index = i;
        var that = this;
        var data = that.data;
        $($slide).find(".has-vacancy").remove();
        var $img =  $($slide).find("[data-src]")[0];
        var dataSrc = $($($img)[0]).attr("data-src");
      
       
        $img.src  =  this.api.getProjectImages(data[index].id , data[index][dataSrc] );
        $($slide).data("data",data[index]);
        data[i].vacancies = data[i].vacancies ? data[i].vacancies : [];
        if(data[i].vacancies.length > 0){
            var child = $($slide).find("div.item-container").append($('<span class="has-vacancy">Є вакансія</span>'));
        }
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

    // DevCarousel.prototype.requestProjects = function (func) {
    //     var callback = func;
    //     var url = SERVER_API_ACTION.getProjectsUrl;
    //     $.ajax({
    //         type: "GET",
    //         url: url,
    //         success: function (result) {
    //             callback(result);
    //         },
    //         dataType: "json",
    //         contentType: "application/json"
    //     });
    // }

    // CAROUSEL PLUGIN DEFINITION
    // ==========================

    function Plugin(api, option) {
        return this.each(function () {
            var $this   = $(this);
            var devcarousel    = $this.data("devcarousel");
            var options = $.extend({}, DevCarousel.DEFAULTS, $this.data(), typeof option == "object" && option);
            var action  = typeof option == "string" ? option : options.action;

            if (!devcarousel) {
                $this.data("devcarousel", (devcarousel = new DevCarousel( this,api, options)));
            }
            if (typeof option == "number") devcarousel.to(option);
            else if (action) devcarousel[action](option);
            if(action === "view"){
                var selectProject = option.data;
                var projectData = devcarousel.data;
                var $viewer = devcarousel.$element.parents(".projects").find("#project-view");
                var projects    = $viewer.data("dev.projects");
                if (!projects) {
                    $viewer.data("dev.projects", (new ProjectViwer($viewer, projectData, selectProject, ServerApi)));
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
            Plugin.call($target, null, options);
            if (slideIndex) {
                $target.data("devcarousel").to(slideIndex);
            }
        }else if($target.hasClass("project-view")){
            ProjectPlugin.call($target,options);
        }else {
            return;
        }
        // e.preventDefault();
    };

    $("#projects")
        .on("click", "[data-action]", clickHandler)
        .on("change", "[data-action]", clickHandler);

    $(window).on("load", function () {
        $("[data-ride='carousel']").each(function () {
            var $carousel = $(this);
            Plugin.call($carousel, ServerApi, $carousel.data());
        });
    });


    var ProjectViwer = function (element, data, currentProject, api) {
        this.$element = element;
        this.currentProject= currentProject;
        this.data = data;
        this.vacancies = [];
        this.jobPositions = [];
        this.createListProjects(this.data);
        this.vacancy = null;
        this.serverApi = api;
        this.view();
    };

    ProjectViwer.prototype.vacancyComponent = function (arg) {
        var obj = {};
        var item = arg;

        obj.template =
            '<div class="vacancy">'+
            '<div class="resume">'+
            '<h3 data-vacancy="jobName"></h3>'+
            '<a class="btn btn-dev btn-desc" data-target="#project-view" role="button" data-view="vacancy-description" data-action="toggleVacancy">Опис вакансії</a>'+
            '<a class="btn btn-dev btn-send" data-target="#project-view" role="button" data-view="send_resume"   data-action="toggleVacancy">Відіслати резюме</a>'+
            '</div>'+
            '<div class="vacancy-description collapse-view collapse" >'+
                '<p data-vacancy="description"></p>'+
            '</div>'+
            '<div id="ok" class="ok success collapse-view  text-center collapse" >'+
            '<div class="clearfix">'+
               '<a class="close" data-target="#project-view" role="button" data-view="ok"   data-action="toggleVacancy"></a>'+
            '</div>'+
            '<div class="ok-icon"></div>'+
            '<p>Дякуємо, Ваша резюме</p>'+
            '<p>успішно відправлено</p>'+
            '</div>'+
            '<div class="send_resume collapse-view  collapse">'+
            '<div class="flex_row">'+
            '<div class="col-xs-6 flex_col">'+
            '<form  class="alumnus">'+
            '<p>Якщо ти - випускник Bionic можеш подати резюме, ввівши логін і пароль Bionic</p>'+
            '<div class="form-group row">'+
            '<div class="col-xs-4 text-right">'+
            '<label for="inputLogin' + item.id   + '" class="control-label">login</label>'+
            '</div>'+
            '<div class=" col-sm-8">'+
            '<input type="text" name="login"  class="form-control" id="inputLogin' + item.id   + '"  required>'+
            '</div>'+
            '</div>'+
            '<div class="form-group row">'+
            '<div class="col-xs-4  text-right">'+
            '<label for="inputPassword' + item.id   + '" class="control-label">password</label>'+
            '</div>'+
            '<div class="col-xs-8">'+
            '<input type="password" name="password"  class="form-control" id="inputPassword' + item.id   + '"  required>'+
            '</div>'+
            '</div>'+
            '<div class="form-group row">'+
            '<div class="text-center">'+
            '<button type="button"   class="btn  btn-dev  btn-send"  data-target="#project-view" data-action="sendResume">Відіслати резюме</button>'+
            '</div>'+
            '</div>'+
            '</form>'+
            '</div>'+
            '<div class="col-xs-6 flex_col">'+
            '<form class="noalumnus" enctype="multipart/form-data">'+
            '<p>Завантажте, будь-ласка, своє резюме (PDF, RTF, DOC, DOCX)</p>'+
            '<div class="form-group upload-form  row">'+
            '<label for="uploadResume' + item.id   + '" > <input type="file" data-target="#project-view" data-action="uploadFile" class="upload-resume" data-show-preview="false" id = "uploadResume' + item.id   + '" required><span class="upload-icon"></span>'+
            '<span>Виберіть файл для загрузки</span> </label>'+
            '</div>'+
            '<div class="form-group row">'+
            '<div class="text-center">'+
            '<button type="button"   class="btn  btn-dev  btn-send" data-target="#project-view" data-action="sendUploadFile">Відіслати резюме</button>'+
            '</div>'+
            '</div>'+
            '</form>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>';
        return obj;
    };

    ProjectViwer.prototype.successComponent = function () {
        var obj={};
        obj.template = '<div id="ok" class="success text-center " >'+
                            '<div class="clearfix">'+
                                '<a class="close collapsed" data-target="#ok"></a>'+
                            '</div>'+
                            '<div class="ok-icon"></div>'+
                            '<p>Дякуємо, Ваша резюме</p>'+
                            '<p>успішно відправлено</p>'+
                        '</div>';
    };

    //
    ProjectViwer.prototype.toggleVacancy = function (option) {
        var $parent = $(option.item[0]).parents(".vacancy");
        var $checked = $parent.find("." + option.view);
        var $sendResume = $(this.$element[0]).find(".collapse-view");
        var vacancy = $parent.data().data;
        if(option.view == "ok") {
            $checked.hide();
        }else   if(this.vacancy && vacancy.id == this.vacancy.id && this.viewVacancy == option.view) {
          $checked.slideToggle();
          $sendResume.slideUp();
         this.vacancy =null;
      }   else {
            $sendResume.slideUp();
            $checked.slideToggle();
         this.vacancy = vacancy;
        }

        this.viewVacancy = option.view;
    };
    
    ProjectViwer.prototype.sendResume = function (option) {
        var $parent =  option.item.parents(".vacancy");
        var that = this;
        var form  = option.item.parents(".alumnus");
        var formData = JSON.stringify(form.serializeObject());
        this.serverApi.sendResume(formData, that.successSendFile, $parent)
        form.find($("input")).each(function(){
            $(this).val('');
        });
    }

    ProjectViwer.prototype.uploadFile = function (option) {
        var $input = option.item;
        if($input[0].files.length<=0) return;
        var $parent = $input.parents(".upload-form ");
        var file = $input[0].files[0];
        var error = true;
        $($parent).find(".file-upload").remove();
        if(file.name.length < 1) {
              error= false;
        }
        else if(file.type != 'application/msword'&&file.type != 'application/pdf'&&file.type != 'application/rtf'
            &&file.type != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'  ){
            $parent.append($('<div class="file-upload file-error">Не коректний формат файла</div>'));
            error= false;
        }
        else if(file.size > 52428800) {
            $parent.append($('<div class="file-upload file-error">Ви вибрали надто великий файл</div>'));
            error= false;
        }else {
            $parent.append($('<div class="file-upload file-success">'+ file.name +'</div>'));
            error = true;
        }
        $input.data("error", error)
    };

    ProjectViwer.prototype.successSendFile = function (item) {
        var $element = this.$element;
        var $collapse = $element.find(".collapse-view");
        $collapse.hide();
        var $item = item.find(".ok");
        $item.show();
        $element.find("input[type='file']").val("");
    };
    
    ProjectViwer.prototype.sendUploadFile = function (option) {
        var $parent =  option.item.parents(".vacancy");
        var $input =$parent.find("input[type='file']");
        if(!$input.data().error) return;
        var file = $input[0].files[0]
        this.requestResumeFile(file, $parent);
        file = null;
    };


    ProjectViwer.prototype.requestResumeFile = function (data, $item) {
        var file = data;
        var that = this;
        // var formData = new FormData("file", file);
        this.serverApi.sendResumeFile(file, that.successSendFile, $item)

    };


    // select project in list
    ProjectViwer.prototype.select = function (option) {
        var that = this;
        that.currentProject = option.data;
        this.viewProject();
        this.hideSelectedItemList(option);
    };

      // toggle into carousel
    ProjectViwer.prototype.view = function (option) {
        this.$element.slideToggle();
        var selectedProject = this.currentProject;
        var setVacancies = this.setVacancies.bind(this);
        var createListVacancies = this.createListVacancies.bind(this);
        var setJobPostions = this.setJobPostions.bind(this);
        ServerApi.getVacancies().then(function(response){
            setVacancies(response);
            createListVacancies(selectedProject);
        });
        ServerApi.getJobPositions().then(function(response){
            setJobPostions(response);
            createListVacancies(selectedProject);
        });
    };

    ProjectViwer.prototype.setJobPostions = function(data){
        this.jobPositions = data;
    }

    ProjectViwer.prototype.setVacancies = function(data){
        this.vacancies = data;
    }

    // change html value
    ProjectViwer.prototype.viewProject = function () {
        var self = this;
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

                that.src=  ServerApi.getProjectImages(selectedProject.id, selectedProject["previewImg"] );
            }
        });

        this.createListVacancies(selectedProject);

    };

    ProjectViwer.prototype.createListVacancies = function (item) {
        var project = item;
        var that = this;
        var vacancies= [];
        for(var i = 0; i< that.vacancies.length; i++){
            if(project.id == that.vacancies[i].project.id){
                vacancies.push(that.vacancies[i]);
            }
        };

        var $container = that.$element.find(".vacancies");
        // var $vacancy = $.parseHTML(this.vacancyComponent().template)
        $container.children().remove();
        if(vacancies.length>0){
            $container.append($("<h2>Вакансії:</h2>"))
            for(var i = 0; i< vacancies.length; i++){
                var $vacancy = $.parseHTML(this.vacancyComponent(vacancies[i]).template)
                var clone = $($vacancy).clone();
                $container.append(clone);
                var $model = $($($container.children()[i+1])).find("[data-vacancy]");
                this.initVacancyItem($model, vacancies[i]);
                $($container.children()[i+1]).data("data", vacancies[i]);
            }
        }else if(vacancies.length<=0){
            $container.append($('<div class="vacancy-absent">На цьому проекті вакансій зараз немає</div>'))
        }
    };

    ProjectViwer.prototype.initVacancyItem = function ($item, model) {
        var $vacancyItems = $item;
        var data = model;
        var text =  /^(?:p|a|h1|h2|h3|h4|h5|h6|span|div)$/i;
        for(var i = 0; i< this.jobPositions.length; i++){
            if(data.jobPosition.id == this.jobPositions[i].id){
                data.jobName = this.jobPositions[i].name;
                console.log(data);
                
            }
        }
        $vacancyItems.each(function () {
            var that = this;
            var attr;
            var tag = that.tagName.toLowerCase();
            if( text.test(tag)){
                attr = $(that).attr("data-vacancy");
                that.innerHTML = data[attr];
            }
        });
    }

    // creat list projects
    ProjectViwer.prototype.createListProjects = function () {
        var that = this;
        var data = this.data ? this.data : [];
        var $element = this.$element;
        var $list = $element.find(" #list-projects")[0];

        for(var i = 0; i< data.length; i++){
                var li = $('<li  data-target="#project-view" role="button" data-action="select"><a></a></li>');
                $(li).find("a").text(data[i].name);
                li.data("data" ,data[i]);
                $($list).append(li);
                if(data[i].id === this.currentProject.id) {li.slideToggle();}
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




