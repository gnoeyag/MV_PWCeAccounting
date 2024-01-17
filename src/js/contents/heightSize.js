(function(window, $) {
  /**
   * Create a HeightSize
   * @class HeightSize
   * @param {Element} target - 생성 타겟
   * @description 높이 조절이 필요한 element height 제어
   */
  function HeightSize(target) {
    var el = {
      target: $(target),
      popup: null,
      content: null,
      bottomBtn: null,
      listCard: null,
      cardItem: null,
      radioSelector: null
    };

    var selector = {
      popup: '#carbonTrafficPop',
      content: '.content, .layer-content',
      bottomBtn: '.btn-wrap.btn-wrap--bottom',
      listCard: '.list-type--card',
      cardItem : '.card-item',
      radioSelector : '.radio-selector--wrap'
    };
    
    var handler = {
      /**
       * @callback bottomBtnToggle
       * @memberof HeightSize
       * @param {*} element
       * @description 하단 버튼 element의 상위 content 높이와 디바이스 높이 비교하여 하단 버튼 영역 클래스 추가 및 제거
       */
      bottomBtnToggle: function(element) {
        // .content | .layer-content 영역의 높이가 clientHeight보다 클 경우 .non-fixed 클래스 추가
        // console.log('content/layer-content 높이 : ' + el.content.innerHeight());
        // console.log('device 높이 : ' + document.documentElement.clientHeight);
        if (element.closest(el.content).innerHeight() > document.documentElement.clientHeight) {
          element.addClass('non-fixed');
        } else {
          element.removeClass('non-fixed');
        }
      },      
      /**
      * @callback resize
      * @memberof HeightSize
      * @description listCard 영역 item 추가 및 제거 시 높이 재계산
      */
      resize: function() {
        setTimeout(function() {
          handler.bottomBtnToggle(el.bottomBtn);
        }, 10);
      }
    };

    var bind = function() {
      el.listCard.on('DOMNodeInserted', handler.resize);
      el.listCard.on('DOMNodeRemoved', handler.resize);

      el.radioSelector.on('click', handler.resize);
    };

    var unbind = function() {
      el.listCard.off('DOMNodeInserted', handler.resize);
      el.listCard.off('DOMNodeRemoved', handler.resize);
      
      el.radioSelector.off('click', handler.resize);
    };

    var setProperty = function() {
      el.popup = el.target.closest(selector.popup);
      el.radioSelector = el.popup.find(selector.radioSelector).find('li span input');
      el.content = el.popup.find(selector.content);
      el.bottomBtn = el.content.find(selector.bottomBtn);
      el.listCard = el.target.find(selector.listCard);
      el.cardItem = el.listCard.find(selector.cardItem);
    };

    /**
     * @function init
     * @memberof HeightSize
     * @description 인스턴스 생성
     */  
    this.init = function() { 
      setProperty();
      bind();
    };

    /**
   * @function reInit
   * @memberof HeightSize
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
   * @alias heightSize
   * @memberof pn
   * @param {String} target - 셀렉터
   * @description 생성
   */  
  window.mvJs.pn.heightSize = {
  
    /**
    * @function init
    * @memberof heightSize
    * @description 인터페이스 모음
    */
   
    init: function(selector) {
      $(selector).each(function(idx, el) {
        var $el = $(el);
        var obj = $el.data('heightSize');

        if (obj) {
          obj.reInit(); 
        } else {
          obj = new HeightSize(el);

          $el.data('heightSize', obj);
        }
      });
    }
  };
  
})(window, window.jQuery); 