(function(window, $) { 
  /**
  * Create a TabDefault
  * @class TabDefault
  * @description .tab-default 클래스가 있는 ui에 적용
  */  
  function TabDefault(target) {
    var el = {
      tabWrap : target,
      tabList : null
    };

    var selector = {
      tabBtn: 'button[role=tab]'
    };

    var handler = {
      /**
       * @callback clickTab
       * @memberof TabDefault
       * @param {*} event
       * @description Tab클릭 시 is-active 클래스 추가 및 제거
       */
      clickTab: function(event) {
        event.preventDefault();

        $(el.tabList).each(function(idx, element) {
          element.classList.remove('is-active');
        });
        event.target.classList.add('is-active');
      }
    };

    var bind = function() {
      if (el.tabList) {
        $(el.tabList).each(function(idx, element) {
          $(element).on('click', handler.clickTab);
        });
      }
    };
    
    var unbind = function() {
      if (el.tabList) {
        $(el.tabList).each(function(idx, element) {
          $(element).off('click', handler.clickTab);
        });
      }
    };

    var setProperty = function() {
      el.tabList = el.tabWrap.querySelectorAll(selector.tabBtn);
    };

    /**
   * @function init
   * @memberof tabDefault
   * @description tabDefault 인스턴스 생성
   */  
    this.init = function() {
      setProperty();

      bind();
    };

    /**
   * @function reInit
   * @memberof tabDefault
   * @description 재생성
   */  
    this.reInit = function() {
      unbind();

      setProperty();

      bind();
    };
    
    this.init();
  }

  window.mvJs.pn.tabDefault = {
    /**
   * @function init
   * @memberof tabDefault
   * @description tabDefault 인터페이스 모음
   */  
    init: function(selector) {
      $(selector).each(function(idx, el) {
        var $el = $(el);
        var obj = $el.data('tabDefault');

        if (obj) {
          obj.reInit(); 
        } else {
          obj = new TabDefault(el);

          $el.data('tabDefault', obj);
        }        
      });
    }
  };
})(window, window.jQuery);