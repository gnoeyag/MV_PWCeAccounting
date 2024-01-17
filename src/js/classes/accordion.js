(function(window, $) {
  /**
   * Create a Accordion
   * @class Accordion
   * @param {Element} target - 생성 타겟
   * @description Accordion 오픈 클래스 추가 및 오픈/닫기 바인드 접근성 코드 추가
   */  
  function Accordion(target) {
    var el = {
      target : target,
      accordion: null,
      dataOptions: null,
      optionId: null,
      openType: null,
      animation: null,
      animationSpeed: null,
      accHeader: null,
      accPanel: null,
      accButton: null
    };

    var selector = {
      dataOptions: 'data-options',
      accHeader: '.accordion-header',
      accPanel: '.accordion-panel',
      accButton: '.accordion-btn'
    };

    var setProperty = function() {
      el.accordion = el.target;

      el.accButton = el.target.querySelectorAll(selector.accButton);

      el.dataOptions = JSON.parse(el.target.getAttribute(selector.dataOptions));

      const id = el.dataOptions.id? el.dataOptions.id : 'accordion';
      el.optionId = id + '_' + Accordion.index;
      
      el.openType = el.dataOptions.openType? el.dataOptions.openType : 'single';
      
      el.animation = el.dataOptions.animation;
      
      el.animationSpeed = el.dataOptions.animationSpeed;
      
      el.accHeader = el.target.querySelectorAll(selector.accHeader);
      el.accPanel = el.target.querySelectorAll(selector.accPanel);

      $(el.accHeader).each(function(idx, singleAccHeader) {
        singleAccHeader.setAttribute('id', el.optionId + '_btn_' + (idx+1));
        el.accPanel[idx].setAttribute('aria-labelledby', singleAccHeader.id);

        // 추가적으로 jqury instance가 생성되는것 같아 데이터를 저장
        singleAccHeader.querySelector('button').dataText = $(singleAccHeader.querySelector('[data-text]')).data('dataText');
      });

      $(el.accPanel).each(function(idx, singleAccPanel) {
        singleAccPanel.setAttribute('id', el.optionId + '_panel_' + (idx+1));
        el.accHeader[idx].querySelector('.accordion-btn').setAttribute('aria-controls', singleAccPanel.id);
      });

      Accordion.index++;
    };

    var handler = {
      /**
       * @callback btnClick
       * @memberof Accordion
       * @description accordian 오픈 및 닫기 
       */
      btnClick: function(e) {
        var btnArrow = e.currentTarget.getAttribute('aria-expanded');
        var elId = e.currentTarget.getAttribute('aria-controls');
        e.preventDefault();
  
        if (el.openType === 'multi') { 
          if (btnArrow === 'true') {
            e.currentTarget.setAttribute('aria-expanded', 'false');

            e.currentTarget.dataText.show(1);

            method.close(elId);
          } else {
            e.currentTarget.setAttribute('aria-expanded', 'true');

            e.currentTarget.dataText.show(2);

            method.open(elId);
          }
        } else if (el.openType ==='single') {
          var accSingleEl = el.target.querySelectorAll('.accordion-item');
          var thisItem = e.currentTarget.parentNode.parentNode;
          $(accSingleEl).each(function(index, element) {
            if (thisItem === element) {
              e.currentTarget.setAttribute('aria-expanded', 'true');
                
              e.currentTarget.dataText.show(2);

              method.open(elId);
              return;
            } else {
              element.querySelector(selector.accButton).setAttribute('aria-expanded', 'false');

              element.querySelector(selector.accButton).dataText.show(1);
            }
              
            var notActiveBtn = element.querySelector(selector.accButton);
            var notActiveElId = notActiveBtn.getAttribute('aria-controls');
            method.close(notActiveElId);
          });
        }
      }
    };

    var method = {
      /**
       * @callback open
       * @memberof Popup
       * @description open accordion 
       */
      open : function(elId) {
        var activePanelElement = el.target.querySelector('#' + elId);
        if (el.animation) {
          $(activePanelElement).slideDown(el.animationSpeed);
        }
        activePanelElement.style.display = 'block';
        activePanelElement.setAttribute('aria-hidden', 'false');
      },

      /**
       * @callback close
       * @memberof Popup
       * @description close accordion 
       */
      close: function(elId) {
        var activePanelElement = el.target.querySelector('#' + elId);
        if (el.animation) {
          $(activePanelElement).slideUp(el.animationSpeed);
        } else {
          activePanelElement.style.display = 'none';  
        }
        activePanelElement.setAttribute('aria-hidden', 'true');
      }
    };

    var bind = function() {
      if (el.accButton) {
        $(el.accButton).each(function(idx, el) {
          el.addEventListener('click', handler.btnClick);          
        });
      }
    };

    var unbind = function() {
      if (el.accButton) {
        $(el.accButton).each(function(idx, el) {
          el.removeEventListener('click', handler.btnClick);          
        });
      }
    };

    /**
     * @function init
     * @memberof Accordion
     * @description  Accordion instance 생성
     */  
    this.init = function() {
      setProperty();
      bind();
    };

    /**
     * @function reInit
     * @memberof Accordion
     * @description 재생성
     */
    this.reInit = function() {
      unbind();
      setProperty();
      bind();
    };
    
    this.init();
  }

  Accordion.index = 0;

  var accordionController = {
    init: function(selector) {
      $(selector).each(function(idx, el) {
        var $el = $(el);
        var obj = $el.data('accordion');

        if (obj) {
          obj.reInit();
        } else {
          obj = new Accordion(el);

          $el.data('accordion', obj);
        }
      });
    }
  };

  /**
   * @alias pn.accordion
   * @memberof pn
   * @param {String} target - selector
   * @description accordion 생성
   */  
  window.mvJs.pn.accordion = {
  /** 
   * @memberof accordion
   * @description 재생성
   */  
    init: function(selector) {
      accordionController.init(selector);
    }
  };
})(window, window.jQuery);