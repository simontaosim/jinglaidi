/*********************************************
 * common.js
 * -------------------------------------------
*********************************************/
/* -------------------------------------------
 * @namespace
------------------------------------------- */
var MIKIMOTO = MIKIMOTO || {};

/* -------------------------------------------
 * @constructor
------------------------------------------- */
MIKIMOTO.Util = function(){
	this.$win = $(window);
	this.$doc = $(document);
	this.$pageWrap = $("#pageWrap");
	this.ua = navigator.userAgent.toLowerCase();
	this.SMART_UA = ["iphone","ipad","android","windows phone"];
	this.breakPoint1 = 639;
};

MIKIMOTO.Util.prototype = {
	/*
	 * @method isRangeSP
	 * @return {Boolean}
	 */
	isRangeSP: function(){
		var winW = this.$win.width();
		return (winW <= this.breakPoint1) ? true : false;
	},
	/*
	 * @method isNotPC
	 * @return {Boolean}
	 */
	isNotPC: function(){
		var uaArray = new RegExp(this.SMART_UA.join("|"),"i");
		return uaArray.test(this.ua);
	},
	/*
	 * @method isTablet
	 * @return {Boolean}
	 */
	isTablet: function(){
		var UA = {
			iPad: this.ua.indexOf('ipad') != -1,
			Android: this.ua.indexOf('android') != -1 && this.ua.indexOf('mobile') == -1
		};
		return (UA.iPad || UA.Android) ? true : false;
	},
	/*
	 * @method isSmartphone
	 * @return {Boolean}
	 */
	isSmartphone: function(){
		var UA = {
			iPhone: this.ua.indexOf('iphone') != -1,
			iPod: this.ua.indexOf('ipod') != -1,
			Android: this.ua.indexOf('android') != -1 && this.ua.indexOf('mobile') != -1,
			WindowsPhone: this.ua.indexOf('windows phone') != -1
		}
		return (UA.iPhone || UA.iPod || UA.Android || UA.WindowsPhone) ? true : false;
	},
	/*
	 * @method isAndroid
	 * @return {Boolean}
	 */
	isAndroid: function(){
		return (this.ua.indexOf('android') != -1) ? true : false;
	},
	/*
	 * @method isChrome
	 * @return {Boolean}
	 */
	isChrome: function(){
		return (this.ua.indexOf("chrome") != -1) ? true : false;
	},
	/*
	 * @method isIE8
	 * @return {Boolean}
	 */
	isIE8: function(){
		return (this.ua.indexOf("msie 8") != -1) ? true : false;
	},
	/*
	 * @method isFontSizeCheck
	 * @param {function} callback
	 * - フォントサイズが変更されたら、callbackを実行
	 */
	isFontSizeCheck: function(callback){
		var HTML_FS_WATCH = $('<div id="fontSizeWatcher">&nbsp;</div>'),
			CSS_OBJECT = {
				display: "block",
				visibility: "hidden",
				position: "absolute",
				top: "0",
				padding: "0"
			},
			$elm,
			interval = 500,
			currentSize = 0;
		
		// 監視用HTMLを生成する
		HTML_FS_WATCH.css(CSS_OBJECT).appendTo("body");
		$elm = $("#fontSizeWatcher");
		
		// 要素の高さを取得
		var getSize = function($elm){ return $elm.height(); };
		
		// 要素の高さを比較して、異なればcallbackを実行
		var fontSizeCheck = function(){
			var h = getSize($elm);
			
			if(h === currentSize){
				return false;
			} else {
				currentSize = h;
				callback();
			}
		};
		setInterval(fontSizeCheck, interval);
	},
	/*
	 * @method isWindowSizeCheck
	 * @param {function} callback
	 * - windowのリサイズ処理が完了したら、callbackを実行
	 */
	isWindowSizeCheck: function(callback){
		var resize = false,
			interval = 500;
		
		this.$win.on("resize", function(){
			// リサイズされている間は何もしない
			if(resize !== false){ clearTimeout(resize); }
			
			resize = setTimeout(function(){
				callback();
			}, interval);
		});
	}

};

