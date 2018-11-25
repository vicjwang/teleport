  WebFontConfig = {
    google: { families: [ 'Work+Sans:300,100:latin' ] }
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })(); 

var $w = $(window);
var winHeight = $w.height();
var tutorial; // for debugging

$(document).ready(function() {
  $("body").addClass("no-scroll");
  drawPreload();

  $(".intro__menutoggle").click(function() {
    $(this).toggleClass("toggle");
    $("#intro ul").toggleClass("visible");
  });

  $("section").removeClass("focus");

  tutorial = new TutorialController();
  var myElement = document.getElementById('tutorial');

  if (typeof Hammer !== 'undefined') {
    // create a simple instance
    // by default, it only adds horizontal recognizers
    var mc = new Hammer(myElement);

    // listen to events...
    mc.on("swipeleft", function(ev) {
        tutorial.next();
    });
    mc.on("swiperight", function(ev) {
        tutorial.prev();
    });
  }

  $w.scroll(triggerFocus);

  function triggerFocus() {
    var h = $w.scrollTop();
    $(".intro__planet").css({
      'transform': 'translate3d(0,'+h/8+'px,0)'
    });

    if(h >= winHeight*.9) $("#intro").removeClass("focus");
    else if(h < winHeight/1.5) {
      if(!$("#intro").hasClass("focus")){
        $("#intro").addClass("focus");
        $("#tutorial").removeClass("focus");
      }
    }

    if(h >= winHeight*.8) {
      if(!$("#tutorial").hasClass("focus")){
        $("#tutorial").addClass("focus");
        tutorial.animate();
      }
    }
  }


  $('.slideshow__paginator-next').click(function(e) {
    e.preventDefault();
    var $siblings = $(this).siblings(".slideshow__child");
    $siblings.each(function(i) {
      if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        var $next = $(this).next();
        if ($next.length) 
          $next.addClass('active'); 
        else 
          $siblings.first().addClass('active');
        return false;
      }
    });
    return false;
  });
  $('.slideshow__paginator-prev').click(function(e) {
    e.preventDefault();
    var $siblings = $(this).siblings(".slideshow__child");
    $siblings.each(function(i) {
      if ($(this).hasClass("active")) {
        $(this).removeClass("active");
        if (i>0) 
          $(this).prev().addClass('active'); 
        else 
          $siblings.last().addClass('active');
        return false;
      }
    });
    return false;
  });


});

$(".faq__q").click(function() {
  $(this).parent(".faq__question").toggleClass("active");
});

if (typeof $().hideseek !== 'undefined') {
  $('#faq__search').hideseek({
    highlight: true,
    ignore: '.faq__question-ignore'
  });
}

$(".intro__faq").click(function() {
  event.preventDefault();

  $(".intro__menutoggle").removeClass("toggle");
  $("#intro ul").removeClass("visible");
  
  $('html, body').animate({
    scrollTop: $("#faq").offset().top
  }, 1000);
});

$(".intro__arrow").click(function() {
  event.preventDefault();
  $('html, body').animate({
    scrollTop: $("#tutorial").offset().top
  }, 1000);
});

function initialize() {
  imagesLoaded( document.querySelector('#intro'), function( instance ) {
    $("#preload").fadeOut();
    $("#intro").addClass("focus");
    $("body").removeClass("no-scroll");
  });
}

function drawPreload() {
  if ($("#preload").length) {
    var $preload = $("#preload").addClass("visible");
    var s = Snap(".preload__logo svg");
    s.select("polygon").animate({points:"60,99.8 60,131.7 60,99.8 60,36.2 60,4.3 60,36.2      "},500, mina.easein,function() {
      s.select("polygon").animate({points:"116,99.8 60,131.7 4,99.8 4,36.2 60,4.3 116,36.2      "},600, mina.easeout,function() {
        s.select("polygon").animate({points:"60,99.8 60,131.7 60,99.8 60,36.2 60,4.3 60,36.2      "},700, mina.easein,function() {
          s.select("polygon").animate({points:"116,99.8 60,131.7 4,99.8 4,36.2 60,4.3 116,36.2      "},1200, mina.bounce,function() {
            createLines(s);
          });
        });
      });
    });
  }

  createLines = function(s) {
    var options = {
      "fill":"none",
      "stroke":"#FF8484",
      "stroke-width":"0",
      "stroke-linecap":"round",
      "stroke-linejoin":"round",
      "stroke-miterlimit":"10",
      // "transform":"translate(418,-212)"
    }
    var line1 = s.path("M38.9 78.6l41 23.3");
    var line2 = s.path("M38.9 58.7l41 23.3");
    var line3 = s.path("M38.9 38.5l41 23.3");
    line1.attr(options);
    line2.attr(options);
    line3.attr(options);

    line3.animate({"stroke-width":"6"},100,mina.linear,function() {
      line2.animate({"stroke-width":"6"},100,mina.linear,function() {
        line1.animate({"stroke-width":"6"},100,mina.linear,function() {
          setTimeout(initialize,300);
        });
      });
    });
  }
}




