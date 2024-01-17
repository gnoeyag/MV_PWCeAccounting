(function(window, $) {
  /**
   * Create a FloatingFixed
   * @class FloatingFixed
   * @param {Element} target - 생성 타겟
   * @description 스크롤이 시작 되면 fixed element 제어
   */  
  function FloatingFixed(target) {
    var el = {
      target: $(target),
      inner: null,
      floatBtn: null,
      popup: null,
      content: null,
      bottomBtn: null
    };

    var selector = {
      inner: '__inner',
      floatBtn: '.floating-btn',
      popup: '.layer--full',
      content: '.content, .layer-content',
      bottomBtn: '.btn-wrap.btn-wrap--bottom'
    };
    
    var handler = {
      /**
       * @callback toggleClass
       * @memberof FloatingFixed
       * @param {*} event
       * @description 스크롤 시 fixed되는 영역 클래스 추가 및 제거
       */
      toggleClass: function(event) {
        if ($(event.currentTarget).scrollTop() > 0) {
          if (event.currentTarget === document && ($(el.inner).hasClass('header__inner') || $(el.inner).hasClass('fixed-top__inner'))) {
            el.inner.addClass('is-fixed');
            el.target.height(el.inner.innerHeight());
          } else if ($(event.currentTarget).hasClass('popup-wrap') && $(el.inner).hasClass('fixed-top__inner')) {
            el.inner.addClass('is-fixed');
            el.target.height(el.inner.innerHeight());
          }
        } else {
          if (event.currentTarget === document && ($(el.inner).hasClass('header__inner') || $(el.inner).hasClass('fixed-top__inner'))) {
            el.inner.removeClass('is-fixed');
            el.target.css('height', '');
          } else if ($(event.currentTarget).hasClass('popup-wrap') && $(el.inner).hasClass('fixed-top__inner')) {
            el.inner.removeClass('is-fixed');
            el.target.css('height', '');
          }
        }
      },
      /**
       * @callback setFixedHeight
       * @memberof FloatingFixed
       * @description floating button 높이 설정
       */
      setFixedHeight: function() {
        el.floatBtn.each(function(idx, element) {
          $(element).height($(element).find('.floating-btn__inner').innerHeight());
        });

        // el.target.height(el.inner.innerHeight());
      },
      /**
       * @callback bottomBtnToggle
       * @memberof FloatingFixed
       * @param {*} element
       * @description 하단 버튼 element의 상위 content 높이와 디바이스 높이 비교하여 하단 버튼 영역 클래스 추가 및 제거
       */
      bottomBtnToggle: function(element) {
        // .content | .layer-content 영역의 높이가 clientHeight보다 클 경우 .non-fixed 클래스 추가
        // console.log('content/layer-content 높이 : ' + el.content.innerHeight());
        if (element.closest(el.content).innerHeight() > document.documentElement.clientHeight) {
          element.addClass('non-fixed');
        } else {
          element.removeClass('non-fixed');
        }
      }
    };

    var bind = function() {
      handler.setFixedHeight();
      
      if (el.bottomBtn.length > 0) {
        handler.bottomBtnToggle(el.bottomBtn);
      }

      $(document).on('scroll', handler.toggleClass);
      
      if (el.popup.length > 0) {
        $('.popup-wrap').on('scroll', handler.toggleClass);
      }
    };

    var unbind = function() {
      $(document).off('scroll', handler.toggleClass);
      
      if (el.popup.length > 0) {
        $('.popup-wrap').off('scroll', handler.toggleClass);
      }
    };

    var setProperty = function() {
      el.floatBtn = $(document).find(selector.floatBtn);
      el.popup = $(document).find(selector.popup);
      el.content = $(document).find(selector.content);
      el.bottomBtn = el.content.find(selector.bottomBtn);

      var temp = '';

      if ($(el.target).attr('class') !== undefined) {
        temp = $(el.target).attr('class') + selector.inner;
      } else {
        temp = $(el.target).prop('tagName').toLowerCase() + selector.inner;
      }

      el.inner = el.target.find('.' + temp);
    };

    /**
     * @function init
     * @memberof FloatingFixed
     * @description 인스턴스 생성
     */  
    this.init = function() { 
      setProperty();
      bind();
    };

    /**
   * @function reInit
   * @memberof FloatingFixed
   * @description 재생성
   */  
    this.reInit = function() {
      unbind();
      setProperty();
      bind();
    };
    this.init();
  }
  
  /**
   * @alias floatingFixed
   * @memberof pn
   * @param {String} target - 셀렉터
   * @description 생성
   */  
  window.mvJs.pn.floatingFixed = {
  
    /**
    * @function init
    * @memberof floatingFixed
    * @description 인터페이스 모음
    */
   
    init: function(selector) {
      $(selector).each(function(idx, el) {
        var $el = $(el);
        var obj = $el.data('floatingFixed');

        if (obj) {
          obj.reInit(); 
        } else {
          obj = new FloatingFixed(el);

          $el.data('floatingFixed', obj);
        }
      });
    }
  };

  window.mvJs.fn.setFixedHeight = function(el) {
    $(el + ' .fixed-top').height($(el + ' .fixed-top__inner').innerHeight());
  };

  
})(window, window.jQuery); 