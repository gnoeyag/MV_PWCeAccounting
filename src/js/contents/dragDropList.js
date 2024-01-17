(function(window, $) { 
  /**
  * Create a DragDropList
  * @class DragDropList
  * @description .approver-list 클래스가 있는 ui에 적용
  */  
  function DragDropList(target) {
    var el = {
      listWrap : $(target),
      item : null,
      deleteBtn : null
    };
    
    // 생성 테스트
    // $('.approver-list').append('<li class="approver-list__item"><button type="button" class="btn--drag-list" data-idx="11">순서 변경</button><span>박오일</span><button type="button" class="btn--drag-del" data-idx="12">삭제</button></li>')

    var SELL_HEIGHT = '51';

    var selector = {
      item : '.approver-list__item',
      deleteBtn : 'button[class=btn--drag-del]'
    };
    
    var posY = 0;
    var handler = {
      /**
       * @callback drag
       * @memberof DragDropList
       * @param {*} event
       * @description item drag start
       */
      drag: {
        start: function(event) {
          event.preventDefault();
          event.stopImmediatePropagation();

          if (!event.target.classList.contains('btn--drag-del')) {
            var touch = event.touches[0] || event.changedTouches[0];
            var y = touch.pageY;
            posY = y;
    
            event.target.style.zIndex = '10';
    
            event.target.addEventListener('touchmove', handler.drag.ing);
            event.target.addEventListener('touchend', handler.drag.drop);
          }          
        },
        /**
         * @callback ing
         * @memberof DragDropList
         * @param {*} event
         * @description item drag ing
         */
        ing: function(event) {
          if (!event.target.classList.contains('btn--drag-del')) {
            var touch = event.touches[0] || event.changedTouches[0];

            var ty = touch.pageY;
            var y = posY - touch.pageY;
            posY = ty;
    
            event.target.style.top = event.target.offsetTop - y + 'px';
          }
        },
        /**
         * @callback drop
         * @memberof DragDropList
         * @param {*} event
         * @description item drag drop
         */
        drop: function(event) {
          if (!event.target.classList.contains('btn--drag-del')) {
            var touch = event.touches[0] || event.changedTouches[0];
            var y = touch.pageY;

            el.item.each(function(idx, element) {
              var ty = element.offsetTop + el.listWrap.offset().top;

              if (y > ty && y < ty + event.target.offsetHeight && event.target !== element) {
                var nv = $(event.target).index();
                var ov = $(element).index();

                el.listWrap.insertAtIndex(ov, event.target);
                el.listWrap.insertAtIndex(nv, element);

                window.custom();
              }
            });

            event.target.style.top = '';
            event.target.style.zIndex = '';
          }
        }
      },
      events: {
        /**
         * @callback resize
         * @memberof events
         * @description item 추가 및 제거 시 listWrap 높이 재계산
         */
        resize: function() {
          setTimeout(function() {
            el.item.off();
            el.deleteBtn.off();

            el.item = el.listWrap.find(selector.item);
            el.deleteBtn = el.item.find(selector.deleteBtn);

            el.item.on('touchstart', handler.drag.start);
            el.deleteBtn.on('touchend', handler.events.delete);

            el.listWrap.height(el.item.length * SELL_HEIGHT +'px');
          }, 10);
        },
        /**
         * @callback delete
         * @memberof events
         * @description item 제거
         */
        delete: function(evt) {
          // 삭제 버튼 클릭 시 onclick 이벤트 호출
          $(evt.currentTarget).trigger('click');
          
          var target = $(evt.target.closest('.approver-list__item'));

          target.off();
          target.remove();

          window.deleteList(target);
        }
      }
    };

    var bind = function() {
      el.listWrap.on('DOMNodeInserted', handler.events.resize);
      el.listWrap.on('DOMNodeRemoved', handler.events.resize);

      handler.events.resize();
    };
    
    var unbind = function() {
      el.item.off('touchstart', handler.drag.start);
      el.deleteBtn.off('touchend', handler.events.delete);

      el.listWrap.off('DOMNodeInserted', handler.events.resize);
      el.listWrap.off('DOMNodeRemoved', handler.events.resize);
    };

    var setProperty = function() {
      el.item = el.listWrap.find(selector.item);
      el.deleteBtn = el.item.find(selector.deleteBtn);
    };

    /**
   * @function init
   * @memberof dragDropList
   * @description dragDropList 인스턴스 생성
   */  
    this.init = function() {
      setProperty();

      bind();
    };

    /**
   * @function reInit
   * @memberof dragDropList
   * @description 재생성
   */  
    this.reInit = function() {
      unbind();

      setProperty();

      bind();
    };
    
    this.init();
  }

  window.mvJs.pn.dragDropList = {
    /**
   * @function init
   * @memberof dragDropList
   * @description dragDropList 인터페이스 모음
   */  
    init: function(selector) {
      $(selector).each(function(idx, el) {
        var $el = $(el);
        var obj = $el.data('dragDropList');

        if (obj) {
          obj.reInit(); 
        } else {
          obj = new DragDropList(el);

          $el.data('dragDropList', obj);
        }        
      });
    }
  };
})(window, window.jQuery);