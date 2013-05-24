(function($){
    var constants = { 
	ENTER_KEY_CODE: 13
    };

    var methods = {
	init : function(options){
	    var $this = this,
   	        settings = { filterMode : false },
	        data = $this.data('jqlist', { settings : settings, widgets : {} });

	    return $this.each(function(){
		var $input = $('<input/>', { type : "text"}).addClass('jqlist-input-item'),
		    $filterIconDiv = $('<div></div>')
		                      .addClass('jqlist-filter-icon')
		                      .addClass('filter-not-active');
		
		$input.bind('keyup.jqlist', function(e){

			if(e.keyCode == constants.ENTER_KEY_CODE){
			    var $inputElem = $(this);
			    methods.addItem.call($this, $inputElem.val());
			    $inputElem.val('');
			}
			
		});

		$(this)
		    .addClass("jqlist-parent")
		    .append($input)
		    .append($filterIconDiv)
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
	},
	
	addItem : function(itemText){
	    return this.each(function(){
		var $listDiv = $(this).children('div.jqlist-items-list'),
		    $link = $('<a/>', {href : '#'})
		              .text('remove')
		              .click(function(e){
				  e.stopPropagation();
				  $(this).closest('.jqlist-item-placeholder').remove();
			      }),
		    $itemDiv = $('<div></div>')
		              .addClass('jqlist-item-placeholder')
		              .append($('<span></span>')
				      .text(itemText))
		              .append($link);
		
		$listDiv.append($itemDiv);
	    });
	},
	
	addItems : function(items){
	    var $this = this;
	    return $this.each(function(){
		items.forEach(function(item){
		    methods.addItem.call($this, item);  
		});
	    });
	},
	
	getItems : function(){
	    var itemsToReturn = [];
	    
	    $(this)
		.children('div.jqlist-items-list')
		.children('div.jqlist-item-placeholder')
		.each(function(index, item){
		    itemsToReturn.push($(item).children('span').text());
		});
	    
	    return itemsToReturn;
	},
	
	filterMode : function(){
	    var data = $(this).data('jqlist');	
	        $filterIconDiv = $(this).find('.jqlist-filter-icon');
	    
	    if(arguments.length > 0)
		data.settings.filterMode = arguments[0];

	    if(data.settings.filterMode){
		$filterIconDiv
		    .removeClass('filter-not-active')
		    .addClass('filter-active');
	    }else{
		$filterIconDiv
		    .removeClass('filter-active')
		    .addClass('filter-not-active');
	    }
	    

	    return data.settings.filterMode;
	},
	
	destroy : function(){
	    var $input = $(this).find('.jqlist-input-item');
	    $input.unbind('keyup.jqlist');
	    $(this).empty().removeClass('jqlist-parent');
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
