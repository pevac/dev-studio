$('.carousel').carousel({
    interval: 0
});

$('.navbar').scrollspy();

$('.item-container').on ("mouseover",
    function () {
        $('.project-slide-item').parents(".carousel-inner").addClass("inner-visible");

    }
);

$('.item-container').on ("mouseleave",
    function () {
        $('.project-slide-item').parents(".carousel-inner").removeClass("inner-visible");

    }
);


$('.btn-dev').on ("mouseover",
    function () {
        $('.project-slide-item').parents(".carousel-inner").addClass("inner-visible");

    }
);

$('.btn-dev').on ("mouseleave",
    function () {
        $('.project-slide-item').parents(".carousel-inner").removeClass("inner-visible");

    }
);