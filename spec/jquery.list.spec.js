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

    describe('check ordering of inserted html elements', function(){
	it('should input element can be placed before div list element', function(){
	    $divMemo.list();
	    var childrens = $divMemo.children();
	    expect(childrens.first()).toBe('input');
	    expect(childrens.last()).toBe('div');
	});
    });
}); 
