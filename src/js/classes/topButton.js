(function(window, $) {
  /**
   * Create a TopButton
   * @class TopButton
   * @param {Element} target - 생성 타겟
   * @description 스크롤이 시작 되면 탑버튼에 scroll 클래스 추가, document 0이 되면 scroll 클래스 제거
   */  
  function TopButton(target) {
    var el = {
      target: target
    };
    
    var handler = {
      /**
       * @callback toggleClass
       * @memberof TopButton
       * @param {*} e
       * @return {myCallback}
       */
      toggleClass: function(event) {
        if ($(event.currentTarget).scrollTop() > 30) {
          el.target.classList.add('scroll');
        } else {
          el.target.classList.remove('scroll');
        }
      },
      scrollTop: function() {
        $('html, body').animate({ scrollTop: 0 }, 300);
      }
    };

    var bind = function() {
      $(document).on('scroll', handler.toggleClass);
      $(el.target).on('click', handler.scrollTop);
    };

    var unbind = function() {
      $(document).off('scroll', handler.toggleClass);
      $(el.target).off('click', handler.scrollTop);
    };

    var setProperty = function() {};

    /**
     * @function init
     * @memberof TopButton
     * @description 상단 이동 스크롤 버튼 인스턴스 생성
     */  
    this.init = function() {
      setProperty();
      bind();
    };

    /**
   * @function reInit
   * @memberof TopButton
   * @description 상단 이동 스크롤 버튼 재생성
   */  
    this.reInit = function() {
      unbind();
      setProperty();
      bind();
    };
    this.init();
  }
  
  /**
   * @alias topButton
   * @memberof pn
   * @param {String} target - 셀렉터
   * @description 상단 이동 스크롤 버튼 생성
   */  
  window.mvJs.pn.topButton = {
  
    /**
    * @function init
    * @memberof topButton
    * @description 상단 이동 스크롤 버튼 인터페이스 모음
    */
   
    init: function(selector) {
      $(selector).each(function(idx, el) {
        var $el = $(el);
        var obj = $el.data('topButton');

        if (obj) {
          obj.reInit(); 
        } else {
          obj = new TopButton(el);

          $el.data('topButton', obj);
        }
      });
    }
  };
  
})(window, window.jQuery); 