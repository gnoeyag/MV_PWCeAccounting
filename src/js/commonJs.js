(function($, window) {
  // project default object

  //* 각각 모듈 별로
  //* el, selector, handler, 변수 선언 및 구릅핑 필요 하지 않으면 비할당
  //* init(), reInit(), bind() , setProperty() 함수는 존재 하도록 구현하지 않아도 되면 공백으로
  
  //* 전역 변수 mvJs 오브젝트 형식으로 하나만 사용
  //* 산출물 가이드 작성을 위해 https://jsdoc.app/ 주석 스타일 참고

  //* 주석 작성 항목은 
  //* 1. 클래스 (클래스 역할, 메소드 설명, 멤버 변수등)
  //* 2. 공통영역 모듈 오브젝트
  //* 3. global variable 
  //* 4. global function 외부 제어 영역 (백엔드 데이터 연동부분)
  // *5. 함수의 경우는 첫글자 소문자 commonFunc / Camel case
  // *6. 클래스의 경우 첫글자 대문자 CommonFunc / Camel case

  var pn = window.mvJs.pn;
  var fn = window.mvJs.fn;

  var common = {
    el: {
      doc : $(document),
      win : $(window),
      body: null
    },

    selector: {
      body        : 'body, html',
      topMenu     : '.topMenu',
      mainSlider  : '.mainSlider',
      popup       : '[data-popup-id]',
      accordion   : '.accordion',
      slideDown   : '.slideDown',
      human       : '.human',
      swiper      : '.swiper',
      toolTip     : '.tooltip',
      scrollMenu  : '.scroll-menu',
      dataText    : '[data-text]',
      topButton   : '.btn-top',
      tab         : '.js-tab',
      inputText   : '.input-text',
      tabDefault  : '.tab-default',
      selectBtn   : '.select-btn--active',
      approveList : '.approver-list',
      fixed       : 'header, .fixed-top',
      scrollList  : '[data-infinitescroll]',
      actionSheet : '.action-sheet',
      btnMenu     : '.btn--menu',
      listCard    : '.selector-panel'
    },

    handler: {
      ready: function() {
        common.el.body = $(common.selector.body);

        // 최초 init
        pn.dataText.init(common.selector.dataText);

        pn.tooltip.init(common.selector.toolTip);
        
        pn.scrollMenu.init(common.selector.scrollMenu);
        
        pn.accordion.init(common.selector.accordion);
        
        pn.slideDown.init(common.selector.slideDown);

        pn.topButton.init(common.selector.topButton);

        pn.swiper.controller(common.selector.swiper);

        pn.popup.controller(common.selector.popup);      
        
        pn.tab.init(common.selector.tab);

        pn.inputText.init(common.selector.inputText);

        pn.tabDefault.init(common.selector.tabDefault);

        pn.selectBtn.init(common.selector.selectBtn);
        
        pn.dragDropList.init(common.selector.approveList);

        pn.floatingFixed.init(common.selector.fixed);
        
        pn.infiniteScroll.init(common.selector.scrollList);
        
        pn.actionSheet.init(common.selector.actionSheet);

        pn.navOpen.init(common.selector.btnMenu);

        pn.heightSize.init(common.selector.listCard);

        // pn.contents.init();
      },
      load: function() {

      }
    },
    
    setProperty: function() {

    },

    init: function() {
      common.setProperty();

      common.handler.ready();
    },

    bind: function() {}
  };


  if (document.readyState === 'loading') {
    $(document).on('DOMContentLoaded', common.handler.ready);
  } else {
    common.init();
  }

  common.el.win.on('load', common.handler.load);

  /**
   * @function init
   * @alias common.init
   * @memberof common
   * @description 전체 스크립트 재 설정
   */ 
  fn.common.init = common.init;

})(window.jQuery, window);
