$(window).scroll(function () {
  var sticky = $('header'),
    scroll = $(window).scrollTop();

  if (scroll >= 40) sticky.addClass('fixed');
  else sticky.removeClass('fixed');
});
$('.product-box-img .owl-carousel').owlCarousel({
  margin: 0,
  loop: true,
  items: 1,
  dots: false,
  nav: true
})

// var header_h = $('.header').height();
// $('body').css({'padding-top': header_h});

// function resizeDiv() {
//   var header_h = $('.header').height();
//   $('body').css({'padding-top': header_h});
// }

$('#nav-icon2').click(function () {
  $('#nav-icon2').parent().toggleClass('open');
});


(function (document, window, index) {
  var inputs = document.querySelectorAll('.inputfile');
  Array.prototype.forEach.call(inputs, function (input) {
    var label = input.nextElementSibling,
      labelVal = label.innerHTML;

    input.addEventListener('change', function (e) {
      var fileName = '';
      if (this.files && this.files.length > 1)
        fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
      else
        fileName = e.target.value.split('\\').pop();

      if (fileName)
        label.querySelector('span').innerHTML = fileName;
      else
        label.innerHTML = labelVal;
    });

    // Firefox bug fix
    input.addEventListener('focus', function () { input.classList.add('has-focus'); });
    input.addEventListener('blur', function () { input.classList.remove('has-focus'); });
  });
}(document, window, 0));

// $('#dp3').datepicker('show');

$(function () {
  $(document).click(function (event) {
    $('.navbar-collapse').collapse('hide');
  });
});
