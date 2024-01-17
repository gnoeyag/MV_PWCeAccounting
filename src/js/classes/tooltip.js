(function(window, $) {
  
  var pn = window.mvJs.pn;

  /**
   * Create a Tooltip
   * @class Tooltip
   * @param {Element} target - 생성 타겟
   * @description 툴팁 오픈 클래스 추가 및 닫기번트 접근성 코드 추가
   */  
  function Tooltip(target) {
    var el = {
      target: $(target),
      btn: null,
      text: null
    };

    var selector = {
      btn: '.tooltip-btn',
      closeBtn: '.tooltip-close',
      text: '.tooltip-txt'
    };

    var handler = {
      /**
       * @callback btnClick
       * @memberof Tooltip
       * @description 오픈 콜백 함수
       */
      btnClick: function(e) {
        e.preventDefault();

        el.target.toggleClass('is-active');
      },

      /**
       * @callback closeClick
       * @memberof Tooltip
       * @description 오픈 콜백 함수
       */
      closeClick: function(e) {
        e.preventDefault();

        el.target.removeClass('is-active');
      }
    };

    var method = {
      /**
       * @callback setAria
       * @memberof Tooltip
       * @description 접근성 추가
       */
      setAria: function() {
        el.btn.attr('aria-describedby', el.text.attr('id'));
      }
    };

    var bind = function() {
      el.btn.on('click', handler.btnClick);

      if (el.closeBtn.length) {
        el.closeBtn.on('click', handler.closeClick);
      }
    };

    var unbind = function() {
    };

    var setProperty = function() {
      el.btn = el.target.find(selector.btn);

      el.closeBtn = el.target.find(selector.closeBtn);

      el.text = el.target.find(selector.text);
    };
    

    /**
   * @function init
   * @memberof Tooltip
   * @description 툴팁 인스턴스 생성
   */  
    this.init = function() {
      setProperty();

      method.setAria();

      bind();
    };

    /**
   * @function reInit
   * @memberof Tooltip
   * @description 재생성
   */  
    this.reInit = function() {
      unbind();

      setProperty();

      method.setAria();

      bind();
    };
    
    this.init();
  }

  var tooltipController = {
    init: function(selector) {
      $(selector).each(function(idx, el) {
        var $el = $(el);
        var obj = $el.data('tooltip');

        if (obj) {
          obj.reInit(); 
        } else {
          obj = new Tooltip(el);

          $el.data('popup', obj);
        }
      });
    }
  };

  pn.tooltip = {};
  
  /**
   * @alias pn.tooltip
   * @memberof pn
   * @description 툴팁 생성
   */  
  pn.tooltip.init = tooltipController.init;
})(window, window.jQuery);