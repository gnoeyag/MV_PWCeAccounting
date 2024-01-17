(function(window, $) { 
  var pn = window.mvJs.pn;

  /**
  * Create a ActionSheet
  * @class ActionSheet
  * @description .action-sheet 클래스가 있는 ui에 적용
  */  
  function ActionSheet(target) {
    var el = {
      target : target,
      btn : null,
      wrapper : null
    };

    var selector = {
      btn: '.btn-action-sheet',
      wrapper: 'section.wrapper'
    };

    var handler = {
      /**
       * @callback click
       * @memberof ActionSheet
       * @param {*} event
       * @description 버튼 클릭 시 is-active 클래스 추가 및 제거
       */
      click: function(event) {
        event.preventDefault();

        if ($(el.target).hasClass('is-active')) {
          $(el.target).removeClass('is-active');
          $(el.wrapper).removeClass('is-reversal');

          $('meta').remove('[name=theme-color],[name=apple-mobile-web-app-capable],[name=apple-mobile-web-app-status-bar-style]');

          pn.utils.scrollControl(true);
        } else {
          $(el.target).addClass('is-active');
          $(el.wrapper).addClass('is-reversal');

          setTimeout(function() {
            $('head').append('<meta name="theme-color" content="#464646"/><meta name="apple-mobile-web-app-capable" content="yes"/><meta name="apple-mobile-web-app-status-bar-style"  content="#464646"/>');
          }, 300);
          
          pn.utils.scrollControl(false);
        }
      }
    };

    var bind = function() {
      $(el.btn).on('click', handler.click);
    };
    
    var unbind = function() {
      $(el.btn).off('click', handler.click);
    };

    var setProperty = function() {
      el.btn = $(el.target).find(selector.btn);
      el.wrapper = el.target.closest(selector.wrapper);
    };

    /**
   * @function init
   * @memberof actionSheet
   * @description actionSheet 인스턴스 생성
   */  
    this.init = function() {
      setProperty();

      bind();
    };

    /**
   * @function reInit
   * @memberof actionSheet
   * @description 재생성
   */  
    this.reInit = function() {
      unbind();

      setProperty();

      bind();
    };
    
    this.init();
  }

  window.mvJs.pn.actionSheet = {
    /**
   * @function init
   * @memberof actionSheet
   * @description actionSheet 인터페이스 모음
   */  
    init: function(selector) {
      $(selector).each(function(idx, el) {
        var $el = $(el);
        var obj = $el.data('actionSheet');

        if (obj) {
          obj.reInit(); 
        } else {
          obj = new ActionSheet(el);

          $el.data('actionSheet', obj);
        }        
      });
    }
  };

  window.mvJs.fn.openActionSheet = function(el) {
    $(el).addClass('is-active');
    $('section.wrapper').addClass('is-reversal');

    setTimeout(function() {
      $('head').append('<meta name="theme-color" content="#464646"/><meta name="apple-mobile-web-app-capable" content="yes"/><meta name="apple-mobile-web-app-status-bar-style"  content="#464646"/>');
    }, 300);
  };

})(window, window.jQuery);