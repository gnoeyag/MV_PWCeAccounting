(function(window, $) {
  var utils = window.mvJs.pn.utils;
  var Swiper = window.Swiper;

  function CustomSwiper(target) {
    /**
     * Create a CustomSwiper
     * @class CustomSwiper
     * @param {Element} target - 생성 타겟
     * @description 외부 라이브러리, 제작사 : {@link https://swiperjs.com/},
     * 스와이퍼 관리
     */
    var el = {
      swiperWrapper: target,
      container: target.querySelector('.swiper-container'),
      swiperSlide: target.querySelectorAll('.swiper-slide'),
      btnStop: target.querySelector('.btn--stop, .swiper-button-autoplay--pause'),
      btnPlay: target.querySelector('.btn--Play, .swiper-button-autoplay--play'),
      progressBar: target.querySelector('.swiper-pagination-progressbar-fill'),
      paginationEl: target.querySelector('.swiper-pagination'),
      popupEl: null
    };

    var options = {
      loop: false,
      speed: 300,
      autoplay: false,
      spaceBetween: 0,
      observer: true,
      observeParents: true,
      autoHeight: false,
      breakpoints: {},
      a11y: false,
      direction : 'horizontal',
      allowTouchMove: true,
      autoDelete: false
    };  

    // this.swiper = {};

    var $swiper = $(target);
    var optionData = {};
    var rIndex = 0;
    // bullet|fraction|
    // data-options

    if (el.swiperWrapper.dataset.options) {
      optionData = JSON.parse(el.swiperWrapper.dataset.options);
    }

    if (optionData.lazy) {
      options.lazy = optionData.lazy;
    }

    if (optionData.direction) {
      options.direction = optionData.direction;
    }

    // loop
    if (optionData.loop) {
      if (el.swiperWrapper.classList.contains('main-visual__swiper') && el.popupEl) {
        options.loop = false;
      } else {
        options.loop = true;
      }
      // options.loop = true;
    }

    if (optionData.speed) {
      options.speed = optionData.speed;
    }

    // spacebetween
    if (optionData.spaceBetween > 0) {
      options.spaceBetween = optionData.spaceBetween;
    }

    // slidesPerView
    if (optionData.slidesPerView) {
      options.slidesPerView = optionData.slidesPerView;
    }

    // autoplay
    if (optionData.autoplay > 0) {
      if (!el.swiperWrapper.querySelector('.swiper-autoplay')) {
        
        // $('<div class="swiper-autoplay"><button type="button" class="swiper-button-autoplay--pause on"><span class="hidden">정지</span></button><button type="button" class="swiper-button-autoplay--play"><span class="hidden">재생</span></button></div>')
        // .insertAfter($(el.swiperWrapper)
        // .find('.swiper-button-next'));

        el.btnStop = el.swiperWrapper.querySelector('.btn--stop, .swiper-button-autoplay--pause');
        el.btnPlay = el.swiperWrapper.querySelector('.btn--Play, .swiper-button-autoplay--play');
      }

      if (el.swiperWrapper.classList.contains('main-visual__swiper') && el.popupEl) {
        options.autoplay = false;
      } else {
        options.autoplay = {
          delay: optionData.autoplay,
          disableOnInteraction: false
        };
      }
    }

    // autoHeight
    if (optionData.autoHeight) {
      options.autoHeight = optionData.autoHeight;
    }

    if (optionData.progress) {
      options.progress = true;
    }

    // next prev
    if (el.swiperWrapper.querySelector('.swiper-button-prev')) {
      options.navigation = {
        nextEl: el.swiperWrapper.querySelector('.swiper-button-next'),
        prevEl: el.swiperWrapper.querySelector('.swiper-button-prev')
      };
    }

    // breakpoints
    if (optionData.breakpoints) {
      options.breakpoints = optionData.breakpoints;
    }

    if (optionData.mode) {
      options.mode = optionData.mode;
    }
    //effect fade
    if (optionData.effect) {
      options.effect = optionData.effect;
    }

    // pagination
    if (optionData.pagination === 'all') {
      options.pagination = {
        el: el.paginationEl,
        type: 'custom',
        clickable: true,
        renderCustom: function(swiper, current, total) {
          var paging = '';
          for (var i = 1; i <= total; i++) {
            if (current === i) {
              paging += '<button class="swiper-pagination-bullet swiper-pagination-bullet-active" type="button" aria-label="Go to slide ' + i + '"></button>';
            } else {
              paging += '<button class="swiper-pagination-bullet" aria-label="Go to slide ' + i + '"></button>';
            }
          }

          paging += '<div class="swiper-paging"><div class="paging"><span class="swiper-pagination-current">' + current + '</span>/<span class="swiper-pagination-total">' + total + '</span></div></div>';

          // '</span></div><button type="button" class="swiperMore">더보기</button></div>';
          return paging;
        }
      };
    } else if (optionData.pagination === 'fraction') {
      el.paginationEl.style.display = '';

      options.pagination = {
        el: el.paginationEl,
        type: 'custom',
        renderCustom: function(swiper, current, total) {
          return '<div class="swiper-paging"><div class="paging"><span class="swiper-pagination-current">' + current + '</span>/<span class="swiper-pagination-total">' + total + '</span></div></div>';
          //'<button type="button" class="swiperMore">더보기</button></div>'
        }
      };
    } else if (el.paginationEl) {
      // el.paginationEl.style.display = '';
      options.pagination = {
        el: el.paginationEl,
        renderBullet: function(i) {
          return '<button class="swiper-pagination-bullet swiper-pagination-bullet-active" type="button" aria-label="Go to slide ' + (i + 1) + '"></button>';
          //'<button type="button" class="swiperMore">더보기</button></div>'
        },
        // type: 'bullets',
        clickable: true //선택 가능 하도록 변경
      };
    }
    options.on = {
      slideChangeTransitionStart: function() {
        if (el.progressBar) {
          var total = this.slides.length - this.el.querySelectorAll('.swiper-slide-duplicate').length;
          if (options.loop === false && Object.keys(options.breakpoints).length > 0) {
            //breakpoints 값 있을 경우
            el.progressBar.style.transform = 'scale(' + (this.snapIndex + 1) / this.snapGrid.length + ',1)';
          } else {
            el.progressBar.style.transform = 'scale(' + (this.realIndex + 1) / total + ',1)';
          }
        }

        //접근성
        $(el.swiperSlide).each(function(index, element) {
          //접근성 > .swiper-slide 에  aria-hidden 추가
          if (options.slidesPerView !== 'auto') {
            $(element).attr('aria-hidden', 'true');
          }

          if (options.autoplay !== false) {
            $(element).removeAttr('tabindex');
          }
        });

        //접근성 > .swiper-slide 에  aria-hidden 추가
        if (options.slidesPerView !== 'auto') {
          el.swiperWrapper.querySelector('.swiper-slide-active').setAttribute('aria-hidden', 'false');
        }

        //autoplay 옵션 있을 경우 swiper-slide-active 에 포커스 갈 경우 정지 기능 추가, 해당 element 포커스 갈 수 있도록 tabindex 지정
        if (options.autoplay !== false) {
          el.swiperWrapper.querySelector('.swiper-slide-active').setAttribute('tabindex', '0');
        }

        rIndex = optionData.loop === true ? this.realIndex : this.activeIndex;
      },

      init: function() {
        if (el.progressBar) {
          var total = this.slides.length - this.el.querySelectorAll('.swiper-slide-duplicate').length;

          if (options.loop === false && Object.keys(options.breakpoints).length > 0) {
            //breakpoints 값 있을 경우
            el.progressBar.style.transform = 'scale(' + (this.snapIndex + 1) / this.snapGrid.length + ',1)';
          } else {
            el.progressBar.style.transform = 'scale(' + 1 / total + ',1)';
          }
        }
        if (options.slidesPerView !== 'auto') {
          $(el.swiperSlide).each(function(index, element) {
            $(element).attr('aria-hidden', 'true');
          });  
          el.swiperWrapper.querySelector('.swiper-slide-active').setAttribute('aria-hidden', 'false');
        }

        //autoplay 옵션 있을 경우 swiper-slide-active 에 포커스 갈 경우 정지 기능 추가, 해당 element 포커스 갈 수 있도록 tabindex 지정
        if (options.autoplay !== false) {
          el.swiperWrapper.querySelector('.swiper-slide-active').setAttribute('tabindex', '0');
        }
      },
      slideChangeTransitionEnd: function() {
        // pagination custom 일 경우 keyboard 이벤트 추가
        if (options.pagination && options.pagination.type === 'custom') {
          var btnBullet = el.swiperWrapper.querySelectorAll('.swiper-pagination-bullet');
          $(btnBullet).each(function(index, element) {
            $(element).keydown(handler.keydownBtnBullet);
          });
        }
      }
    };
    //접근성
    // options.a11y = true;
    var self = this;
    var handler = {
      resize: function() {

        if (options.mode === CustomSwiper.MODE_PC) {
          if (utils.isPc() && self.swiper.destroyed) {

            self.init();
          } else if (!utils.isPc() && !self.swiper.destroyed) {            
            el.swiperWrapper.setAttribute('data-initIdx', self.swiper.activeIndex);
            // self.swiper.destroy();
            swiperDestroy();

            el.swiperWrapper.removeAttribute('style');
            $(el.swiperWrapper).find('.swiper-slide').removeAttr('style');
          }
        } else if (options.mode === CustomSwiper.MODE_MO) {
          if (utils.isPc() && !self.swiper.destroyed) {            
            el.swiperWrapper.setAttribute('data-initIdx', self.swiper.activeIndex);
            // self.swiper.destroy();
            swiperDestroy();

            el.swiperWrapper.removeAttribute('style');
            $(el.swiperWrapper).find('.swiper-slide').removeAttr('style');
          } else if (!utils.isPc() && self.swiper.destroyed) {
            self.init();
          }
        }
      },

      resizeSlide: function() {
        if (utils.isPc() && el.container.getAttribute('data-wrapSlideCnt') === '3') {
          //PC 슬라이드 설정
          el.container.setAttribute('data-wrapSlideCnt', 5);

          //기존 swiper 삭제
          // self.swiper.destroy();

          // if ($swiper.data('swiper').swiper) {
          //   $swiper.data('swiper').swiper.destroy();
          // }
          swiperDestroy();

          setProperty();

          self.init();
        } else if (!utils.isPc() && el.container.getAttribute('data-wrapSlideCnt') === '5') {
          //MOB 슬라이드 설정
          el.container.setAttribute('data-wrapSlideCnt', 3);

          //기존 swiper 삭제
          // self.swiper.destroy();
          swiperDestroy();
          // if ($swiper.data('swiper').swiper) {
          //   $swiper.data('swiper').swiper.destroy();
          // }

          setProperty();

          self.init();
        }

        if (!utils.isPc()) {
          var oSelf = this;
          setTimeout(function() {
            //기존 swiper 삭제
            // oSelf.swiper.destroy();
            // if ($swiper.data('swiper').swiper) {
            //   $swiper.data('swiper').swiper.destroy();
            // }
            swiperDestroy();
      
            //swiper-slide set slide
            method.setOptBoxRelated();

            oSelf.init();
          }, 100);
        }
      },
      resizeSlideCertification: function() {
        if (utils.isPc()) {
          var oSelf = this;
          setTimeout(function() {
            //기존 swiper 삭제
            // oSelf.swiper.destroy();

            // if ($swiper.data('swiper').swiper) {
            //   $swiper.data('swiper').swiper.destroy();
            // }
            swiperDestroy();

            //swiper-slide set slide
            method.setOptBoxCertification();

            oSelf.init();
          }, 100);
        }
      },
      clickBtnPause: function(e) {    
        if (!self.swiper.destroyed) {
          self.swiper.autoplay.stop();
        }
        el.swiperWrapper.setAttribute('isPlay', false);

        if (e.currentTarget.classList.contains('on')) {
          e.currentTarget.classList.remove('on');

          el.btnPlay.classList.add('on');

          el.btnPlay.focus();
        }
      },
      clickBtnPlay: function(e) {
        if (!self.swiper.destroyed) {
          self.swiper.autoplay.start();
        }
        el.swiperWrapper.setAttribute('isPlay', true);

        if (e.currentTarget.classList.contains('on')) {
          e.currentTarget.classList.remove('on');

          el.btnStop.classList.add('on');

          el.btnStop.focus();
        }
      },
      mouseoverSwiper: function() {
        //정지 버튼 안 눌었을 경우에만 체크
        if (el.swiperWrapper.getAttribute('isPlay') === 'true') {
          if (!self.swiper.destroyed) {
            self.swiper.autoplay.stop();
          }
        }
      },
      mouseleaveSwiper: function() {
        //정지 버튼 안 눌었을 경우에만 체크
        if (el.swiperWrapper.getAttribute('isPlay') === 'true') {
          if (!self.swiper.destroyed) {
            self.swiper.autoplay.start();
          }
        }
      },
      focusinSwiper: function() {
        //정지 버튼 안 눌었을 경우에만 체크
        if (el.swiperWrapper.getAttribute('isPlay') === 'true') {
          if (!self.swiper.destroyed) {
            self.swiper.autoplay.stop();
          }
        }
      },
      focusoutSwiper: function() {
        //정지 버튼 안 눌었을 경우에만 체크
        if (el.swiperWrapper.getAttribute('isPlay') === 'true') {
          if (!self.swiper.destroyed) {
            self.swiper.autoplay.start();
          }
        }
      },
      keydownBtnBullet: function(e) {
        if (e.keyCode === 13) {
          var index = Array.from(e.currentTarget.parentNode.querySelectorAll('.swiper-pagination-bullet')).indexOf(
            e.currentTarget
          );
            //슬라이드 이동
          if (!self.swiper.destroyed) {
            self.swiper.slideTo(index, options.speed);
          }
          //슬라이드 이동 후 포커스 이동
          setTimeout(function() {
            el.swiperWrapper.querySelectorAll('.swiper-pagination-bullet')[index].focus();
          }, options.speed);
        }
      }
    };

    var method = {
      wrapSlide: function() {
        //swiper-slide 태그로 묶음
        var wrapCnt;
        if (utils.isPc()) {
          wrapCnt = 5;
          el.container.setAttribute('data-wrapSlideCnt', 5);
        } else {
          wrapCnt = 3;
          el.container.setAttribute('data-wrapSlideCnt', 3);
        }

        var nodesToWrap = document.querySelectorAll('.thumbnail-carousel-box__swiper-slide');
        var node, wrapper;

        $(nodesToWrap).each(function(index) {
          node = nodesToWrap[index];

          if (index % wrapCnt === 0) {
            wrapper = document.createElement('div');
            wrapper.className = 'swiper-slide';
            node.parentNode.insertBefore(wrapper, node);
          }
          node.parentNode.removeChild(node);
          wrapper.appendChild(node);
        });

        el.swiperSlide = target.querySelectorAll('.swiper-slide');
      },
      unWrapSlide: function() {
        var wrapper = document.querySelector('.swiper-wrapper');
        var nodesToWrap = document.querySelectorAll('.thumbnail-carousel-box__swiper-slide');
        var node;

        $(nodesToWrap).each(function() {
          node = nodesToWrap[0];
          wrapper.insertBefore(node, null);
        });

        $(el.swiperSlide).each(function(index, element) {
          $(element).remove();
        });
      },
      setOptBoxRelated: function() {
        if (!utils.isPc()) {
          //MOB
          options.spaceBetween = 36;
          options.width = window.innerWidth - 72; // 슬라이드 넓이 = 전체 화면 사이즈 - 슬라이드padding값
        } else {
          //option 설정
          if (options.spaceBetween) {
            delete options.spaceBetween;
          }

          if (options.width) {
            delete options.width;
          }
        }
      },
      setOptBoxCertification: function() {
        if (utils.isPc()) {
          //슬라이드 넓이, margin-left 값 설정

          var slideCertification = document.querySelectorAll('.certification__swiper-slide-inner')[1];
          var wSldie = Math.ceil(slideCertification.getBoundingClientRect().width);

          var leftMargin = window.getComputedStyle(slideCertification).getPropertyValue('margin-left');
          leftMargin = leftMargin.match(/\d+/);

          var optWidth = Number(leftMargin) * 3 + wSldie * 3;
          options.width = optWidth;
          document.querySelector('.certification__swiper').style.marginLeft =
                  Math.ceil(document.querySelector('.text--type2').getBoundingClientRect().x) + 'px';
        } else {
          document.querySelector('.certification__swiper').style.marginLeft = '';
        }
      },

      initSwiper: function() {
        el.swiperSlide = target.querySelectorAll('.swiper-slide');

        if ($swiper.data('swiper')) {
          var obj = $swiper.data('swiper').swiper;
  
          if (!obj.destroyed) {
            $swiper.data('swiper').swiper.destroy();
          }
        }
        //PC 모드 일 경우 ::  PC -> MOB -> PC 화면 리사이즈 시 처음 PC 모드에서 봤던 idx 로 이동
        var initIdx = el.swiperWrapper.getAttribute('data-initIdx');
        if (initIdx) {
          options.initialSlide = Number(initIdx);
          el.swiperWrapper.removeAttribute('data-initIdx');
        }
        
        if (el.swiperSlide.length > 1) {
          // console.log('11111111111111111111 ');
          //함수 호출 여러번 될 경우 :: 스타일 초기화
          if (el.paginationEl) {
            el.paginationEl.style.display = '';
          }

          if (options.navigation) {
            options.navigation.nextEl.style.display = '';
            options.navigation.prevEl.style.display = '';
          }
        
          if (el.progressBar) {
            el.progressBar.parentElement.style.display = '';
          }
        
          if (el.swiperWrapper.querySelector('.swiper-btn-wrap')) {
            el.swiperWrapper.querySelector('.swiper-btn-wrap').style.display = '';
          }
          //스와이프 1개 이상 일 경우에만 작동
          self.swiper = new Swiper(el.container, options);

          self.swiper.on('slidesLengthChange', () => {
            self.swiper.slideTo(rIndex, 0);
          });

        } else {
          // console.log('-- swiper ::: single ');

          //슬라이드가 하나 일때 style="display:none" 추가
          if (el.swiperWrapper.querySelector('.swiper-notification')) {
            el.swiperWrapper.querySelector('.swiper-notification').remove();
          }
        
          if (el.paginationEl) {
            el.paginationEl.style.display = 'none';
          }

          if (options.navigation) {
            options.navigation.nextEl.style.display = 'none';
            options.navigation.prevEl.style.display = 'none';
          }

          if (el.progressBar) {
            el.progressBar.parentElement.style.display = 'none';
          }
        
          if (el.swiperWrapper.querySelector('.swiper-btn-wrap')) {
            el.swiperWrapper.querySelector('.swiper-btn-wrap').style.display = 'none';
          }

          self.swiper = new Swiper(el.container, options);
          
          self.swiper.on('slidesLengthChange', () => {

            swiperDestroy();
          });

          swiperDestroy();
        }
      }
    };

    var bind = function() {
      // 모드 변화
      if (options.mode) {
        $(window).on('resize', handler.resize);
        handler.resize();
      }
    
      //모드 변경 시 슬라이드 묶음 변경
      if (el.container.classList.contains('thumbnail-carousel-box__swiper-wrap')) {
        $(window).on('resize', handler.resizeSlide);
      }
    
      //품질 경영 슬라이드 리사이즈
      if (el.swiperWrapper.classList.contains('certification__swiper')) {
        $(window).on('resize', handler.resizeSlideCertification);
      }
    
      //정지 버튼 클릭
      if (el.btnStop) {
        $(el.btnStop).on('click', handler.clickBtnPause);
      }
    
      //재생 버튼 클릭
      if (el.btnPlay) {
        $(el.btnPlay).on('click', handler.clickBtnPlay);
      }
    
      //autoplay 옵션 있는 경우 hover/foucs 시 swiper 정지
      if (options.autoplay !== false) {
        el.swiperWrapper.setAttribute('isPlay', true);

        $(el.swiperWrapper).on('mouseover', handler.mouseoverSwiper);
        $(el.swiperWrapper).on('mouseleave', handler.mouseleaveSwiper);

        $(el.swiperWrapper).on('focusin', handler.focusinSwiper);
        $(el.swiperWrapper).on('focusout', handler.focusoutSwiper);
      }
    
      // pagination custom 일 경우 keyboard 이벤트 추가
      if (options.pagination && options.pagination.type === 'custom') {
        var btnBullet = el.swiperWrapper.querySelectorAll('.swiper-pagination-bullet');
        $(btnBullet).each(function(index, element) {
          $(element).keydown(handler.keydownBtnBullet);
        });
      }
    };

    var unbind = function() {
      // 모드 변화 이벤트 제거
      if (options.mode) {
        $(window).off('resize', handler.resize);
      }
    
      //모드 변경 시 슬라이드 묶음 변경 이벤트 제거
      if (el.container.classList.contains('thumbnail-carousel-box__swiper-wrap')) {
        $(window).off('resize', handler.resizeSlide);
      }
    
    
      //정지 버튼 클릭 이벤트 제거
      if (el.btnStop) {
        $(el.btnStop).off('click', handler.clickBtnPause);
      }
    
      //재생 버튼 클릭 이벤트 제거
      if (el.btnPlay) {
        $(el.btnPlay).off('click', handler.clickBtnPlay);
      }
    
      //autoplay 옵션 있는 경우 hover/foucs 시 swiper 정지 이벤트 제거
      if (options.autoplay !== false) {        
        $(el.swiperWrapper).off('mouseover', handler.mouseoverSwiper);
        $(el.swiperWrapper).off('mouseleave', handler.mouseleaveSwiper);

        $(el.swiperWrapper).off('focusin', handler.focusinSwiper);
        $(el.swiperWrapper).off('focusout', handler.focusoutSwiper);
      }
    };

    var setProperty = function() {
      //effect fade 일 경우 해당 클래스 추가
      if (optionData.effect === 'fade') {
        el.swiperWrapper.classList.add('swiper-fade');
      }

      if (el.container.classList.contains('thumbnail-carousel-box__swiper-wrap')) {
        if (el.swiperSlide.length > 0) {
          //swiper-slide 태그 삭제
          method.unWrapSlide();
        }
        //swiper-slide 태그로 묶음
        method.wrapSlide();

        //swiper-slide set swiper option
        method.setOptBoxRelated();
      }

      //품질 경영 슬라이드
      if (el.swiperWrapper.classList.contains('certification__swiper')) {
        //swiper-slide set swiper option
        method.setOptBoxCertification();
      }
    };

    var swiperDestroy = function() {
      // console.log('options.autoDelete ', options.autoDelete);

      if (options.autoDelete) {
        // console.log('111111111 ');
        self.swiper.destroy();
      } else {
        // console.log('2222222222 ');
        if (self.swiper.slides.length > 1) {
          self.swiper.allowTouchMove = true;
        } else {
          self.swiper.allowTouchMove = false;
        }
        
        self.swiper.update();
      }
    };

    /**
     * @function init
     * @memberof CustomSwiper
     * @description CustomSwiper 인스턴스 생성
    */
    this.init = function() {
      setProperty();

      method.initSwiper();

      bind();
    };

    /**
     * @function reInit
     * @memberof CustomSwiper
     * @description 재생성
    */  
    this.reInit = function() {
      unbind();

      setProperty();

      method.initSwiper();

      bind();
    };
    
    this.init();
  }
  
  var swiperController = {
    init: function(selector) {
      $(selector).each(function(idx, el) {
        var $el = $(el);
        var obj = $el.data('swiper');

        if (obj) {
          obj.reInit(); 
        } else {
          obj = new CustomSwiper(el);

          $el.data('swiper', obj);
        } 
      });
    }
  };
  /**
   * @alias mvJS.pn.swiper
   * @memberof pn
   * @description js내부에서 swiper 인터페이스 모음
  */
  window.mvJs.pn.swiper = {
    controller: function(selector) {
      swiperController.init(selector);
    }
  };

  /**
   * @namespace swiper
   * @alias mvJS.fn.swiper
   * @memberof fn
   * @description swiper 인터페이스 모음
  */
  window.mvJs.fn.swiper = {
    /**
     * @param {String} id - element id
     * @memberof swiper
     * @description 스와이퍼 생성
    **/
    init: function(id) {
      var el = document.querySelector(id);
      var $el = $(el);

      if (!$el.length) {
        return;
      }

      var obj = $el.data('swiper');

      if (obj) {
        obj.reInit(); 
      } else {
        obj = new CustomSwiper(el);
        $el.data('swiper', obj);
      }
    },
    /**
     * @param {String} id - element id
     * @returns {Number}
     * @memberof swiper
     * @description 선택 스와이퍼 활성화 슬라이드 인텍스 리턴
     **/
    getActiveIndex: function(id) {
      var $el = $(id);
      var active = null;

      if ($el.length) {
        active = $el.data('swiper').swiper.activeIndex;
      }
      return active;
    },
    /**
     * @param {String} id - element id
     * @memberof swiper
     * @description swiper 업데이트
     **/   
    update: function(id) {
      var $el = $(id);

      if ($el.length) {
        $el.data('swiper').swiper.update();
      }
    },
    /**
     * @param {String} id - element id
     * @memberof swiper
     * @description swiper 제거
     **/      
    destroy: function(id) {
      var $el = $(id);

      if ($el.length) {
        $el.data('swiper').swiper.destroy();
      }
    },
    /**
     * @param {String} id - element id
     * @memberof swiper
     * @description swiper instance remove
     **/     
    remove: function(id) {
      var $el = $(id);

      if ($el.length) {
        $el.removeData('swiper');
      }
    },
    /**
     * @param {String} id - element id
     * @memberof swiper
     * @returns {InstanceType} swiper instance
     * @description 생성된 swiper instance 전달
     **/
    getSwiper: function(id) {
      var $el = $(id);
      var swiperInstance = null;

      if ($el.length) {
        swiperInstance = $el.data('swiper').swiper;
      }
      return swiperInstance;
    },
    /**
     * @param {String} id - element id
     * @memberof swiper
     * @description swiper start autoplay
     **/   
    setPlay: function(id) {
      var $el = $(id);
      var optionData = $el.data('options');
      var swiper = $el.data('swiper').swiper;
      swiper.params.autoplay.delay = optionData.autoplay;
      swiper.params.autoplay.disableOnInteraction = false;
      swiper.autoplay.start();
    }
  };

  CustomSwiper.MODE_ALL = 'all';
  CustomSwiper.MODE_PC = 'pc';
  CustomSwiper.MODE_MO = 'mo';
  CustomSwiper.mode = CustomSwiper.MODE_ALL;
  
})(window, window.jQuery);