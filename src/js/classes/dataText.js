(function(window, $) {
  /**
   * Create a DataText
   * @class DataText
   * @param {Element} target - 생성 타겟
   * @description data-text 속성(property) 이 있는 경우엔 해당 엘리먼트에 텍스트 영역에 문구 추가
   */  
  function DataText(target) {
    var el = {
      target: target,
      textContent : null
    };

    var bind = function() {};
    var unbind = function() {};

    var obj = JSON.parse(el.target.dataset.text);
    var textArr = obj.text.split('|');
    var first = parseInt(obj.show);

    var setProperty = function() {
      el.target.textContent = textArr[first - 1];
    };

    /**
     * @function init
     * @memberof DataText
     * @description DataText 인스턴스 생성
   */ 
    this.init = function() {
      setProperty();
      bind();
    };

    /**
     * @function reInit
     * @memberof DataText
     * @description 재생성
   */  
    this.reInit = function() {
      unbind();
      setProperty();
      bind();
    };

    /**
     * @function show
     * @memberof DataText
     * @param {Number} num 넘버
     * @description 파라미터에 따라서 문자배열의 텍스트 변경
   */  
    this.show = function(num) {
      el.target.textContent = textArr[num - 1];
    };

    this.init();
  }

  var dataTextController = {
    init: function(selector) {
      $(selector).each(function(idx, el) {
        var $el = $(el);
        var obj = $el.data('dataText');

        if (obj) {
          obj.reInit(); 
        } else {
          obj = new DataText(el);

          $el.data('dataText', obj);
        }
      });
    }
  };

  /**
   * @alias dataText
   * @memberof pn
   * @param {String} target - 셀렉터
   * @description data-text 속성 사용하기, JS에서 값들을 변경할 것입니다.
   */  
  window.mvJs.pn.dataText = {
    /**
   * @function init
   * @memberof dataText
   * @description dataText 인터페이스 모음
   */  
    init: function(selector) {
      dataTextController.init(selector);
    }
  };
})(window, window.jQuery);