/* -------------------------------------------
 * @module
------------------------------------------- */
MIKIMOTO.module = function(){
	var u = new MIKIMOTO.Util();
	
	return {
		/*
		 * @method initialize
		 * - 初期化
		 */
		initialize: function(){
			this.rollover();
			this.spAccordion();
			this.toggleContent();
			this.toggleInformation();
			this.popup();
			this.telLink();
			this.toolTip();
			this.toTop();
			this.selectLang();
			this.productsList();
		},

		/*
		 * @method rollover
		 * - ロールオーバー
		 */
		rollover: function(){
			if(u.isNotPC()){
				return false;
			}
			var $elm = $(".js-rollover"),
				onSuffix = "on";
			
			var src = {
				over: function($elm){return $elm.attr("src").replace(/^(.+)(\.[a-z]+)$/, "$1" + onSuffix + "$2");},
				out: function($elm){return $elm.attr("src").replace(new RegExp("^(.+)" + onSuffix + "(\.[a-z]+)$" ), "$1$2");},
				preload: function($elm){return $elm.attr("src").replace(/^(.+)(\.[a-z]+)$/, "$1" + onSuffix + "$2");}
			};
			
			$elm
				.hover(function(){
					$(this).attr("src", src.over($(this)));
				}, function(){
					$(this).attr("src", src.out($(this)));
				})
				.each(function(){
					$("<img>").attr("src", src.preload($(this)));
				});
		},
		/*
		 * @method sizeFix
		 * - 画像幅取得
		 */
		 sizeFix: function(config){
			// user option
			var c = $.extend({
				elm: ".js-size-fix", // 実行対象のセレクタ
				isSpRun: true,    // boolean: スマホで実行するかどうか
				resizeRerun: true   // boolean: リサイズ時に実行するかどうか
			}, config);
			
			// vars
			var $elm = $(c.elm),
					spEscName = "spEscape",
					setW;
			
			// return false
			if(($elm.length === 0)||(!c.isSpRun && u.isSmartphone())){ return false; }
			
			// function
			var sizeSet = function(target){
				if(c.resizeRerun){
					if(u.isRangeSP() && target.hasClass(spEscName)){
						target.css("width", "");
						return;
					} else {
						target.css("width", "");
					}
				} else if(u.isRangeSP() && target.hasClass(spEscName)) {
					return;
				}
				setW = $("img", target).width();
				target.css("width", setW);
			};
			
			// trigger
			$elm.each(function(){
				var self = $(this);
				sizeSet(self);
				
				// リサイズ時
				if(c.resizeRerun){
					u.isWindowSizeCheck(function(){
						sizeSet(self);

					});
				}
				
			});
			
		},
		/*
		 * @method equalHeight
		 * - 高さ揃え
		 * @param {Boolean} 文字可変に対応するかどうか
		 */
		equalHeight: function(fsCheck, wsCheck){
			var className = ".js-equal-height, .genreList01_",
				childBaseName = "js-equal-height__child",
				cancelName = "js-equal-height--sp-cancel",
				$elm = $(className),
				$children = $elm.children(),
				$spChildren = $elm.not("." + cancelName).children(),// SP時に有効となる要素
				winW = u.$win.width(),
				fsCheck = fsCheck || false,
				wsCheck = wsCheck || true,
				spCheck = false;
			
			if($elm.length === 0 || $children.length < 2){ return false; }
			
			if(winW < u.breakPoint1){
				spCheck = true;
			}
			
			/* childBaseNameのグループ化 */
			var grouping = function(w){
				var $groupedChildren = $elm.find("*[class*=" + childBaseName + "]"),
					classNames = {},groups = [];
				
				$groupedChildren.each(function(){
					var splitClass = $(this).attr("class").split(" "),
						splitClassNum = splitClass.length,
						newClassName;
					
					for(var i = 0; i < splitClassNum; i++){
						newClassName = splitClass[i].match(RegExp(childBaseName + "[a-z0-9,_,-]*", "i"));
						
						if(!newClassName){
							continue;
						} else {
							newClassName.toString();
							classNames[newClassName] = newClassName;
						}
					}
				});
				
				// childBaseNameの格納
				for(var c in classNames){
					if(w < u.breakPoint1){
						groups.push($elm.not("." + cancelName).find("." + c));// SP時にcancelNameを持つ要素を対象から外す
					} else {
						groups.push($elm.find("." + c));
					}
				}
				return groups;
			};
			
			/* 各要素の高さを揃える */
			var equalHeight = function(elm){
				var maxHeight = 0;
				
				elm.css("height", "auto");
				
				elm.each(function(){
					if($(this).outerHeight() > maxHeight){
						maxHeight = $(this).outerHeight();
					}
				});
				return elm.outerHeight(maxHeight);
			};
			
			/* init */
			var init = function(){
				var winW = u.$win.width(),
					groups = grouping(winW);
				
				var eqAct = function(eqObj){
					var h = [],
						child = [],
						maxHeight = 0,
						top = 0;
					
					$.each(eqObj, function(){
						var $group = $(this).not(":hidden");// 非表示要素に適用させない場合.not(":hidden")を付与
						
						$group.each(function(i){
							$(this).css("height", "auto");
							h[i] = $(this).outerHeight();
							
							if(top != $(this).position().top){
								equalHeight($(child));
								child = [];
								top = $(this).position().top;
							}
							child.push(this);
						});
					});
					if(child.length > 1){ equalHeight($(child)); }
				}
				// childBaseName要素の高さを揃える
				eqAct(groups);
				// 子要素の高さを揃える
				if(winW < u.breakPoint1){
					// SP時
					eqAct($spChildren);
					$("." + cancelName).children().css("height", "auto");
					$("." + cancelName).find("*[class*=" + childBaseName + "]").css("height", "auto");
				} else {
					// PC時
					eqAct($children);
				}
			};
			
			// 文字可変への対応可否
			fsCheck ? u.isFontSizeCheck(init) : init();
			wsCheck ? u.isWindowSizeCheck(init) : init();
		},
		/*
		 * @method spAccordion
		 * - スマホ時アコーディオン
		 */
		spAccordion: function(){
			if(u.$win.width()<=u.breakPoint1){
				var $elm = $(".js-sp-accordion");
				
				$elm.each(function() {
					var self = $(this),
						$trigger = self.find(".js-sp-accordion__trigger"),
						$target = self.find(".js-sp-accordion__body"),
						addClass = "is-active",
						speed = 200;
					
					$trigger.on("click", function(){
						if($trigger.hasClass(addClass)){
							$trigger.removeClass(addClass);
							$target.slideUp(speed);
						} else {
							$trigger.addClass(addClass);
							$target.slideDown(speed);
						}
					});
				});
			};
		},
		/*
		 * @method toggleContent
		 * - コンテンツの表示非表示
		 */
		toggleContent: function(){
			var $elm = $(".js-toggle-content");
			
			$elm.each(function() {
				var self = $(this),
					$trigger = self.children(".js-toggle-content__trigger"),
					$target = self.children(".js-toggle-content__body"),
					addClass = "is-active",
					speed = 200;
				
				$trigger.on("click", function(){
					if($trigger.hasClass(addClass)){
						$trigger.removeClass(addClass);
						$target.slideUp(speed);
					} else {
						$trigger.addClass(addClass);
						$target.slideDown(speed);
					}
				});
			});
		},
		/*
		 * @method toggleInformation
		 * - 個人情報スマホ時アコーディオン
		 */
		toggleInformation: function(){
			if(u.$win.width()<=u.breakPoint1){
				var $elm = $(".js-toggle-information");
				
				$elm.each(function() {
					var self = $(this),
						$trigger = self.find(".js-toggle-information__trigger"),
						$target = self.find(".js-toggle-information__body"),
						$reject = $trigger.find("label"),
						addClass = "is-active",
						speed = 200,
						hover_flg = false;
					
					$reject.hover(function(){
						hover_flg = true;
					}, function(){
						hover_flg = false;
					});
					
					$trigger.on("click", function(){
						if(!hover_flg){
							if($trigger.hasClass(addClass)){
								$trigger.removeClass(addClass);
								$target.slideUp(speed);
							} else {
								$trigger.addClass(addClass);
								$target.slideDown(speed);
							}
						};
					});
				});
			};
		},
		/*
		 * @method popup
		 * - SP時ポップアップ無効
		 */
		popup: function(config){
			var c = $.extend({
				target: ".js-popup",
				name : "POPUP",
				height : 700,
				width : 550,
				toolbar : 0,
				scrollbars : 1,
				status : 0,
				resizable : 1,
				left : 0,
				top : 0,
				center : false
			}, config);
			
			var $this = $(c.target);
			if($this.length === 0 || u.isSmartphone()){ return false; }
			
			if(c.center){
				popupTop = (screen.height - c.height) / 2;
				popupLeft = (screen.width - c.width) / 2;
			} else {
				popupTop = 0;
				popupLeft = 0;
			}
			
			var parameters = "height=" + c.height + ",width=" + c.width + ",toolbar=" + c.toolbar + ",scrollbars=" + c.scrollbars + ",status=" + c.status + ",resizable=" + c.resizable + ",left=" + popupLeft + ",screenX=" + popupLeft + ",top=" + popupTop + ",screenY=" + popupTop;
			
			$this.on("click", function(){
				window.open(this.href, c.name, parameters);
				return false;
			})
		},
		/*
		 * @method toggleInformation
		 * - PC時telリンク無効
		 */
		telLink: function(){
			if (!u.isSmartphone()){
				$('a[href^="tel:"]').on('click', function(e) {
					e.preventDefault();
				});
			} else {
				$('a[href^="tel:"]').on('click', function() {
					var telNum = $(this).attr('href');
					// GA click count
					ga('send', 'event', telNum, 'click');
				});
			}
		},
		/*
		 * @method toolTip
		 * - フッターツールチップ
		 */
		toolTip: function(){
			var $elm = $(".js-tooltip");
			
			$elm.each(function() {
				var self = $(this),
					$trigger = self.children(".js-tooltip__trigger"),
					$target = self.children(".js-tooltip__body"),
					addClass = "is-hide-tip",
					speed = 200,
					hover__flg = false;
					
				self.on("mouseover" , function(){
					hover__flg = true;
				}).on("mouseout" , function(){
					hover__flg = false;
				});
				
				$trigger.on("click", function(){
					if(u.$win.width()<=u.breakPoint1){
						if(self.hasClass(addClass)){
							self.removeClass(addClass);
							$target.stop().slideDown(speed);
							return false;
						} else {
							self.addClass(addClass);
							$target.stop().slideUp(speed);
							return false;
						}
					} else {
						if(self.hasClass(addClass)){
							self.removeClass(addClass);
							$target.stop().fadeIn(speed);
							return false;
						} else {
							self.addClass(addClass);
							$target.stop().fadeOut(speed);
							return false;
						}
					}
				});
				$(".wrapper_").on("click", function(){
					if(u.$win.width()<=u.breakPoint1){
						if(!hover__flg){
							self.addClass(addClass);
							$target.stop().slideUp(speed);
						}
					} else {
						if(!hover__flg){
							self.addClass(addClass);
							$target.stop().fadeOut(speed);
						}
					}
				});
			});
			
		},
		/*
		 * @method toTop
		 * - ページ上部へ
		 */
		toTop: function(){
			var $elm = $('a[href="#top"]');
			
			if($(".js-bullet-nav").length > 0){
				$elm.on("click", function() {
					if($(window).width() >= 1025){
						var bulletItem = $(".js-bullet-nav").find(".bullet-nav__item");
						bulletItem.eq(0).click();
						return false;
					} else {
						$elm.on("click", function() {
							$( 'html,body' ).animate( {scrollTop:0}) ;
						});
					}
				});
			} else {
				$elm.on("click", function() {
					$( 'html,body' ).animate( {scrollTop:0}) ;
				});
			}
		},
		/*
		 * @method shareBox
		 */
		shareBox: function(){
			var $elm = $(".js-share-box");
			$elm.each(function() {
				var self = $(this),
					$trigger = self.children(".js-share-box__trigger"),
					$target = self.children(".js-share-box__body"),
					toggleClass = "is-active",
					speed = 200,
					hover__flg = false;
				
				$target.hide();
				
				$target.on("mouseover" , function(){
					hover__flg = true;
				}).on("mouseout" , function(){
					hover__flg = false;
				});
				
				$trigger.on("click", function(){
					var boxH = $target.innerHeight() + 5,
						boxW = $target.innerWidth()
						boxX = $trigger.position().left + $trigger.innerWidth() - boxW/3*2;
					
					$target.css({
						bottom: "-" + boxH + "px",
						left: boxX
					});
					
					if(self.hasClass(toggleClass)){
						self.removeClass(toggleClass);
						$target.stop().fadeOut(speed);
						return false;
					} else {
						self.addClass(toggleClass);
						$target.stop().fadeIn(speed);
						return false;
					}
				});
				$(".wrapper_").on("click", function(){
					if(!hover__flg){
						self.removeClass(toggleClass);
						$target.stop().fadeOut(speed);
					}
				});
			});
		},
		/*
		 * @method selectLang
		 */
		selectLang: function(){
			var $elm = $(".footer__primary .select--lang");
			
			$elm.on("change", function(){
				var hrefVal = $(this).val();
				
				// GA click count
				if(hrefVal.indexOf("www.mikimoto.com.hk/tc/") != -1){
					ga('send', 'event', '/la/01/ch', 'click');
				} else if(hrefVal.indexOf("www.mikimoto.com.hk/en/") != -1){
					ga('send', 'event', '/la/02/ch', 'click');
				} else if(hrefVal === '/sc/index.html' || hrefVal === 'http://cn.mikimoto.com/sc/index.html'){
					ga('send', 'event', '/la/03/ch', 'click');
				} else if(hrefVal.indexOf("www.mikimoto.com.tw/tc/") != -1){
					ga('send', 'event', '/la/04/ch', 'click');
				} else if(hrefVal.indexOf("www.mikimoto.sg/en/") != -1){
					ga('send', 'event', '/la/05/ch', 'click');
				} else if(hrefVal.indexOf("www.mikimoto.com/jp/") != -1){
					ga('send', 'event', '/la/06/ch', 'click');
				} else if(hrefVal.indexOf("www.mikimoto.com/en/") != -1){
					ga('send', 'event', '/la/07/ch', 'click');
				} else if(hrefVal.indexOf("www.mikimoto.com/sc/") != -1){
					ga('send', 'event', '/la/08/ch', 'click');
				} else if(hrefVal.indexOf("www.mikimoto.com/tc/") != -1){
					ga('send', 'event', '/la/09/ch', 'click');
				} else if(hrefVal.indexOf("www.mikimotoamerica.com") != -1){
					ga('send', 'event', '/la/10/ch', 'click');
				} else if(hrefVal.indexOf("www.mikimoto.co.uk") != -1){
					ga('send', 'event', '/la/11/ch', 'click');
				} else if(hrefVal.indexOf("www.mikimoto.fr") != -1){
					ga('send', 'event', '/la/12/ch', 'click');
				} else if(hrefVal.indexOf("www.mikimoto.ru.com") != -1){
					ga('send', 'event', '/la/13/ch', 'click');
				} else if(hrefVal.indexOf("www.mikimoto.it") != -1){
					ga('send', 'event', '/la/14/ch', 'click');
				}
				
				window.location.href = hrefVal;
			});
		},
		/*
		 * @method productsList
		 */
		productsList: function(){
			var winW = u.$win.width(),
				pathName = location.pathname,
				paths = pathName.split("/"),
				rangeCheck;
			
			if(paths[1] != "jp") { return false; }
			
			
			u.$win.on("load resize", function(){
				if (u.$win.width() <= 1024){
					rangeCheck = true;
				} else {
					rangeCheck = false;
					$(parentName).removeClass(toggleClassName);
				}
			});
			
			var parentName = ".product-fixed__item.js-touch-hover"
				$elm = $(parentName).children(".js-no-focus"),
				toggleClassName = "is-active";
					
				$elm.on("click", function(){
					if(rangeCheck){
						$(parentName).removeClass(toggleClassName);
						$(this).closest(parentName).addClass(toggleClassName);
						return false;
					}
				});
		},
		/*
		 * @method catalogMore
		 */
		catalogMore: function(){
			var $target = $('.js-filter-catalog-items'),
				$moreButton = $('.js-load-more-catalog'),
				$children = $target.children(),
				loadInterval = 12,
				speed = 200;
			
			if($target.length === 0){ return false;}
			
			$moreButton.parent()
				.show();
			
			if($children.length <= loadInterval){
				$moreButton.parent()
					.hide();
			} else {
				var i = 0;
				$children.show();
				$children.each(function(){
					if(i >= loadInterval){$(this).stop(true,true).fadeOut(speed); }
					i++;
				});
			}
			
			$moreButton.on("click", function(){
				var visibles = $target.children(':visible'),
					targetSize = $target.children().length,
					loadSize = visibles.length + loadInterval;
				
				if($moreButton.length === 0){ return false;}
				
				$target.children(':lt(' + loadSize + ')')
					.stop(true,true)
					.fadeIn(speed);
				
				if(loadSize >= targetSize){
					$moreButton.parent()
						.hide();
				}
				
				return false;
			});
		}
	};
}();


