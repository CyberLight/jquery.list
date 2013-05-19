(function($){
    var ENTER_KEY_CODE = 13;

    var methods = {
	init : function(options){
	    return this.each(function(){
		var $input = $('<input/>', { type : "text"}).addClass('jqlist-input-item');

		$input.bind('keyup.jqlist', function(e){

			if(e.keyCode == ENTER_KEY_CODE){
			    var $inputElem = $(this);
			        $listDiv = $inputElem.closest('div').children('div'),
			        $link = $('<a/>', {link : '#'})
				         .text('remove')
				         .click(function(e){
					     e.stopPropagation();
					     $(this).closest('.jqlist-item-placeholder').remove();
					 }),
			        $itemDiv = $('<div></div>')
				            .addClass('jqlist-item-placeholder')
			 	            .append($('<span></span>')
						    .text($inputElem.val()))
				            .append($link);

			    $listDiv.append($itemDiv);
			    $inputElem.val('');
			}
			
		});

		$(this)
		    .addClass("jqlist-parent")
		    .append($input)
		    .append($('<div></div>').addClass('jqlist-items-list'));
	    });
	},
	
	removeAll : function(){
	    return this.each(function(){
		$(this).children('div.jqlist-items-list').empty();
	    });
	},
	
	removeByIdx : function(index){
	    return this.each(function(){
		$(this)
		    .children('div.jqlist-items-list')
		    .find('div:nth-child('+ parseInt(index) +')')
		    .remove();
	    });
	}
    } 

    $.fn.list = function(method){
	if (methods[method]) {
	    return methods[method].apply( this, Array.prototype.slice.call(arguments, 1));
	} else if (typeof method === 'object' || !method) {
	    return methods.init.apply(this, arguments);
	} else {
	    $.error('Method with name ' +  method + ' not found in jQuery.list plugin');
	} 
    };
})(jQuery); 
