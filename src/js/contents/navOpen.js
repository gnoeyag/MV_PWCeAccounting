(function(window, $) { 
  var pn = window.mvJs.pn;

  /**
  * Create a NavOpen
  * @class NavOpen
  * @description .action-sheet 클래스가 있는 ui에 적용
  */  
  function NavOpen(target) {
    var el = {
      btnOpen : target,
      inner  : null,
      btnClose : null,
      nav : null
    };

    var selector = {
      inner : '.header__inner',
      btnClose: '.btn--menu-close',
      nav : 'nav'
    };

    var handler = {
      /**
       * @callback open
       * @memberof NavOpen
       * @param {*} event
       * @description menu 버튼 클릭 시 is-open 클래스 추가
       */
      open: function(event) {
        event.preventDefault();
        $(el.nav).addClass('is-open');
        el.nav.focus();
        pn.utils.scrollControl(false);

        el.nav.find('.nav__inner').height(document.documentElement.clientHeight);
      },
      /**
       * @callback close
       * @memberof NavOpen
       * @param {*} event
       * @description menu 버튼 클릭 시 is-open 클래스 제거
       */
      close: function(event) {
        event.preventDefault();
        $(el.nav).removeClass('is-open');
        el.btnOpen.focus();
        pn.utils.scrollControl(true);
      }
    };

    var bind = function() {
      $(el.btnOpen).on('click', handler.open);
      $(el.btnClose).on('click', handler.close);
    };
    
    var unbind = function() {
      $(el.btnOpen).off('click', handler.open);
      $(el.btnClose).off('click', handler.close);
    };

    var setProperty = function() {
      el.inner = el.btnOpen.closest(selector.inner);
      el.nav = $(el.inner).find(selector.nav);
      el.btnClose = el.nav.find(selector.btnClose);
    };

    /**
   * @function init
   * @memberof navOpen
   * @description navOpen 인스턴스 생성
   */  
    this.init = function() {
      setProperty();

      bind();
    };

    /**
   * @function reInit
   * @memberof navOpen
   * @description 재생성
   */  
    this.reInit = function() {
      unbind();

      setProperty();

      bind();
    };
    
    this.init();
  }

  window.mvJs.pn.navOpen = {
    /**
   * @function init
   * @memberof navOpen
   * @description navOpen 인터페이스 모음
   */  
    init: function(selector) {
      $(selector).each(function(idx, el) {
        var $el = $(el);
        var obj = $el.data('navOpen');

        if (obj) {
          obj.reInit(); 
        } else {
          obj = new NavOpen(el);

          $el.data('navOpen', obj);
        }        
      });
    }
  };
})(window, window.jQuery);