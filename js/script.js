
$(document).ready(function(){    
    /*var owl =  $('.owl-carousel');
    
    owl.owlCarousel({
       margin: 0,
       loop: true,
      //autoWidth:true,
      items:5,
             
    });

    $('.arrow-next').click(function() {console.log(22);
        owl.trigger('next.owl.carousel');
    })

    $('.arrow-prev').click(function() {
        owl.trigger('prev.owl.carousel');
    })*/

    var slider = $(".slider").slick({
        infinite: true,
        slidesToShow: 4,
        nextArrow: '<div class="content-nav-week-day arrow-next"><div class="icone"> &gt;</div></div>',
        prevArrow: '<div class="content-nav-week-day arrow-prev"><div class="icone"> &lt;</div></div>',
        variableWidth: true,
      });
});