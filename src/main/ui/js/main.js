$(document).ready(function () {

    // init scrollspy
    $(function($){
        var url = location.href.replace(/#.*/,'');

        // Find all anchors
        $('.navbar').find('a[href]').each(function(i,a){
            var $a = $(a);
            var href = $a.attr('href');

            // check is anchor href starts with page's URI
            if (href.indexOf(url+'#') === 0) {
                // remove URI from href
                href = href.replace(url,'');
                // update anchors HREF with new one
                $a.attr('href',href);
            }

            // Now refresh scrollspy
            $('[data-spy="scroll"]').each(function (i,spy) {
                $(spy).scrollspy('refresh');
            });
        });

        //  animation scrollspy
        $(".navbar  a[href^='#']").on('click', function(e) {
            event.preventDefault();
            var id  = $(this).attr('href').split('#')[1];
            var top;
            if(id === ""){
                    top = 0;
            }else {
                  top = $("#" + id).offset().top;
            }
            $('body,html').animate({scrollTop: top}, 1500);
        });
    });

    // init carousel
    $("#projects").devcarousel();
});









