(function($){
    var methods = {
	init : function(options){
	    return this.each(function(){
		$(this)
		    .addClass("jqlist-parent")
		    .append('<input type="text" class="jqlist-input-item" value=""/>')
		    .append('<div class="jqlist-list-item"/>')
		    .end();
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
