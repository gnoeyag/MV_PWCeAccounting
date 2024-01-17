(function($) { 
  $.fn.insertAtIndex = function(index, selector) {
    var opts = $.extend({
      index: 0,
      selector: '<div/>'
    }, {
      index: index, 
      selector: selector
    });
    
    return this.each(function() {
      var p = $(this);  
      var i = $.isNumeric(opts.index) ? parseInt(opts.index) : 0;
      if (i <= 0) {
        p.prepend(opts.selector);
      } else if (i > p.children().length-1) {
        p.append(opts.selector);
      } else {
        p.children().eq(i).before(opts.selector);
      }
    });
  };  
})(window.jQuery);

/**
  * @global
  * @namespace mvJs
  * @description ui 스크립트에서 사용할 글로벌 변수
  */
window.mvJs = {
  /**
   * @namespace pn
   * @alias mvJs.pn
   * @memberof mvJs
   * @description js내부 모듈
   */   
  pn: {
    /**
     * @alias utils
     * @memberof pn
     * @description 유틸 함수
    */
    utils : {
      /**
        * @function scrollControl
        * @memberof utils
        * @param {Boolean} value - true: 스크롤 활성화, false: 스크롤 비활성화
        * @description 스크롤 제어 관련 오브젝트
      */  
      scrollControl: function(value) {
        var body = document.body;
        var pos = 0;
        
        if (value) {
          if (body.querySelector('section.action-sheet') !== null) {
            if (!body.querySelector('section.action-sheet').classList.contains('is-active')) {
              pos = parseInt(body.style.top);

              body.style.overflow = '';
              body.style.height = '';
              body.style.width = '';
              body.style.top = '';

              window.scrollTo({
                left: 0,
                top: -pos,
                behavior: 'instant'
              });
            }
          } else {
            pos = parseInt(body.style.top);

            body.style.overflow = '';
            body.style.height = '';
            body.style.width = '';
            body.style.top = '';

            window.scrollTo({
              left: 0,
              top: -pos,
              behavior: 'instant'
            });
          } 
        } else {
          var scrollTop = window.scrollY;

          body.style.overflow = 'hidden';
          body.style.height = '100%';
          body.style.width = '100%';
          body.style.top = `${-scrollTop}px`;
        }
      },
      /**
       * @function isPc
       * @memberof utils
       * @param {Boolean} value - true: 스크롤 활성화, false: 스크롤 비활성화
       * @description 스크롤 제어 관련 오브젝트
      */  
      isPc: function() {    
        var value = false;
        var moSize = 767;
        if (moSize < window.innerWidth) {
          value = true;
        }
        return value;
      },
      /**
       * @function isMobile
       * @memberof utils
       * @param {Boolean} value - true: Mobile, false: PC
       * @description 화면 사이즈가 아닌 device 체크
      */  
      isMobile: function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      }
    }
  },
  /**
   * @namespace fn
   * @alias mvJs.fn
   * @memberof mvJs 
   * @description 외부 오픈 모듈
   */  
  fn: {
    /**
   * @namespace common
   * @alias mvJs.fn
   * @memberof fn
   * @description 외부 오픈 모듈
   */ 
    common: {
      /**
      * @function loadingControl
      * @memberof common
      * @param {Boolean} value - true: 로딩 화면 활성화, false: 로딩 화면 비활성화
      * @description 로딩 화면 제어 관련 오브젝트
      */  
      loadingControl: function(value) {
        var body = document.body;

        if (value) {
          var scrollTop = window.scrollY;
          body.style.overflow = 'hidden';
          body.style.height = '100%';
          body.style.width = '100%';
          body.style.top = `${-scrollTop}px`;
        } else {
          if (body.querySelectorAll('section[aria-hidden=false]').length === 0) {
            var pos = parseInt(body.style.top);
            body.style.overflow = '';
            body.style.height = '';
            body.style.width = '';
            body.style.top = '';
  
            window.scrollTo({
              left: 0,
              top: -pos,
              behavior: 'instant'
            });
          }
        }
      }
    }
  }
};
