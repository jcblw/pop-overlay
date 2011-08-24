/*
* Pop-Overlay 1 alpha - jQuery plugin
*
* Copyright (c) 2011 Jacob Lowe (http://redeyeoperations.com)
* Dual licensed under the MIT (MIT-LICENSE.txt)
* and GPL (GPL-LICENSE.txt) licenses.
*
* Built for jQuery library
* http://jquery.com
*/

(function ($) {
    
    var pops = {
	    count: [],
	    state: null,
	    current: null
    }

	$.fn.popOverlay = function(opts){
	 
	// setting varibles
	   
	    var defaults =  {
		
		transitionSpeed: 500,
		border: 10
		
	    },
		$this = $(this),
		options = $.extend({}, defaults, opts),
		
		// TODO : Seperate
		
		borderToggle = function () {
		    
		    var border = $('.pop-Border'),
			    borderSize =  - options.border;
		    
		    if(parseFloat(border.css('top')) === 0 || pops.state === 1){
		    
			    border.css({
				    
				    left: borderSize,
				    right: borderSize,
				    top: borderSize,
				    bottom: borderSize
				    
			    });
			    
		    }else{
			
			    border.css({
				    
				    left: 0,
				    right: 0,
				    top: 0,
				    bottom: 0
				    
			    });
			
		    }

		},
		resizeContent = function () {
		    
			var h = $('#load-img').find('img').height(),
				w = $('#load-img').find('img').width(),
				ya = $(window).width() / 2,
				xa = $(window).height() / 2,
				end = {
				    marginTop : xa - (h / 2),
				    marginLeft : ya - (w / 2),
				    height: h,
				    width: w
				},
				content = $('#pop-Content'),
				move = {
				    out: function () {
					
					content
					    .css(pops[pops.current]['start'])
					    .animate(end ,options.transitionSpeed);
					
				    },
				    
				    into: function () {
					
					    content.animate(pops[pops.current]['start'], options.transitionSpeed);
				    
				    } 
				}
			
			if(end.marginTop < 0){
				var ratio = null,
					newHeight = $(window).height() - 40,
					newWidth = null;
				if (h < w) {
					ratio = w / h;
					newWidth = newHeight * ratio;
					
				} else {
					ratio = h / w
					newWidth = newHeight / ratio;
				    
				}
				end.marginTop = 20;
				end.height = newHeight;
				end.width = newWidth;
				end.marginLeft = ya - (newWidth / 2);
				
			}
			
			//console.log([end.marginTop, end.marginLeft, end.height, end.width, ratio]);
			
			if(pops.state === null || pops.state === 0){
			
				move.out();
				
				pops.state = 1;
			
				
			}else{
				
				
				move.into();
				
				window.setTimeout(function () {
				
					$('#pop-Overlay').hide();
					
					pops.state = 0;
				    
				}, options.transitionSpeed);
			}
			  
		},
		transition = function () {
		    
		//basic transiton varibles
		
			var main = $('#pop-Container');
			  
			    
			    
			if(pops.state === null || pops.state === 0){
			    
				
			
				main.show();
				
				resizeContent();
			    
				window.setTimeout(function(){
				    
					borderToggle();
					
				},options.transitionSpeed);
			    
			}else{
			    
				resizeContent();
			    
				borderToggle();

			    
			}
			    
	    
	    
			
	    
		},
		
		add = function (element, x) {
		    
		    var ele = element.find('img'),
			    eleOff = ele.offset(),
			    start = {
				    marginTop : eleOff.top,
				    marginLeft : eleOff.left,
				    height : ele.height(),
				    width : ele.width()
			    },
			    origin = {
				x : eleOff.left,
				y : eleOff.top,
				height : ele.height(),
				width : ele.width()
			    }
			    events = function () {
				
				
				    element.bind('click', function () {
					
					
					
					var rel = $(this).attr('rel'),
						i = parseFloat(rel.replace('pop-', '')),
						img = element.attr('href'),
						loading = $('#load-img'),
						loadingImg = null,
						yScroll = window.pageYOffset || document.body.scrollTop;
						
					pops[i]['start']['marginTop'] = pops[i]['origin']['y'] - yScroll;
					pops.current = i;
					
					//console.log([i, yScroll]);
					
					
					loading.html('<img src="' + img + '" />');
					
					loadingImg = $('#load-img').find('img')
					
					$('#pop-Overlay').show();
	    
					
							
					loadingImg.one("load", function () {
					    
						$('.pop-Stuff').html('<img src="' + img + '" />');
						
						transition();
								
					}).each(function () {
							    
						if (this.complete || ($.browser.msie && parseInt($.browser.version, 10) === 6)) {
								    
							$(this).trigger("load");
									
						}
								
					});
					
					
							     
					
					return false;
					
					
					
				    });
				    
				    
				    
			    }
			    
		    
			    
		    
		    
		    element.attr('rel', 'pop-' + x);
			    
		    pops[x] = {
			start : start,
			origin: origin
		    }
		    
		    events();
		    
		    
		    if (!$('#pop-Overlay').length) {
			
			    $('body').append('<div id="pop-Overlay">\
					    <div id="pop-Container">\
						    <div id="pop-Content">\
							    <div class="pop-Border"></div>\
							    <div class="pop-Stuff">\
							    </div>\
						    </div>\
					    </div>\
				    </div>\
				    <div id="load-img"></div>');
			
		    }
		    
		},
		setborder = function () {
		    $('#pop-Close').css('border-width', options.border + 'px');
		}
		
		$this.each(function () {
		    
		    var ele = $(this),
			    img = ele.find('img');
		    
		    
		    pops.count.push(0);
		    
		    var index = pops.count.length;
		    
		    img.one("load", function () {
			    
			    add(ele, index);
			    
		    }).each(function () {
			    if (this.complete || ($.browser.msie && parseInt($.browser.version, 10) === 6)) {
				    $(this).trigger("load");
			    }
		    });
		    
		    
		    
		    
		})
		
		//adding to bottom to avoid doubling up
		
		$('#pop-Close, #pop-Overlay, .pop-Stuff').bind('click', function(){
		    
			if(!$('#pop-Content').is(':animated') || !$('.pop-Border').is(':animated')){
			    var i = pops.current,
				    yScroll = window.pageYOffset || document.body.scrollTop;
				    
			    //console.log([i, yScroll]);
			    
			    
			
			    pops[i]['start']['marginTop'] = pops[i]['origin']['y'] - yScroll;
					    
			    transition();
			}
					
		});
		
		//setborder();

	    
	}

}(jQuery));