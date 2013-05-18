var  utils = { 
    pressEnterOn: function($elem){
	var keyup = $.Event('keyup');
	keyup.keyCode = 13;
	$elem.trigger(keyup);
    },

    clickOn: function($elem){
	var click = $.Event('click');
	$elem.trigger(click);
    }
};

describe('jquery.list', function(){
    var $divMemo;

    beforeEach(function(){
	jasmine.getFixtures().set('<div class="memo-list"/>');
	$divMemo = $('div.memo-list');
    });

    it('should contain div element for testing plugin', function(){
       expect($divMemo.length).toBe(1);
    });

    it('should successfully insert input element into div', function(){
	$divMemo.list();
	expect($divMemo.children('.jqlist-input-item')).toBe('input');
    });

    it('should insert div after input for inserting entered data', function(){
	$divMemo.list();
	expect($divMemo.children('.jqlist-list-item')).toBe('div');
    });
    
    describe('adding items to list',function(){
	var $input, 
	    $divMemo, 
	    $divListItems,
	    spyKeyUpEvent;

	beforeEach(function(){
	    $divMemo = $('div.memo-list');
	    $divMemo.list();
	    $divListItems = $divMemo.children('.jqlist-list-item');
	    $input = $divMemo.children('input');
	    spyKeyUpEvent = spyOnEvent($input, 'keyup');
	});

	it('should add text to the items list after pressing Enter', function(){
	    $input.val('test value');
	    utils.pressEnterOn($input);
	    
	    expect($divListItems.children('.item-placeholder').length).toBe(1);
	    expect(spyKeyUpEvent).toHaveBeenTriggered();
	});
	
	it('should item in list must contain span with entered text', function(){
	    var textValue = 'test value', $item;

	    $input.val(textValue);
	    utils.pressEnterOn($input);

	    $item = $divListItems.children('.item-placeholder');

	    expect($item.find('span')).toHaveText(textValue);
	});

	it('should item in list must contain link with text "remove"', function(){
	    var textValue = 'test value', $item;

	    $input.val(textValue);
	    utils.pressEnterOn($input);

	    $item = $divListItems.children('.item-placeholder');
	    
	    expect($item.find('a')).toHaveText('remove');
	});

	it('should clear textbox after adding not empty text to list', function(){
	    $input.val('test value2');

	    utils.pressEnterOn($input);

	    expect($input).toHaveValue('');
	});

	it('should add three items to list from textbox after press Enter', function(){
	    var testValues = ['test value1', 'test value2', 'testvalue3'];
	    testValues.forEach(function(val){
		$input.val(val);
		utils.pressEnterOn($input);
	    });

	    expect($divListItems.children('.item-placeholder').length).toBe(3);
	});
    });

    describe('remove items from list', function(){
	var $input, 
	    $divListItems,
	    $divMemo;

	beforeEach(function(){
	    $divMemo = $('div.memo-list');
	    $divMemo.list();
	    $divListItems = $divMemo.children('.jqlist-list-item');
	    $input = $divMemo.children('input');
	});
	
	it('should remove item by clicking on link', function(){
	    $input.val('test value2');
	    utils.pressEnterOn($input);

	    var $addedItem = $divMemo.children('div').children('div').first(),
	        $link = $addedItem.children('a'),
	        spyClickEvent = spyOnEvent($link, 'click');
	    
	    utils.clickOn($link);
	    
	    expect($divListItems.children('.item-placeholder').length).toBe(0);
	    expect(spyClickEvent).toHaveBeenTriggered();
	});

	it('should successfully remove middle item from tree items list', function(){
	    var testValues = ['test value1', 'test value2', 'testvalue3'];
	    testValues.forEach(function(val){
		$input.val(val);
		utils.pressEnterOn($input);
	    });

	    var $middleItem = $divMemo.children('div').children('div:even'),
	        $link = $middleItem.children('a'),
	        spyClickEvent = spyOnEvent($link, 'click'),
	        itemsAfterRemoveOp;
	    
	    utils.clickOn($link);
	    
	    itemsAfterRemoveOp = $divListItems.children('.item-placeholder')

	    expect(itemsAfterRemoveOp.length).toBe(2);
	    expect(itemsAfterRemoveOp
		   .filter(function(elem){
		       return $(elem).children('a').text() === 'test value2'
		   }).length).toBe(0);
	    expect(spyClickEvent).toHaveBeenTriggered();
	});

	it('should succesfully remove all added items by using "remove" link', function(){
	    var testValues = ['test value1', 'test value2', 'testvalue3'];

	    testValues.forEach(function(val){
		$input.val(val);
		utils.pressEnterOn($input);
	    });

	    var $addedItems = $divListItems.children('.item-placeholder');
	    
	    $addedItems.each(function(index, divItemElem){
		var $link = $(divItemElem).children('a');
		utils.clickOn($link);
	    });

	    expect($divListItems.children('.item-placeholder').length).toBe(0);
	});
    });
    
    describe('check ordering of inserted html elements', function(){
	it('should input element can be placed before div list element', function(){
	    $divMemo.list();
	    var childrens = $divMemo.children();
	    expect(childrens.first()).toBe('input');
	    expect(childrens.last()).toBe('div');
	});
    });
}); 
