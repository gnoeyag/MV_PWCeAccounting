(function(window, $) {
  /**
   * Create a InfiniteScroll
   * @class InfiniteScroll
   * @param {Element} target - 생성 타겟
   * @description 스크롤이 하단에 내려오면 list가 추가되는 함수 호출
   */  
  function InfiniteScroll(target) {
    var el = {
      target: $(target)
    };

    // var selector = {};

    var newThis = this;

    this.check = true;

    var handler = {
      /**
       * @callback scroll
       * @memberof InfiniteScroll
       * @param {*} event
       * @description 디바이스 하단까지 스크롤된 경우
       */
      scroll: function(event) {
        var isScrollEnd;

        if ($(event.currentTarget).hasClass('popup-wrap')) {
          // popup 페이지 > #selectAttendeesPop, #teamCodePop, #employeeCodePop
          isScrollEnd = $(event.currentTarget).innerHeight() + $(event.currentTarget).scrollTop() + 200 > $(event.currentTarget).prop('scrollHeight');
        } else {
          // 공지사항 페이지 > .board-list
          isScrollEnd = window.innerHeight + window.scrollY + 200 > document.documentElement.scrollHeight;
        }

        if (isScrollEnd && typeof window.addList === 'function') {// && typeof window.addList === 'function'
          if (newThis.check) {
            newThis.check = false;
            window.addList();
          }
        }
      }
    };

    var bind = function() {
      if ($(el.target).attr('id') === 'infiniteScroll') {
        // 공지사항 페이지 > .board-list
        $(document).on('scroll', handler.scroll);
      } else {
        // popup 페이지 > #selectAttendeesPop, #teamCodePop, #employeeCodePop
        $(el.target).find('.popup-wrap').on('scroll', handler.scroll);
      }
    };

    var unbind = function() {
      if ($(el.target).attr('id') === 'infiniteScroll') {
        $(document).off('scroll', handler.scroll);
      } else {
        $(el.target).find('.popup-wrap').off('scroll', handler.scroll);
      }
    };

    var setProperty = function() {};

    /**
     * @function init
     * @memberof InfiniteScroll
     * @description 인스턴스 생성
     */  
    this.init = function() { 
      setProperty();
      bind();
    };

    /**
   * @function reInit
   * @memberof InfiniteScroll
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
   * @alias infiniteScroll
   * @memberof pn
   * @param {String} target - 셀렉터
   * @description 생성
   */  
  window.mvJs.pn.infiniteScroll = {
  
    /**
    * @function init
    * @memberof InfiniteScroll
    * @description 인터페이스 모음
    */
   
    init: function(selector) {
      $(selector).each(function(idx, el) {
        var $el = $(el);
        
        var obj = $el.data('infiniteScroll');

        if (obj) {
          obj.reInit(); 
        } else {
          obj = new InfiniteScroll(el);

          $el.data('infiniteScroll', obj);
        }
      });
    }
  };

  window.mvJs.fn.completedScroll = function(el) {
    $(el).data('infiniteScroll').check = true;
    // console.log(`[해제] 팝업 ${el} this.check 값 : `, $(el).data('infiniteScroll').check);
  };

  window.mvJs.fn.scrollTop = function(el) {
    $(el).scrollTop(0);
  };

})(window, window.jQuery);  