(function() {
  'use strict';

  jQuery(document).ready(function($) {
    var $reviews = $('#owl-reviews'),
        $teammates = $('#owl-teammates'),
        $reviewsNavLeft = $('.reviews-slide-left'),
        $reviewsNavRight = $('.reviews-slide-right'),
        $contactSocialLink = $('.contact-social a'),
        $menuModal = $modal('#menu-modal'),
        $hireUsModal = $modal('#hire-us-modal'),
        $menuModalLinks = $('#menu-modal .menu-box ul >li > a'),
        $hireUsOpen = $('#hire-us-open'),
        $hireUsClose = $('#hire-us-close'),
        $menuOpen = $('#menu-open'),
        $menuClose = $('#menu-close');

    $reviews.owlCarousel({
      singleItem : true,
      stopOnHover: true,
      pagination: false,
      transitionStyle : 'fade'
    });

    $teammates.owlCarousel({
      itemsCustom: [[0, 1], [360, 1], [768, 2], [920, 3], [1200, 4], [1600, 4]],
      stopOnHover: true,
      theme: 'tanatos-theme'
    });

    $reviewsNavRight.on('click', function() {
      $reviews.trigger('owl.next');
    });

    $reviewsNavLeft.on('click', function() {
      $reviews.trigger('owl.prev');
    });

    $menuOpen.on('click', function() {
      $menuModal.show();
    });

    $menuModalLinks.on('click', function() {
      $menuModal.close();
    });

    $menuClose.on('click', function() {
      $menuModal.hide();
    });

    $hireUsOpen.on('click', function() {
      $hireUsModal.show();
    });

    $hireUsClose.on('click', function() {
      $hireUsModal.hide();
    });

    function $modal(selector) {
      var $el = $(selector);
      var $content = $el.find('.modal-content');
      $content.addClass('animated');
        
      var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

      var modalProps = {
        show: function() {
          $content.one(animationEnd, function() {
            $content.removeClass('fadeInDown');
          });
          $el.addClass('modal-visible');
          $content.addClass('fadeInDown');
        },
        hide: function() {
          $content.one(animationEnd, function() {
            $el.removeClass('modal-visible');
            $content.removeClass('fadeOutUp');
          });
          $content.addClass('fadeOutUp');
        },
        close: function() {
          $el.removeClass('modal-visible');
        }
      };

      return $.extend($el, modalProps);
    }
  });
})();