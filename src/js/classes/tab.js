(function(window, $) {
  /**
   * Create a Tab
   * @class Tab
   * @param {Element} target - 생성 타겟
   * @description .js-tab 클래스가 있는 ui에 적용
   */  
  function Tab(target) {
    var el = {
      tabWrap: target,
      tabPanelList : null,
      tabList : null
    };

    var selector = {
      tabPanel : 'div[role=tabpanel]',
      tabBtn: 'div[role=tablist] > button[role=tab]',
      tabUL : 'ul[role=tablist] > li[role=presentation] > button[role=tab]'
    };

    var handler = {
      /**
       * @callback clickTab
       * @memberof Tab
       * @param {*} e
       * @description Tab클릭 시 해당 aria-selected="true"로 변경 및 role="tabpanel"은 aria-hidden="false"로 변경
       */
      clickTab: function(event) {
        event.preventDefault();

        $(el.tabList).each(function(idx, element) {
          element.setAttribute('aria-selected', 'false');
          if (element.parentElement.tagName === 'LI') {
            element.parentElement.classList.remove('is-active');
          } else {
            element.classList.remove('is-active');
          }
        });
        //.js-tab 에서 활성화 된 role="tab" 항목은 aria-selected="true"로 변경
        event.target.setAttribute('aria-selected', 'true');
        if (event.target.parentElement.tagName === 'LI') {
          event.target.parentElement.classList.add('is-active');
        } else {
          event.target.classList.add('is-active');
        }

        $(el.tabPanelList).each(function(idx, element) {
          element.setAttribute('aria-hidden', 'true');
        });
        //.js-tab 에서 활성화 된 role="tabpanel"은 aria-hidden="false"로 변경
        const panelId = event.target.getAttribute('aria-controls');
        document.querySelector('#' + panelId).setAttribute('aria-hidden', 'false');
      }
    };

    var bind = function() {
      if (el.tabList) {
        $(el.tabList).each(function(idx, element) {
          $(element).on('click', handler.clickTab);
        });
      }
    };

    var unbind = function() {
      if (el.tabList) {
        $(el.tabList).each(function(idx, element) {
          $(element).off('click', handler.clickTab);
        });
      }
    };

    var setProperty = function() {
      el.tabPanelList = el.tabWrap.querySelectorAll(selector.tabPanel);
      if (el.tabWrap.firstElementChild.tagName === 'UL') {
        //ul > li 구조로 사용 할 경우
        el.tabList = el.tabWrap.querySelectorAll(selector.tabUL);
      } else {
        //div > button 구조로 사용 할 경우
        el.tabList = el.tabWrap.querySelectorAll(selector.tabBtn);
      }
    };

    /**
   * @function init
   * @memberof Tab
   * @description Tab 인스턴스 생성
   */  
    this.init = function() {
      setProperty();
      bind();
    };

    /**
   * @function reInit
   * @memberof Tab
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
   * @alias tab
   * @memberof pn
   * @param {String} target - 셀렉터
   * @description Tab 생성
   */  
  window.mvJs.pn.tab = {
    /**
   * @function init
   * @memberof tab
   * @description tab 인터페이스 모음
   */  
    init: function(selector) {
      $(selector).each(function(idx, el) {
        var $el = $(el);
        var obj = $el.data('tab');

        if (obj) {
          obj.reInit(); 
        } else {
          obj = new Tab(el);

          $el.data('tab', obj);
        }        
      });
    }
  };
})(window, window.jQuery);