(function($){
		elemMenu = function(){
			var elem = '.js-elem-menu',
				// currentPath = location.pathname,
				// currentDir = currentPath.split('/')
				JSONPATH = '/data/main.json';
			
			if($(elem).length === 0){ return false;}
			
			$.getJSON(JSONPATH, function(data){})
			.done(function(data){
				var getItem = function(){
					for(var i in data){
						var category = data[i].class,
							name = data[i].name,
							url = data[i].url,
							image = data[i].image;
						
						var pc_code = '<div class="large-4 columns"><a href="' + url + '" title="' + name + '"><img src="' + image + '" alt="' + name + '" />' + name + '</a></div>';
						var sp_code = '<li><a href="' + url + '" title="' + name + '" style="padding-left: 45px;">' + name + '</a></li>';
						var pcMenu, spMenu;
						
						switch (category){
							case 'Category':
								pcMenu = $('.js-submenu-jewelry .js-elem-menu-category');
								spMenu = $('.js-mobile-nav-links .js-elem-menu-category');
								break;
							case 'Collection':
								pcMenu = $('.js-submenu-jewelry .js-elem-menu-collection');
								spMenu = $('.js-mobile-nav-links .js-elem-menu-collection');
								break;
							case 'Pearl Type':
								pcMenu = $('.js-submenu-jewelry .js-elem-menu-pearlType');
								spMenu = $('.js-mobile-nav-links .js-elem-menu-pearlType');
								break;
						}
						
						pcMenu.append(pc_code);
						spMenu.append(sp_code);
					}
				}
				
				getItem();
			})
			.fail(function() {
				return false;
			});
			
		}
})(jQuery);


$(function(){
	elemMenu();
});