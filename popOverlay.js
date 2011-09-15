/*
* Pop-Overlay 0.2  - jQuery plugin
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
    };

	$.fn.popOverlay = function(opts){
	 
	// setting varibles
	   
	    var defaults =  {
		
		speed: 500,
		border: 10
		
	    },
		options = $.extend({}, defaults, opts),
		
		// TODO : Seperate
		cue = function (i) {
		    
			var nextNum = (i == pops.count.length) ? 1 : i + 1,
				prevNum = (i == 1) ? pops.count.length : i - 1;
				
			$('#pop-Prev').attr('rel', prevNum);
						
			$('#pop-Next').attr('rel', nextNum);
			
			pops.current = i;

			$('#pop-Position').html(pops.current + ' / ' + pops.count.length);
		    
		},
		
		border = {
		    
		    hide: function () {
			
			    var border = $('.pop-Border');
			    
			    border.css({
				    opacity: 0,
				    left: 0,
				    right: 0,
				    top: 0,
				    bottom: 0
			    });
			    
		    },
		    
		    show: function () {
			
			    var border = $('.pop-Border'),
				    borderSize =  - options.border;
				    
			    border.css({
				    opacity: .7,
				    left: borderSize,
				    right: borderSize,
				    top: borderSize,
				    bottom: borderSize
					
			    });
			    
		    }
		    
		    
		},
		pop = {
		    
		    out: function (gal) {
			
			    //defining end point for pop.out
			    //landing in the center
			
			    var img = $('#load-img').find('img'),
				    h = img.height(),
				    w = img.width(),
				    ya = $(window).width() / 2,
				    xa = $(window).height() / 2,
				    end = {
					
					    marginTop : xa - (h / 2),
					    marginLeft : ya - (w / 2),
					    height: h,
					    width: w,
					    opacity: 1
					    
				    };
				    
			    //Checking to see if image fits in window
				    
			    if(end.marginTop < 0){
				
				    // resize heights and widths - image is too big
				
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
				    
				    // Changing variables in end object
				    
				    end.marginTop = 20;
				    end.height = newHeight;
				    end.width = newWidth;
				    end.marginLeft = ya - (newWidth / 2);
				    
			    }
			    
			    //Show the Container
			    
			    $('#pop-Container').show();
			    
			    // Animate the Content to the Center of the page
			    
			    
				    
			    if(gal){
				
				    $('#pop-Content')
					.css(end);
				
			    }else{
				
				    $('#pop-Content')
					.css(pops[pops.current]['start'])
					.animate(end ,options.speed);
				
			    }
				    
			    pops.state = 1;
			    
			    window.setTimeout(function(){
				    
				    border.show();
					
			    },options.speed);
			
		    },
		    back: function () {
			
			    $('#pop-Content').animate(pops[pops.current]['start'], options.speed);
			    
			    border.hide();
			    
			    window.setTimeout(function () {
				    
				    $('#pop-Overlay').hide();
						    
				    pops.state = 0;
						
			    }, options.speed);
			
		    },
		    change: function () {
			
		    }
		},
		
		transition = function (){
			  
			//Handling pop.out or pop.back based off of state.    
			    
			if(pops.state === null || pops.state === 0){
			    	
				pop.out();
			    
			}else{
			    
				pop.back();
				
			}
			    
	    
	    
			
	    
		},
		
		add = function (element, x) {
		    
		    var ele = element.find('img'),
			    eleOff = ele.offset(),
			    start = {
				
				    marginTop : eleOff.top + 5,
				    marginLeft : eleOff.left + 5,
				    height : ele.height(),
				    width : ele.width(),
				    opacity: 0
				    
			    },
			    origin = {
				
				    x : eleOff.left + 5,
				    y : eleOff.top + 5,
				    height : ele.height(),
				    width : ele.width(),
				    img : element.attr('href')
				    
			    },
			    
			    event = {
				
				pop : function () {
				    
				    element.bind(
					'click', function () {
					
					//console.log(pops)
					
					var rel = $(this).attr('rel'),
						i = parseFloat(rel.replace('pop-', '')),
						img = element.attr('href'),
						yScroll = window.pageYOffset || document.body.scrollTop,
						loading = $('#load-img'),
						loadingImg = null;
						
						
					pops[i]['start']['marginTop'] = pops[i]['origin']['y'] - yScroll;					
					
					
					
					
					loading.html('<img src="' + img + '" height: 100%; width: 100%;/>');
					
					loadingImg = $('#load-img').find('img');
					
					$('#pop-Overlay').show();
					
					//console.log('break');
	    
					
							
					loadingImg.one("load", function () {
					    
					    
						$('.pop-Stuff').html('<img src="' + img + '" />');
						
						cue(i);
						
						transition();
								
					}).each(function () {
							    
						if (this.complete || ($.browser.msie && parseInt($.browser.version, 10) === 6)) {
								    
							$(this).trigger("load");
									
						}
								
					});
					
					
							     
					return false;
					
					
					
					
					});
				    
				},
				close : function () {
				    
				    $('#pop-Close, .pop-Border').bind('click', function(){
		    
					    if(!$('#pop-Content').is(':animated') || !$('.pop-Border').is(':animated')){
						var i = pops.current,
							yScroll = window.pageYOffset || document.body.scrollTop;
							
						//console.log([i, yScroll]);
						
						
					    
						pops[i]['start']['marginTop'] = pops[i]['origin']['y'] - yScroll;
								
						transition();
					    }
							
				    });
				    
				},
				change : function () {
				    
				    //event.change is for gallery changes similar to pop but less event full
				    
				    $('#pop-Next, #pop-Prev').bind('click', function () {
					
					    var rel = $(this).attr('rel'),
						img = pops[rel].origin.img,
						loading = $('#load-img'),
						loadingImg = null;
						
					pops.current = rel;					
					
					
					loading.html('<img src="' + img + '" />');
					
					loadingImg = $('#load-img').find('img');
					
					$('#pop-Overlay').show();
	    
					
							
					loadingImg.one("load", function () {
					    
						$('.pop-Stuff').html('<img src="' + img + '" />');
						
						cue(parseFloat(rel));
                                                
                                                // Bypass Transition and pass in value true to signal not voming from transition
						
						pop.out(true);
								
					}).each(function () {
							    
						if (this.complete || ($.browser.msie && parseInt($.browser.version, 10) === 6)) {
								    
							$(this).trigger("load");
									
						}
								
					});
					
				    });
				}
				
			    };
			    
		    
			    
		    
		    
		    
			    
		    pops[x] = {
			
			    start : start,
			    origin: origin
		    }
		    
		    event.pop();
		    
		    if (!$('#pop-Overlay').length) {
			
			    $('body').append('<div id="pop-Overlay">\
					    <div id="pop-Container">\
						    <div id="pop-Content">\
							    <div class="pop-Border"></div>\
							    <div class="pop-Stuff"></div>\
							    <div id="pop-Meta">\
								<a id="pop-Close">Close</a>\
							    </div>\
						    </div>\
					    </div>\
				    </div>\
				    <div id="load-img"></div>');
			    
			    event.close();
			    
			    
			
		    }
                    
                    // If there is more than one picture enable gallery
                    
                    if(x == 2){
                      
                        $('#pop-Meta').append(  '<a id="pop-Prev">Prev</a>\
                                                <span id="pop-Position"></span>\
                                                <a id="pop-Next">Next</a>');
                      
                        event.change();
                      
                    }
		    
		};

		
		$(this).each(function () {
		    
		    
		    //Extra code added if hidden dont add to list
		    
		    
		    var ele = $(this),
			    img = ele.find('img');
			    
		    if(!img.is(':hidden')){
		    
			    pops.count.push(0);
			    
			    var index = pops.count.length;
			    
			    ele.attr('rel', 'pop-' + index);
			    
			    img.one("load", function () {
				    
				    add(ele, index);
				    
			    }).each(function () {
				    if (this.complete || ($.browser.msie && parseInt($.browser.version, 10) === 6)) {
					    $(this).trigger("load");
				    }
			    });
			    
		    }
		    
		    
		    
		    
		});
		


	    
	}

}(jQuery));