var TutorialController = function() {
  var th = this;
  th.$slides = $(".tutorial__content");
  th.$progress = $(".tutorial__progress li");
  th.$paginatorNext = $(".tutorial__paginator-next");
  th.$paginatorPrev = $(".tutorial__paginator-prev");
  th.state = 0;

  function init() {
    if($(".tutorial__content-1 svg").length){
      th.s = Snap(".tutorial__content-1 svg");
      th.line = th.s.path("M175.9,89.5C175.9,41.7,137.1,3,89.4,3S2.9,41.7,2.9,89.5");
      th.lineLength = th.line.getTotalLength();
      th.options = {
        "fill":"none",
        "stroke":"#f0f0f0",
        "stroke-width":"4",
        "stroke-miterlimit":"10",
        "stroke-dasharray":th.lineLength+","+th.lineLength,
        "stroke-dashoffset":th.lineLength
      };
      
      th.line.attr(th.options);
    }
  }

  $(document).ready(function() {
    init();

    th.$progress.click(function(e) {
      e.preventDefault();
      th.gotoSlide(th.$progress.index(this));
    });
    th.$paginatorNext.click(function(e) {
      e.preventDefault();
      th.next();
    });
    th.$paginatorPrev.click(function(e) {
      e.preventDefault();
      th.prev();
    });
  });
}

TutorialController.prototype.animate = function() {
  var th = this;
  if (th.state==0){
    $(".tutorial__content-1").removeClass("animated");
    var th = this;
    th.line.attr(th.options);
    th.line.animate({"stroke-dashoffset":"0"},1000,mina.linear,function() {
      $(".tutorial__content-1").addClass("animated");
    })
    $("#tutorial").removeClass("planets");
    $("#tutorial").removeClass("map");
    $(".tutorial__content-3").removeClass("animated");
  } else if(th.state==1) {
    $("#tutorial").addClass("planets");
    $("#tutorial").removeClass("map");
    $(".tutorial__content-3").removeClass("animated");
  } else if(th.state==2) {
    $("#tutorial").removeClass("planets");
    $("#tutorial").addClass("map");
    $(".tutorial__content-3").addClass("animated");
  }
};
TutorialController.prototype.gotoSlide = function(slide) {
  var th = this;
  if(slide==th.state) return;
  var newSlide = (slide+3) % th.$slides.length;
  th.$slides.each(function(i) {
    if(i==newSlide)
      $(this).addClass("active").removeClass("prev next");
    else if(i==(slide+1) % th.$slides.length)
      $(this).addClass("next").removeClass("active prev");
    else if(i==(slide-1) % th.$slides.length)
      $(this).addClass("prev").removeClass("active next");
    else
      $(this).removeClass("active next prev");
  });
  th.$progress.each(function(i) {
    if(i==newSlide)
      $(this).addClass("active");
    else 
      $(this).removeClass("active");
  });

  if (slide==0) $(".tutorial__paginator-prev").addClass("hidden");
  else $(".tutorial__paginator-prev").removeClass("hidden");
  if (slide==th.$slides.length-1) $(".tutorial__paginator-next").addClass("hidden");
  else $(".tutorial__paginator-next").removeClass("hidden");

  th.state = newSlide;
  th.animate();
};
TutorialController.prototype.next = function() {
  var th = this;
  th.gotoSlide(th.state+1);
};
TutorialController.prototype.prev = function() {
  var th = this;
  th.gotoSlide(th.state-1);
};


