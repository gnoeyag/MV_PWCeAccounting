(function(window, $) {
  // var mvJs = window.mvJs;
  var pn = window.mvJs.pn;

  /**
   * Create a Popup
   * @class Popup
   * @param {Element} target - 생성 타겟
   * @description 팝업을 생성 접근성 및 탭키이동 적용
   */
  function Popup($el) {
    var el = {
      $doc: null,
      popup: $el,
      btnClose: null,
      btnSelect: null,
      focus: null,
      request: null,
      dimmed: null
    };

    this.state = Popup.STATE_CLOSE;

    var selector = {
      btnClose: '.popup-close',
      btnSelect: '.select-item',
      btnConfirm: '.popup-btn > .btn',
      layerPopWrap: '.popup-wrap',
      focus     : 'a, input, button, [tabindex]',
      dimmed     : '.dimmed'
    };

    // var self = this;

    var setProperty = function() {
      el.$doc = $(document);
      el.btnClose = el.popup.find(selector.btnClose);

      el.btnSelect = el.popup.find(selector.btnSelect);

      el.btnConfirm = el.popup.find(selector.btnConfirm);

      el.layerPopWrap = el.popup.find(selector.layerPopWrap);
      el.layerPopWrap.attr('tabindex', 0);

      el.focus = el.popup.find(selector.focus);
      
      el.focus.each(function(idx, el) {
        el.setAttribute('data-idx', idx);
      });

      el.first = el.focus.eq(1);

      el.dimmed = el.$doc.find(selector.dimmed);
    };

    var handler = {
      btnClose: function(event) {
        // self.close();
        var id = event.currentTarget.closest('section').getAttribute('id');
        popupController.close('#'+id);
      },
      // 팝업 닫기 확인용
      // btnSelect: function(event) {
      //   var id = event.currentTarget.closest('section').getAttribute('id');
      //   mvJs.fn.popup.close('#'+id);
      // },
      keydown: function(evt) {
        if (evt.keyCode !== 9) {
          return;
        }

        var idx = parseInt(document.activeElement.getAttribute('data-idx'));

        if (evt.shiftKey) {
          idx -= 1;
          if (idx < 0) {
            idx = el.focus.length -1;
          }

        } else {
          idx += 1;

          if (idx >= el.focus.length) {
            idx = 0;
          }
        }

        el.focus.eq(idx).focus();

        evt.preventDefault();
      },
      dimmedShow: function() {
        el.dimmed.show().stop().animate({ opacity: 1 }, 300);
      },
      dimmedHide: function() {
        el.dimmed.stop().animate({ opacity: 0 }, 300, function() {
          $(this).hide();
        });
      },
      motionOpen:function(target) {
        target.stop().animate({ bottom: '0%' }, 300);
      },
      motionClose:function(target) {
        target.stop().animate({ bottom: '-100%' }, 300);
      }
    };

    var bind = function() {
      if (el.btnClose) {
        el.btnClose.on('click', handler.btnClose);
      }

      // 팝업 닫기 확인용
      // if (el.btnSelect) {
      //   el.btnSelect.on('click', handler.btnSelect);
      // }
    };

    /**
     * @function open
     * @memberof Popup
     * @description current 팝업 오픈
     */
    this.open = function() {
      if (this.state === Popup.STATE_OPEN) {
        return;
      }

      //popup type 구분
      //bottom popup
      if (el.popup.attr('class').includes('layer--bottom') === true) {
        el.popup.find('.popup-wrap').css('bottom', '-100%');
        handler.dimmedShow();
        handler.motionOpen(el.popup.find('.popup-wrap'));
      }

      el.request = document.activeElement;

      this.state = Popup.STATE_OPEN;

      el.popup.attr('aria-hidden', false);

      el.layerPopWrap.focus();

      el.$doc.on('keydown', handler.keydown);
    };

    /**
     * @function close
     * @memberof Popup
     * @description 팝업 object 닫기
     */
    this.close = function() {
      if (this.state === Popup.STATE_CLOSE) {
        return;
      }

      //popup type 구분
      //full popup
      if (el.popup.attr('class').includes('layer--full') === true) {
        el.popup.attr('aria-hidden', true);

      //bottom popup
      } else if (el.popup.attr('class').includes('layer--bottom') === true) {
        handler.dimmedHide(el.popup);
        handler.motionClose(el.popup.find('.popup-wrap'));

        el.popup.attr('aria-hidden', true);
        setTimeout(function() {
        }, 300);

      //alert popup
      } else if (el.popup.attr('class').includes('layer--alert') === true) {
        el.popup.attr('aria-hidden', true);
      }

      this.state = Popup.STATE_CLOSE;

      el.$doc.off('keydown', handler.keydown);

      el.request.focus();

      el.request = null;
    };

    var init = function() {
      setProperty();
      bind();
    };

    init();
  }

  Popup.STATE_CLOSE = 'close';
  Popup.STATE_OPEN = 'open';

  function Controller(target) {
    /**
     * @class Controller
     * @memberof Popup
     * @param {Element} 콘트롤 바인딩 지점
     * @description button, anchor등 팝업을 제어 할수 있는 요소에 대한 이벤트 바인딩
     */
    var el = {
      btn: $(target)
    };

    var setProperty = function() {};

    var handler = {
      /**
       * @callback btnClick
       * @memberof popupController
       * @description data target id 잡기
       */
      btnClick: function(event) {
        var id = event.currentTarget.getAttribute('data-popup-id');
        popupController.open('#'+id);
      }
    };

    // bind
    var bind = function() {
      el.btn.on('click', handler.btnClick);
    };

    /**
     * @function init
     * @memberof PopupContent
     * @description 펍업 컨트롤 인스턴스 생성
     */
    this.init = function() {
      setProperty();
      bind();
    };

    //init
    this.init();
  }

  var popupController = {
    open : function(selector) {
      var $el = $(selector);

      if (!$el.length) {
        return;
      }

      var obj = $el.data('popup');
      
      if (!obj) {
        obj = new Popup($el);

        $el.data('popup', obj);
      }

      obj.open();

      pn.utils.scrollControl(false);
      
      pn.floatingFixed.init('header, .fixed-top');
      // pn.heightSize.init('.selector-panel');
      pn.infiniteScroll.init('[data-infinitescroll]');
    },
    close : function(selector) {
      var $el = $(selector);

      if (!$el.length) {
        return;
      }

      var obj = $el.data('popup');
      if (!obj) {
        obj = new Popup($el);

        $el.data('popup', obj);
      }

      obj.close();

      setTimeout(function() {
        if (document.body.querySelectorAll('section[aria-hidden=false]').length === 0) {
          pn.utils.scrollControl(true);
        }
      }, 300);
    }
  };

  window.mvJs.pn.popup = {
    controller: function(selector) { 
      $(selector).each(function(idx, el) {
        new Controller(el);
      });
    }   
  };

  /**
   * @namespace popup
   * @alias fn.popup
   * @memberof fn
   * @param {String} target - 셀렉터
   * @description popup control
   */
  window.mvJs.fn.popup = {
    /**
     * @function open
     * @memberof popup
     * @description popup open
     */
    open: function(selector) {
      popupController.open(selector);
    },
    
    /**
     * @function close
     * @memberof popup
     * @description popup close
     */
    close: function(selector) {
      popupController.close(selector);
    }
  };
})(window, window.jQuery);
