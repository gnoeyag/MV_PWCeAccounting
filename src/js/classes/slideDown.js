(function(window, $) {
  /**
   * Create a SlideDown
   * @class SlideDown
   * @param {Element} target - 생성 타겟
   * @description SlideDown 오픈 클래스 추가 및 오픈/닫기 바인드 접근성 코드 추가
   */  
  function SlideDown(target) {
    var el = {
      target:target,
      slidedownBtn:'',
      content:''
    };

    var selector = {
      slidedownBtn:'.slideDown-btn',
      content: '.slideDown-cont'
    };

    var options = {
      animation: true,
      animationSpeed: 400
    };

    options = $.extend(options, $(el.target).data('options'));
    var animationSpeed = options.animationSpeed;
    var dataText = null;

    var slideDownOption = {
      duration: animationSpeed,
      easing: 'swing'
    };

    if (String(options.animation) !== 'true') {
      slideDownOption.duration= 0;
    }

    var setProperty = function() {
      el.slidedownBtn = el.target.querySelector(selector.slidedownBtn);
      dataText = $(el.slidedownBtn.querySelector('[data-text]')).data('dataText');
      el.content = $(el.target.querySelector(selector.content));

      if (method.check()) {
        el.slidedownBtn.setAttribute('aria-expanded', true);
        el.content.attr('aria-hidden', false);

      } else {
        el.slidedownBtn.setAttribute('aria-expanded', false);
        el.content.attr('aria-hidden', true);
        el.content.hide();
      } 
    };

    var handler = {
      /**
       * @callback click
       * @memberof SlideDown
       * @description SlideDown 오픈 및 닫기 
       */
      button: {
        click: function() {
          if (method.check()) {
            method.close();
          } else {
            method.open();
          }
        }
      }
    };

    var method = {
      /**
       * @callback open
       * @memberof SlideDown
       * @description slideDown 오픈 
       */
      check() {
        return el.slidedownBtn.getAttribute('aria-expanded') === 'true'? true : false;
      },
      /**
       * @callback open
       * @memberof slideDown
       * @description open slideDown 
       */
      open : function() {
        el.slidedownBtn.setAttribute('aria-expanded', true);

        el.content.stop().slideDown(slideDownOption);

        el.content.attr('aria-hidden', false);

        if (dataText) {
          dataText.show(1);
        }
      },

      /**
       * @callback close
       * @memberof slideDown
       * @description close slideDown 
       */
      close: function() {
        el.slidedownBtn.setAttribute('aria-expanded', false);

        el.content.stop().slideUp(slideDownOption);

        el.content.attr('aria-hidden', true);

        if (dataText) {
          dataText.show(2);
        }
      }
    };

    var bind = function() {
      $(el.slidedownBtn).on('click', handler.button.click);
    };

    var unbind = function() {
      $(el.slidedownBtn).off();
    };

    /**
     * @function init
     * @memberof slideDown
     * @description  slideDown instance 생성
     */  
    this.init = function() {
      setProperty();

      bind();
    };

    /**
     * @function reInit
     * @memberof slideDown
     * @description 재생성
     */
    this.reInit = function() {
      unbind();

      setProperty();

      bind();
    };
    
    this.init();
  }

  var slideDownController = {
    init: function(selector) {
      $(selector).each(function(idx, el) {
        var $el = $(el);
        var obj = $el.data('slidedown');

        if (obj) {
          obj.reInit();
        } else {
          obj = new SlideDown(el);

          $el.data('slidedown', obj);
        }
      });
    }
  };

  /**
   * @alias pn.slideDown
   * @memberof pn
   * @param {String} target - selector
   * @description slideDown 생성
   */

  window.mvJs.pn.slideDown = {
  /** 
   * @memberof slideDown
   * @description 재생성
   */  
    init: function(selector) {
      slideDownController.init(selector);
    }
  };

})(window, window.jQuery);