(function(window, $) {
  /**
   * Create a SelectBtn
   * @class SelectBtn
   * @description .select-wrap 클래스가 있는 ui에 적용
   */  
  function SelectBtn(target) {
    var el = {
      seletWrap : target,
      selectBtn : null
    };

    var selector = {
      selectBtn: '.btn--sel'
    };

    var handler = {
      /**
       * @callback clickBtn
       * @memberof selectBtn
       * @param {*} event
       * @description 버튼 클릭 시 is-active 클래스 추가 및 제거
       */
      clickBtn: function(event) {
        event.preventDefault();
        
        if ($(event.target).hasClass('is-active') === true) {
          event.target.classList.remove('is-active');
        } else {
          $(el.selectBtn).each(function(idx, element) {
            element.classList.remove('is-active');
          });
          event.target.classList.add('is-active');
        }
      }
    };

    var bind = function() {
      $(el.selectBtn).each(function(idx, element) {
        $(element).on('click', handler.clickBtn);
      });
    };
    
    var unbind = function() {
      $(el.selectBtn).each(function(idx, element) {
        $(element).off('click', handler.clickBtn);
      });
    };

    var setProperty = function() {
      el.selectBtn = el.seletWrap.querySelectorAll(selector.selectBtn);
    };

    /**
   * @function init
   * @memberof selectBtn
   * @description selectBtn 인스턴스 생성
   */  
    this.init = function() {
      setProperty();

      bind();
    };

    /**
   * @function reInit
   * @memberof selectBtn
   * @description 재생성
   */  
    this.reInit = function() {
      unbind();

      setProperty();

      bind();
    };
    
    this.init();
  }

  window.mvJs.pn.selectBtn = {
    /**
   * @function init
   * @memberof selectBtn
   * @description selectBtn 인터페이스 모음
   */  
    init: function(selector) {
      $(selector).each(function(idx, el) {
        var $el = $(el);
        var obj = $el.data('selectBtn');

        if (obj) {
          obj.reInit(); 
        } else {
          obj = new SelectBtn(el);

          $el.data('selectBtn', obj);
        }        
      });
    }
  };
})(window, window.jQuery);