(function(window, $) {
  /**
   * Create a ScrollMenu
   * @class ScrollMenu
   * @param {Element} target - 생성 타겟
   * @description 마우스로 드래그해서 스크롤을 할 수 있는 메뉴
   */  
  function ScrollMenu(target) {
    var el = {
      target: target,
      linkParentUl: null,
      linkAnchor : null
    };

    var selector = {
      linkAnchor: '.scroll-menu > ul > li > a',
      linkParentUl: '.scroll-menu > ul'
    };

    var position = {
      startX: 0,
      walk:0,
      scrollLeft: 0,
      mouseDown: false
    };

    var handler = {
      /**
       * @callback clickAnchor
       * @memberof ScrollMenu
       * @param {*} e
       * @return {myCallback} menu-item 클릭 시 해당 menu-item에 is-active class 추가
       */
      clickAnchor: function(event) {
        event.preventDefault();
        method.move(event.target);
      },
      // 해당 ul element에서 마우스 버튼을 눌렀을 때 발생합니다.
      mouseDown: function(event) {
        event.preventDefault();
        position = {
          mouseDown : true,
          // 전체 문서를 기준으로 current mouse X position을 표시합니다. clientX과 같습니다.
          startX : event.pageX - event.currentTarget.offsetLeft,
          // 셀렉터에 해당하는 요소의 가로스크롤 값을 지정합니다.
          scrollLeft : event.currentTarget.scrollLeft,
          // 마우스의 움직임을 지정합니다.
          walk : 0
        };
        // element에서 href="#"을 사용하면 페이지가 상단으로 이동하는 문제가 발생합니다. 해결 방법이에요.
        if (event.target.tagName === 'A') {
          event.target.setAttribute('href', 'javascript:;');
        }
      },
      //해당 ul element에서 마우스를 움직였을 때 발생합니다.
      mouseMove: function(event) {
        if (position.mouseDown) {
          var newPageX = event.pageX - event.currentTarget.offsetLeft;
          // 마우스가 얼마나 움직였는지 계산합니다.
          position.walk = newPageX - position.startX;
          // 셀렉터의 가로스크롤 값을 계산하여 다시 지정하기
          event.currentTarget.scrollLeft = position.scrollLeft - position.walk;
        }
      },
      // 해당 ul element에서 눌렀던 마우스 버튼을 떼었을 때 발생합니다.
      mouseUp: function(event) {
        position.mouseDown = false;
        // element가 a 태그, 마우스의 움직음 없을땐 click handler 호출합니다.
        if (event.target.tagName === 'A' && position.walk === 0) {
          handler.clickAnchor(event);
        }
      }
    };

    var method = {
      move: function(target) {
        var active = el.target.querySelector('li.is-active');
        if (active) {
          active.classList.remove('is-active');
        }

        var li = target.parentElement;
        li.classList.add('is-active');

        var middle = window.innerWidth / 3;

        var targetEl = el.target;

        if (middle > li.offsetLeft + target.scrollLeft) {
          middle = li.offsetLeft;
        }
        $(targetEl.querySelector('ul')).animate({scrollLeft: li.offsetLeft - middle}, 400, $.easing.swing);
      },
      moveActive: function() {
        var active = el.target.querySelector('li.is-active');
        if (active) {
          var middle = window.innerWidth / 3;
          var targetEl = el.target;
  
          if (middle > active.offsetLeft) {
            middle = active.offsetLeft;
          }
          $(targetEl.querySelector('ul')).animate({scrollLeft: active.offsetLeft - middle}, 400, $.easing.swing);
        }
      }
    };

    var bind = function() {
      $(el.linkParentUl).on('mousedown', handler.mouseDown);
      $(el.linkParentUl).on('mousemove', handler.mouseMove);
      $(el.linkParentUl).on('mouseup', handler.mouseUp);
    };

    var unbind = function() {
      $(el.linkParentUl).off('mousedown', handler.mouseDown);
      $(el.linkParentUl).off('mousemove', handler.mouseMove);
      $(el.linkParentUl).off('mouseup', handler.mouseUp);
    };

    var setProperty = function() {
      el.linkAnchor = el.target.querySelectorAll(selector.linkAnchor);
      el.linkParentUl = el.target.querySelector(selector.linkParentUl);
    };

    /**
   * @function init
   * @memberof ScrollMenu
   * @description ScrollMenu 인스턴스 생성
   */  
    this.init = function() {
      setProperty();
      bind();
      method.moveActive();
    };

    /**
   * @function reInit
   * @memberof ScrollMenu
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
   * @alias scrollMenu
   * @memberof pn
   * @param {String} target - 셀렉터
   * @description ScrollMenu 생성
   */  
  window.mvJs.pn.scrollMenu = {
    /**
   * @function init
   * @memberof scrollMenu
   * @description scrollMenu 인터페이스 모음
   */  
    init: function(selector) {
      $(selector).each(function(idx, el) {
        var $el = $(el);
        var obj = $el.data('scrollMenu');

        if (obj) {
          obj.reInit(); 
        } else {
          obj = new ScrollMenu(el);

          $el.data('scrollMenu', obj);
        }        
      });
    }
  };
})(window, window.jQuery);