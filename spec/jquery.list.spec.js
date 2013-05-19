var testValues = ['test value1', 'test value2', 'testvalue3'],
    utils = {
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
    var $divToTestPlugin;

    beforeEach(function(){
	jasmine.getFixtures().set('<div class="test-plugin"/>');
	$divToTestPlugin = $('div.test-plugin');
    });

    it('should contain div element for testing plugin', function(){
       expect($divToTestPlugin.length).toBe(1);
    });

    it('should successfully insert input element into div', function(){
	$divToTestPlugin.list();
	expect($divToTestPlugin.children('.jqlist-input-item')).toBe('input');
    });

    it('should insert div after input for entered items', function(){
	$divToTestPlugin.list();
	expect($divToTestPlugin.children('.jqlist-items-list')).toBe('div');
    });
    
    describe('adding items to list', function(){
	var $input, 
	    $divToTestPlugin, 
	    $divListItems,
	    spyKeyUpEvent;

	beforeEach(function(){
	    $divToTestPlugin = $('div.test-plugin');
	    $divToTestPlugin.list();
	    $divListItems = $divToTestPlugin.children('.jqlist-items-list');
	    $input = $divToTestPlugin.children('input');
	    spyKeyUpEvent = spyOnEvent($input, 'keyup');
	});

	it('should add text to the items list after pressing Enter', function(){
	    $input.val('test value');
	    utils.pressEnterOn($input);
	    
	    expect($divListItems.children('.jqlist-item-placeholder').length).toBe(1);
	    expect(spyKeyUpEvent).toHaveBeenTriggered();
	});
	
	it('should contain <span> with entered text inside added item', function(){
	    var textValue = 'test value', $item;

	    $input.val(textValue);
	    utils.pressEnterOn($input);

	    $item = $divListItems.children('.jqlist-item-placeholder');

	    expect($item.find('span')).toHaveText(textValue);
	});

	it('should contain link with text "remove" inside added item', function(){
	    var textValue = 'test value', $item;

	    $input.val(textValue);
	    utils.pressEnterOn($input);

	    $item = $divListItems.children('.jqlist-item-placeholder');
	    
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

	    expect($divListItems.children('.jqlist-item-placeholder').length).toBe(3);
	});
    });

    describe('remove items from list', function(){
	var $input, 
	    $divListItems,
	    $divToTestPlugin;

	beforeEach(function(){
	    $divToTestPlugin = $('div.test-plugin');
	    $divToTestPlugin.list();
	    $divListItems = $divToTestPlugin.children('.jqlist-items-list');
	    $input = $divToTestPlugin.children('input');
	});
	
	it('should remove item by clicking on link', function(){
	    $input.val('test value2');
	    utils.pressEnterOn($input);

	    var $addedItem = $divToTestPlugin.children('div').children('div').first(),
	        $link = $addedItem.children('a'),
	        spyClickEvent = spyOnEvent($link, 'click');
	    
	    utils.clickOn($link);
	    
	    expect($divListItems.children('.jqlist-item-placeholder').length).toBe(0);
	    expect(spyClickEvent).toHaveBeenTriggered();
	});

	it('should successfully remove middle item from tree items list', function(){
	    testValues.forEach(function(val){
		$input.val(val);
		utils.pressEnterOn($input);
	    });

	    var $middleItem = $divToTestPlugin.children('div').children('div:even'),
	        $link = $middleItem.children('a'),
	        spyClickEvent = spyOnEvent($link, 'click'),
	        itemsAfterRemoveOp;
	    
	    utils.clickOn($link);
	    
	    itemsAfterRemoveOp = $divListItems.children('.jqlist-item-placeholder')

	    expect(itemsAfterRemoveOp.length).toBe(2);
	    expect(itemsAfterRemoveOp
		   .filter(function(elem){
		       return $(elem).children('a').text() === 'test value2'
		   }).length).toBe(0);
	    expect(spyClickEvent).toHaveBeenTriggered();
	});

	it('should succesfully remove all added items by using "remove" link', function(){
	    testValues.forEach(function(val){
		$input.val(val);
		utils.pressEnterOn($input);
	    });

	    var $addedItems = $divListItems.children('.jqlist-item-placeholder');
	    
	    $addedItems.each(function(index, divItemElem){
		var $link = $(divItemElem).children('a');
		utils.clickOn($link);
	    });

	    expect($divListItems.children('.jqlist-item-placeholder').length).toBe(0);
	});
    });

    describe('removing items use plugin commands', function(){
	var $input, 
	    $divListItems,
	    $divToTestPlugin;

	beforeEach(function(){
	    $divToTestPlugin = $('div.test-plugin');
	    $divToTestPlugin.list();
	    $divListItems = $divToTestPlugin.children('.jqlist-items-list');
	    $input = $divToTestPlugin.children('input');
	    testValues.forEach(function(vl){
		$input.val(vl);
		utils.pressEnterOn($input);
	    });
	});

	it('should successfully remove all added items, using plugin "removeAll" command', function(){
	    $divToTestPlugin.list("removeAll");
	    
	    expect($divListItems.children('.jqlist-item-placeholder').length).toBe(0);
	});

	it('should successfully remove item by using "removeByIdx"', function(){
	    $divToTestPlugin.list("removeByIdx", 1);
	    
	    var $itemsInList = $divListItems.children('.jqlist-item-placeholder');
	    expect($itemsInList.length).toBe(2);
	    expect($itemsInList
		   .filter(function(elem){
		       return $(elem).children('a').text() === 'test value2'
		   }).length).toBe(0);
	});
    });

    describe('check ordering of inserted html elements', function(){
	it('should input element can be placed before div list element', function(){
	    $divToTestPlugin.list();
	    var childrens = $divToTestPlugin.children();
	    expect(childrens.first()).toBe('input');
	    expect(childrens.last()).toBe('div');
	});
    });
}); 
