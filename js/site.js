
// initialize custom scrollbar only for desktop browsers
var htmlScrollbar = false;
if (!navigator.userAgent.toLowerCase().match(/(iphone|ipod|ipad|android)/)) {
	htmlScrollbar = $("html").niceScroll({
		cursoropacitymax   : 1,
		cursorcolor        : '#8A0808',
		cursorwidth        : '10px',
		cursorborder       : '0',
		cursorborderradius : '0',
		cursorminheight    : 50,
		hidecursordelay    : 400,
		mousescrollstep    : 50,
		grabcursorenabled  : false,
		dblclickzoom       : false,
		horizrailenabled   : false
	});
}

jQuery('html').removeClass('no-js');

jQuery(document).ready(function () {

	jQuery('.tooltip').tip();
	jQuery('.tabs').tabify();
	jQuery('select').customSelect();

	jQuery('.accordion .accordion-title').click(function(e){
		$li = jQuery(this).parent('li');
		$ul = $li.parent('.accordion');
		// check if only one accordion can be opened at a time
		if ($ul.hasClass('only-one-visible')) {
			jQuery('li',$ul).not($li).removeClass('active');
		}
		$li.toggleClass('active');
		e.preventDefault();
	});

	if ( (jQuery('#quick-message').length>0) && jQuery.cookie ) {
		if ( jQuery.cookie('quickMessage') === 'quickMessageAccepted' && jQuery.cookie('quickMessageText') === jQuery('#quick-message .message').text() ) {
			jQuery('#quick-message').remove();
		} else {
			jQuery('#quick-message').slideDown();
			jQuery('#quick-message span.button').click(function(e) {
				jQuery('#quick-message').slideUp(function() {
					jQuery('#quick-message').remove();
				});
				if (jQuery.cookie) {
					jQuery.cookie('quickMessage', 'quickMessageAccepted', { expires: 14, path: '/' });
					jQuery.cookie('quickMessageText', jQuery('#quick-message .message').text(), { expires: 14, path: '/' });
				} else {
					jQuery.error('The jQuery.cookie plugin was not found, install this and try again!');
				}
				e.preventDefault();
			});
		}
	}

	jQuery('#menu li').hover(
		function () {
			jQuery(this).addClass("hover");
		},
		function () {
			jQuery(this).removeClass("hover");
		}
	);

	jQuery('#menu li.arrow > a').click( function (e) {
		$el = jQuery(this).parent();
		if ($el.hasClass('arrow')) {
			e.preventDefault();
			$el.toggleClass("hover");
			if ($el.parents('#menu').hasClass('mobile')) {
				$el.toggleClass('show-menu');
			}
		}
	});

	jQuery('#menu-switch').click(function(e) {
		jQuery(this).toggleClass('hover');
		jQuery('#menu').toggleClass('mobile');
		if (htmlScrollbar) htmlScrollbar.resize();
		return false;
	});

	jQuery(document).click(function(e) {
		if (jQuery('#menu.mobile').length == 0) return;
		if (jQuery(e.target).parents('#menu').length > 0) return;
		jQuery('#menu-switch').removeClass('hover');
		jQuery('#menu').removeClass('mobile');
		if (htmlScrollbar) htmlScrollbar.resize();
	});

	jQuery(window).smartresize(function() {
		if ($(window).width() >= 768) {
			jQuery('#menu-switch').removeClass('hover');
			jQuery('#menu').removeClass('mobile');
			jQuery('#tooltip:visible').css("opacity", 0);
		}
		jQuery('select.hasCustomSelect').trigger('update');
	});
});

(function($) {
    $.fn.tip = function(options) {
        return this.each(function() {
            var settings = {
                offset: 5
            };
            if (options) $.extend(settings, options);
            var $tip_target = $(this), $tip_elem = $('#tooltip'), tip = $tip_target.attr('title');
            if( !tip || tip == '' ) return false;
            if ($tip_elem.length == 0) {
                $tip_elem = $('<div id="tooltip"></div>');
                $tip_elem.appendTo('body');
            }
            $tip_target.removeAttr('title').data('tip',tip);

            $tip_target.on('mouseenter', function(e) {
            	$target = $(this);
            	$tip_elem.html($target.data('tip'));
                if( $(window).width() < $tip_elem.outerWidth() * 1.5 ) {
                    $tip_elem.css( 'max-width', $(window).width() / 2 );
                }

                var pos_left = $target.offset().left + ( $target.outerWidth() / 2 ) - ( $tip_elem.outerWidth() / 2 ),
                    pos_top  = $target.offset().top - $tip_elem.outerHeight() - settings.offset;
     
                if( pos_left < 0 ) {
                    pos_left = $target.offset().left + $target.outerWidth() / 2 - settings.offset;
                    $tip_elem.addClass( 'left' );
                }
                else
                    $tip_elem.removeClass( 'left' );
     
                if( pos_left + $tip_elem.outerWidth() > $( window ).width() )
                {
                    pos_left = $target.offset().left - $tip_elem.outerWidth() + $target.outerWidth() / 2 + settings.offset;
                    $tip_elem.addClass( 'right' );
                }
                else
                    $tip_elem.removeClass( 'right' );
     
                if( pos_top < 0 )
                {
                    var pos_top  = $target.offset().top + $target.outerHeight() + settings.offset;
                    $tip_elem.addClass( 'top' );
                }
                else
                    $tip_elem.removeClass( 'top' );
     
                $tip_elem.css( { left: pos_left, top: pos_top, display: 'block' } ).stop().animate( { opacity: 1 }, 50 );

            });

			$tip_target.on('mouseleave click', function(e) {
            	$target = $(this);
				$tip_elem.stop().animate( { opacity: 0 }, 50);
			});
        });
    }
})(jQuery);