// Typewriter effect
var TxtRotate = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
  };
  
  TxtRotate.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];
  
    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }
  
    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';
  
    var that = this;
    var delta = 50;// - Math.random() * 100;
  
    // if (this.isDeleting) { delta /= 2; }
  
    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }
  
    setTimeout(function() {
      that.tick();
    }, delta);
  };
  
  window.onload = function() {
    var elements = document.getElementsByClassName('txt-rotate');
    for (var i=0; i<elements.length; i++) {
      var toRotate = elements[i].getAttribute('data-rotate');
      var period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtRotate(elements[i], JSON.parse(toRotate), period);
      }
    }
    // INJECT CSS
    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
    document.body.appendChild(css);
  };

// carousel custom interval control
var t;
$('.carousel').on('slid.bs.carousel', () => {
  cycleCarousel();
})

$('.carousel-control-next').on('click', function(){
  clearTimeout(t);   
});

$('.carousel-control-prev').on('click', function(){
  clearTimeout(t);   
});

// ensures user always starts on first slide
$('.modal').on('shown.bs.modal', (e) => {
  if ($(window).width() < 900) {
    console.log('less than 900')
    $('#scrollUp').hide()
  }
  else {
    var currModal = $('.modal.show')
    var slideList = currModal.find('.carousel-inner')[0].getElementsByClassName('carousel-item')
    var indicators = currModal.find('.carousel-indicators')[0].getElementsByTagName('li')
    for(var i=0; i < slideList.length; i++){
      if(i === 0) {
        slideList[i].setAttribute("class", "carousel-item active");
        indicators[i].setAttribute("class", "active")
      }
      else {
        slideList[i].setAttribute("class", "carousel-item");
        indicators[i].setAttribute("class", "")
      }
    }
    cycleCarousel();
  }
})

function cycleCarousel() {
  clearTimeout(t);
  var carouselElement = $(".modal.show").find('.carousel')
  var duration = carouselElement.find('.carousel-item.active').attr('data-interval');
  var showingChild = $(".modal.show").find('.carousel').find('.carousel-item.active')[0].childNodes[1]
  carouselElement.carousel('pause');
  if(showingChild.tagName === 'VIDEO') {
    showingChild.currentTime = 0;
    showingChild.play();
  }
  t = setTimeout("$('.modal.show').find('.carousel').carousel('next');", duration)
}

// ensures timeouts dont stack up
$('.modal').on('hide.bs.modal', (e) => {
  clearTimeout(t);
  if ($(window).width() < 900) {
    $('#scrollUp').show()
  }
})

const sectionList = ['homearea', 'skills', 'experience', 'education', 'projects', 'resume_area']

// scroll to navigation
$('#navbarSupportedContent').find('a[href*="#"]:not([href="#"])').click(function () {
  if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      console.log()
      if (target.length) {
        if ($('.navbar-collapse.offset.collapse.show').length > 0) {
          $('.navbar-collapse.offset.collapse.show').toggleClass('show')
          $('.navbar-toggler').toggleClass('collapsed')
          $('.navbar-toggler').attr('aria-expanded', 'false')
        }
        else {
          var currElem = this.getAttribute('href').substring(1);
          for(var i=0; i < sectionList.length; i++) {
            if(currElem === sectionList[i]) {
              $('#navbarSupportedContent').find('a[href="#' + sectionList[i] + '"]').parent().addClass('active')
            }
            else {
              $('#navbarSupportedContent').find('a[href="#' + sectionList[i] + '"]').parent().removeClass('active')
            }
          }
        }
        $('html,body').animate({
          scrollTop: (target.offset().top - 0)
        }, 1000);
        if ($('.navbar-toggle').css('display') != 'none') {
            $(this).parents('.container').find(".navbar-toggle").trigger("click");
        }
        return false;
      }
  }
});

$('.homelink').click(function () {
  if ($('.navbar-collapse.offset.collapse.show').length > 0) {
    $('.navbar-collapse.offset.collapse.show').toggleClass('show')
    $('.navbar-toggler').toggleClass('collapsed')
    $('.navbar-toggler').attr('aria-expanded', 'false')
  }
  $('html,body').animate({
    scrollTop: 0
  }, 1000);
  if ($('.navbar-toggle').css('display') != 'none') {
      $(this).parents('.container').find(".navbar-toggle").trigger("click");
  }
  return;
});


var debounce_timer;

$(window).scroll(function() {

  if(debounce_timer) {
    window.clearTimeout(debounce_timer);
  }

  debounce_timer = window.setTimeout(handleScroll, 50);

});

function handleScroll() {
  // close nav menu if scrolling
  if ($('.navbar-collapse.offset.collapse.show').length > 0) {
    $('.navbar-collapse.offset.collapse.show').toggleClass('show')
    $('.navbar-toggler').toggleClass('collapsed')
    $('.navbar-toggler').attr('aria-expanded', 'false')
  }

  
  var currElem;
  for(var i=0; i < sectionList.length; i++) {
    var hT = $('#' + sectionList[i]).offset().top,
        hH = $('#' + sectionList[i]).outerHeight(),
        wH = $(window).height(),
        wS = $(this).scrollTop();
    // if (wS > (hT+hH-wH)) {// && wS < hT + hH){
    var offset = 0;
    if (hT + hH > wH) offset = 100;
    if (wS >= hT - offset && wS < (hT + hH)) {
        currElem = sectionList[i]
        // var nums = {
        //   'top of element' : hT,
        //   'height of element' : hH,
        //   'window height' : wH,
        //   'top of window' : wS,
        // }
    }
  }
  for(var i=0; i < sectionList.length; i++) {
    if(currElem === sectionList[i]) {
      $('#navbarSupportedContent').find('a[href="#' + sectionList[i] + '"]').parent().addClass('active')
    }
    else {
      $('#navbarSupportedContent').find('a[href="#' + sectionList[i] + '"]').parent().removeClass('active')
    }
  }
}

$(document).click(function(e) {
  // close nav menu if touch outside of menu
  if ($('.navbar-collapse.offset.collapse.show').length > 0) {
    $('.navbar-collapse.offset.collapse.show').toggleClass('show')
    $('.navbar-toggler').toggleClass('collapsed')
    $('.navbar-toggler').attr('aria-expanded', 'false')
  }
});

