document.addEventListener('DOMContentLoaded', function () {
  var burgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  burgers.forEach(function (burger) {
    burger.addEventListener('click', function () {
      burger.classList.toggle('is-active');
      document.querySelectorAll('.navbar-menu').forEach(function (menu) {
        menu.classList.toggle('is-active');
      });
    });
  });

  if (window.bulmaCarousel) {
    bulmaCarousel.attach('.carousel', {
      slidesToScroll: 1,
      slidesToShow: 3,
      loop: true,
      infinite: true,
      autoplay: false,
      pagination: true,
      breakpoints: [
        { changePoint: 768, slidesToShow: 1, slidesToScroll: 1 },
        { changePoint: 1024, slidesToShow: 2, slidesToScroll: 1 }
      ]
    });
  }
});
