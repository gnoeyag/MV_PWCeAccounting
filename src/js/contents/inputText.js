(function(window, $) {
  var pn = window.mvJs.pn;

  /**
   * Create a InputText
   * @class InputText
   * @param {Element} target - 생성 타겟
   * @description .input-text 클래스가 있는 ui에 적용
   */  
  function InputText(target) {
    var el = {
      target: $(target),
      textField: null,
      multiField: null,
      deleteBtn: null,
      inputField: null
    };

    var selector = {
      textField: '.text-field-wrap',
      multiField: '.multi-field',
      deleteBtn: '.btn--del',
      inputField: '.field-adddel'
    };

    var handler = {
      /**
       * @callback focusIn
       * @memberof InputText
       * @description input focus시
       */
      focusIn: function() {
        $(el.target).addClass('focus');

        if (el.target.val().length > 0) {
          handler.addClass(el.target);
          $(el.deleteBtn).show();
        }
      },
      /**
       * @callback focusOut
       * @memberof InputText
       * @description input focus 해제 시
       */
      focusOut: function() {
        $(el.target).removeClass('focus');
        handler.removeClass(el.target);
        $(el.deleteBtn).hide();
      },
      /**
       * @callback checkVal
       * @memberof InputText
       * @description input value 확인 후 클래스 추가·제거 및 delete 버튼 보임·숨김 처리 
       */
      checkVal: function() {
        if (el.target.val().length > 0) {
          handler.addClass(el.target);
          $(el.deleteBtn).show();
        } else {
          handler.removeClass(el.target);
          $(el.deleteBtn).hide();
        }
      },
      /**
       * @callback clickDel
       * @memberof InputText
       * @description delete 버튼 클릭 시 input value 삭제
       */
      clickDel: function() {
        $(el.deleteBtn).trigger('click');
        el.target.val('');
        $(el.deleteBtn).hide();
      },
      /**
       * @callback moveFocus
       * @memberof InputText
       * @description .multi-field 클래스의 input value 길이가 maxlength 값이 될 경우 다음 input으로 focus 이동
       */
      moveFocus: function(target) {
        if ($(target.currentTarget).val().length >= $(target.currentTarget).attr('maxlength')) {
          $(el.textField).next().find('input').focus();
        }
      },
      /**
       * @callback addClass
       * @memberof InputText
       * @param {*} target
       * @description .is-actie 클래스 추가
       */
      addClass: function(target) {
        $(target).addClass('is-active');
      },
      /**
       * @callback removeClass
       * @memberof InputText
       * @param {*} target
       * @description .is-actie 클래스 제거
       */
      removeClass: function(target) {
        $(target).removeClass('is-active');
      },
      /**
       * @callback resize
       * @memberof InputText
       * @description 새로 추가된 input의 focus, delete 버튼 기능 적용 위해 다시 호출
       */
      resize: function() {
        pn.inputText.init('.input-text');
      }
    };

    var bind = function() {
      //2023.12.07
      //캘린더 input의 표기되는 값 형식 변경 테스트
      // if (el.target.hasClass('calendar')) {
      //   el.target.on('input', function(e) {
      //     var temp = e.target.value.replace(/\D/g, "");
          
      //     $(e.target).attr('data-show-txt', temp.substring(0,4) + "-" + temp.substring(4,6) + "-" + temp.substring(6,8));
      //   });
      // }

      el.target.on('focus', handler.focusIn);
      el.target.on('blur', handler.focusOut);
      el.target.on('keypress', handler.addClass);
      el.target.on('input', handler.checkVal);

      el.deleteBtn.on('mousedown', handler.clickDel);

      el.multiField.on('keyup', handler.moveFocus);
      
      el.inputField.on('DOMNodeInserted', handler.resize);
      el.inputField.on('DOMNodeRemoved', handler.resize);
    };
    
    var unbind = function() {
      el.target.off('focus', handler.focusIn);
      el.target.off('blur', handler.focusOut);
      el.target.off('keypress', handler.addClass);
      el.target.off('input', handler.checkVal);
      
      el.deleteBtn.off('mousedown', handler.clickDel);

      el.multiField.off('keyup', handler.moveFocus);

      el.inputField.off('DOMNodeInserted', handler.resize);
      el.inputField.off('DOMNodeRemoved', handler.resize);
    };

    var setProperty = function() {
      el.textField = el.target.closest(selector.textField);
      el.multiField = el.textField.find('input');
      el.deleteBtn = el.textField.find(selector.deleteBtn);
      el.inputField = el.textField.closest(selector.inputField);
    };

    /**
   * @function init
   * @memberof InputText
   * @description InputText 인스턴스 생성
   */  
    this.init = function() {
      setProperty();

      bind();
    };

    /**
   * @function reInit
   * @memberof InputText
   * @description 재생성
   */  
    this.reInit = function() {
      unbind();

      setProperty();

      bind();
    };
    
    this.init();
  }


  window.mvJs.pn.inputText = {
    /**
   * @function init
   * @memberof inputText
   * @description inputText 인터페이스 모음
   */  
    init: function(selector) {
      $(selector).each(function(idx, el) {
        var $el = $(el);
        var obj = $el.data('inputText');

        if (obj) {
          obj.reInit(); 
        } else {
          obj = new InputText(el);

          $el.data('inputText', obj);
        }        
      });
    }
  };

})(window, window.jQuery);