/* -------------------------------------------
 * @init
------------------------------------------- */
$(function(){
	var u = new MIKIMOTO.Util();
	
	MIKIMOTO.module.initialize();
	
	u.$win.on("load", function(){
		MIKIMOTO.module.equalHeight(true, true);
		MIKIMOTO.module.sizeFix();
		MIKIMOTO.module.shareBox();
		MIKIMOTO.module.catalogMore();
	});
	
});


/* -------------------------------------------
 * @PLUG IN
------------------------------------------- */
/*!
	Colorbox 1.6.4
	license: MIT
	http://www.jacklmoore.com/colorbox
*/
(function(t,e,i){function n(i,n,o){var r=e.createElement(i);return n&&(r.id=Z+n),o&&(r.style.cssText=o),t(r)}function o(){return i.innerHeight?i.innerHeight:t(i).height()}function r(e,i){i!==Object(i)&&(i={}),this.cache={},this.el=e,this.value=function(e){var n;return void 0===this.cache[e]&&(n=t(this.el).attr("data-cbox-"+e),void 0!==n?this.cache[e]=n:void 0!==i[e]?this.cache[e]=i[e]:void 0!==X[e]&&(this.cache[e]=X[e])),this.cache[e]},this.get=function(e){var i=this.value(e);return t.isFunction(i)?i.call(this.el,this):i}}function h(t){var e=W.length,i=(A+t)%e;return 0>i?e+i:i}function a(t,e){return Math.round((/%/.test(t)?("x"===e?E.width():o())/100:1)*parseInt(t,10))}function s(t,e){return t.get("photo")||t.get("photoRegex").test(e)}function l(t,e){return t.get("retinaUrl")&&i.devicePixelRatio>1?e.replace(t.get("photoRegex"),t.get("retinaSuffix")):e}function d(t){"contains"in x[0]&&!x[0].contains(t.target)&&t.target!==v[0]&&(t.stopPropagation(),x.focus())}function c(t){c.str!==t&&(x.add(v).removeClass(c.str).addClass(t),c.str=t)}function g(e){A=0,e&&e!==!1&&"nofollow"!==e?(W=t("."+te).filter(function(){var i=t.data(this,Y),n=new r(this,i);return n.get("rel")===e}),A=W.index(_.el),-1===A&&(W=W.add(_.el),A=W.length-1)):W=t(_.el)}function u(i){t(e).trigger(i),ae.triggerHandler(i)}function f(i){var o;if(!G){if(o=t(i).data(Y),_=new r(i,o),g(_.get("rel")),!U){U=$=!0,c(_.get("className")),x.css({visibility:"hidden",display:"block",opacity:""}),I=n(se,"LoadedContent","width:0; height:0; overflow:hidden; visibility:hidden"),b.css({width:"",height:""}).append(I),j=T.height()+k.height()+b.outerHeight(!0)-b.height(),D=C.width()+H.width()+b.outerWidth(!0)-b.width(),N=I.outerHeight(!0),z=I.outerWidth(!0);var h=a(_.get("initialWidth"),"x"),s=a(_.get("initialHeight"),"y"),l=_.get("maxWidth"),f=_.get("maxHeight");_.w=Math.max((l!==!1?Math.min(h,a(l,"x")):h)-z-D,0),_.h=Math.max((f!==!1?Math.min(s,a(f,"y")):s)-N-j,0),I.css({width:"",height:_.h}),J.position(),u(ee),_.get("onOpen"),O.add(F).hide(),x.focus(),_.get("trapFocus")&&e.addEventListener&&(e.addEventListener("focus",d,!0),ae.one(re,function(){e.removeEventListener("focus",d,!0)})),_.get("returnFocus")&&ae.one(re,function(){t(_.el).focus()})}var p=parseFloat(_.get("opacity"));v.css({opacity:p===p?p:"",cursor:_.get("overlayClose")?"pointer":"",visibility:"visible"}).show(),_.get("closeButton")?B.html(_.get("close")).appendTo(b):B.appendTo("<div/>"),w()}}function p(){x||(V=!1,E=t(i),x=n(se).attr({id:Y,"class":t.support.opacity===!1?Z+"IE":"",role:"dialog",tabindex:"-1"}).hide(),v=n(se,"Overlay").hide(),L=t([n(se,"LoadingOverlay")[0],n(se,"LoadingGraphic")[0]]),y=n(se,"Wrapper"),b=n(se,"Content").append(F=n(se,"Title"),R=n(se,"Current"),P=t('<button type="button"/>').attr({id:Z+"Previous"}),K=t('<button type="button"/>').attr({id:Z+"Next"}),S=t('<button type="button"/>').attr({id:Z+"Slideshow"}),L),B=t('<button type="button"/>').attr({id:Z+"Close"}),y.append(n(se).append(n(se,"TopLeft"),T=n(se,"TopCenter"),n(se,"TopRight")),n(se,!1,"clear:left").append(C=n(se,"MiddleLeft"),b,H=n(se,"MiddleRight")),n(se,!1,"clear:left").append(n(se,"BottomLeft"),k=n(se,"BottomCenter"),n(se,"BottomRight"))).find("div div").css({"float":"left"}),M=n(se,!1,"position:absolute; width:9999px; visibility:hidden; display:none; max-width:none;"),O=K.add(P).add(R).add(S)),e.body&&!x.parent().length&&t(e.body).append(v,x.append(y,M))}function m(){function i(t){t.which>1||t.shiftKey||t.altKey||t.metaKey||t.ctrlKey||(t.preventDefault(),f(this))}return x?(V||(V=!0,K.click(function(){J.next()}),P.click(function(){J.prev()}),B.click(function(){J.close()}),v.click(function(){_.get("overlayClose")&&J.close()}),t(e).bind("keydown."+Z,function(t){var e=t.keyCode;U&&_.get("escKey")&&27===e&&(t.preventDefault(),J.close()),U&&_.get("arrowKey")&&W[1]&&!t.altKey&&(37===e?(t.preventDefault(),P.click()):39===e&&(t.preventDefault(),K.click()))}),t.isFunction(t.fn.on)?t(e).on("click."+Z,"."+te,i):t("."+te).live("click."+Z,i)),!0):!1}function w(){var e,o,r,h=J.prep,d=++le;if($=!0,q=!1,u(he),u(ie),_.get("onLoad"),_.h=_.get("height")?a(_.get("height"),"y")-N-j:_.get("innerHeight")&&a(_.get("innerHeight"),"y"),_.w=_.get("width")?a(_.get("width"),"x")-z-D:_.get("innerWidth")&&a(_.get("innerWidth"),"x"),_.mw=_.w,_.mh=_.h,_.get("maxWidth")&&(_.mw=a(_.get("maxWidth"),"x")-z-D,_.mw=_.w&&_.w<_.mw?_.w:_.mw),_.get("maxHeight")&&(_.mh=a(_.get("maxHeight"),"y")-N-j,_.mh=_.h&&_.h<_.mh?_.h:_.mh),e=_.get("href"),Q=setTimeout(function(){L.show()},100),_.get("inline")){var c=t(e).eq(0);r=t("<div>").hide().insertBefore(c),ae.one(he,function(){r.replaceWith(c)}),h(c)}else _.get("iframe")?h(" "):_.get("html")?h(_.get("html")):s(_,e)?(e=l(_,e),q=_.get("createImg"),t(q).addClass(Z+"Photo").bind("error."+Z,function(){h(n(se,"Error").html(_.get("imgError")))}).one("load",function(){d===le&&setTimeout(function(){var e;_.get("retinaImage")&&i.devicePixelRatio>1&&(q.height=q.height/i.devicePixelRatio,q.width=q.width/i.devicePixelRatio),_.get("scalePhotos")&&(o=function(){q.height-=q.height*e,q.width-=q.width*e},_.mw&&q.width>_.mw&&(e=(q.width-_.mw)/q.width,o()),_.mh&&q.height>_.mh&&(e=(q.height-_.mh)/q.height,o())),_.h&&(q.style.marginTop=Math.max(_.mh-q.height,0)/2+"px"),W[1]&&(_.get("loop")||W[A+1])&&(q.style.cursor="pointer",t(q).bind("click."+Z,function(){J.next()})),q.style.width=q.width+"px",q.style.height=q.height+"px",h(q)},1)}),q.src=e):e&&M.load(e,_.get("data"),function(e,i){d===le&&h("error"===i?n(se,"Error").html(_.get("xhrError")):t(this).contents())})}var v,x,y,b,T,C,H,k,W,E,I,M,L,F,R,S,K,P,B,O,_,j,D,N,z,A,q,U,$,G,Q,J,V,X={html:!1,photo:!1,iframe:!1,inline:!1,transition:"elastic",speed:300,fadeOut:300,width:!1,initialWidth:"600",innerWidth:!1,maxWidth:!1,height:!1,initialHeight:"450",innerHeight:!1,maxHeight:!1,scalePhotos:!0,scrolling:!0,opacity:.9,preloading:!0,className:!1,overlayClose:!0,escKey:!0,arrowKey:!0,top:!1,bottom:!1,left:!1,right:!1,fixed:!1,data:void 0,closeButton:!0,fastIframe:!0,open:!1,reposition:!0,loop:!0,slideshow:!1,slideshowAuto:!0,slideshowSpeed:2500,slideshowStart:"start slideshow",slideshowStop:"stop slideshow",photoRegex:/\.(gif|png|jp(e|g|eg)|bmp|ico|webp|jxr|svg)((#|\?).*)?$/i,retinaImage:!1,retinaUrl:!1,retinaSuffix:"@2x.$1",current:"image {current} of {total}",previous:"previous",next:"next",close:"close",xhrError:"This content failed to load.",imgError:"This image failed to load.",returnFocus:!0,trapFocus:!0,onOpen:!1,onLoad:!1,onComplete:!1,onCleanup:!1,onClosed:!1,rel:function(){return this.rel},href:function(){return t(this).attr("href")},title:function(){return this.title},createImg:function(){var e=new Image,i=t(this).data("cbox-img-attrs");return"object"==typeof i&&t.each(i,function(t,i){e[t]=i}),e},createIframe:function(){var i=e.createElement("iframe"),n=t(this).data("cbox-iframe-attrs");return"object"==typeof n&&t.each(n,function(t,e){i[t]=e}),"frameBorder"in i&&(i.frameBorder=0),"allowTransparency"in i&&(i.allowTransparency="true"),i.name=(new Date).getTime(),i.allowFullscreen=!0,i}},Y="colorbox",Z="cbox",te=Z+"Element",ee=Z+"_open",ie=Z+"_load",ne=Z+"_complete",oe=Z+"_cleanup",re=Z+"_closed",he=Z+"_purge",ae=t("<a/>"),se="div",le=0,de={},ce=function(){function t(){clearTimeout(h)}function e(){(_.get("loop")||W[A+1])&&(t(),h=setTimeout(J.next,_.get("slideshowSpeed")))}function i(){S.html(_.get("slideshowStop")).unbind(s).one(s,n),ae.bind(ne,e).bind(ie,t),x.removeClass(a+"off").addClass(a+"on")}function n(){t(),ae.unbind(ne,e).unbind(ie,t),S.html(_.get("slideshowStart")).unbind(s).one(s,function(){J.next(),i()}),x.removeClass(a+"on").addClass(a+"off")}function o(){r=!1,S.hide(),t(),ae.unbind(ne,e).unbind(ie,t),x.removeClass(a+"off "+a+"on")}var r,h,a=Z+"Slideshow_",s="click."+Z;return function(){r?_.get("slideshow")||(ae.unbind(oe,o),o()):_.get("slideshow")&&W[1]&&(r=!0,ae.one(oe,o),_.get("slideshowAuto")?i():n(),S.show())}}();t[Y]||(t(p),J=t.fn[Y]=t[Y]=function(e,i){var n,o=this;return e=e||{},t.isFunction(o)&&(o=t("<a/>"),e.open=!0),o[0]?(p(),m()&&(i&&(e.onComplete=i),o.each(function(){var i=t.data(this,Y)||{};t.data(this,Y,t.extend(i,e))}).addClass(te),n=new r(o[0],e),n.get("open")&&f(o[0])),o):o},J.position=function(e,i){function n(){T[0].style.width=k[0].style.width=b[0].style.width=parseInt(x[0].style.width,10)-D+"px",b[0].style.height=C[0].style.height=H[0].style.height=parseInt(x[0].style.height,10)-j+"px"}var r,h,s,l=0,d=0,c=x.offset();if(E.unbind("resize."+Z),x.css({top:-9e4,left:-9e4}),h=E.scrollTop(),s=E.scrollLeft(),_.get("fixed")?(c.top-=h,c.left-=s,x.css({position:"fixed"})):(l=h,d=s,x.css({position:"absolute"})),d+=_.get("right")!==!1?Math.max(E.width()-_.w-z-D-a(_.get("right"),"x"),0):_.get("left")!==!1?a(_.get("left"),"x"):Math.round(Math.max(E.width()-_.w-z-D,0)/2),l+=_.get("bottom")!==!1?Math.max(o()-_.h-N-j-a(_.get("bottom"),"y"),0):_.get("top")!==!1?a(_.get("top"),"y"):Math.round(Math.max(o()-_.h-N-j,0)/2),x.css({top:c.top,left:c.left,visibility:"visible"}),y[0].style.width=y[0].style.height="9999px",r={width:_.w+z+D,height:_.h+N+j,top:l,left:d},e){var g=0;t.each(r,function(t){return r[t]!==de[t]?(g=e,void 0):void 0}),e=g}de=r,e||x.css(r),x.dequeue().animate(r,{duration:e||0,complete:function(){n(),$=!1,y[0].style.width=_.w+z+D+"px",y[0].style.height=_.h+N+j+"px",_.get("reposition")&&setTimeout(function(){E.bind("resize."+Z,J.position)},1),t.isFunction(i)&&i()},step:n})},J.resize=function(t){var e;U&&(t=t||{},t.width&&(_.w=a(t.width,"x")-z-D),t.innerWidth&&(_.w=a(t.innerWidth,"x")),I.css({width:_.w}),t.height&&(_.h=a(t.height,"y")-N-j),t.innerHeight&&(_.h=a(t.innerHeight,"y")),t.innerHeight||t.height||(e=I.scrollTop(),I.css({height:"auto"}),_.h=I.height()),I.css({height:_.h}),e&&I.scrollTop(e),J.position("none"===_.get("transition")?0:_.get("speed")))},J.prep=function(i){function o(){return _.w=_.w||I.width(),_.w=_.mw&&_.mw<_.w?_.mw:_.w,_.w}function a(){return _.h=_.h||I.height(),_.h=_.mh&&_.mh<_.h?_.mh:_.h,_.h}if(U){var d,g="none"===_.get("transition")?0:_.get("speed");I.remove(),I=n(se,"LoadedContent").append(i),I.hide().appendTo(M.show()).css({width:o(),overflow:_.get("scrolling")?"auto":"hidden"}).css({height:a()}).prependTo(b),M.hide(),t(q).css({"float":"none"}),c(_.get("className")),d=function(){function i(){t.support.opacity===!1&&x[0].style.removeAttribute("filter")}var n,o,a=W.length;U&&(o=function(){clearTimeout(Q),L.hide(),u(ne),_.get("onComplete")},F.html(_.get("title")).show(),I.show(),a>1?("string"==typeof _.get("current")&&R.html(_.get("current").replace("{current}",A+1).replace("{total}",a)).show(),K[_.get("loop")||a-1>A?"show":"hide"]().html(_.get("next")),P[_.get("loop")||A?"show":"hide"]().html(_.get("previous")),ce(),_.get("preloading")&&t.each([h(-1),h(1)],function(){var i,n=W[this],o=new r(n,t.data(n,Y)),h=o.get("href");h&&s(o,h)&&(h=l(o,h),i=e.createElement("img"),i.src=h)})):O.hide(),_.get("iframe")?(n=_.get("createIframe"),_.get("scrolling")||(n.scrolling="no"),t(n).attr({src:_.get("href"),"class":Z+"Iframe"}).one("load",o).appendTo(I),ae.one(he,function(){n.src="//about:blank"}),_.get("fastIframe")&&t(n).trigger("load")):o(),"fade"===_.get("transition")?x.fadeTo(g,1,i):i())},"fade"===_.get("transition")?x.fadeTo(g,0,function(){J.position(0,d)}):J.position(g,d)}},J.next=function(){!$&&W[1]&&(_.get("loop")||W[A+1])&&(A=h(1),f(W[A]))},J.prev=function(){!$&&W[1]&&(_.get("loop")||A)&&(A=h(-1),f(W[A]))},J.close=function(){U&&!G&&(G=!0,U=!1,u(oe),_.get("onCleanup"),E.unbind("."+Z),v.fadeTo(_.get("fadeOut")||0,0),x.stop().fadeTo(_.get("fadeOut")||0,0,function(){x.hide(),v.hide(),u(he),I.remove(),setTimeout(function(){G=!1,u(re),_.get("onClosed")},1)}))},J.remove=function(){x&&(x.stop(),t[Y].close(),x.stop(!1,!0).remove(),v.remove(),G=!1,x=null,t("."+te).removeData(Y).removeClass(te),t(e).unbind("click."+Z).unbind("keydown."+Z))},J.element=function(){return t(_.el)},J.settings=X)})(jQuery,document,window);

$(function(){
	$(".js-show-qr").colorbox({closeButton: false, className: "show-qr", title: false});
});