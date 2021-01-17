// Utility function
function Util () {};

/* 
	class manipulation functions
*/
Util.hasClass = function(el, className) {
	if (el.classList) return el.classList.contains(className);
	else return !!el.getAttribute('class').match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};

Util.addClass = function(el, className) {
	var classList = className.split(' ');
 	if (el.classList) el.classList.add(classList[0]);
  else if (!Util.hasClass(el, classList[0])) el.setAttribute('class', el.getAttribute('class') +  " " + classList[0]);
 	if (classList.length > 1) Util.addClass(el, classList.slice(1).join(' '));
};

Util.removeClass = function(el, className) {
	var classList = className.split(' ');
	if (el.classList) el.classList.remove(classList[0]);	
	else if(Util.hasClass(el, classList[0])) {
		var reg = new RegExp('(\\s|^)' + classList[0] + '(\\s|$)');
    el.setAttribute('class', el.getAttribute('class').replace(reg, ' '));
	}
	if (classList.length > 1) Util.removeClass(el, classList.slice(1).join(' '));
};

Util.toggleClass = function(el, className, bool) {
	if(bool) Util.addClass(el, className);
	else Util.removeClass(el, className);
};

Util.setAttributes = function(el, attrs) {
  for(var key in attrs) {
    el.setAttribute(key, attrs[key]);
  }
};

/* 
  DOM manipulation
*/
Util.getChildrenByClassName = function(el, className) {
  var children = el.children,
    childrenByClass = [];
  for (var i = 0; i < el.children.length; i++) {
    if (Util.hasClass(el.children[i], className)) childrenByClass.push(el.children[i]);
  }
  return childrenByClass;
};

Util.is = function(elem, selector) {
  if(selector.nodeType){
    return elem === selector;
  }

  var qa = (typeof(selector) === 'string' ? document.querySelectorAll(selector) : selector),
    length = qa.length,
    returnArr = [];

  while(length--){
    if(qa[length] === elem){
      return true;
    }
  }

  return false;
};

/* 
	Animate height of an element
*/
Util.setHeight = function(start, to, element, duration, cb) {
	var change = to - start,
	    currentTime = null;

  var animateHeight = function(timestamp){  
    if (!currentTime) currentTime = timestamp;         
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = parseInt((progress/duration)*change + start);
    element.style.height = val+"px";
    if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
    } else {
    	if(cb) cb();
    }
  };
  
  //set the height of the element before starting animation -> fix bug on Safari
  element.style.height = start+"px";
  window.requestAnimationFrame(animateHeight);
};

/* 
	Smooth Scroll
*/

Util.scrollTo = function(final, duration, cb, scrollEl) {
  var element = scrollEl || window;
  var start = element.scrollTop || document.documentElement.scrollTop,
    currentTime = null;

  if(!scrollEl) start = window.scrollY || document.documentElement.scrollTop;
      
  var animateScroll = function(timestamp){
  	if (!currentTime) currentTime = timestamp;        
    var progress = timestamp - currentTime;
    if(progress > duration) progress = duration;
    var val = Math.easeInOutQuad(progress, start, final-start, duration);
    element.scrollTo(0, val);
    if(progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb && cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

/* 
  Focus utility classes
*/

//Move focus to an element
Util.moveFocus = function (element) {
  if( !element ) element = document.getElementsByTagName("body")[0];
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute('tabindex','-1');
    element.focus();
  }
};

/* 
  Misc
*/

Util.getIndexInArray = function(array, el) {
  return Array.prototype.indexOf.call(array, el);
};

Util.cssSupports = function(property, value) {
  if('CSS' in window) {
    return CSS.supports(property, value);
  } else {
    var jsProperty = property.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase();});
    return jsProperty in document.body.style;
  }
};

// merge a set of user options into plugin defaults
// https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
Util.extend = function() {
  // Variables
  var extended = {};
  var deep = false;
  var i = 0;
  var length = arguments.length;

  // Check if a deep merge
  if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
    deep = arguments[0];
    i++;
  }

  // Merge the object into the extended object
  var merge = function (obj) {
    for ( var prop in obj ) {
      if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
        // If deep merge and property is an object, merge properties
        if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
          extended[prop] = extend( true, extended[prop], obj[prop] );
        } else {
          extended[prop] = obj[prop];
        }
      }
    }
  };

  // Loop through each object and conduct a merge
  for ( ; i < length; i++ ) {
    var obj = arguments[i];
    merge(obj);
  }

  return extended;
};

// Check if Reduced Motion is enabled
Util.osHasReducedMotion = function() {
  if(!window.matchMedia) return false;
  var matchMediaObj = window.matchMedia('(prefers-reduced-motion: reduce)');
  if(matchMediaObj) return matchMediaObj.matches;
  return false; // return false if not supported
}; 

/* 
	Polyfills
*/
//Closest() method
if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
	Element.prototype.closest = function(s) {
		var el = this;
		if (!document.documentElement.contains(el)) return null;
		do {
			if (el.matches(s)) return el;
			el = el.parentElement || el.parentNode;
		} while (el !== null && el.nodeType === 1); 
		return null;
	};
}

//Custom Event() constructor
if ( typeof window.CustomEvent !== "function" ) {

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
}

/* 
	Animation curves
*/
Math.easeInOutQuad = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t + b;
	t--;
	return -c/2 * (t*(t-2) - 1) + b;
};

Math.easeInQuart = function (t, b, c, d) {
	t /= d;
	return c*t*t*t*t + b;
};

Math.easeOutQuart = function (t, b, c, d) { 
  t /= d;
	t--;
	return -c * (t*t*t*t - 1) + b;
};

Math.easeInOutQuart = function (t, b, c, d) {
	t /= d/2;
	if (t < 1) return c/2*t*t*t*t + b;
	t -= 2;
	return -c/2 * (t*t*t*t - 2) + b;
};

Math.easeOutElastic = function (t, b, c, d) {
  var s=1.70158;var p=d*0.7;var a=c;
  if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
  if (a < Math.abs(c)) { a=c; var s=p/4; }
  else var s = p/(2*Math.PI) * Math.asin (c/a);
  return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
};


/* JS Utility Classes */

// make focus ring visible only for keyboard navigation (i.e., tab key) 
(function() {
  var focusTab = document.getElementsByClassName('js-tab-focus'),
    shouldInit = false,
    outlineStyle = false,
    eventDetected = false;

  function detectClick() {
    if(focusTab.length > 0) {
      resetFocusStyle(false);
      window.addEventListener('keydown', detectTab);
    }
    window.removeEventListener('mousedown', detectClick);
    outlineStyle = false;
    eventDetected = true;
  };

  function detectTab(event) {
    if(event.keyCode !== 9) return;
    resetFocusStyle(true);
    window.removeEventListener('keydown', detectTab);
    window.addEventListener('mousedown', detectClick);
    outlineStyle = true;
  };

  function resetFocusStyle(bool) {
    var outlineStyle = bool ? '' : 'none';
    for(var i = 0; i < focusTab.length; i++) {
      focusTab[i].style.setProperty('outline', outlineStyle);
    }
  };

  function initFocusTabs() {
    if(shouldInit) {
      if(eventDetected) resetFocusStyle(outlineStyle);
      return;
    }
    shouldInit = focusTab.length > 0;
    window.addEventListener('mousedown', detectClick);
  };

  initFocusTabs();
  window.addEventListener('initFocusTabs', initFocusTabs);
}());

function resetFocusTabsStyle() {
  window.dispatchEvent(new CustomEvent('initFocusTabs'));
};
// File#: _1_anim-menu-btn
// Usage: codyhouse.co/license
(function() {
	var menuBtns = document.getElementsByClassName('js-anim-menu-btn');
	if( menuBtns.length > 0 ) {
		for(var i = 0; i < menuBtns.length; i++) {(function(i){
			initMenuBtn(menuBtns[i]);
		})(i);}

		function initMenuBtn(btn) {
			btn.addEventListener('click', function(event){	
				event.preventDefault();
				var status = !Util.hasClass(btn, 'anim-menu-btn--state-b');
				Util.toggleClass(btn, 'anim-menu-btn--state-b', status);
				// emit custom event
				var event = new CustomEvent('anim-menu-btn-clicked', {detail: status});
				btn.dispatchEvent(event);
			});
		};
	}
}());
// File#: _1_confetti-button
// Usage: codyhouse.co/license
(function() {
  var ConfettiBtn = function(element) {
    this.element = element;
    this.btn = this.element.getElementsByClassName('js-confetti-btn__btn');
    this.icon = this.element.getElementsByClassName('js-confetti-btn__icon');
    this.animating = false;
    this.animationClass = 'confetti-btn--animate';
    this.positionVariables = '--conf-btn-click-';
    initConfettiBtn(this);
	};

  function initConfettiBtn(element) {
    if(element.btn.length < 1 || element.icon.length < 1) return;
    element.btn[0].addEventListener('click', function(event){
      if(element.animating) return;
      element.animating = true;
      setAnimationPosition(element, event);
      Util.addClass(element.element, element.animationClass);
      resetAnimation(element);
    });
  };

  function setAnimationPosition(element, event) { // change icon position based on click position
    
    var btnBoundingRect = element.btn[0].getBoundingClientRect();
    document.documentElement.style.setProperty(element.positionVariables+'x', (event.clientX - btnBoundingRect.left)+'px');
    document.documentElement.style.setProperty(element.positionVariables+'y', (event.clientY - btnBoundingRect.top)+'px');
  };

  function resetAnimation(element) { // reset the button at the end of the icon animation
    
    element.icon[0].addEventListener('animationend', function cb(){
      element.icon[0].removeEventListener('animationend', cb);
      Util.removeClass(element.element, element.animationClass);
      element.animating = false;
    });
  };

  var confettiBtn = document.getElementsByClassName('js-confetti-btn');
  if(confettiBtn.length > 0) {
    for(var i = 0; i < confettiBtn.length; i++) {
      (function(i){new ConfettiBtn(confettiBtn[i]);})(i);
    }
  }
}());
// File#: _1_diagonal-movement
// Usage: codyhouse.co/license
/*
  Modified version of the jQuery-menu-aim plugin
  https://github.com/kamens/jQuery-menu-aim
  - Replaced jQuery with Vanilla JS
  - Minor changes
*/
(function() {
  var menuAim = function(opts) {
    init(opts);
  };

  window.menuAim = menuAim;

  function init(opts) {
    var activeRow = null,
      mouseLocs = [],
      lastDelayLoc = null,
      timeoutId = null,
      options = Util.extend({
        menu: '',
        rows: false, //if false, get direct children - otherwise pass nodes list 
        submenuSelector: "*",
        submenuDirection: "right",
        tolerance: 75,  // bigger = more forgivey when entering submenu
        enter: function(){},
        exit: function(){},
        activate: function(){},
        deactivate: function(){},
        exitMenu: function(){}
      }, opts),
      menu = options.menu;

    var MOUSE_LOCS_TRACKED = 3,  // number of past mouse locations to track
      DELAY = 300;  // ms delay when user appears to be entering submenu

    /**
     * Keep track of the last few locations of the mouse.
     */
    var mousemoveDocument = function(e) {
      mouseLocs.push({x: e.pageX, y: e.pageY});

      if (mouseLocs.length > MOUSE_LOCS_TRACKED) {
        mouseLocs.shift();
      }
    };

    /**
     * Cancel possible row activations when leaving the menu entirely
     */
    var mouseleaveMenu = function() {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // If exitMenu is supplied and returns true, deactivate the
      // currently active row on menu exit.
      if (options.exitMenu(this)) {
        if (activeRow) {
          options.deactivate(activeRow);
        }

        activeRow = null;
      }
    };

    /**
     * Trigger a possible row activation whenever entering a new row.
     */
    var mouseenterRow = function() {
      if (timeoutId) {
        // Cancel any previous activation delays
        clearTimeout(timeoutId);
      }

      options.enter(this);
      possiblyActivate(this);
    },
    mouseleaveRow = function() {
      options.exit(this);
    };

    /*
     * Immediately activate a row if the user clicks on it.
     */
    var clickRow = function() {
      activate(this);
    };  

    /**
     * Activate a menu row.
     */
    var activate = function(row) {
      if (row == activeRow) {
        return;
      }

      if (activeRow) {
        options.deactivate(activeRow);
      }

      options.activate(row);
      activeRow = row;
    };

    /**
     * Possibly activate a menu row. If mouse movement indicates that we
     * shouldn't activate yet because user may be trying to enter
     * a submenu's content, then delay and check again later.
     */
    var possiblyActivate = function(row) {
      var delay = activationDelay();

      if (delay) {
        timeoutId = setTimeout(function() {
          possiblyActivate(row);
        }, delay);
      } else {
        activate(row);
      }
    };

    /**
     * Return the amount of time that should be used as a delay before the
     * currently hovered row is activated.
     *
     * Returns 0 if the activation should happen immediately. Otherwise,
     * returns the number of milliseconds that should be delayed before
     * checking again to see if the row should be activated.
     */
    var activationDelay = function() {
      if (!activeRow || !Util.is(activeRow, options.submenuSelector)) {
        // If there is no other submenu row already active, then
        // go ahead and activate immediately.
        return 0;
      }

      function getOffset(element) {
        var rect = element.getBoundingClientRect();
        return { top: rect.top + window.pageYOffset, left: rect.left + window.pageXOffset };
      };

      var offset = getOffset(menu),
          upperLeft = {
              x: offset.left,
              y: offset.top - options.tolerance
          },
          upperRight = {
              x: offset.left + menu.offsetWidth,
              y: upperLeft.y
          },
          lowerLeft = {
              x: offset.left,
              y: offset.top + menu.offsetHeight + options.tolerance
          },
          lowerRight = {
              x: offset.left + menu.offsetWidth,
              y: lowerLeft.y
          },
          loc = mouseLocs[mouseLocs.length - 1],
          prevLoc = mouseLocs[0];

      if (!loc) {
        return 0;
      }

      if (!prevLoc) {
        prevLoc = loc;
      }

      if (prevLoc.x < offset.left || prevLoc.x > lowerRight.x || prevLoc.y < offset.top || prevLoc.y > lowerRight.y) {
        // If the previous mouse location was outside of the entire
        // menu's bounds, immediately activate.
        return 0;
      }

      if (lastDelayLoc && loc.x == lastDelayLoc.x && loc.y == lastDelayLoc.y) {
        // If the mouse hasn't moved since the last time we checked
        // for activation status, immediately activate.
        return 0;
      }

      // Detect if the user is moving towards the currently activated
      // submenu.
      //
      // If the mouse is heading relatively clearly towards
      // the submenu's content, we should wait and give the user more
      // time before activating a new row. If the mouse is heading
      // elsewhere, we can immediately activate a new row.
      //
      // We detect this by calculating the slope formed between the
      // current mouse location and the upper/lower right points of
      // the menu. We do the same for the previous mouse location.
      // If the current mouse location's slopes are
      // increasing/decreasing appropriately compared to the
      // previous's, we know the user is moving toward the submenu.
      //
      // Note that since the y-axis increases as the cursor moves
      // down the screen, we are looking for the slope between the
      // cursor and the upper right corner to decrease over time, not
      // increase (somewhat counterintuitively).
      function slope(a, b) {
        return (b.y - a.y) / (b.x - a.x);
      };

      var decreasingCorner = upperRight,
        increasingCorner = lowerRight;

      // Our expectations for decreasing or increasing slope values
      // depends on which direction the submenu opens relative to the
      // main menu. By default, if the menu opens on the right, we
      // expect the slope between the cursor and the upper right
      // corner to decrease over time, as explained above. If the
      // submenu opens in a different direction, we change our slope
      // expectations.
      if (options.submenuDirection == "left") {
        decreasingCorner = lowerLeft;
        increasingCorner = upperLeft;
      } else if (options.submenuDirection == "below") {
        decreasingCorner = lowerRight;
        increasingCorner = lowerLeft;
      } else if (options.submenuDirection == "above") {
        decreasingCorner = upperLeft;
        increasingCorner = upperRight;
      }

      var decreasingSlope = slope(loc, decreasingCorner),
        increasingSlope = slope(loc, increasingCorner),
        prevDecreasingSlope = slope(prevLoc, decreasingCorner),
        prevIncreasingSlope = slope(prevLoc, increasingCorner);

      if (decreasingSlope < prevDecreasingSlope && increasingSlope > prevIncreasingSlope) {
        // Mouse is moving from previous location towards the
        // currently activated submenu. Delay before activating a
        // new menu row, because user may be moving into submenu.
        lastDelayLoc = loc;
        return DELAY;
      }

      lastDelayLoc = null;
      return 0;
    };

    /**
     * Hook up initial menu events
     */
    menu.addEventListener('mouseleave', mouseleaveMenu);  
    var rows = (options.rows) ? options.rows : menu.children;
    if(rows.length > 0) {
      for(var i = 0; i < rows.length; i++) {(function(i){
        rows[i].addEventListener('mouseenter', mouseenterRow);  
        rows[i].addEventListener('mouseleave', mouseleaveRow);
        rows[i].addEventListener('click', clickRow);  
      })(i);}
    }

    document.addEventListener('mousemove', function(event){
    (!window.requestAnimationFrame) ? mousemoveDocument(event) : window.requestAnimationFrame(function(){mousemoveDocument(event);});
    });
  };
}());


// File#: _1_expandable-search
// Usage: codyhouse.co/license
(function() {
    var expandableSearch = document.getElementsByClassName('js-expandable-search');
    if(expandableSearch.length > 0) {
      for( var i = 0; i < expandableSearch.length; i++) {
        (function(i){ // if user types in search input, keep the input expanded when focus is lost
          expandableSearch[i].getElementsByClassName('js-expandable-search__input')[0].addEventListener('input', function(event){
            Util.toggleClass(event.target, 'expandable-search__input--has-content', event.target.value.length > 0);
          });
        })(i);
      }
    }
  }());
// File#: _1_file-upload
// Usage: codyhouse.co/license
(function() {
    var InputFile = function(element) {
      this.element = element;
      this.input = this.element.getElementsByClassName('file-upload__input')[0];
      this.label = this.element.getElementsByClassName('file-upload__label')[0];
      this.multipleUpload = this.input.hasAttribute('multiple'); // allow for multiple files selection
      
      // this is the label text element -> when user selects a file, it will be changed from the default value to the name of the file 
      this.labelText = this.element.getElementsByClassName('file-upload__text')[0];
      this.initialLabel = this.labelText.textContent;
  
      initInputFileEvents(this);
    }; 
  
    function initInputFileEvents(inputFile) {
      // make label focusable
      inputFile.label.setAttribute('tabindex', '0');
      inputFile.input.setAttribute('tabindex', '-1');
  
      // move focus from input to label -> this is triggered when a file is selected or the file picker modal is closed
      inputFile.input.addEventListener('focusin', function(event){ 
        inputFile.label.focus();
      });
  
      // press 'Enter' key on label element -> trigger file selection
      inputFile.label.addEventListener('keydown', function(event) {
        if( event.keyCode && event.keyCode == 13 || event.key && event.key.toLowerCase() == 'enter') {inputFile.input.click();}
      });
  
      // file has been selected -> update label text
      inputFile.input.addEventListener('change', function(event){ 
        updateInputLabelText(inputFile);
      });
    };
  
    function updateInputLabelText(inputFile) {
      var label = '';
      if(inputFile.input.files && inputFile.input.files.length < 1) { 
        label = inputFile.initialLabel; // no selection -> revert to initial label
      } else if(inputFile.multipleUpload && inputFile.input.files && inputFile.input.files.length > 1) {
        label = inputFile.input.files.length+ ' files'; // multiple selection -> show number of files
      } else {
        label = inputFile.input.value.split('\\').pop(); // single file selection -> show name of the file
      }
      inputFile.labelText.textContent = label;
    };
  
    //initialize the InputFile objects
    var inputFiles = document.getElementsByClassName('file-upload');
    if( inputFiles.length > 0 ) {
      for( var i = 0; i < inputFiles.length; i++) {
        (function(i){new InputFile(inputFiles[i]);})(i);
      }
    }
  }());
// File#: _1_header
// Usage: codyhouse.co/license
(function() {
    var mainHeader = document.getElementsByClassName('js-header');
    if( mainHeader.length > 0 ) {
      var trigger = mainHeader[0].getElementsByClassName('js-header__trigger')[0],
        nav = mainHeader[0].getElementsByClassName('js-header__nav')[0];
  
      // we'll use these to store the node that needs to receive focus when the mobile menu is closed 
      var focusMenu = false;
  
      //detect click on nav trigger
      trigger.addEventListener("click", function(event) {
        event.preventDefault();
        toggleNavigation(!Util.hasClass(nav, 'header__nav--is-visible'));
      });
  
      // listen for key events
      window.addEventListener('keyup', function(event){
        // listen for esc key
        if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
          // close navigation on mobile if open
          if(trigger.getAttribute('aria-expanded') == 'true' && isVisible(trigger)) {
            focusMenu = trigger; // move focus to menu trigger when menu is close
            trigger.click();
          }
        }
        // listen for tab key
        if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
          // close navigation on mobile if open when nav loses focus
          if(trigger.getAttribute('aria-expanded') == 'true' && isVisible(trigger) && !document.activeElement.closest('.js-header')) trigger.click();
        }
      });
  
      // listen for resize
      var resizingId = false;
      window.addEventListener('resize', function() {
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 500);
      });
  
      function doneResizing() {
        if( !isVisible(trigger) && Util.hasClass(mainHeader[0], 'header--expanded')) toggleNavigation(false); 
      };
    }
  
    function isVisible(element) {
      return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
    };
  
    function toggleNavigation(bool) { // toggle navigation visibility on small device
      Util.toggleClass(nav, 'header__nav--is-visible', bool);
      Util.toggleClass(mainHeader[0], 'header--expanded', bool);
      trigger.setAttribute('aria-expanded', bool);
      if(bool) { //opening menu -> move focus to first element inside nav
        nav.querySelectorAll('[href], input:not([disabled]), button:not([disabled])')[0].focus();
      } else if(focusMenu) {
        focusMenu.focus();
        focusMenu = false;
      }
    };
  }());
// File#: _1_hiding-nav
// Usage: codyhouse.co/license
(function() {
  var hidingNav = document.getElementsByClassName('js-hide-nav');
  if(hidingNav.length > 0 && window.requestAnimationFrame) {
    var mainNav = Array.prototype.filter.call(hidingNav, function(element) {
      return Util.hasClass(element, 'js-hide-nav--main');
    }),
    subNav = Array.prototype.filter.call(hidingNav, function(element) {
      return Util.hasClass(element, 'js-hide-nav--sub');
    });
    
    var scrolling = false,
      previousTop = window.scrollY,
      currentTop = window.scrollY,
      scrollDelta = 10,
      scrollOffset = 150, // scrollY needs to be bigger than scrollOffset to hide navigation
      headerHeight = 0; 

    var navIsFixed = false; // check if main navigation is fixed
    if(mainNav.length > 0 && Util.hasClass(mainNav[0], 'hide-nav--fixed')) navIsFixed = true;

    // store button that triggers navigation on mobile
    var triggerMobile = getTriggerMobileMenu();
    var prevElement = createPrevElement();
    var mainNavTop = 0;
    // list of classes the hide-nav has when it is expanded -> do not hide if it has those classes
    var navOpenClasses = hidingNav[0].getAttribute('data-nav-target-class'),
      navOpenArrayClasses = [];
    if(navOpenClasses) navOpenArrayClasses = navOpenClasses.split(' ');
    getMainNavTop();
    if(mainNavTop > 0) {
      scrollOffset = scrollOffset + mainNavTop;
    }
    
    // init navigation and listen to window scroll event
    getHeaderHeight();
    initSecondaryNav();
    initFixedNav();
    resetHideNav();
    window.addEventListener('scroll', function(event){
      if(scrolling) return;
      scrolling = true;
      window.requestAnimationFrame(resetHideNav);
    });

    window.addEventListener('resize', function(event){
      if(scrolling) return;
      scrolling = true;
      window.requestAnimationFrame(function(){
        if(headerHeight > 0) {
          getMainNavTop();
          getHeaderHeight();
          initSecondaryNav();
          initFixedNav();
        }
        // reset both navigation
        hideNavScrollUp();

        scrolling = false;
      });
    });

    function getHeaderHeight() {
      headerHeight = mainNav[0].offsetHeight;
    };

    function initSecondaryNav() { // if there's a secondary nav, set its top equal to the header height
      if(subNav.length < 1 || mainNav.length < 1) return;
      subNav[0].style.top = (headerHeight - 1)+'px';
    };

    function initFixedNav() {
      if(!navIsFixed || mainNav.length < 1) return;
      mainNav[0].style.marginBottom = '-'+headerHeight+'px';
    };

    function resetHideNav() { // check if navs need to be hidden/revealed
      currentTop = window.scrollY;
      if(currentTop - previousTop > scrollDelta && currentTop > scrollOffset) {
        hideNavScrollDown();
      } else if( previousTop - currentTop > scrollDelta || (previousTop - currentTop > 0 && currentTop < scrollOffset) ) {
        hideNavScrollUp();
      } else if( previousTop - currentTop > 0 && subNav.length > 0 && subNav[0].getBoundingClientRect().top > 0) {
        setTranslate(subNav[0], '0%');
      }
      // if primary nav is fixed -> toggle bg class
      if(navIsFixed) {
        var scrollTop = window.scrollY || window.pageYOffset;
        Util.toggleClass(mainNav[0], 'hide-nav--has-bg', (scrollTop > headerHeight + mainNavTop));
      }
      previousTop = currentTop;
      scrolling = false;
    };

    function hideNavScrollDown() {
      // if there's a secondary nav -> it has to reach the top before hiding nav
      if( subNav.length  > 0 && subNav[0].getBoundingClientRect().top > headerHeight) return;
      // on mobile -> hide navigation only if dropdown is not open
      if(triggerMobile && triggerMobile.getAttribute('aria-expanded') == "true") return;
      // check if main nav has one of the following classes
      if( mainNav.length > 0 && (!navOpenClasses || !checkNavExpanded())) {
        setTranslate(mainNav[0], '-100%'); 
        mainNav[0].addEventListener('transitionend', addOffCanvasClass);
      }
      if( subNav.length  > 0 ) setTranslate(subNav[0], '-'+headerHeight+'px');
    };

    function hideNavScrollUp() {
      if( mainNav.length > 0 ) {setTranslate(mainNav[0], '0%'); Util.removeClass(mainNav[0], 'hide-nav--off-canvas');mainNav[0].removeEventListener('transitionend', addOffCanvasClass);}
      if( subNav.length  > 0 ) setTranslate(subNav[0], '0%');
    };

    function addOffCanvasClass() {
      mainNav[0].removeEventListener('transitionend', addOffCanvasClass);
      Util.addClass(mainNav[0], 'hide-nav--off-canvas');
    };

    function setTranslate(element, val) {
      element.style.transform = 'translateY('+val+')';
    };

    function getTriggerMobileMenu() {
      // store trigger that toggle mobile navigation dropdown
      var triggerMobileClass = hidingNav[0].getAttribute('data-mobile-trigger');
      if(!triggerMobileClass) return false;
      if(triggerMobileClass.indexOf('#') == 0) { // get trigger by ID
        var trigger = document.getElementById(triggerMobileClass.replace('#', ''));
        if(trigger) return trigger;
      } else { // get trigger by class name
        var trigger = hidingNav[0].getElementsByClassName(triggerMobileClass);
        if(trigger.length > 0) return trigger[0];
      }
      
      return false;
    };

    function createPrevElement() {
      // create element to be inserted right before the mainNav to get its top value
      if( mainNav.length < 1) return false;
      var newElement = document.createElement("div"); 
      newElement.setAttribute('aria-hidden', 'true');
      mainNav[0].parentElement.insertBefore(newElement, mainNav[0]);
      var prevElement =  mainNav[0].previousElementSibling;
      prevElement.style.opacity = '0';
      return prevElement;
    };

    function getMainNavTop() {
      if(!prevElement) return;
      mainNavTop = prevElement.getBoundingClientRect().top + window.scrollY;
    };

    function checkNavExpanded() {
      var navIsOpen = false;
      for(var i = 0; i < navOpenArrayClasses.length; i++){
        if(Util.hasClass(mainNav[0], navOpenArrayClasses[i].trim())) {
          navIsOpen = true;
          break;
        }
      }
      return navIsOpen;
    };
    
  } else {
    // if window requestAnimationFrame is not supported -> add bg class to fixed header
    var mainNav = document.getElementsByClassName('js-hide-nav--main');
    if(mainNav.length < 1) return;
    if(Util.hasClass(mainNav[0], 'hide-nav--fixed')) Util.addClass(mainNav[0], 'hide-nav--has-bg');
  }
}());
// File#: _1_masonry
// Usage: codyhouse.co/license

(function() {
    var Masonry = function(element) {
      this.element = element;
      this.list = this.element.getElementsByClassName('js-masonry__list')[0];
      this.items = this.element.getElementsByClassName('js-masonry__item');
      this.activeColumns = 0;
      this.colStartWidth = 0; // col min-width (defined in CSS using --masonry-col-auto-size variable)
      this.colWidth = 0; // effective column width
      this.colGap = 0;
      // store col heights and items
      this.colHeights = [];
      this.colItems = [];
      // flex full support
      this.flexSupported = checkFlexSupported(this.items[0]);
      getGridLayout(this); // get initial grid params
      setGridLayout(this); // set grid params (width of elements)
      initMasonryLayout(this); // init gallery layout
    };
  
    function checkFlexSupported(item) {
      var itemStyle = window.getComputedStyle(item);
      return itemStyle.getPropertyValue('flex-basis') != 'auto';
    };
  
    function getGridLayout(grid) { // this is used to get initial grid details (width/grid gap)
      var itemStyle = window.getComputedStyle(grid.items[0]);
      if( grid.colStartWidth == 0) {
        grid.colStartWidth = parseFloat(itemStyle.getPropertyValue('width'));
      }
      grid.colGap = parseFloat(itemStyle.getPropertyValue('margin-right'));
    };
  
    function setGridLayout(grid) { // set width of items in the grid
      var containerWidth = parseFloat(window.getComputedStyle(grid.element).getPropertyValue('width'));
      grid.activeColumns = parseInt((containerWidth + grid.colGap)/(grid.colStartWidth+grid.colGap));
      if(grid.activeColumns == 0) grid.activeColumns = 1;
      grid.colWidth = parseFloat((containerWidth - (grid.activeColumns - 1)*grid.colGap)/grid.activeColumns);
      for(var i = 0; i < grid.items.length; i++) {
        grid.items[i].style.width = grid.colWidth+'px'; // reset items width
      }
    };
  
    function initMasonryLayout(grid) {
      if(grid.flexSupported) {
        checkImgLoaded(grid); // reset layout when images are loaded
      } else {
        Util.addClass(grid.element, 'masonry--loaded'); // make sure the gallery is visible
      }
  
      grid.element.addEventListener('masonry-resize', function(){ // window has been resized -> reset masonry layout
        getGridLayout(grid);
        setGridLayout(grid);
        if(grid.flexSupported) layItems(grid); 
      });
  
      grid.element.addEventListener('masonry-reset', function(event){ // reset layout (e.g., new items added to the gallery)
        if(grid.flexSupported) checkImgLoaded(grid); 
      });
    };
  
    function layItems(grid) {
      Util.addClass(grid.element, 'masonry--loaded'); // make sure the gallery is visible
      grid.colHeights = [];
      grid.colItems = [];
  
      // grid layout has already been set -> update container height and order of items
      for(var j = 0; j < grid.activeColumns; j++) {
        grid.colHeights.push(0); // reset col heights
        grid.colItems[j] = []; // reset items order
      }
      
      for(var i = 0; i < grid.items.length; i++) {
        var minHeight = Math.min.apply( Math, grid.colHeights ),
          index = grid.colHeights.indexOf(minHeight);
        if(grid.colItems[index]) grid.colItems[index].push(i);
        grid.items[i].style.flexBasis = 0; // reset flex basis before getting height
        var itemHeight = grid.items[i].getBoundingClientRect().height || grid.items[i].offsetHeight || 1;
        grid.colHeights[index] = grid.colHeights[index] + grid.colGap + itemHeight;
      }
  
      // reset height of container
      var masonryHeight = Math.max.apply( Math, grid.colHeights ) + 5;
      grid.list.style.cssText = 'height: '+ masonryHeight + 'px;';
  
      // go through elements and set flex order
      var order = 0;
      for(var i = 0; i < grid.colItems.length; i++) {
        for(var j = 0; j < grid.colItems[i].length; j++) {
          grid.items[grid.colItems[i][j]].style.order = order;
          order = order + 1;
        }
        // change flex-basis of last element of each column, so that next element shifts to next col
        var lastItemCol = grid.items[grid.colItems[i][grid.colItems[i].length - 1]];
        lastItemCol.style.flexBasis = masonryHeight - grid.colHeights[i] + lastItemCol.getBoundingClientRect().height - 5 + 'px';
      }
  
      // emit custom event when grid has been reset
      grid.element.dispatchEvent(new CustomEvent('masonry-laid'));
    };
  
    function checkImgLoaded(grid) {
      var imgs = grid.list.getElementsByTagName('img');
  
      function countLoaded() {
        var setTimeoutOn = false;
        for(var i = 0; i < imgs.length; i++) {
          if(!imgs[i].complete) {
            setTimeoutOn = true;
            break;
          } else if (typeof imgs[i].naturalHeight !== "undefined" && imgs[i].naturalHeight == 0) {
            setTimeoutOn = true;
            break;
          }
        }
  
        if(!setTimeoutOn) {
          layItems(grid);
        } else {
          setTimeout(function(){
            countLoaded();
          }, 100);
        }
      };
  
      if(imgs.length == 0) {
        layItems(grid); // no need to wait -> no img available
      } else {
        countLoaded();
      }
    };
  
    //initialize the Masonry objects
    var masonries = document.getElementsByClassName('js-masonry'), 
      flexSupported = Util.cssSupports('flex-basis', 'auto'),
      masonriesArray = [];
  
    if( masonries.length > 0) {
      for( var i = 0; i < masonries.length; i++) {
        if(!flexSupported) {
          Util.addClass(masonries[i], 'masonry--loaded'); // reveal gallery
        } else {
          (function(i){masonriesArray.push(new Masonry(masonries[i]));})(i); // init Masonry Layout
        }
      }
  
      if(!flexSupported) return;
  
      // listen to window resize -> reorganize items in gallery
      var resizingId = false,
        customEvent = new CustomEvent('masonry-resize');
        
      window.addEventListener('resize', function() {
        clearTimeout(resizingId);
        resizingId = setTimeout(doneResizing, 500);
      });
  
      function doneResizing() {
        for( var i = 0; i < masonriesArray.length; i++) {
          (function(i){masonriesArray[i].element.dispatchEvent(customEvent)})(i);
        };
      };
    };
  }());
// File#: _1_modal-window
// Usage: codyhouse.co/license
(function() {
	var Modal = function(element) {
		this.element = element;
		this.triggers = document.querySelectorAll('[aria-controls="'+this.element.getAttribute('id')+'"]');
		this.firstFocusable = null;
		this.lastFocusable = null;
		this.moveFocusEl = null; // focus will be moved to this element when modal is open
		this.modalFocus = this.element.getAttribute('data-modal-first-focus') ? this.element.querySelector(this.element.getAttribute('data-modal-first-focus')) : null;
		this.selectedTrigger = null;
		this.preventScrollEl = this.getPreventScrollEl();
		this.showClass = "modal--is-visible";
		this.initModal();
	};

	Modal.prototype.getPreventScrollEl = function() {
		var scrollEl = false;
		var querySelector = this.element.getAttribute('data-modal-prevent-scroll');
		if(querySelector) scrollEl = document.querySelector(querySelector);
		return scrollEl;
	};

	Modal.prototype.initModal = function() {
		var self = this;
		//open modal when clicking on trigger buttons
		if ( this.triggers ) {
			for(var i = 0; i < this.triggers.length; i++) {
				this.triggers[i].addEventListener('click', function(event) {
					event.preventDefault();
					if(Util.hasClass(self.element, self.showClass)) {
						self.closeModal();
						return;
					}
					self.selectedTrigger = event.target;
					self.showModal();
					self.initModalEvents();
				});
			}
		}

		// listen to the openModal event -> open modal without a trigger button
		this.element.addEventListener('openModal', function(event){
			if(event.detail) self.selectedTrigger = event.detail;
			self.showModal();
			self.initModalEvents();
		});

		// listen to the closeModal event -> close modal without a trigger button
		this.element.addEventListener('closeModal', function(event){
			if(event.detail) self.selectedTrigger = event.detail;
			self.closeModal();
		});

		// if modal is open by default -> initialise modal events
		if(Util.hasClass(this.element, this.showClass)) this.initModalEvents();
	};

	Modal.prototype.showModal = function() {
		var self = this;
		Util.addClass(this.element, this.showClass);
		this.getFocusableElements();
		if(this.moveFocusEl) {
			this.moveFocusEl.focus();
			// wait for the end of transitions before moving focus
			this.element.addEventListener("transitionend", function cb(event) {
				self.moveFocusEl.focus();
				self.element.removeEventListener("transitionend", cb);
			});
		}
		this.emitModalEvents('modalIsOpen');
		// change the overflow of the preventScrollEl
		if(this.preventScrollEl) this.preventScrollEl.style.overflow = 'hidden';
	};

	Modal.prototype.closeModal = function() {
		if(!Util.hasClass(this.element, this.showClass)) return;
		Util.removeClass(this.element, this.showClass);
		this.firstFocusable = null;
		this.lastFocusable = null;
		this.moveFocusEl = null;
		if(this.selectedTrigger) this.selectedTrigger.focus();
		//remove listeners
		this.cancelModalEvents();
		this.emitModalEvents('modalIsClose');
		// change the overflow of the preventScrollEl
		if(this.preventScrollEl) this.preventScrollEl.style.overflow = '';
	};

	Modal.prototype.initModalEvents = function() {
		//add event listeners
		this.element.addEventListener('keydown', this);
		this.element.addEventListener('click', this);
	};

	Modal.prototype.cancelModalEvents = function() {
		//remove event listeners
		this.element.removeEventListener('keydown', this);
		this.element.removeEventListener('click', this);
	};

	Modal.prototype.handleEvent = function (event) {
		switch(event.type) {
			case 'click': {
				this.initClick(event);
			}
			case 'keydown': {
				this.initKeyDown(event);
			}
		}
	};

	Modal.prototype.initKeyDown = function(event) {
		if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
			//trap focus inside modal
			this.trapFocus(event);
		} else if( (event.keyCode && event.keyCode == 13 || event.key && event.key == 'Enter') && event.target.closest('.js-modal__close')) {
			event.preventDefault();
			this.closeModal(); // close modal when pressing Enter on close button
		}	
	};

	Modal.prototype.initClick = function(event) {
		//close modal when clicking on close button or modal bg layer 
		if( !event.target.closest('.js-modal__close') && !Util.hasClass(event.target, 'js-modal') ) return;
		event.preventDefault();
		this.closeModal();
	};

	Modal.prototype.trapFocus = function(event) {
		if( this.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of modal
			event.preventDefault();
			this.lastFocusable.focus();
		}
		if( this.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of modal
			event.preventDefault();
			this.firstFocusable.focus();
		}
	}

	Modal.prototype.getFocusableElements = function() {
		//get all focusable elements inside the modal
		var allFocusable = this.element.querySelectorAll(focusableElString);
		this.getFirstVisible(allFocusable);
		this.getLastVisible(allFocusable);
		this.getFirstFocusable();
	};

	Modal.prototype.getFirstVisible = function(elements) {
		//get first visible focusable element inside the modal
		for(var i = 0; i < elements.length; i++) {
			if( isVisible(elements[i]) ) {
				this.firstFocusable = elements[i];
				break;
			}
		}
	};

	Modal.prototype.getLastVisible = function(elements) {
		//get last visible focusable element inside the modal
		for(var i = elements.length - 1; i >= 0; i--) {
			if( isVisible(elements[i]) ) {
				this.lastFocusable = elements[i];
				break;
			}
		}
	};

	Modal.prototype.getFirstFocusable = function() {
		if(!this.modalFocus || !Element.prototype.matches) {
			this.moveFocusEl = this.firstFocusable;
			return;
		}
		var containerIsFocusable = this.modalFocus.matches(focusableElString);
		if(containerIsFocusable) {
			this.moveFocusEl = this.modalFocus;
		} else {
			this.moveFocusEl = false;
			var elements = this.modalFocus.querySelectorAll(focusableElString);
			for(var i = 0; i < elements.length; i++) {
				if( isVisible(elements[i]) ) {
					this.moveFocusEl = elements[i];
					break;
				}
			}
			if(!this.moveFocusEl) this.moveFocusEl = this.firstFocusable;
		}
	};

	Modal.prototype.emitModalEvents = function(eventName) {
		var event = new CustomEvent(eventName, {detail: this.selectedTrigger});
		this.element.dispatchEvent(event);
	};

	function isVisible(element) {
		return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
	};

	//initialize the Modal objects
	var modals = document.getElementsByClassName('js-modal');
	// generic focusable elements string selector
	var focusableElString = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';
	if( modals.length > 0 ) {
		var modalArrays = [];
		for( var i = 0; i < modals.length; i++) {
			(function(i){modalArrays.push(new Modal(modals[i]));})(i);
		}

		window.addEventListener('keydown', function(event){ //close modal window on esc
			if(event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape') {
				for( var i = 0; i < modalArrays.length; i++) {
					(function(i){modalArrays[i].closeModal();})(i);
				};
			}
		});
	}
}());
// File#: _1_popover
// Usage: codyhouse.co/license
(function() {
  var Popover = function(element) {
    this.element = element;
		this.elementId = this.element.getAttribute('id');
		this.trigger = document.querySelectorAll('[aria-controls="'+this.elementId+'"]');
		this.selectedTrigger = false;
    this.popoverVisibleClass = 'popover--is-visible';
    this.selectedTriggerClass = 'popover-control--active';
    this.popoverIsOpen = false;
    // focusable elements
    this.firstFocusable = false;
		this.lastFocusable = false;
		// position target - position tooltip relative to a specified element
		this.positionTarget = getPositionTarget(this);
		// gap between element and viewport - if there's max-height 
		this.viewportGap = parseInt(getComputedStyle(this.element).getPropertyValue('--popover-viewport-gap')) || 20;
		initPopover(this);
		initPopoverEvents(this);
  };

  // public methods
  Popover.prototype.togglePopover = function(bool, moveFocus) {
    togglePopover(this, bool, moveFocus);
  };

  Popover.prototype.checkPopoverClick = function(target) {
    checkPopoverClick(this, target);
  };

  Popover.prototype.checkPopoverFocus = function() {
    checkPopoverFocus(this);
  };

	// private methods
	function getPositionTarget(popover) {
		// position tooltip relative to a specified element - if provided
		var positionTargetSelector = popover.element.getAttribute('data-position-target');
		if(!positionTargetSelector) return false;
		var positionTarget = document.querySelector(positionTargetSelector);
		return positionTarget;
	};

  function initPopover(popover) {
		// init aria-labels
		for(var i = 0; i < popover.trigger.length; i++) {
			Util.setAttributes(popover.trigger[i], {'aria-expanded': 'false', 'aria-haspopup': 'true'});
		}
  };
  
  function initPopoverEvents(popover) {
		for(var i = 0; i < popover.trigger.length; i++) {(function(i){
			popover.trigger[i].addEventListener('click', function(event){
				event.preventDefault();
				// if the popover had been previously opened by another trigger element -> close it first and reopen in the right position
				if(Util.hasClass(popover.element, popover.popoverVisibleClass) && popover.selectedTrigger !=  popover.trigger[i]) {
					togglePopover(popover, false, false); // close menu
				}
				// toggle popover
				popover.selectedTrigger = popover.trigger[i];
				togglePopover(popover, !Util.hasClass(popover.element, popover.popoverVisibleClass), true);
			});
    })(i);}
    
    // trap focus
    popover.element.addEventListener('keydown', function(event){
      if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        //trap focus inside popover
        trapFocus(popover, event);
      }
    });
  };
  
  function togglePopover(popover, bool, moveFocus) {
		// toggle popover visibility
		Util.toggleClass(popover.element, popover.popoverVisibleClass, bool);
		popover.popoverIsOpen = bool;
		if(bool) {
      popover.selectedTrigger.setAttribute('aria-expanded', 'true');
      getFocusableElements(popover);
      // move focus
      focusPopover(popover);
			popover.element.addEventListener("transitionend", function(event) {focusPopover(popover);}, {once: true});
			// position the popover element
			positionPopover(popover);
			// add class to popover trigger
			Util.addClass(popover.selectedTrigger, popover.selectedTriggerClass);
		} else if(popover.selectedTrigger) {
			popover.selectedTrigger.setAttribute('aria-expanded', 'false');
			if(moveFocus) Util.moveFocus(popover.selectedTrigger);
			// remove class from menu trigger
			Util.removeClass(popover.selectedTrigger, popover.selectedTriggerClass);
			popover.selectedTrigger = false;
		}
	};
	
	function focusPopover(popover) {
		if(popover.firstFocusable) {
			popover.firstFocusable.focus();
		} else {
			Util.moveFocus(popover.element);
		}
	};

  function positionPopover(popover) {
		// reset popover position
		resetPopoverStyle(popover);
		var selectedTriggerPosition = (popover.positionTarget) ? popover.positionTarget.getBoundingClientRect() : popover.selectedTrigger.getBoundingClientRect();
		
		var menuOnTop = (window.innerHeight - selectedTriggerPosition.bottom) < selectedTriggerPosition.top;
			
		var left = selectedTriggerPosition.left,
			right = (window.innerWidth - selectedTriggerPosition.right),
			isRight = (window.innerWidth < selectedTriggerPosition.left + popover.element.offsetWidth);

		var horizontal = isRight ? 'right: '+right+'px;' : 'left: '+left+'px;',
			vertical = menuOnTop
				? 'bottom: '+(window.innerHeight - selectedTriggerPosition.top)+'px;'
				: 'top: '+selectedTriggerPosition.bottom+'px;';
		// check right position is correct -> otherwise set left to 0
		if( isRight && (right + popover.element.offsetWidth) > window.innerWidth) horizontal = 'left: '+ parseInt((window.innerWidth - popover.element.offsetWidth)/2)+'px;';
		// check if popover needs a max-height (user will scroll inside the popover)
		var maxHeight = menuOnTop ? selectedTriggerPosition.top - popover.viewportGap : window.innerHeight - selectedTriggerPosition.bottom - popover.viewportGap;

		var initialStyle = popover.element.getAttribute('style');
		if(!initialStyle) initialStyle = '';
		popover.element.setAttribute('style', initialStyle + horizontal + vertical +'max-height:'+Math.floor(maxHeight)+'px;');
	};
	
	function resetPopoverStyle(popover) {
		// remove popover inline style before appling new style
		popover.element.style.maxHeight = '';
		popover.element.style.top = '';
		popover.element.style.bottom = '';
		popover.element.style.left = '';
		popover.element.style.right = '';
	};

  function checkPopoverClick(popover, target) {
    // close popover when clicking outside it
    if(!popover.popoverIsOpen) return;
    if(!popover.element.contains(target) && !target.closest('[aria-controls="'+popover.elementId+'"]')) togglePopover(popover, false);
  };

  function checkPopoverFocus(popover) {
    // on Esc key -> close popover if open and move focus (if focus was inside popover)
    if(!popover.popoverIsOpen) return;
    var popoverParent = document.activeElement.closest('.js-popover');
    togglePopover(popover, false, popoverParent);
  };
  
  function getFocusableElements(popover) {
    //get all focusable elements inside the popover
		var allFocusable = popover.element.querySelectorAll(focusableElString);
		getFirstVisible(popover, allFocusable);
		getLastVisible(popover, allFocusable);
  };

  function getFirstVisible(popover, elements) {
		//get first visible focusable element inside the popover
		for(var i = 0; i < elements.length; i++) {
			if( isVisible(elements[i]) ) {
				popover.firstFocusable = elements[i];
				break;
			}
		}
	};

  function getLastVisible(popover, elements) {
		//get last visible focusable element inside the popover
		for(var i = elements.length - 1; i >= 0; i--) {
			if( isVisible(elements[i]) ) {
				popover.lastFocusable = elements[i];
				break;
			}
		}
  };

  function trapFocus(popover, event) {
    if( popover.firstFocusable == document.activeElement && event.shiftKey) {
			//on Shift+Tab -> focus last focusable element when focus moves out of popover
			event.preventDefault();
			popover.lastFocusable.focus();
		}
		if( popover.lastFocusable == document.activeElement && !event.shiftKey) {
			//on Tab -> focus first focusable element when focus moves out of popover
			event.preventDefault();
			popover.firstFocusable.focus();
		}
  };
  
  function isVisible(element) {
		// check if element is visible
		return element.offsetWidth || element.offsetHeight || element.getClientRects().length;
	};

  window.Popover = Popover;

  //initialize the Popover objects
  var popovers = document.getElementsByClassName('js-popover');
  // generic focusable elements string selector
	var focusableElString = '[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary';
	
	if( popovers.length > 0 ) {
		var popoversArray = [];
		var scrollingContainers = [];
		for( var i = 0; i < popovers.length; i++) {
			(function(i){
				popoversArray.push(new Popover(popovers[i]));
				var scrollableElement = popovers[i].getAttribute('data-scrollable-element');
				if(scrollableElement && !scrollingContainers.includes(scrollableElement)) scrollingContainers.push(scrollableElement);
			})(i);
		}

		// listen for key events
		window.addEventListener('keyup', function(event){
			if( event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {
        // close popover on 'Esc'
				popoversArray.forEach(function(element){
					element.checkPopoverFocus();
				});
			} 
		});
		// close popover when clicking outside it
		window.addEventListener('click', function(event){
			popoversArray.forEach(function(element){
				element.checkPopoverClick(event.target);
			});
		});
		// on resize -> close all popover elements
		window.addEventListener('resize', function(event){
			popoversArray.forEach(function(element){
				element.togglePopover(false, false);
			});
		});
		// on scroll -> close all popover elements
		window.addEventListener('scroll', function(event){
			popoversArray.forEach(function(element){
				if(element.popoverIsOpen) element.togglePopover(false, false);
			});
		});
		// take into account additinal scrollable containers
		for(var j = 0; j < scrollingContainers.length; j++) {
			var scrollingContainer = document.querySelector(scrollingContainers[j]);
			if(scrollingContainer) {
				scrollingContainer.addEventListener('scroll', function(event){
					popoversArray.forEach(function(element){
						if(element.popoverIsOpen) element.togglePopover(false, false);
					});
				});
			}
		}
	}
}());
// File#: _1_side-navigation
// Usage: codyhouse.co/license
(function() {
  function initSideNav(nav) {
    nav.addEventListener('click', function(event){
      var btn = event.target.closest('.js-sidenav__sublist-control');
      if(!btn) return;
      var listItem = btn.parentElement,
        bool = Util.hasClass(listItem, 'sidenav__item--expanded');
      btn.setAttribute('aria-expanded', !bool);
      Util.toggleClass(listItem, 'sidenav__item--expanded', !bool);
    });
  };

	var sideNavs = document.getElementsByClassName('js-sidenav');
	if( sideNavs.length > 0 ) {
		for( var i = 0; i < sideNavs.length; i++) {
      (function(i){initSideNav(sideNavs[i]);})(i);
		}
	}
}());
// File#: _1_sub-navigation
// Usage: codyhouse.co/license
(function() {
    var SideNav = function(element) {
      this.element = element;
      this.control = this.element.getElementsByClassName('js-subnav__control');
      this.navList = this.element.getElementsByClassName('js-subnav__wrapper');
      this.closeBtn = this.element.getElementsByClassName('js-subnav__close-btn');
      this.firstFocusable = getFirstFocusable(this);
      this.showClass = 'subnav__wrapper--is-visible';
      this.collapsedLayoutClass = 'subnav--collapsed';
      initSideNav(this);
    };
  
    function getFirstFocusable(sidenav) { // get first focusable element inside the subnav
      if(sidenav.navList.length == 0) return;
      var focusableEle = sidenav.navList[0].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'),
          firstFocusable = false;
      for(var i = 0; i < focusableEle.length; i++) {
        if( focusableEle[i].offsetWidth || focusableEle[i].offsetHeight || focusableEle[i].getClientRects().length ) {
          firstFocusable = focusableEle[i];
          break;
        }
      }
  
      return firstFocusable;
    };
  
    function initSideNav(sidenav) {
      checkSideNavLayout(sidenav); // switch from --compressed to --expanded layout
      initSideNavToggle(sidenav); // mobile behavior + layout update on resize
    };
  
    function initSideNavToggle(sidenav) { 
      // custom event emitted when window is resized
      sidenav.element.addEventListener('update-sidenav', function(event){
        checkSideNavLayout(sidenav);
      });
  
      // mobile only
      if(sidenav.control.length == 0 || sidenav.navList.length == 0) return;
      sidenav.control[0].addEventListener('click', function(event){ // open sidenav
        openSideNav(sidenav, event);
      });
      sidenav.element.addEventListener('click', function(event) { // close sidenav when clicking on close button/bg layer
        if(event.target.closest('.js-subnav__close-btn') || Util.hasClass(event.target, 'js-subnav__wrapper')) {
          closeSideNav(sidenav, event);
        }
      });
    };
  
    function openSideNav(sidenav, event) { // open side nav - mobile only
      event.preventDefault();
      sidenav.selectedTrigger = event.target;
      event.target.setAttribute('aria-expanded', 'true');
      Util.addClass(sidenav.navList[0], sidenav.showClass);
      sidenav.navList[0].addEventListener('transitionend', function cb(event){
        sidenav.navList[0].removeEventListener('transitionend', cb);
        sidenav.firstFocusable.focus();
      });
    };
  
    function closeSideNav(sidenav, event, bool) { // close side sidenav - mobile only
      if( !Util.hasClass(sidenav.navList[0], sidenav.showClass) ) return;
      if(event) event.preventDefault();
      Util.removeClass(sidenav.navList[0], sidenav.showClass);
      if(!sidenav.selectedTrigger) return;
      sidenav.selectedTrigger.setAttribute('aria-expanded', 'false');
      if(!bool) sidenav.selectedTrigger.focus();
      sidenav.selectedTrigger = false; 
    };
  
    function checkSideNavLayout(sidenav) { // switch from --compressed to --expanded layout
      var layout = getComputedStyle(sidenav.element, ':before').getPropertyValue('content').replace(/\'|"/g, '');
      if(layout != 'expanded' && layout != 'collapsed') return;
      Util.toggleClass(sidenav.element, sidenav.collapsedLayoutClass, layout != 'expanded');
    };
    
    var sideNav = document.getElementsByClassName('js-subnav'),
      SideNavArray = [],
      j = 0;
    if( sideNav.length > 0) {
      for(var i = 0; i < sideNav.length; i++) {
        var beforeContent = getComputedStyle(sideNav[i], ':before').getPropertyValue('content');
        if(beforeContent && beforeContent !='' && beforeContent !='none') {
          j = j + 1;
        }
        (function(i){SideNavArray.push(new SideNav(sideNav[i]));})(i);
      }
  
      if(j > 0) { // on resize - update sidenav layout
        var resizingId = false,
          customEvent = new CustomEvent('update-sidenav');
        window.addEventListener('resize', function(event){
          clearTimeout(resizingId);
          resizingId = setTimeout(doneResizing, 300);
        });
  
        function doneResizing() {
          for( var i = 0; i < SideNavArray.length; i++) {
            (function(i){SideNavArray[i].element.dispatchEvent(customEvent)})(i);
          };
        };
  
        (window.requestAnimationFrame) // init table layout
          ? window.requestAnimationFrame(doneResizing)
          : doneResizing();
      }
  
      // listen for key events
      window.addEventListener('keyup', function(event){
        if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {// listen for esc key - close navigation on mobile if open
          for(var i = 0; i < SideNavArray.length; i++) {
            (function(i){closeSideNav(SideNavArray[i], event);})(i);
          };
        }
        if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) { // listen for tab key - close navigation on mobile if open when nav loses focus
          if( document.activeElement.closest('.js-subnav__wrapper')) return;
          for(var i = 0; i < SideNavArray.length; i++) {
            (function(i){closeSideNav(SideNavArray[i], event, true);})(i);
          };
        }
      });
    }
  }());
// File#: _1_swipe-content
(function() {
    var SwipeContent = function(element) {
      this.element = element;
      this.delta = [false, false];
      this.dragging = false;
      this.intervalId = false;
      initSwipeContent(this);
    };
  
    function initSwipeContent(content) {
      content.element.addEventListener('mousedown', handleEvent.bind(content));
      content.element.addEventListener('touchstart', handleEvent.bind(content));
    };
  
    function initDragging(content) {
      //add event listeners
      content.element.addEventListener('mousemove', handleEvent.bind(content));
      content.element.addEventListener('touchmove', handleEvent.bind(content));
      content.element.addEventListener('mouseup', handleEvent.bind(content));
      content.element.addEventListener('mouseleave', handleEvent.bind(content));
      content.element.addEventListener('touchend', handleEvent.bind(content));
    };
  
    function cancelDragging(content) {
      //remove event listeners
      if(content.intervalId) {
        (!window.requestAnimationFrame) ? clearInterval(content.intervalId) : window.cancelAnimationFrame(content.intervalId);
        content.intervalId = false;
      }
      content.element.removeEventListener('mousemove', handleEvent.bind(content));
      content.element.removeEventListener('touchmove', handleEvent.bind(content));
      content.element.removeEventListener('mouseup', handleEvent.bind(content));
      content.element.removeEventListener('mouseleave', handleEvent.bind(content));
      content.element.removeEventListener('touchend', handleEvent.bind(content));
    };
  
    function handleEvent(event) {
      switch(event.type) {
        case 'mousedown':
        case 'touchstart':
          startDrag(this, event);
          break;
        case 'mousemove':
        case 'touchmove':
          drag(this, event);
          break;
        case 'mouseup':
        case 'mouseleave':
        case 'touchend':
          endDrag(this, event);
          break;
      }
    };
  
    function startDrag(content, event) {
      content.dragging = true;
      // listen to drag movements
      initDragging(content);
      content.delta = [parseInt(unify(event).clientX), parseInt(unify(event).clientY)];
      // emit drag start event
      emitSwipeEvents(content, 'dragStart', content.delta, event.target);
    };
  
    function endDrag(content, event) {
      cancelDragging(content);
      // credits: https://css-tricks.com/simple-swipe-with-vanilla-javascript/
      var dx = parseInt(unify(event).clientX), 
        dy = parseInt(unify(event).clientY);
      
      // check if there was a left/right swipe
      if(content.delta && (content.delta[0] || content.delta[0] === 0)) {
        var s = getSign(dx - content.delta[0]);
        
        if(Math.abs(dx - content.delta[0]) > 30) {
          (s < 0) ? emitSwipeEvents(content, 'swipeLeft', [dx, dy]) : emitSwipeEvents(content, 'swipeRight', [dx, dy]);	
        }
        
        content.delta[0] = false;
      }
      // check if there was a top/bottom swipe
      if(content.delta && (content.delta[1] || content.delta[1] === 0)) {
          var y = getSign(dy - content.delta[1]);
  
          if(Math.abs(dy - content.delta[1]) > 30) {
            (y < 0) ? emitSwipeEvents(content, 'swipeUp', [dx, dy]) : emitSwipeEvents(content, 'swipeDown', [dx, dy]);
        }
  
        content.delta[1] = false;
      }
      // emit drag end event
      emitSwipeEvents(content, 'dragEnd', [dx, dy]);
      content.dragging = false;
    };
  
    function drag(content, event) {
      if(!content.dragging) return;
      // emit dragging event with coordinates
      (!window.requestAnimationFrame) 
        ? content.intervalId = setTimeout(function(){emitDrag.bind(content, event);}, 250) 
        : content.intervalId = window.requestAnimationFrame(emitDrag.bind(content, event));
    };
  
    function emitDrag(event) {
      emitSwipeEvents(this, 'dragging', [parseInt(unify(event).clientX), parseInt(unify(event).clientY)]);
    };
  
    function unify(event) { 
      // unify mouse and touch events
      return event.changedTouches ? event.changedTouches[0] : event; 
    };
  
    function emitSwipeEvents(content, eventName, detail, el) {
      var trigger = false;
      if(el) trigger = el;
      // emit event with coordinates
      var event = new CustomEvent(eventName, {detail: {x: detail[0], y: detail[1], origin: trigger}});
      content.element.dispatchEvent(event);
    };
  
    function getSign(x) {
      if(!Math.sign) {
        return ((x > 0) - (x < 0)) || +x;
      } else {
        return Math.sign(x);
      }
    };
  
    window.SwipeContent = SwipeContent;
    
    //initialize the SwipeContent objects
    var swipe = document.getElementsByClassName('js-swipe-content');
    if( swipe.length > 0 ) {
      for( var i = 0; i < swipe.length; i++) {
        (function(i){new SwipeContent(swipe[i]);})(i);
      }
    }
  }());
// File#: _1_table
// Usage: codyhouse.co/license
(function() {
    function initTable(table) {
      checkTableLayour(table); // switch from a collapsed to an expanded layout
      Util.addClass(table, 'table--loaded'); // show table
  
      // custom event emitted when window is resized
      table.addEventListener('update-table', function(event){
        checkTableLayour(table);
      });
    };
  
    function checkTableLayour(table) {
      var layout = getComputedStyle(table, ':before').getPropertyValue('content').replace(/\'|"/g, '');
      Util.toggleClass(table, tableExpandedLayoutClass, layout != 'collapsed');
    };
  
    var tables = document.getElementsByClassName('js-table'),
      tableExpandedLayoutClass = 'table--expanded';
    if( tables.length > 0 ) {
      var j = 0;
      for( var i = 0; i < tables.length; i++) {
        var beforeContent = getComputedStyle(tables[i], ':before').getPropertyValue('content');
        if(beforeContent && beforeContent !='' && beforeContent !='none') {
          (function(i){initTable(tables[i]);})(i);
          j = j + 1;
        } else {
          Util.addClass(tables[i], 'table--loaded');
        }
      }
      
      if(j > 0) {
        var resizingId = false,
          customEvent = new CustomEvent('update-table');
        window.addEventListener('resize', function(event){
          clearTimeout(resizingId);
          resizingId = setTimeout(doneResizing, 300);
        });
  
        function doneResizing() {
          for( var i = 0; i < tables.length; i++) {
            (function(i){tables[i].dispatchEvent(customEvent)})(i);
          };
        };
  
        (window.requestAnimationFrame) // init table layout
          ? window.requestAnimationFrame(doneResizing)
          : doneResizing();
      }
    }
  }());
// File#: _1_tabs
// Usage: codyhouse.co/license
(function() {
	var Tab = function(element) {
		this.element = element;
		this.tabList = this.element.getElementsByClassName('js-tabs__controls')[0];
		this.listItems = this.tabList.getElementsByTagName('li');
		this.triggers = this.tabList.getElementsByTagName('a');
		this.panelsList = this.element.getElementsByClassName('js-tabs__panels')[0];
		this.panels = Util.getChildrenByClassName(this.panelsList, 'js-tabs__panel');
		this.hideClass = 'is-hidden';
		this.customShowClass = this.element.getAttribute('data-show-panel-class') ? this.element.getAttribute('data-show-panel-class') : false;
		this.initTab();
	};

	Tab.prototype.initTab = function() {
		//set initial aria attributes
		this.tabList.setAttribute('role', 'tablist');
		for( var i = 0; i < this.triggers.length; i++) {
			var bool = (i == 0),
				panelId = this.panels[i].getAttribute('id');
			this.listItems[i].setAttribute('role', 'presentation');
			Util.setAttributes(this.triggers[i], {'role': 'tab', 'aria-selected': bool, 'aria-controls': panelId, 'id': 'tab-'+panelId});
			Util.addClass(this.triggers[i], 'js-tabs__trigger'); 
			Util.setAttributes(this.panels[i], {'role': 'tabpanel', 'aria-labelledby': 'tab-'+panelId});
			Util.toggleClass(this.panels[i], this.hideClass, !bool);

			if(!bool) this.triggers[i].setAttribute('tabindex', '-1'); 
		}

		//listen for Tab events
		this.initTabEvents();
	};

	Tab.prototype.initTabEvents = function() {
		var self = this;
		//click on a new tab -> select content
		this.tabList.addEventListener('click', function(event) {
			if( event.target.closest('.js-tabs__trigger') ) self.triggerTab(event.target.closest('.js-tabs__trigger'), event);
		});
		//arrow keys to navigate through tabs 
		this.tabList.addEventListener('keydown', function(event) {
			if( !event.target.closest('.js-tabs__trigger') ) return;
			if( event.keyCode && event.keyCode == 39 || event.key && event.key == 'ArrowRight' ) {
				self.selectNewTab('next');
			} else if( event.keyCode && event.keyCode == 37 || event.key && event.key == 'ArrowLeft' ) {
				self.selectNewTab('prev');
			}
		});
	};

	Tab.prototype.selectNewTab = function(direction) {
		var selectedTab = this.tabList.querySelector('[aria-selected="true"]'),
			index = Util.getIndexInArray(this.triggers, selectedTab);
		index = (direction == 'next') ? index + 1 : index - 1;
		//make sure index is in the correct interval 
		//-> from last element go to first using the right arrow, from first element go to last using the left arrow
		if(index < 0) index = this.listItems.length - 1;
		if(index >= this.listItems.length) index = 0;	
		this.triggerTab(this.triggers[index]);
		this.triggers[index].focus();
	};

	Tab.prototype.triggerTab = function(tabTrigger, event) {
		var self = this;
		event && event.preventDefault();	
		var index = Util.getIndexInArray(this.triggers, tabTrigger);
		//no need to do anything if tab was already selected
		if(this.triggers[index].getAttribute('aria-selected') == 'true') return;
		
		for( var i = 0; i < this.triggers.length; i++) {
			var bool = (i == index);
			Util.toggleClass(this.panels[i], this.hideClass, !bool);
			if(this.customShowClass) Util.toggleClass(this.panels[i], this.customShowClass, bool);
			this.triggers[i].setAttribute('aria-selected', bool);
			bool ? this.triggers[i].setAttribute('tabindex', '0') : this.triggers[i].setAttribute('tabindex', '-1');
		}
	};
	
	//initialize the Tab objects
	var tabs = document.getElementsByClassName('js-tabs');
	if( tabs.length > 0 ) {
		for( var i = 0; i < tabs.length; i++) {
			(function(i){new Tab(tabs[i]);})(i);
		}
	}
}());
// File#: _2_autocomplete
// Usage: codyhouse.co/license
(function() {
  var Autocomplete = function(opts) {
    if(!('CSS' in window) || !CSS.supports('color', 'var(--color-var)')) return;
    this.options = Util.extend(Autocomplete.defaults, opts);
    this.element = this.options.element;
    this.input = this.element.getElementsByClassName('js-autocomplete__input')[0];
    this.results = this.element.getElementsByClassName('js-autocomplete__results')[0];
    this.resultsList = this.results.getElementsByClassName('js-autocomplete__list')[0];
    this.ariaResult = this.element.getElementsByClassName('js-autocomplete__aria-results');
    this.resultClassName = this.element.getElementsByClassName('js-autocomplete__item').length > 0 ? 'js-autocomplete__item' : 'js-autocomplete__result';
    // store search info
    this.inputVal = '';
    this.typeId = false;
    this.searching = false;
    this.searchingClass = this.element.getAttribute('data-autocomplete-searching-class') || 'autocomplete--searching';
    // dropdown reveal class
    this.dropdownActiveClass =  this.element.getAttribute('data-autocomplete-dropdown-visible-class') || this.element.getAttribute('data-dropdown-active-class');
    // truncate dropdown
    this.truncateDropdown = this.element.getAttribute('data-autocomplete-dropdown-truncate') && this.element.getAttribute('data-autocomplete-dropdown-truncate') == 'on' ? true : false;
    initAutocomplete(this);
    this.autocompleteClosed = false; // fix issue when selecting an option from the list
  };

  function initAutocomplete(element) {
    initAutocompleteAria(element); // set aria attributes for SR and keyboard users
    initAutocompleteTemplates(element);
    initAutocompleteEvents(element);
  };

  function initAutocompleteAria(element) {
    // set aria attributes for input element
    Util.setAttributes(element.input, {'role': 'combobox', 'aria-autocomplete': 'list'});
    var listId = element.resultsList.getAttribute('id');
    if(listId) element.input.setAttribute('aria-owns', listId);
    // set aria attributes for autocomplete list
    element.resultsList.setAttribute('role', 'list');
  };

  function initAutocompleteTemplates(element) {
    element.templateItems = element.resultsList.querySelectorAll('.'+element.resultClassName+'[data-autocomplete-template]');
    if(element.templateItems.length < 1) element.templateItems = element.resultsList.querySelectorAll('.'+element.resultClassName);
    element.templates = [];
    for(var i = 0; i < element.templateItems.length; i++) {
      element.templates[i] = element.templateItems[i].getAttribute('data-autocomplete-template');
    }
  };

  function initAutocompleteEvents(element) {
    // input - keyboard navigation 
    element.input.addEventListener('keyup', function(event){
      handleInputTyped(element, event);
    });

    // if input type="search" -> detect when clicking on 'x' to clear input
    element.input.addEventListener('search', function(event){
      updateSearch(element);
    });

    // make sure dropdown is open on click
    element.input.addEventListener('click', function(event){
      updateSearch(element, true);
    });

    element.input.addEventListener('focus', function(event){
      if(element.autocompleteClosed) {
        element.autocompleteClosed = false;
        return;
      }
      updateSearch(element, true);
    });

    // input loses focus -> close menu
    element.input.addEventListener('blur', function(event){
      checkFocusLost(element, event);
    });

    // results list - keyboard navigation 
    element.resultsList.addEventListener('keydown', function(event){
      navigateList(element, event);
    });

    // results list loses focus -> close menu
    element.resultsList.addEventListener('focusout', function(event){
      checkFocusLost(element, event);
    });

    // close on esc
    window.addEventListener('keyup', function(event){
      if( event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' ) {
        toggleOptionsList(element, false);
      } else if(event.keyCode && event.keyCode == 13 || event.key && event.key.toLowerCase() == 'enter') { // on Enter - select result if focus is within results list
        selectResult(element, document.activeElement.closest('.'+element.resultClassName), event);
      }
    });

    // select element from list
    element.resultsList.addEventListener('click', function(event){
      selectResult(element, event.target.closest('.'+element.resultClassName), event);
    });
  };

  function checkFocusLost(element, event) {
    if(element.element.contains(event.relatedTarget)) return;
    toggleOptionsList(element, false);
  };

  function handleInputTyped(element, event) {
    if(event.key.toLowerCase() == 'arrowdown' || event.keyCode == '40') {
      moveFocusToList(element);
    } else {
      updateSearch(element);
    }
  };

  function moveFocusToList(element) {
    if(!Util.hasClass(element.element, element.dropdownActiveClass)) return;
    resetSearch(element); // clearTimeout
    // make sure first element is focusable
    var index = 0;
    if(!elementListIsFocusable(element.resultsItems[index])) {
      index = getElementFocusbleIndex(element, index, true);
    }
    getListFocusableEl(element.resultsItems[index]).focus();
  };

  function updateSearch(element, bool) {
    var inputValue = element.input.value;
    if(inputValue == element.inputVal && !bool) return; // input value did not change
    element.inputVal = inputValue;
    if(element.typeId) clearInterval(element.typeId); // clearTimeout
    if(element.inputVal.length < element.options.characters) { // not enough characters to start searching
      toggleOptionsList(element, false);
      return;
    }
    if(bool) { // on focus -> update result list without waiting for the debounce
      updateResultsList(element, 'focus');
      return;
    }
    element.typeId = setTimeout(function(){
      updateResultsList(element, 'type');
    }, element.options.debounce);
  };

  function toggleOptionsList(element, bool) {
    // toggle visibility of options list
    if(bool) {
      if(Util.hasClass(element.element, element.dropdownActiveClass)) return;
      Util.addClass(element.element, element.dropdownActiveClass);
      element.input.setAttribute('aria-expanded', true);
      truncateAutocompleteList(element);
    } else {
      if(!Util.hasClass(element.element, element.dropdownActiveClass)) return;
      if(element.resultsList.contains(document.activeElement)) {
        element.autocompleteClosed = true;
        element.input.focus();
      }
      Util.removeClass(element.element, element.dropdownActiveClass);
      element.input.removeAttribute('aria-expanded');
      resetSearch(element); // clearTimeout
    }
  };

  function truncateAutocompleteList(element) {
    if(!element.truncateDropdown) return;
    // reset max height
    element.resultsList.style.maxHeight = '';
    // check available space 
    var spaceBelow = (window.innerHeight - element.input.getBoundingClientRect().bottom - 10),
      maxHeight = parseInt(getComputedStyle(element.resultsList).maxHeight);

    (maxHeight > spaceBelow) 
      ? element.resultsList.style.maxHeight = spaceBelow+'px' 
      : element.resultsList.style.maxHeight = '';
  };

  function updateResultsList(element, eventType) {
    if(element.searching) return;
    element.searching = true;
    Util.addClass(element.element, element.searchingClass); // show loader
    element.options.searchData(element.inputVal, function(data){
      // data = custom results
      populateResults(element, data);
      Util.removeClass(element.element, element.searchingClass);
      toggleOptionsList(element, true);
      updateAriaRegion(element);
      element.searching = false;
    }, eventType);
  };

  function updateAriaRegion(element) {
    element.resultsItems = element.resultsList.querySelectorAll('.'+element.resultClassName+'[tabindex="-1"]');
    if(element.ariaResult.length == 0) return;
    element.ariaResult[0].textContent = element.resultsItems.length;
  };

  function resetSearch(element) {
    if(element.typeId) clearInterval(element.typeId);
    element.typeId = false;
  };

  function navigateList(element, event) {
    var downArrow = (event.key.toLowerCase() == 'arrowdown' || event.keyCode == '40'),
      upArrow = (event.key.toLowerCase() == 'arrowup' || event.keyCode == '38');
    if(!downArrow && !upArrow) return;
    event.preventDefault();
    var selectedElement = document.activeElement.closest('.'+element.resultClassName) || document.activeElement;
    var index = Util.getIndexInArray(element.resultsItems, selectedElement);
    var newIndex = getElementFocusbleIndex(element, index, downArrow);
    getListFocusableEl(element.resultsItems[newIndex]).focus();
  };

  function getElementFocusbleIndex(element, index, nextItem) {
    var newIndex = nextItem ? index + 1 : index - 1;
    if(newIndex < 0) newIndex = element.resultsItems.length - 1;
    if(newIndex >= element.resultsItems.length) newIndex = 0;
    // check if element can be focused
    if(!elementListIsFocusable(element.resultsItems[newIndex])) {
      // skip this element
      return getElementFocusbleIndex(element, newIndex, nextItem);
    }
    return newIndex;
  };

  function elementListIsFocusable(item) {
    var role = item.getAttribute('role');
    if(role && role == 'presentation') {
      // skip this element
      return false;
    }
    return true;
  };

  function getListFocusableEl(item) {
    var newFocus = item,
      focusable = newFocus.querySelectorAll('button:not([disabled]), [href]');
    if(focusable.length > 0 ) newFocus = focusable[0];
    return newFocus;
  };

  function selectResult(element, result, event) {
    if(!result) return;
    if(element.options.onClick) {
      element.options.onClick(result, element, event, function(){
        toggleOptionsList(element, false);
      });
    } else {
      element.input.value = getResultContent(result);
      toggleOptionsList(element, false);
    }
    element.inputVal = element.input.value;
  };

  function getResultContent(result) { // get text content of selected item
    var labelElement = result.querySelector('[data-autocomplete-label]');
    return labelElement ? labelElement.textContent : result.textContent;
  };

  function populateResults(element, data) {
    var innerHtml = '';

    for(var i = 0; i < data.length; i++) {
      innerHtml = innerHtml + getItemHtml(element, data[i]);
    }
    element.resultsList.innerHTML = innerHtml;
  };

  function getItemHtml(element, data) {
    var clone = getClone(element, data);
    Util.removeClass(clone, 'is-hidden');
    clone.setAttribute('tabindex', '-1');
    for(var key in data) {
      if (data.hasOwnProperty(key)) {
        if(key == 'label') setLabel(clone, data[key]);
        else if(key == 'class') setClass(clone, data[key]);
        else if(key == 'url') setUrl(clone, data[key]);
        else if(key == 'src') setSrc(clone, data[key]);
        else setKey(clone, key, data[key]);
      }
    }
    return clone.outerHTML;
  };

  function getClone(element, data) {
    var item = false;
    if(element.templateItems.length == 1 || !data['template']) item = element.templateItems[0];
    else {
      for(var i = 0; i < element.templateItems.length; i++) {
        if(data['template'] == element.templates[i]) {
          item = element.templateItems[i];
        }
      }
      if(!item) item = element.templateItems[0];
    }
    return item.cloneNode(true);
  };

  function setLabel(clone, label) {
    var labelElement = clone.querySelector('[data-autocomplete-label]');
    labelElement 
      ? labelElement.textContent = label
      : clone.textContent = label;
  };

  function setClass(clone, classList) {
    Util.addClass(clone, classList);
  };

  function setUrl(clone, url) {
    var linkElement = clone.querySelector('[data-autocomplete-url]');
    if(linkElement) linkElement.setAttribute('href', url);
  };

  function setSrc(clone, src) {
    var imgElement = clone.querySelector('[data-autocomplete-src]');
    if(imgElement) imgElement.setAttribute('src', src);
  };

  function setKey(clone, key, value) {
    var subElement = clone.querySelector('[data-autocomplete-'+key+']');
    if(subElement) {
      if(subElement.hasAttribute('data-autocomplete-html')) subElement.innerHTML = value;
      else subElement.textContent = value;
    }
  };

  Autocomplete.defaults = {
    element : '',
    debounce: 200,
    characters: 2,
    searchData: false, // function used to return results
    onClick: false // function executed when selecting an item in the list; arguments (result, obj) -> selected <li> item + Autocompletr obj reference
  };

  window.Autocomplete = Autocomplete;
}());
// File#: _2_carousel
// Usage: codyhouse.co/license
(function() {
    var Carousel = function(opts) {
      this.options = Util.extend(Carousel.defaults , opts);
      this.element = this.options.element;
      this.listWrapper = this.element.getElementsByClassName('carousel__wrapper')[0];
      this.list = this.element.getElementsByClassName('carousel__list')[0];
      this.items = this.element.getElementsByClassName('carousel__item');
      this.initItems = []; // store only the original elements - will need this for cloning
      this.itemsNb = this.items.length; //original number of items
      this.visibItemsNb = 1; // tot number of visible items
      this.itemsWidth = 1; // this will be updated with the right width of items
      this.itemOriginalWidth = false; // store the initial width to use it on resize
      this.selectedItem = 0; // index of first visible item 
      this.translateContainer = 0; // this will be the amount the container has to be translated each time a new group has to be shown (negative)
      this.containerWidth = 0; // this will be used to store the total width of the carousel (including the overflowing part)
      this.ariaLive = false;
      // navigation
      this.controls = this.element.getElementsByClassName('js-carousel__control');
      this.animating = false;
      // autoplay
      this.autoplayId = false;
      this.autoplayPaused = false;
      //drag
      this.dragStart = false;
      // resize
      this.resizeId = false;
      // used to re-initialize js
      this.cloneList = [];
      // store items min-width
      this.itemAutoSize = false;
      // store translate value (loop = off)
      this.totTranslate = 0;
      // modify loop option if navigation is on
      if(this.options.nav) this.options.loop = false;
      // store counter elements (if present)
      this.counter = this.element.getElementsByClassName('js-carousel__counter');
      this.counterTor = this.element.getElementsByClassName('js-carousel__counter-tot');
      initCarouselLayout(this); // get number visible items + width items
      setItemsWidth(this, true); 
      insertBefore(this, this.visibItemsNb); // insert clones before visible elements
      updateCarouselClones(this); // insert clones after visible elements
      resetItemsTabIndex(this); // make sure not visible items are not focusable
      initAriaLive(this); // set aria-live region for SR
      initCarouselEvents(this); // listen to events
      initCarouselCounter(this);
      Util.addClass(this.element, 'carousel--loaded');
    };
    
    //public carousel functions
    Carousel.prototype.showNext = function() {
      showNextItems(this);
    };
  
    Carousel.prototype.showPrev = function() {
      showPrevItems(this);
    };
  
    Carousel.prototype.startAutoplay = function() {
      startAutoplay(this);
    };
  
    Carousel.prototype.pauseAutoplay = function() {
      pauseAutoplay(this);
    };
    
    //private carousel functions
    function initCarouselLayout(carousel) {
      // evaluate size of single elements + number of visible elements
      var itemStyle = window.getComputedStyle(carousel.items[0]),
        containerStyle = window.getComputedStyle(carousel.listWrapper),
        itemWidth = parseFloat(itemStyle.getPropertyValue('width')),
        itemMargin = parseFloat(itemStyle.getPropertyValue('margin-right')),
        containerPadding = parseFloat(containerStyle.getPropertyValue('padding-left')),
        containerWidth = parseFloat(containerStyle.getPropertyValue('width'));
  
      if(!carousel.itemAutoSize) {
        carousel.itemAutoSize = itemWidth;
      }
  
      // if carousel.listWrapper is hidden -> make sure to retrieve the proper width
      containerWidth = getCarouselWidth(carousel, containerWidth);
  
      if( !carousel.itemOriginalWidth) { // on resize -> use initial width of items to recalculate 
        carousel.itemOriginalWidth = itemWidth;
      } else {
        itemWidth = carousel.itemOriginalWidth;
      }
  
      if(carousel.itemAutoSize) {
        carousel.itemOriginalWidth = parseInt(carousel.itemAutoSize);
        itemWidth = carousel.itemOriginalWidth;
      }
      // make sure itemWidth is smaller than container width
      if(containerWidth < itemWidth) {
        carousel.itemOriginalWidth = containerWidth
        itemWidth = carousel.itemOriginalWidth;
      }
      // get proper width of elements
      carousel.visibItemsNb = parseInt((containerWidth - 2*containerPadding + itemMargin)/(itemWidth+itemMargin));
      carousel.itemsWidth = parseFloat( (((containerWidth - 2*containerPadding + itemMargin)/carousel.visibItemsNb) - itemMargin).toFixed(1));
      carousel.containerWidth = (carousel.itemsWidth+itemMargin)* carousel.items.length;
      carousel.translateContainer = 0 - ((carousel.itemsWidth+itemMargin)* carousel.visibItemsNb);
      // flexbox fallback
      if(!flexSupported) carousel.list.style.width = (carousel.itemsWidth + itemMargin)*carousel.visibItemsNb*3+'px';
      
      // this is used when loop == off
      carousel.totTranslate = 0 - carousel.selectedItem*(carousel.itemsWidth+itemMargin);
      if(carousel.items.length <= carousel.visibItemsNb) carousel.totTranslate = 0;
  
      centerItems(carousel); // center items if carousel.items.length < visibItemsNb
      alignControls(carousel); // check if controls need to be aligned to a different element
    };
  
    function setItemsWidth(carousel, bool) {
      for(var i = 0; i < carousel.items.length; i++) {
        carousel.items[i].style.width = carousel.itemsWidth+"px";
        if(bool) carousel.initItems.push(carousel.items[i]);
      }
    };
  
    function updateCarouselClones(carousel) { 
      if(!carousel.options.loop) return;
      // take care of clones after visible items (needs to run after the update of clones before visible items)
      if(carousel.items.length < carousel.visibItemsNb*3) {
        insertAfter(carousel, carousel.visibItemsNb*3 - carousel.items.length, carousel.items.length - carousel.visibItemsNb*2);
      } else if(carousel.items.length > carousel.visibItemsNb*3 ) {
        removeClones(carousel, carousel.visibItemsNb*3, carousel.items.length - carousel.visibItemsNb*3);
      }
      // set proper translate value for the container
      setTranslate(carousel, 'translateX('+carousel.translateContainer+'px)');
    };
  
    function initCarouselEvents(carousel) {
      // listen for click on previous/next arrow
      // dots navigation
      if(carousel.options.nav) {
        carouselCreateNavigation(carousel);
        carouselInitNavigationEvents(carousel);
      }
  
      if(carousel.controls.length > 0) {
        carousel.controls[0].addEventListener('click', function(event){
          event.preventDefault();
          showPrevItems(carousel);
          updateAriaLive(carousel);
        });
        carousel.controls[1].addEventListener('click', function(event){
          event.preventDefault();
          showNextItems(carousel);
          updateAriaLive(carousel);
        });
  
        // update arrow visility -> loop == off only
        resetCarouselControls(carousel);
        // emit custom event - items visible
        emitCarouselActiveItemsEvent(carousel)
      }
      // autoplay
      if(carousel.options.autoplay) {
        startAutoplay(carousel);
        // pause autoplay if user is interacting with the carousel
        carousel.element.addEventListener('mouseenter', function(event){
          pauseAutoplay(carousel);
          carousel.autoplayPaused = true;
        });
        carousel.element.addEventListener('focusin', function(event){
          pauseAutoplay(carousel);
          carousel.autoplayPaused = true;
        });
        carousel.element.addEventListener('mouseleave', function(event){
          carousel.autoplayPaused = false;
          startAutoplay(carousel);
        });
        carousel.element.addEventListener('focusout', function(event){
          carousel.autoplayPaused = false;
          startAutoplay(carousel);
        });
      }
      // drag events
      if(carousel.options.drag && window.requestAnimationFrame) {
        //init dragging
        new SwipeContent(carousel.element);
        carousel.element.addEventListener('dragStart', function(event){
          if(event.detail.origin && event.detail.origin.closest('.js-carousel__control')) return;
          if(event.detail.origin && event.detail.origin.closest('.js-carousel__navigation')) return;
          if(event.detail.origin && !event.detail.origin.closest('.carousel__wrapper')) return;
          Util.addClass(carousel.element, 'carousel--is-dragging');
          pauseAutoplay(carousel);
          carousel.dragStart = event.detail.x;
          animateDragEnd(carousel);
        });
        carousel.element.addEventListener('dragging', function(event){
          if(!carousel.dragStart) return;
          if(carousel.animating || Math.abs(event.detail.x - carousel.dragStart) < 10) return;
          var translate = event.detail.x - carousel.dragStart + carousel.translateContainer;
          if(!carousel.options.loop) {
            translate = event.detail.x - carousel.dragStart + carousel.totTranslate; 
          }
          setTranslate(carousel, 'translateX('+translate+'px)');
        });
      }
      // reset on resize
      window.addEventListener('resize', function(event){
        pauseAutoplay(carousel);
        clearTimeout(carousel.resizeId);
        carousel.resizeId = setTimeout(function(){
          resetCarouselResize(carousel);
          // reset dots navigation
          resetDotsNavigation(carousel);
          resetCarouselControls(carousel);
          setCounterItem(carousel);
          startAutoplay(carousel);
          centerItems(carousel); // center items if carousel.items.length < visibItemsNb
          alignControls(carousel);
          // emit custom event - items visible
          emitCarouselActiveItemsEvent(carousel)
        }, 250)
      });
      // keyboard navigation
      carousel.element.addEventListener('keydown', function(event){
        if(event.keyCode && event.keyCode == 39 || event.key && event.key.toLowerCase() == 'arrowright') {
          carousel.showNext();
        } else if(event.keyCode && event.keyCode == 37 || event.key && event.key.toLowerCase() == 'arrowleft') {
          carousel.showPrev();
        }
      });
    };
  
    function showPrevItems(carousel) {
      if(carousel.animating) return;
      carousel.animating = true;
      carousel.selectedItem = getIndex(carousel, carousel.selectedItem - carousel.visibItemsNb);
      animateList(carousel, '0', 'prev');
    };
  
    function showNextItems(carousel) {
      if(carousel.animating) return;
      carousel.animating = true;
      carousel.selectedItem = getIndex(carousel, carousel.selectedItem + carousel.visibItemsNb);
      animateList(carousel, carousel.translateContainer*2+'px', 'next');
    };
  
    function animateDragEnd(carousel) { // end-of-dragging animation
      carousel.element.addEventListener('dragEnd', function cb(event){
        carousel.element.removeEventListener('dragEnd', cb);
        Util.removeClass(carousel.element, 'carousel--is-dragging');
        if(event.detail.x - carousel.dragStart < -40) {
          carousel.animating = false;
          showNextItems(carousel);
        } else if(event.detail.x - carousel.dragStart > 40) {
          carousel.animating = false;
          showPrevItems(carousel);
        } else if(event.detail.x - carousel.dragStart == 0) { // this is just a click -> no dragging
          return;
        } else { // not dragged enought -> do not update carousel, just reset
          carousel.animating = true;
          animateList(carousel, carousel.translateContainer+'px', false);
        }
        carousel.dragStart = false;
      });
    };
  
    function animateList(carousel, translate, direction) { // takes care of changing visible items
      pauseAutoplay(carousel);
      Util.addClass(carousel.list, 'carousel__list--animating');
      var initTranslate = carousel.totTranslate;
      if(!carousel.options.loop) {
        translate = noLoopTranslateValue(carousel, direction);
      }
      setTimeout(function() {setTranslate(carousel, 'translateX('+translate+')');});
      if(transitionSupported) {
        carousel.list.addEventListener('transitionend', function cb(event){
          if(event.propertyName && event.propertyName != 'transform') return;
          Util.removeClass(carousel.list, 'carousel__list--animating');
          carousel.list.removeEventListener('transitionend', cb);
          animateListCb(carousel, direction);
        });
      } else {
        animateListCb(carousel, direction);
      }
      if(!carousel.options.loop && (initTranslate == carousel.totTranslate)) {
        // translate value was not updated -> trigger transitionend event to restart carousel
        carousel.list.dispatchEvent(new CustomEvent('transitionend'));
      }
      resetCarouselControls(carousel);
      setCounterItem(carousel);
      // emit custom event - items visible
      emitCarouselActiveItemsEvent(carousel)
    };
  
    function noLoopTranslateValue(carousel, direction) {
      var translate = carousel.totTranslate;
      if(direction == 'next') {
        translate = carousel.totTranslate + carousel.translateContainer;
      } else if(direction == 'prev') {
        translate = carousel.totTranslate - carousel.translateContainer;
      } else if(direction == 'click') {
        translate = carousel.selectedDotIndex*carousel.translateContainer;
      }
      if(translate > 0)  {
        translate = 0;
        carousel.selectedItem = 0;
      }
      if(translate < - carousel.translateContainer - carousel.containerWidth) {
        translate = - carousel.translateContainer - carousel.containerWidth;
        carousel.selectedItem = carousel.items.length - carousel.visibItemsNb;
      }
      if(carousel.visibItemsNb > carousel.items.length) translate = 0;
      carousel.totTranslate = translate;
      return translate + 'px';
    };
  
    function animateListCb(carousel, direction) { // reset actions after carousel has been updated
      if(direction) updateClones(carousel, direction);
      carousel.animating = false;
      // reset autoplay
      startAutoplay(carousel);
      // reset tab index
      resetItemsTabIndex(carousel);
    };
  
    function updateClones(carousel, direction) {
      if(!carousel.options.loop) return;
      // at the end of each animation, we need to update the clones before and after the visible items
      var index = (direction == 'next') ? 0 : carousel.items.length - carousel.visibItemsNb;
      // remove clones you do not need anymore
      removeClones(carousel, index, false);
      // add new clones 
      (direction == 'next') ? insertAfter(carousel, carousel.visibItemsNb, 0) : insertBefore(carousel, carousel.visibItemsNb);
      //reset transform
      setTranslate(carousel, 'translateX('+carousel.translateContainer+'px)');
    };
  
    function insertBefore(carousel, nb, delta) {
      if(!carousel.options.loop) return;
      var clones = document.createDocumentFragment();
      var start = 0;
      if(delta) start = delta;
      for(var i = start; i < nb; i++) {
        var index = getIndex(carousel, carousel.selectedItem - i - 1),
          clone = carousel.initItems[index].cloneNode(true);
        Util.addClass(clone, 'js-clone');
        clones.insertBefore(clone, clones.firstChild);
      }
      carousel.list.insertBefore(clones, carousel.list.firstChild);
      emitCarouselUpdateEvent(carousel);
    };
  
    function insertAfter(carousel, nb, init) {
      if(!carousel.options.loop) return;
      var clones = document.createDocumentFragment();
      for(var i = init; i < nb + init; i++) {
        var index = getIndex(carousel, carousel.selectedItem + carousel.visibItemsNb + i),
          clone = carousel.initItems[index].cloneNode(true);
        Util.addClass(clone, 'js-clone');
        clones.appendChild(clone);
      }
      carousel.list.appendChild(clones);
      emitCarouselUpdateEvent(carousel);
    };
  
    function removeClones(carousel, index, bool) {
      if(!carousel.options.loop) return;
      if( !bool) {
        bool = carousel.visibItemsNb;
      }
      for(var i = 0; i < bool; i++) {
        if(carousel.items[index]) carousel.list.removeChild(carousel.items[index]);
      }
    };
  
    function resetCarouselResize(carousel) { // reset carousel on resize
      var visibleItems = carousel.visibItemsNb;
      // get new items min-width value
      resetItemAutoSize(carousel);
      initCarouselLayout(carousel); 
      setItemsWidth(carousel, false);
      resetItemsWidth(carousel); // update the array of original items -> array used to create clones
      if(carousel.options.loop) {
        if(visibleItems > carousel.visibItemsNb) {
          removeClones(carousel, 0, visibleItems - carousel.visibItemsNb);
        } else if(visibleItems < carousel.visibItemsNb) {
          insertBefore(carousel, carousel.visibItemsNb, visibleItems);
        }
        updateCarouselClones(carousel); // this will take care of translate + after elements
      } else {
        // reset default translate to a multiple value of (itemWidth + margin)
        var translate = noLoopTranslateValue(carousel);
        setTranslate(carousel, 'translateX('+translate+')');
      }
      resetItemsTabIndex(carousel); // reset focusable elements
    };
  
    function resetItemAutoSize(carousel) {
      if(!cssPropertiesSupported) return;
      // remove inline style
      carousel.items[0].removeAttribute('style');
      // get original item width 
      carousel.itemAutoSize = getComputedStyle(carousel.items[0]).getPropertyValue('width');
    };
  
    function resetItemsWidth(carousel) {
      for(var i = 0; i < carousel.initItems.length; i++) {
        carousel.initItems[i].style.width = carousel.itemsWidth+"px";
      }
    };
  
    function resetItemsTabIndex(carousel) {
      var carouselActive = carousel.items.length > carousel.visibItemsNb;
      var j = carousel.items.length;
      for(var i = 0; i < carousel.items.length; i++) {
        if(carousel.options.loop) {
          if(i < carousel.visibItemsNb || i >= 2*carousel.visibItemsNb ) {
            carousel.items[i].setAttribute('tabindex', '-1');
          } else {
            if(i < j) j = i;
            carousel.items[i].removeAttribute('tabindex');
          }
        } else {
          if( (i < carousel.selectedItem || i >= carousel.selectedItem + carousel.visibItemsNb) && carouselActive) {
            carousel.items[i].setAttribute('tabindex', '-1');
          } else {
            if(i < j) j = i;
            carousel.items[i].removeAttribute('tabindex');
          }
        }
      }
      resetVisibilityOverflowItems(carousel, j);
    };
  
    function startAutoplay(carousel) {
      if(carousel.options.autoplay && !carousel.autoplayId && !carousel.autoplayPaused) {
        carousel.autoplayId = setInterval(function(){
          showNextItems(carousel);
        }, carousel.options.autoplayInterval);
      }
    };
  
    function pauseAutoplay(carousel) {
      if(carousel.options.autoplay) {
        clearInterval(carousel.autoplayId);
        carousel.autoplayId = false;
      }
    };
  
    function initAriaLive(carousel) { // create an aria-live region for SR
      if(!carousel.options.ariaLive) return;
      // create an element that will be used to announce the new visible slide to SR
      var srLiveArea = document.createElement('div');
      Util.setAttributes(srLiveArea, {'class': 'sr-only js-carousel__aria-live', 'aria-live': 'polite', 'aria-atomic': 'true'});
      carousel.element.appendChild(srLiveArea);
      carousel.ariaLive = srLiveArea;
    };
  
    function updateAriaLive(carousel) { // announce to SR which items are now visible
      if(!carousel.options.ariaLive) return;
      carousel.ariaLive.innerHTML = 'Item '+(carousel.selectedItem + 1)+' selected. '+carousel.visibItemsNb+' items of '+carousel.initItems.length+' visible';
    };
  
    function getIndex(carousel, index) {
      if(index < 0) index = getPositiveValue(index, carousel.itemsNb);
      if(index >= carousel.itemsNb) index = index % carousel.itemsNb;
      return index;
    };
  
    function getPositiveValue(value, add) {
      value = value + add;
      if(value > 0) return value;
      else return getPositiveValue(value, add);
    };
  
    function setTranslate(carousel, translate) {
      carousel.list.style.transform = translate;
      carousel.list.style.msTransform = translate;
    };
  
    function getCarouselWidth(carousel, computedWidth) { // retrieve carousel width if carousel is initially hidden
      var closestHidden = carousel.listWrapper.closest('.sr-only');
      if(closestHidden) { // carousel is inside an .sr-only (visually hidden) element
        Util.removeClass(closestHidden, 'sr-only');
        computedWidth = carousel.listWrapper.offsetWidth;
        Util.addClass(closestHidden, 'sr-only');
      } else if(isNaN(computedWidth)){
        computedWidth = getHiddenParentWidth(carousel.element, carousel);
      }
      return computedWidth;
    };
  
    function getHiddenParentWidth(element, carousel) {
      var parent = element.parentElement;
      if(parent.tagName.toLowerCase() == 'html') return 0;
      var style = window.getComputedStyle(parent);
      if(style.display == 'none' || style.visibility == 'hidden') {
        parent.setAttribute('style', 'display: block!important; visibility: visible!important;');
        var computedWidth = carousel.listWrapper.offsetWidth;
        parent.style.display = '';
        parent.style.visibility = '';
        return computedWidth;
      } else {
        return getHiddenParentWidth(parent, carousel);
      }
    };
  
    function resetCarouselControls(carousel) {
      if(carousel.options.loop) return;
      // update arrows status
      if(carousel.controls.length > 0) {
        (carousel.totTranslate == 0) 
          ? carousel.controls[0].setAttribute('disabled', true) 
          : carousel.controls[0].removeAttribute('disabled');
        (carousel.totTranslate == (- carousel.translateContainer - carousel.containerWidth) || carousel.items.length <= carousel.visibItemsNb) 
          ? carousel.controls[1].setAttribute('disabled', true) 
          : carousel.controls[1].removeAttribute('disabled');
      }
      // update carousel dots
      if(carousel.options.nav) {
        var selectedDot = carousel.navigation.getElementsByClassName(carousel.options.navigationItemClass+'--selected');
        if(selectedDot.length > 0) Util.removeClass(selectedDot[0], carousel.options.navigationItemClass+'--selected');
  
        var newSelectedIndex = getSelectedDot(carousel);
        if(carousel.totTranslate == (- carousel.translateContainer - carousel.containerWidth)) {
          newSelectedIndex = carousel.navDots.length - 1;
        }
        Util.addClass(carousel.navDots[newSelectedIndex], carousel.options.navigationItemClass+'--selected');
      }
  
      (carousel.totTranslate == 0 && (carousel.totTranslate == (- carousel.translateContainer - carousel.containerWidth) || carousel.items.length <= carousel.visibItemsNb))
          ? Util.addClass(carousel.element, 'carousel--hide-controls')
          : Util.removeClass(carousel.element, 'carousel--hide-controls');
    };
  
    function emitCarouselUpdateEvent(carousel) {
      carousel.cloneList = [];
      var clones = carousel.element.querySelectorAll('.js-clone');
      for(var i = 0; i < clones.length; i++) {
        Util.removeClass(clones[i], 'js-clone');
        carousel.cloneList.push(clones[i]);
      }
      emitCarouselEvents(carousel, 'carousel-updated', carousel.cloneList);
    };
  
    function carouselCreateNavigation(carousel) {
      if(carousel.element.getElementsByClassName('js-carousel__navigation').length > 0) return;
    
      var navigation = document.createElement('ol'),
        navChildren = '';
  
      var navClasses = carousel.options.navigationClass+' js-carousel__navigation';
      if(carousel.items.length <= carousel.visibItemsNb) {
        navClasses = navClasses + ' is-hidden';
      }
      navigation.setAttribute('class', navClasses);
  
      var dotsNr = Math.ceil(carousel.items.length/carousel.visibItemsNb),
        selectedDot = getSelectedDot(carousel),
        indexClass = carousel.options.navigationPagination ? '' : 'sr-only'
      for(var i = 0; i < dotsNr; i++) {
        var className = (i == selectedDot) ? 'class="'+carousel.options.navigationItemClass+' '+carousel.options.navigationItemClass+'--selected js-carousel__nav-item"' :  'class="'+carousel.options.navigationItemClass+' js-carousel__nav-item"';
        navChildren = navChildren + '<li '+className+'><button class="reset js-tab-focus" style="outline: none;"><span class="'+indexClass+'">'+ (i+1) + '</span></button></li>';
      }
      navigation.innerHTML = navChildren;
      carousel.element.appendChild(navigation);
    };
  
    function carouselInitNavigationEvents(carousel) {
      carousel.navigation = carousel.element.getElementsByClassName('js-carousel__navigation')[0];
      carousel.navDots = carousel.element.getElementsByClassName('js-carousel__nav-item');
      carousel.navIdEvent = carouselNavigationClick.bind(carousel);
      carousel.navigation.addEventListener('click', carousel.navIdEvent);
    };
  
    function carouselRemoveNavigation(carousel) {
      if(carousel.navigation) carousel.element.removeChild(carousel.navigation);
      if(carousel.navIdEvent) carousel.navigation.removeEventListener('click', carousel.navIdEvent);
    };
  
    function resetDotsNavigation(carousel) {
      if(!carousel.options.nav) return;
      carouselRemoveNavigation(carousel);
      carouselCreateNavigation(carousel);
      carouselInitNavigationEvents(carousel);
    };
  
    function carouselNavigationClick(event) {
      var dot = event.target.closest('.js-carousel__nav-item');
      if(!dot) return;
      if(this.animating) return;
      this.animating = true;
      var index = Util.getIndexInArray(this.navDots, dot);
      this.selectedDotIndex = index;
      this.selectedItem = index*this.visibItemsNb;
      animateList(this, false, 'click');
    };
  
    function getSelectedDot(carousel) {
      return Math.ceil(carousel.selectedItem/carousel.visibItemsNb);
    };
  
    function initCarouselCounter(carousel) {
      if(carousel.counterTor.length > 0) carousel.counterTor[0].textContent = carousel.itemsNb;
      setCounterItem(carousel);
    };
  
    function setCounterItem(carousel) {
      if(carousel.counter.length == 0) return;
      var totalItems = carousel.selectedItem + carousel.visibItemsNb;
      if(totalItems > carousel.items.length) totalItems = carousel.items.length;
      carousel.counter[0].textContent = totalItems;
    };
  
    function centerItems(carousel) {
      if(!carousel.options.justifyContent) return;
      Util.toggleClass(carousel.list, 'justify-center', carousel.items.length < carousel.visibItemsNb);
    };
  
    function alignControls(carousel) {
      if(carousel.controls.length < 1 || !carousel.options.alignControls) return;
      if(!carousel.controlsAlignEl) {
        carousel.controlsAlignEl = carousel.element.querySelector(carousel.options.alignControls);
      }
      if(!carousel.controlsAlignEl) return;
      var translate = (carousel.element.offsetHeight - carousel.controlsAlignEl.offsetHeight);
      for(var i = 0; i < carousel.controls.length; i++) {
        carousel.controls[i].style.marginBottom = translate + 'px';
      }
    };
  
    function emitCarouselActiveItemsEvent(carousel) {
      emitCarouselEvents(carousel, 'carousel-active-items', {firstSelectedItem: carousel.selectedItem, visibleItemsNb: carousel.visibItemsNb});
    };
  
    function emitCarouselEvents(carousel, eventName, eventDetail) {
      var event = new CustomEvent(eventName, {detail: eventDetail});
      carousel.element.dispatchEvent(event);
    };
  
    function resetVisibilityOverflowItems(carousel, j) {
      if(!carousel.options.overflowItems) return;
      var itemWidth = carousel.containerWidth/carousel.items.length,
        delta = (window.innerWidth - itemWidth*carousel.visibItemsNb)/2,
        overflowItems = Math.ceil(delta/itemWidth);
  
      for(var i = 0; i < overflowItems; i++) {
        var indexPrev = j - 1 - i; // prev element
        if(indexPrev >= 0 ) carousel.items[indexPrev].removeAttribute('tabindex');
        var indexNext = j + carousel.visibItemsNb + i; // next element
        if(indexNext < carousel.items.length) carousel.items[indexNext].removeAttribute('tabindex');
      }
    };
  
    Carousel.defaults = {
      element : '',
      autoplay : false,
      autoplayInterval: 5000,
      loop: true,
      nav: false,
      navigationItemClass: 'carousel__nav-item',
      navigationClass: 'carousel__navigation',
      navigationPagination: false,
      drag: false,
      justifyContent: false,
      alignControls: false,
      overflowItems: false
    };
  
    window.Carousel = Carousel;
  
    //initialize the Carousel objects
    var carousels = document.getElementsByClassName('js-carousel'),
      flexSupported = Util.cssSupports('align-items', 'stretch'),
      transitionSupported = Util.cssSupports('transition'),
      cssPropertiesSupported = ('CSS' in window && CSS.supports('color', 'var(--color-var)'));
  
    if( carousels.length > 0) {
      for( var i = 0; i < carousels.length; i++) {
        (function(i){
          var autoplay = (carousels[i].getAttribute('data-autoplay') && carousels[i].getAttribute('data-autoplay') == 'on') ? true : false,
            autoplayInterval = (carousels[i].getAttribute('data-autoplay-interval')) ? carousels[i].getAttribute('data-autoplay-interval') : 5000,
            drag = (carousels[i].getAttribute('data-drag') && carousels[i].getAttribute('data-drag') == 'on') ? true : false,
            loop = (carousels[i].getAttribute('data-loop') && carousels[i].getAttribute('data-loop') == 'off') ? false : true,
            nav = (carousels[i].getAttribute('data-navigation') && carousels[i].getAttribute('data-navigation') == 'on') ? true : false,
            navigationItemClass = carousels[i].getAttribute('data-navigation-item-class') ? carousels[i].getAttribute('data-navigation-item-class') : 'carousel__nav-item',
            navigationClass = carousels[i].getAttribute('data-navigation-class') ? carousels[i].getAttribute('data-navigation-class') : 'carousel__navigation',
            navigationPagination = (carousels[i].getAttribute('data-navigation-pagination') && carousels[i].getAttribute('data-navigation-pagination') == 'on') ? true : false,
            overflowItems = (carousels[i].getAttribute('data-overflow-items') && carousels[i].getAttribute('data-overflow-items') == 'on') ? true : false,
            alignControls = carousels[i].getAttribute('data-align-controls') ? carousels[i].getAttribute('data-align-controls') : false,
            justifyContent = (carousels[i].getAttribute('data-justify-content') && carousels[i].getAttribute('data-justify-content') == 'on') ? true : false;
          new Carousel({element: carousels[i], autoplay : autoplay, autoplayInterval : autoplayInterval, drag: drag, ariaLive: true, loop: loop, nav: nav, navigationItemClass: navigationItemClass, navigationPagination: navigationPagination, navigationClass: navigationClass, overflowItems: overflowItems, justifyContent: justifyContent, alignControls: alignControls});
        })(i);
      }
    };
  }());
// File#: _2_flexi-header
// Usage: codyhouse.co/license
(function() {
  var flexHeader = document.getElementsByClassName('js-f-header');
	if(flexHeader.length > 0) {
		var menuTrigger = flexHeader[0].getElementsByClassName('js-anim-menu-btn')[0],
			firstFocusableElement = getMenuFirstFocusable();

		// we'll use these to store the node that needs to receive focus when the mobile menu is closed 
		var focusMenu = false;

		menuTrigger.addEventListener('anim-menu-btn-clicked', function(event){
			toggleMenuNavigation(event.detail);
		});

		// listen for key events
		window.addEventListener('keyup', function(event){
			// listen for esc key
			if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
				// close navigation on mobile if open
				if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger)) {
					focusMenu = menuTrigger; // move focus to menu trigger when menu is close
					menuTrigger.click();
				}
			}
			// listen for tab key
			if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
				// close navigation on mobile if open when nav loses focus
				if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger) && !document.activeElement.closest('.js-f-header')) menuTrigger.click();
			}
		});

		// listen for resize
		var resizingId = false;
		window.addEventListener('resize', function() {
			clearTimeout(resizingId);
			resizingId = setTimeout(doneResizing, 500);
		});

		function getMenuFirstFocusable() {
			var focusableEle = flexHeader[0].getElementsByClassName('f-header__nav')[0].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'),
				firstFocusable = false;
			for(var i = 0; i < focusableEle.length; i++) {
				if( focusableEle[i].offsetWidth || focusableEle[i].offsetHeight || focusableEle[i].getClientRects().length ) {
					firstFocusable = focusableEle[i];
					break;
				}
			}

			return firstFocusable;
    };
    
    function isVisible(element) {
      return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
		};

		function doneResizing() {
			if( !isVisible(menuTrigger) && Util.hasClass(flexHeader[0], 'f-header--expanded')) {
				menuTrigger.click();
			}
		};
		
		function toggleMenuNavigation(bool) { // toggle menu visibility on small devices
			Util.toggleClass(document.getElementsByClassName('f-header__nav')[0], 'f-header__nav--is-visible', bool);
			Util.toggleClass(flexHeader[0], 'f-header--expanded', bool);
			menuTrigger.setAttribute('aria-expanded', bool);
			if(bool) firstFocusableElement.focus(); // move focus to first focusable element
			else if(focusMenu) {
				focusMenu.focus();
				focusMenu = false;
			}
		};
	}
}());
// File#: _2_morphing-image-modal
// Usage: codyhouse.co/license
(function() {
  var MorphImgModal = function(opts) {
    this.options = Util.extend(MorphImgModal.defaults, opts);
    this.element = this.options.element;
    this.modalId = this.element.getAttribute('id');
    this.triggers = document.querySelectorAll('[aria-controls="'+this.modalId+'"]');
    this.selectedImg = false;
    // store morph elements
    this.morphBg = document.getElementsByClassName('js-morph-img-bg');
    this.morphImg = document.getElementsByClassName('js-morph-img-clone');
    // store modal content
    this.modalContent = this.element.getElementsByClassName('js-morph-img-modal__content');
    this.modalImg = this.element.getElementsByClassName('js-morph-img-modal__img');
    this.modalInfo = this.element.getElementsByClassName('js-morph-img-modal__info');
    // store close btn element
    this.modalCloseBtn = document.getElementsByClassName('js-morph-img-close-btn');
    // animation duration
    this.animationDuration = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--morph-img-modal-transition-duration'))*1000 || 300;
    // morphing animation should run
    this.animating = false;
    this.reset = false;
    initMorphModal(this);
  };

  function initMorphModal(element) {
    if(element.morphImg.length < 1) return;
    element.morphEl = element.morphImg[0].getElementsByTagName('image');
    element.morphRect  = element.morphImg[0].getElementsByTagName('rect');
    initMorphModalMarkup(element);
    initMorphModalEvents(element);
  };

  function initMorphModalMarkup(element) {
    // append the clip path + <image> elements to use to morph the image
    element.morphImg[0].innerHTML = '<svg><defs><clipPath id="'+element.modalId+'-clip"><rect/></clipPath></defs><image height="100%" width="100%" clip-path="url(#'+element.modalId+'-clip)"></image></svg>';
  };

  function initMorphModalEvents(element) {
    // morph modal was open
    element.element.addEventListener('modalIsOpen', function(event){
      var target = event.detail.closest('[aria-controls="'+element.modalId+'"]');
      setModalImg(element, target);
      setModalContent(element, target);
      toggleModalCloseBtn(element, true);
    });

    // morph modal was closed
    element.element.addEventListener('modalIsClose', function(event){
      element.reset = false;
      element.animating = true;
      Util.addClass(element.modalContent[0], 'opacity-0');
      animateImg(element, false, function() {
        if(element.reset) return; // user opened a new modal before the animation was complete - no need to reset the modal
        element.selectedImg = false;
        resetMorphModal(element, false);
        element.animating = false;
      });
      toggleModalCloseBtn(element, false);
    });

    // close modal clicking on close btn
    if(element.modalCloseBtn.length > 0) {
      element.modalCloseBtn[0].addEventListener('click', function(event) {
        element.element.click();
      });
    }
  };

  function setModalImg(element, target) {
    if(!target) return;
    element.selectedImg = (target.tagName.toLowerCase() == 'img') ? target : target.querySelector('img');
    var src = element.selectedImg.getAttribute('data-modal-src') || element.selectedImg.getAttribute('src');
    // update url modal image + morph
    if(element.modalImg.length > 0) element.modalImg[0].setAttribute('src', src);
    Util.setAttributes(element.morphEl[0], {'xlink:href': src, 'href': src});
    element.reset = false;
    element.animating = true;  
    // wait for image to be loaded, then animate
    loadImage(element, src, function() {
      animateImg(element, true, function() {
        if(element.reset) return; // user closed the modal before the animation was complete - no need to reset the modal
        resetMorphModal(element, true);
        element.animating = false;
      });
    });
  };

  function loadImage(element, src, cb) {
    var image = new Image();
    var loaded = false;
    image.onload = function () {
      if(loaded) return;
      cb();
    }
    image.src = src;
    if(image.complete) {
      loaded = true;
      cb();
    }
  };

  function setModalContent(element, target) {
    // load the modal info details - using the searchData custom function the user defines
    if(element.modalInfo.length < 1) return;
    element.options.searchData(target, function(data){
      element.modalInfo[0].innerHTML = data;
    });
  };

  function toggleModalCloseBtn(element, bool) {
    if(element.modalCloseBtn.length > 0) {
      Util.toggleClass(element.modalCloseBtn[0], 'morph-img-close-btn--is-visible', bool);
    }
  };

  function animateImg(element, isOpening, cb) {
    Util.removeClass(element.morphImg[0], 'is-hidden');

    var galleryImgRect = element.selectedImg.getBoundingClientRect(),
      modalImgRect = element.modalImg[0].getBoundingClientRect();

    runClipAnimation(element, galleryImgRect, modalImgRect, isOpening, cb);
  };

  function runClipAnimation(element, startRect, endRect, isOpening, cb) {
    // retrieve all animation params
    // main element animation (<div>)
    var elInitHeight = startRect.height,
      elIntWidth = startRect.width,
      elInitTop = startRect.top,
      elInitLeft = startRect.left;
    
    var elScale = Math.max(endRect.height/startRect.height, endRect.width/startRect.width);

    var elTranslateX = endRect.left - startRect.left + (endRect.width - startRect.width*elScale)*0.5,
      elTranslateY = endRect.top - startRect.top + (endRect.height - startRect.height*elScale)*0.5;

    // clip <rect> animation
    var rectScaleX = endRect.width/(startRect.width*elScale),
      rectScaleY = endRect.height/(startRect.height*elScale);

    element.morphImg[0].style = 'height:'+elInitHeight+'px; width:'+elIntWidth+'px; top:'+elInitTop+'px; left:'+elInitLeft+'px;';

    element.morphRect[0].setAttribute('transform', 'scale('+1+','+1+')');

    // init morph bg
    element.morphBg[0].style.height = startRect.height + 'px';
    element.morphBg[0].style.width = startRect.width + 'px';
    element.morphBg[0].style.top = startRect.top + 'px';
    element.morphBg[0].style.left = startRect.left + 'px';

    Util.removeClass(element.morphBg[0], 'is-hidden');
    
    animateRectScale(element, elInitHeight, elIntWidth, elScale, elTranslateX, elTranslateY, rectScaleX, rectScaleY, isOpening, cb);
  };

  function animateRectScale(element, height, width, elScale, elTranslateX, elTranslateY, rectScaleX, rectScaleY, isOpening, cb) {
    var isMobile = getComputedStyle(element.element, ':before').getPropertyValue('content').replace(/\'|"/g, '') == 'mobile';

    var currentTime = null,
      duration =  element.animationDuration;

    var startRect = element.selectedImg.getBoundingClientRect(),
      endRect = element.modalContent[0].getBoundingClientRect();
    
    var scaleX = endRect.width/startRect.width,
      scaleY = endRect.height/startRect.height;
  
    var translateX = endRect.left - startRect.left,
      translateY = endRect.top - startRect.top;

    var animateScale = function(timestamp){  
      if (!currentTime) currentTime = timestamp;         
      var progress = timestamp - currentTime;
      if(progress > duration) progress = duration;
      
      // main element values
      if(isOpening) {
        var elScalePr = Math.easeOutQuart(progress, 1, elScale - 1, duration),
        elTransXPr = Math.easeOutQuart(progress, 0, elTranslateX, duration),
        elTransYPr = Math.easeOutQuart(progress, 0, elTranslateY, duration);
      } else {
        var elScalePr = Math.easeOutQuart(progress, elScale, 1 - elScale, duration),
        elTransXPr = Math.easeOutQuart(progress, elTranslateX, - elTranslateX, duration),
        elTransYPr = Math.easeOutQuart(progress, elTranslateY, - elTranslateY, duration);
      }
      
      // rect values
      if(isOpening) {
        var rectScaleXPr = Math.easeOutQuart(progress, 1, rectScaleX - 1, duration),
          rectScaleYPr = Math.easeOutQuart(progress, 1, rectScaleY - 1, duration);
      } else {
        var rectScaleXPr = Math.easeOutQuart(progress, rectScaleX,  1 - rectScaleX, duration),
          rectScaleYPr = Math.easeOutQuart(progress, rectScaleY, 1 - rectScaleY, duration);
      }

      element.morphImg[0].style.transform = 'translateX('+elTransXPr+'px) translateY('+elTransYPr+'px) scale('+elScalePr+')';

      element.morphRect[0].setAttribute('transform', 'translate('+(width/2)*(1 - rectScaleXPr)+' '+(height/2)*(1 - rectScaleYPr)+') scale('+rectScaleXPr+','+rectScaleYPr+')');

      if(isOpening) {
        var valScaleX = Math.easeOutQuart(progress, 1, (scaleX - 1), duration),
          valScaleY = isMobile ? Math.easeOutQuart(progress, 1, (scaleY - 1), duration): rectScaleYPr*elScalePr,
          valTransX = Math.easeOutQuart(progress, 0, translateX, duration),
          valTransY = isMobile ? Math.easeOutQuart(progress, 0, translateY, duration) : elTransYPr + (elScalePr*height - rectScaleYPr*elScalePr*height)/2;
      } else {
        var valScaleX = Math.easeOutQuart(progress, scaleX, 1 - scaleX, duration),
          valScaleY = isMobile ? Math.easeOutQuart(progress, scaleY, 1 - scaleY, duration) : rectScaleYPr*elScalePr,
          valTransX = Math.easeOutQuart(progress, translateX, - translateX, duration),
          valTransY = isMobile ? Math.easeOutQuart(progress, translateY, - translateY, duration) : elTransYPr + (elScalePr*height - rectScaleYPr*elScalePr*height)/2;
      }

      // morph bg
      element.morphBg[0].style.transform = 'translateX('+valTransX+'px) translateY('+valTransY+'px) scale('+valScaleX+','+valScaleY+')';

      if(progress < duration) {
        window.requestAnimationFrame(animateScale);
      } else if(cb) {
        cb();
      }
    };
    
    window.requestAnimationFrame(animateScale);
  };
  
  function resetMorphModal(element, isOpening) {
    // reset modal at the end of an opening/closing animation
    Util.toggleClass(element.modalContent[0], 'opacity-0', !isOpening);
    Util.toggleClass(element.modalInfo[0], 'opacity-0', !isOpening);
    Util.addClass(element.morphBg[0], 'is-hidden');
    Util.addClass(element.morphImg[0], 'is-hidden');
    if(!isOpening) {
      element.modalImg[0].removeAttribute('src');
      element.modalInfo[0].innerHTML = '';
      element.morphEl[0].removeAttribute('xlink:href');
      element.morphEl[0].removeAttribute('href');
      element.morphBg[0].removeAttribute('style');
      element.morphImg[0].removeAttribute('style');
    }
  };

  window.MorphImgModal = MorphImgModal;

  MorphImgModal.defaults = {
    element : '',
    searchData: false, // function used to return results
  };
}());
// File#: _2_slideshow-preview-mode
// Usage: codyhouse.co/license
(function() {
    var SlideshowPrew = function(opts) {
      this.options = Util.extend(SlideshowPrew.defaults , opts);
      this.element = this.options.element;
      this.list = this.element.getElementsByClassName('js-slideshow-pm__list')[0];
      this.items = this.list.getElementsByClassName('js-slideshow-pm__item');
      this.controls = this.element.getElementsByClassName('js-slideshow-pm__control'); 
      this.selectedSlide = 0;
      this.autoplayId = false;
      this.autoplayPaused = false;
      this.navigation = false;
      this.navCurrentLabel = false;
      this.ariaLive = false;
      this.moveFocus = false;
      this.animating = false;
      this.supportAnimation = Util.cssSupports('transition');
      this.itemWidth = false;
      this.itemMargin = false;
      this.containerWidth = false;
      this.resizeId = false;
      // we will need this to implement keyboard nav
      this.firstFocusable = false;
      this.lastFocusable = false;
      // fallback for browsers not supporting flexbox
      initSlideshow(this);
      initSlideshowEvents(this);
      initAnimationEndEvents(this);
      Util.addClass(this.element, 'slideshow-pm--js-loaded');
    };
  
    SlideshowPrew.prototype.showNext = function(autoplay) {
      showNewItem(this, this.selectedSlide + 1, 'next', autoplay);
    };
  
    SlideshowPrew.prototype.showPrev = function() {
      showNewItem(this, this.selectedSlide - 1, 'prev');
    };
  
    SlideshowPrew.prototype.showItem = function(index) {
      showNewItem(this, index, false);
    };
  
    SlideshowPrew.prototype.startAutoplay = function() {
      var self = this;
      if(this.options.autoplay && !this.autoplayId && !this.autoplayPaused) {
        self.autoplayId = setInterval(function(){
          self.showNext(true);
        }, self.options.autoplayInterval);
      }
    };
  
    SlideshowPrew.prototype.pauseAutoplay = function() {
      var self = this;
      if(this.options.autoplay) {
        clearInterval(self.autoplayId);
        self.autoplayId = false;
      }
    };
  
    function initSlideshow(slideshow) { // basic slideshow settings
      // if no slide has been selected -> select the first one
      if(slideshow.element.getElementsByClassName('slideshow-pm__item--selected').length < 1) Util.addClass(slideshow.items[0], 'slideshow-pm__item--selected');
      slideshow.selectedSlide = Util.getIndexInArray(slideshow.items, slideshow.element.getElementsByClassName('slideshow-pm__item--selected')[0]);
      // now set translate value to the container element
      setTranslateValue(slideshow);
      setTranslate(slideshow);
      resetSlideshowNav(slideshow, 0, slideshow.selectedSlide);
      setFocusableElements(slideshow);
      // if flexbox is not supported, set a width for the list element
      if(!flexSupported) resetSlideshowFlexFallback(slideshow);
      // now add class to animate while translating
      setTimeout(function(){Util.addClass(slideshow.list, 'slideshow-pm__list--has-transition');}, 50);
      // add arai-hidden to not selected slides
      for(var i = 0; i < slideshow.items.length; i++) {
        (i == slideshow.selectedSlide) ? slideshow.items[i].removeAttribute('aria-hidden') : slideshow.items[i].setAttribute('aria-hidden', 'true');
      }
      // create an element that will be used to announce the new visible slide to SR
      var srLiveArea = document.createElement('div');
      Util.setAttributes(srLiveArea, {'class': 'sr-only js-slideshow-pm__aria-live', 'aria-live': 'polite', 'aria-atomic': 'true'});
      slideshow.element.appendChild(srLiveArea);
      slideshow.ariaLive = srLiveArea;
    };
  
    function initSlideshowEvents(slideshow) {
      // if slideshow navigation is on -> create navigation HTML and add event listeners
      if(slideshow.options.navigation) {
        var navigation = document.createElement('ol'),
          navChildren = '';
        
        navigation.setAttribute('class', 'slideshow-pm__navigation');
        for(var i = 0; i < slideshow.items.length; i++) {
          var className = (i == slideshow.selectedSlide) ? 'class="slideshow-pm__nav-item slideshow-pm__nav-item--selected js-slideshow-pm__nav-item"' :  'class="slideshow-pm__nav-item js-slideshow-pm__nav-item"',
            navCurrentLabel = (i == slideshow.selectedSlide) ? '<span class="sr-only js-slideshow-pm__nav-current-label">Current Item</span>' : '';
          navChildren = navChildren + '<li '+className+'><button class="reset"><span class="sr-only">'+ (i+1) + '</span>'+navCurrentLabel+'</button></li>';
        }
  
        navigation.innerHTML = navChildren;
        slideshow.navCurrentLabel = navigation.getElementsByClassName('js-slideshow-pm__nav-current-label')[0]; 
        slideshow.element.appendChild(navigation);
        slideshow.navigation = slideshow.element.getElementsByClassName('js-slideshow-pm__nav-item');
  
        navigation.addEventListener('click', function(event){
          navigateSlide(slideshow, event, true);
        });
        navigation.addEventListener('keyup', function(event){
          navigateSlide(slideshow, event, (event.key.toLowerCase() == 'enter'));
        });
      }
      // slideshow arrow controls
      if(slideshow.controls.length > 0) {
        slideshow.controls[0].addEventListener('click', function(event){
          event.preventDefault();
          slideshow.showPrev();
          updateAriaLive(slideshow);
        });
        slideshow.controls[1].addEventListener('click', function(event){
          event.preventDefault();
          slideshow.showNext(false);
          updateAriaLive(slideshow);
        });
      }
      // navigate slideshow when clicking on preview
      if(slideshow.options.prewNav) {
        slideshow.element.addEventListener('click', function(event){
          var item = event.target.closest('.js-slideshow-pm__item');
          if(item && !Util.hasClass(item, 'slideshow-pm__item--selected')) {
            slideshow.showItem(Util.getIndexInArray(slideshow.items, item));
          }
        });
      }
      // swipe events
      if(slideshow.options.swipe) {
        //init swipe
        new SwipeContent(slideshow.element);
        slideshow.element.addEventListener('swipeLeft', function(event){
          slideshow.showNext(false);
        });
        slideshow.element.addEventListener('swipeRight', function(event){
          slideshow.showPrev();
        });
      }
      // autoplay
      if(slideshow.options.autoplay) {
        slideshow.startAutoplay();
        // pause autoplay if user is interacting with the slideshow
        slideshow.element.addEventListener('mouseenter', function(event){
          slideshow.pauseAutoplay();
          slideshow.autoplayPaused = true;
        });
        slideshow.element.addEventListener('focusin', function(event){
          slideshow.pauseAutoplay();
          slideshow.autoplayPaused = true;
        });
        slideshow.element.addEventListener('mouseleave', function(event){
          slideshow.autoplayPaused = false;
          slideshow.startAutoplay();
        });
        slideshow.element.addEventListener('focusout', function(event){
          slideshow.autoplayPaused = false;
          slideshow.startAutoplay();
        });
      }
      // keyboard navigation
      initKeyboardEvents(slideshow);
      // reset on resize
      window.addEventListener('resize', function(event){
          slideshow.pauseAutoplay();
        clearTimeout(slideshow.resizeId);
        slideshow.resizeId = setTimeout(function(){
          resetSlideshowResize(slideshow);
          setTimeout(function(){slideshow.startAutoplay();}, 60);
        }, 250)
      });
    };
  
    function initKeyboardEvents(slideshow) {
      // tab on selected slide -> if last focusable -> move to prev or next arrow
      // tab + shift selected slide -> if first focusable -> move to container
      if(slideshow.controls.length > 0) {
        // tab+shift on prev arrow -> move focus to last focusable element inside the selected slide (or to the slider container)
        slideshow.controls[0].addEventListener('keydown', function(event){
          if( (event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab') && event.shiftKey ) moveFocusToLast(slideshow);
        });
        // tab+shift on next arrow -> if first slide selectes -> move focus to last focusable element inside the selected slide (or to the slider container)
        slideshow.controls[1].addEventListener('keydown', function(event){
          if( (event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab') && event.shiftKey && (slideshow.selectedSlide == 0)) moveFocusToLast(slideshow);
        });
      }
      // check tab is pressed when focus is inside selected slide
      slideshow.element.addEventListener('keydown', function(event){
        if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
          var target = event.target.closest('.js-slideshow-pm__item');
          if(target && Util.hasClass(target, 'slideshow-pm__item--selected')) moveFocusOutsideSlide(slideshow, event);
          else if(target || Util.hasClass(event.target, 'js-slideshow-pm') && !event.shiftKey) moveFocusToSelectedSlide(slideshow);
        } 
      });
  
      // detect tab moves to slideshow 
      window.addEventListener('keyup', function(event){
        if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab') {
          var target = event.target.closest('.js-slideshow-prew__item');
          if(target || Util.hasClass(event.target, 'js-slideshow-prew') && !event.shiftKey) moveFocusToSelectedSlide(slideshow);
        }
      });
    };
  
    function moveFocusToLast(slideshow) {
      event.preventDefault();
      if(slideshow.lastFocusable)	{
        slideshow.lastFocusable.focus();
      } else {
        Util.moveFocus(slideshow.element);
      }
    };
  
    function moveFocusToSelectedSlide(slideshow) { // focus is inside a slide that is not selected
      event.preventDefault();
      if(slideshow.firstFocusable)	{
        slideshow.firstFocusable.focus();
      } else if(slideshow.controls.length > 0) {
        (slideshow.selectedSlide == 0) ? slideshow.controls[1].getElementsByTagName('button')[0].focus() : slideshow.controls[0].getElementsByTagName('button')[0].focus();
      } else if(slideshow.options.navigation) {
        slideshow.navigation.getElementsByClassName('js-slideshow-pm__nav-item')[0].getElementsByTagName('button')[0].focus();
      }
    };
  
    function moveFocusOutsideSlide(slideshow, event) {
      if(event.shiftKey && slideshow.firstFocusable && event.target == slideshow.firstFocusable) {
        // shift+tab -> focus was on first foucusable element inside selected slide -> move to container
        event.preventDefault();
        Util.moveFocus(slideshow.element);
      } else if( !event.shiftKey && slideshow.lastFocusable && event.target == slideshow.lastFocusable) {
        event.preventDefault();
        
        if(slideshow.selectedSlide != 0) slideshow.controls[0].getElementsByTagName('button')[0].focus();
        else slideshow.controls[1].getElementsByTagName('button')[0].focus();
      }
    };
  
    function initAnimationEndEvents(slideshow) {
      slideshow.list.addEventListener('transitionend', function(){
        setTimeout(function(){ // add a delay between the end of animation and slideshow reset - improve animation performance
          resetAnimationEnd(slideshow);
        }, 100);
      });
    };
  
    function resetAnimationEnd(slideshow) {
      if(slideshow.moveFocus) Util.moveFocus(slideshow.items[slideshow.selectedSlide]);
      slideshow.items[slideshow.selectedSlide].removeAttribute('aria-hidden');
      slideshow.animating = false;
      slideshow.moveFocus = false;
      slideshow.startAutoplay();
    };
  
    function navigateSlide(slideshow, event, keyNav) { 
      // user has interacted with the slideshow navigation -> update visible slide
      var target = event.target.closest('.js-slideshow-pm__nav-item');
      if(keyNav && target && !Util.hasClass(target, 'slideshow-pm__nav-item--selected')) {
        slideshow.showItem(Util.getIndexInArray(slideshow.navigation, target));
        slideshow.moveFocus = true;
        updateAriaLive(slideshow);
      }
    };
  
    function showNewItem(slideshow, index, bool, autoplay) {
      if(slideshow.animating && slideshow.supportAnimation) return;
      if(autoplay) {
        if(index < 0) index = slideshow.items.length - 1;
        else if(index >= slideshow.items.length) index = 0;
      }
      if(index < 0 || index >= slideshow.items.length) return;
      slideshow.animating = true;
      Util.removeClass(slideshow.items[slideshow.selectedSlide], 'slideshow-pm__item--selected');
      slideshow.items[slideshow.selectedSlide].setAttribute('aria-hidden', 'true'); //hide to sr element that is exiting the viewport
      Util.addClass(slideshow.items[index], 'slideshow-pm__item--selected');
      resetSlideshowNav(slideshow, index, slideshow.selectedSlide);
      slideshow.selectedSlide = index;
      setTranslate(slideshow);
      slideshow.pauseAutoplay();
      setFocusableElements(slideshow);
      if(!transitionSupported) resetAnimationEnd(slideshow);
    };
  
    function updateAriaLive(slideshow) {
      slideshow.ariaLive.innerHTML = 'Item '+(slideshow.selectedSlide + 1)+' of '+slideshow.items.length;
    };
  
    function resetSlideshowResize(slideshow) {
      Util.removeClass(slideshow.list, 'slideshow-pm__list--has-transition');
      setTimeout(function(){
        setTranslateValue(slideshow);
        setTranslate(slideshow);
        Util.addClass(slideshow.list, 'slideshow-pm__list--has-transition');
      }, 30)
    };
  
    function setTranslateValue(slideshow) {
      var itemStyle = window.getComputedStyle(slideshow.items[slideshow.selectedSlide]);
  
      slideshow.itemWidth = parseFloat(itemStyle.getPropertyValue('width'));
      slideshow.itemMargin = parseFloat(itemStyle.getPropertyValue('margin-right'));
      slideshow.containerWidth = parseFloat(window.getComputedStyle(slideshow.element).getPropertyValue('width'));
    };
  
    function setTranslate(slideshow) {
      var translate = parseInt(((slideshow.itemWidth + slideshow.itemMargin) * slideshow.selectedSlide * (-1)) + ((slideshow.containerWidth - slideshow.itemWidth)*0.5));
      slideshow.list.style.transform = 'translateX('+translate+'px)';
      slideshow.list.style.msTransform = 'translateX('+translate+'px)';
    };
  
    function resetSlideshowNav(slideshow, newIndex, oldIndex) {
        if(slideshow.navigation) {
        Util.removeClass(slideshow.navigation[oldIndex], 'slideshow-pm__nav-item--selected');
        Util.addClass(slideshow.navigation[newIndex], 'slideshow-pm__nav-item--selected');
        slideshow.navCurrentLabel.parentElement.removeChild(slideshow.navCurrentLabel);
        slideshow.navigation[newIndex].getElementsByTagName('button')[0].appendChild(slideshow.navCurrentLabel);
      }
      if(slideshow.controls.length > 0) {
        Util.toggleClass(slideshow.controls[0], 'slideshow-pm__control--active', newIndex != 0);
        Util.toggleClass(slideshow.controls[1], 'slideshow-pm__control--active', newIndex != (slideshow.items.length - 1));
        }
    };
  
    function setFocusableElements(slideshow) {
        //get all focusable elements inside the selected slide
      var allFocusable = slideshow.items[slideshow.selectedSlide].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary');
      getFirstVisible(slideshow, allFocusable);
      getLastVisible(slideshow, allFocusable);
    };
  
    function getFirstVisible(slideshow, elements) {
        slideshow.firstFocusable = false;
      //get first visible focusable element inside the selected slide
      for(var i = 0; i < elements.length; i++) {
        if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
          slideshow.firstFocusable = elements[i];
          return true;
        }
      }
    };
  
    function getLastVisible(slideshow, elements) {
        //get last visible focusable element inside the selected slide
        slideshow.lastFocusable = false;
      for(var i = elements.length - 1; i >= 0; i--) {
        if( elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length ) {
          slideshow.lastFocusable = elements[i];
          return true;
        }
      }
    };
  
    function resetSlideshowFlexFallback(slideshow) {
      slideshow.list.style.width = ((slideshow.items.length+1)*(slideshow.itemMargin+slideshow.itemWidth))+'px';
      for(var i = 0; i < slideshow.items.length; i++) {slideshow.items[i].style.width = slideshow.itemWidth+'px';}
    };
  
    SlideshowPrew.defaults = {
      element : '',
      navigation : true,
      autoplay : false,
      autoplayInterval: 5000,
      prewNav: false,
      swipe: false
    };
  
    window.SlideshowPrew = SlideshowPrew;
    
    // initialize the slideshowsPrew objects
    var slideshowsPrew = document.getElementsByClassName('js-slideshow-pm'),
      flexSupported = Util.cssSupports('align-items', 'stretch'),
      transitionSupported = Util.cssSupports('transition');
    if( slideshowsPrew.length > 0 ) {
      for( var i = 0; i < slideshowsPrew.length; i++) {
        (function(i){
          var navigation = (slideshowsPrew[i].getAttribute('data-navigation') && slideshowsPrew[i].getAttribute('data-navigation') == 'off') ? false : true,
            autoplay = (slideshowsPrew[i].getAttribute('data-autoplay') && slideshowsPrew[i].getAttribute('data-autoplay') == 'on') ? true : false,
            autoplayInterval = (slideshowsPrew[i].getAttribute('data-autoplay-interval')) ? slideshowsPrew[i].getAttribute('data-autoplay-interval') : 5000,
            prewNav = (slideshowsPrew[i].getAttribute('data-pm-nav') && slideshowsPrew[i].getAttribute('data-pm-nav') == 'on' ) ? true : false, 
            swipe = (slideshowsPrew[i].getAttribute('data-swipe') && slideshowsPrew[i].getAttribute('data-swipe') == 'on') ? true : false;
          new SlideshowPrew({element: slideshowsPrew[i], navigation: navigation, autoplay : autoplay, autoplayInterval : autoplayInterval, swipe : swipe, prewNav: prewNav});
        })(i);
      }
    }
  
  }());
// File#: _3_drop-menu
// Usage: codyhouse.co/license
(function() {
  var DropMenu = function(element) {
    this.element = element;
    this.innerElement = this.element.getElementsByClassName('js-drop-menu__inner');
    this.trigger = document.querySelector('[aria-controls="'+this.element.getAttribute('id')+'"]');
    this.autocompleteInput = false;
    this.autocompleteList = false;
    this.animationDuration = parseFloat(getComputedStyle(this.element).getPropertyValue('--drop-menu-transition-duration')) || 0.3;
    // store some basic classes
    this.menuIsVisibleClass = 'drop-menu--is-visible';
    this.menuLevelClass = 'js-drop-menu__list';
    this.menuBtnInClass = 'js-drop-menu__btn--sublist-control';
    this.menuBtnOutClass = 'js-drop-menu__btn--back';
    this.levelInClass = 'drop-menu__list--in';
    this.levelOutClass = 'drop-menu__list--out';
    // store the max height of the element
    this.maxHeight = false;
    // store drop menu layout 
    this.layout = false;
    // vertical gap - desktop layout
    this.verticalGap = parseInt(getComputedStyle(this.element).getPropertyValue('--drop-menu-gap-y')) || 4;
    // store autocomplete search results
    this.searchResults = [];
    // focusable elements
    this.focusableElements = [];
    initDropMenu(this);
  };

  function initDropMenu(menu) {
    // trigger drop menu opening/closing
    toggleDropMenu(menu);
    // toggle sublevels
    menu.element.addEventListener('click', function(event){
      // check if we need to show a new sublevel
      var menuBtnIn = event.target.closest('.'+menu.menuBtnInClass);
      if(menuBtnIn) showSubLevel(menu, menuBtnIn);
      // check if we need to go back to a previous level
      var menuBtnOut = event.target.closest('.'+menu.menuBtnOutClass);
      if(menuBtnOut) hideSubLevel(menu, menuBtnOut);
    });
    // init automplete search
    initAutocomplete(menu);
    // close drop menu on focus out
    initFocusOut(menu);
  };

  function toggleDropMenu(menu) { // toggle drop menu
    if(!menu.trigger) return;
    // actions to be performed when closing the drop menu
    menu.dropMenuClosed = function(event) {
      if(event.propertyName != 'visibility') return;
      if(getComputedStyle(menu.element).getPropertyValue('visibility') != 'hidden') return;
      menu.element.removeEventListener('transitionend', menu.dropMenuClosed);
      menu.element.removeAttribute('style');
      resetAllLevels(menu); // go back to main list
      resetAutocomplete(menu); // if autocomplte is enabled -> reset input fields
    };

    // on mobile - close drop menu when clicking on close btn
    menu.element.addEventListener('click', function(event){
      var target = event.target.closest('.js-drop-menu__close-btn');
      if(!target || !dropMenuVisible(menu)) return;
      menu.trigger.click();
    });

    // click on trigger
    menu.trigger.addEventListener('click', function(event){
      menu.element.removeEventListener('transitionend', menu.dropMenuClosed);
      var isVisible = dropMenuVisible(menu);
      Util.toggleClass(menu.element, menu.menuIsVisibleClass, !isVisible);
      isVisible ? menu.trigger.removeAttribute('aria-expanded') : menu.trigger.setAttribute('aria-expanded', true);
      if(isVisible) {
        menu.element.addEventListener('transitionend', menu.dropMenuClosed);
      } else {
        menu.element.addEventListener('transitionend', function cb(){
          menu.element.removeEventListener('transitionend', cb);
          focusFirstElement(menu, menu.element);
        });
        getLayoutValue(menu);
        setDropMenuMaxHeight(menu); // set max-height
        placeDropMenu(menu); // desktop only
      }
    });
  };

  function dropMenuVisible(menu) {
    return Util.hasClass(menu.element, menu.menuIsVisibleClass);
  };

  function showSubLevel(menu, menuBtn) {
    var mainLevel = menuBtn.closest('.'+menu.menuLevelClass),
      subLevel = Util.getChildrenByClassName(menuBtn.parentNode, menu.menuLevelClass);
    if(!mainLevel || subLevel.length == 0 ) return;
    // trigger classes
    Util.addClass(subLevel[0], menu.levelInClass);
    Util.addClass(mainLevel, menu.levelOutClass);
    Util.removeClass(mainLevel, menu.levelInClass);
    // animate height of main element
    animateDropMenu(menu, mainLevel.offsetHeight, subLevel[0].offsetHeight, function(){
      focusFirstElement(menu, subLevel[0]);
    });
  };

  function hideSubLevel(menu, menuBtn) {
    var subLevel = menuBtn.closest('.'+menu.menuLevelClass),
      mainLevel = subLevel.parentNode.closest('.'+menu.menuLevelClass);
    if(!mainLevel || !subLevel) return;
    // trigger classes
    Util.removeClass(subLevel, menu.levelInClass);
    Util.addClass(mainLevel, menu.levelInClass);
    Util.removeClass(mainLevel, menu.levelOutClass);
    // animate height of main element
    animateDropMenu(menu, subLevel.offsetHeight, mainLevel.offsetHeight, function(){
      var menuBtnIn = Util.getChildrenByClassName(subLevel.parentNode, menu.menuBtnInClass);
      if(menuBtnIn.length > 0) menuBtnIn[0].focus();
      // if primary level -> reset height of element + inner element
      if(Util.hasClass(mainLevel, 'js-drop-menu__list--main') && menu.layout == 'desktop') {
        menu.element.style.height = '';
        if(menu.innerElement.length > 0) menu.innerElement[0].style.height = '';
      }
    });
  };

  function animateDropMenu(menu, initHeight, finalHeight, cb) {
    if(menu.innerElement.length < 1 || menu.layout == 'mobile') {
      if(cb) setTimeout(function(){cb();}, menu.animationDuration*1000);
      return;
    }
    var resetHeight = false;
    // make sure init and final height are smaller than max height
    if(initHeight > menu.maxHeight) initHeight = menu.maxHeight;
    if(finalHeight > menu.maxHeight) {
      resetHeight = finalHeight;
      finalHeight = menu.maxHeight;
    }
    var change = finalHeight - initHeight,
      currentTime = null,
      duration = menu.animationDuration*1000;

    var animateHeight = function(timestamp){  
      if (!currentTime) currentTime = timestamp;         
      var progress = timestamp - currentTime;
      if(progress > duration) progress = duration;
      var val = Math.easeOutQuart(progress, initHeight, change, duration);
      menu.element.style.height = val+"px";
      if(progress < duration) {
        window.requestAnimationFrame(animateHeight);
      } else {
        menu.innerElement[0].style.height = resetHeight ? resetHeight+'px' : '';
        if(cb) cb();
      }
    };
    
    //set the height of the element before starting animation -> fix bug on Safari
    menu.element.style.height = initHeight+"px";
    window.requestAnimationFrame(animateHeight);
  };

  function resetAllLevels(menu) {
    var openLevels = menu.element.getElementsByClassName(menu.levelInClass),
      closeLevels = menu.element.getElementsByClassName(menu.levelOutClass);
    while(openLevels[0]) {
      Util.removeClass(openLevels[0], menu.levelInClass);
    }
    while(closeLevels[0]) {
      Util.removeClass(closeLevels[0], menu.levelOutClass);
    }
  };

  function focusFirstElement(menu, level) {
    var element = getFirstFocusable(level);
    element.focus();
  };

  function getFirstFocusable(element) {
    var elements = element.querySelectorAll(focusableElString);
    for(var i = 0; i < elements.length; i++) {
			if(elements[i].offsetWidth || elements[i].offsetHeight || elements[i].getClientRects().length) {
				return elements[i];
			}
		}
  };

  function getFocusableElements(menu) { // all visible focusable elements
    var elements = menu.element.querySelectorAll(focusableElString);
    menu.focusableElements = [];
    for(var i = 0; i < elements.length; i++) {
			if( isVisible(menu, elements[i]) ) menu.focusableElements.push(elements[i]);
		}
  };

  function isVisible(menu, element) {
    var elementVisible = false;
    if( (element.offsetWidth || element.offsetHeight || element.getClientRects().length) && getComputedStyle(element).getPropertyValue('visibility') == 'visible') {
      elementVisible = true;
      if(menu.element.contains(element) && element.parentNode) elementVisible = isVisible(menu, element.parentNode);
    }
    return elementVisible;
  };

  function initAutocomplete(menu) {
    if(!Util.hasClass(menu.element, 'js-autocomplete')) return;
    // get list of search results
    getSearchResults(menu);
    var autocompleteCharacters = 1;
    menu.autocompleteInput = menu.element.getElementsByClassName('js-autocomplete__input');
    menu.autocompleteList = menu.element.getElementsByClassName('js-autocomplete__results');
    new Autocomplete({
      element: menu.element,
      characters: autocompleteCharacters,
      searchData: function(query, cb) {
        var data = [];
        if(query.length >= autocompleteCharacters) {
          data = menu.searchResults.filter(function(item){
            return item['label'].toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }
        cb(data);
      }
    });
  };

  function resetAutocomplete(menu) {
    if(menu.autocompleteInput && menu.autocompleteInput.length > 0) {
      menu.autocompleteInput[0].value = '';
    }
  };

  function getSearchResults(menu) {
    var anchors = menu.element.getElementsByClassName('drop-menu__link');
    for(var i = 0; i < anchors.length; i++) {
      menu.searchResults.push({label: anchors[i].textContent, url: anchors[i].getAttribute('href')});
    }
  };

  function setDropMenuMaxHeight(menu) {
    if(!menu.trigger) return;
    if(menu.layout == 'mobile') {
      menu.maxHeight = '100%';
      menu.element.style.maxHeight = menu.maxHeight;
      if(menu.autocompleteList.length > 0) menu.autocompleteList[0].style.maxHeight = 'calc(100% - '+menu.autocompleteInput[0].offsetHeight+'px)';
    } else {
      menu.maxHeight = window.innerHeight - menu.trigger.getBoundingClientRect().bottom - menu.verticalGap - 15;
      menu.element.style.maxHeight = menu.maxHeight + 'px';
      if(menu.autocompleteList.length > 0) menu.autocompleteList[0].style.maxHeight = (menu.maxHeight - menu.autocompleteInput[0].offsetHeight) + 'px';
    }
  };

  function getLayoutValue(menu) {
    menu.layout = getComputedStyle(menu.element, ':before').getPropertyValue('content').replace(/\'|"/g, '');
  };

  function placeDropMenu(menu) {
    if(menu.layout == 'mobile') {
      menu.element.style.top = menu.element.style.left = menu.element.style.right = '';
    } else {
      var selectedTriggerPosition = menu.trigger.getBoundingClientRect();
			
      var left = selectedTriggerPosition.left,
        right = (window.innerWidth - selectedTriggerPosition.right),
        isRight = (window.innerWidth < selectedTriggerPosition.left + menu.element.offsetWidth);

      var rightVal = 'auto', leftVal = 'auto';
      if(isRight) {
        rightVal = right+'px';
      } else {
        leftVal = left+'px';
      }

      var topVal = (selectedTriggerPosition.bottom+menu.verticalGap)+'px';
      if( isRight && (right + menu.element.offsetWidth) > window.innerWidth) {
        rightVal = 'auto';
        leftVal = parseInt((window.innerWidth - menu.element.offsetWidth)/2)+'px';
      }
      menu.element.style.top = topVal;
      menu.element.style.left = leftVal;
      menu.element.style.right = rightVal;
    }
  };

  function closeOnResize(menu) {
    getLayoutValue(menu);
    if(menu.layout == 'mobile' || !dropMenuVisible(menu)) return;
    menu.trigger.click();
  };

  function closeOnClick(menu, target) {
    if(menu.layout == 'mobile' || !dropMenuVisible(menu)) return;
    if(menu.element.contains(target) || menu.trigger.contains(target)) return;
    menu.trigger.click();
  };

  function initFocusOut(menu) {
    menu.element.addEventListener('keydown', function(event){
      if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
        getFocusableElements(menu);
        if( (menu.focusableElements[0] == document.activeElement && event.shiftKey) || (menu.focusableElements[menu.focusableElements.length - 1] == document.activeElement && !event.shiftKey)) {
          menu.trigger.click();
        }
      } else if(event.keyCode && event.keyCode == 27 || event.key && event.key.toLowerCase() == 'escape' && dropMenuVisible(menu)) {
        menu.trigger.click();
			}
    });
  };

  // init DropMenu objects
  var dropMenus = document.getElementsByClassName('js-drop-menu');
  var focusableElString = '[href], input:not([disabled]), select:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"]), [contenteditable], summary';
  if( dropMenus.length > 0 ) {
    var dropMenusArray = [];
    for( var i = 0; i < dropMenus.length; i++) {(function(i){
      dropMenusArray.push(new DropMenu(dropMenus[i]));
    })(i);}

    // on resize -> close all drop menu elements
		window.addEventListener('resize', function(event){
			dropMenusArray.forEach(function(element){
				closeOnResize(element);
			});
    });
    
    // close drop menu when clicking outside it
		window.addEventListener('click', function(event){
      dropMenusArray.forEach(function(element){
				closeOnClick(element, event.target);
			});
		});
  }
}());
// File#: _3_main-header-v2
// Usage: codyhouse.co/license
(function() {
	var Submenu = function(element) {
		this.element = element;
		this.trigger = this.element.getElementsByClassName('header-v2__nav-link')[0];
		this.dropdown = this.element.getElementsByClassName('header-v2__nav-dropdown')[0];
		this.triggerFocus = false;
		this.dropdownFocus = false;
		this.hideInterval = false;
		this.prevFocus = false; // nested dropdown - store element that was in focus before focus changed
		initSubmenu(this);
		initNestedDropdown(this);
	};

	function initSubmenu(list) {
		initElementEvents(list, list.trigger);
		initElementEvents(list, list.dropdown);
	};

	function initElementEvents(list, element, bool) {
		element.addEventListener('focus', function(){
			bool = true;
			showDropdown(list);
		});
		element.addEventListener('focusout', function(event){
			bool = false;
			hideDropdown(list, event);
		});
	};

	function showDropdown(list) {
		if(list.hideInterval) clearInterval(list.hideInterval);
		Util.addClass(list.dropdown, 'header-v2__nav-list--is-visible');
		resetDropdownStyle(list.dropdown, true);
	};

	function hideDropdown(list, event) {
		if(list.hideInterval) clearInterval(this.hideInterval);
		list.hideInterval = setTimeout(function(){
			var submenuFocus = document.activeElement.closest('.header-v2__nav-item--main'),
				inFocus = submenuFocus && (submenuFocus == list.element);
			if(!list.triggerFocus && !list.dropdownFocus && !inFocus) { // hide if focus is outside submenu
				Util.removeClass(list.dropdown, 'header-v2__nav-list--is-visible');
				resetDropdownStyle(list.dropdown, false);
				hideSubLevels(list);
				list.prevFocus = false;
			}
		}, 100);
	};

	function initNestedDropdown(list) {
		var dropdownMenu = list.element.getElementsByClassName('header-v2__nav-list');
		for(var i = 0; i < dropdownMenu.length; i++) {
			var listItems = dropdownMenu[i].children;
			// bind hover
	    new menuAim({
	      menu: dropdownMenu[i],
	      activate: function(row) {
	      	var subList = row.getElementsByClassName('header-v2__nav-dropdown')[0];
	      	if(!subList) return;
	      	Util.addClass(row.querySelector('a.header-v2__nav-link'), 'header-v2__nav-link--hover');
	      	showLevel(list, subList);
	      },
	      deactivate: function(row) {
	      	var subList = row.getElementsByClassName('header-v2__nav-dropdown')[0];
	      	if(!subList) return;
	      	Util.removeClass(row.querySelector('a.header-v2__nav-link'), 'header-v2__nav-link--hover');
	      	hideLevel(list, subList);
	      },
	      exitMenu: function() {
	        return true;
	      },
	      submenuSelector: '.header-v2__nav-item--has-children',
	    });
		}
		// store focus element before change in focus
		list.element.addEventListener('keydown', function(event) { 
			if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
				list.prevFocus = document.activeElement;
			}
		});
		// make sure that sublevel are visible when their items are in focus
		list.element.addEventListener('keyup', function(event) {
			if( event.keyCode && event.keyCode == 9 || event.key && event.key == 'Tab' ) {
				// focus has been moved -> make sure the proper classes are added to subnavigation
				var focusElement = document.activeElement,
					focusElementParent = focusElement.closest('.header-v2__nav-dropdown'),
					focusElementSibling = focusElement.nextElementSibling;

				// if item in focus is inside submenu -> make sure it is visible
				if(focusElementParent && !Util.hasClass(focusElementParent, 'header-v2__nav-list--is-visible')) {
					showLevel(list, focusElementParent);
				}
				// if item in focus triggers a submenu -> make sure it is visible
				if(focusElementSibling && !Util.hasClass(focusElementSibling, 'header-v2__nav-list--is-visible')) {
					showLevel(list, focusElementSibling);
				}

				// check previous element in focus -> hide sublevel if required 
				if( !list.prevFocus) return;
				var prevFocusElementParent = list.prevFocus.closest('.header-v2__nav-dropdown'),
					prevFocusElementSibling = list.prevFocus.nextElementSibling;
				
				if( !prevFocusElementParent ) return;
				
				// element in focus and element prev in focus are siblings
				if( focusElementParent && focusElementParent == prevFocusElementParent) {
					if(prevFocusElementSibling) hideLevel(list, prevFocusElementSibling);
					return;
				}

				// element in focus is inside submenu triggered by element prev in focus
				if( prevFocusElementSibling && focusElementParent && focusElementParent == prevFocusElementSibling) return;
				
				// shift tab -> element in focus triggers the submenu of the element prev in focus
				if( focusElementSibling && prevFocusElementParent && focusElementSibling == prevFocusElementParent) return;
				
				var focusElementParentParent = focusElementParent.parentNode.closest('.header-v2__nav-dropdown');
				
				// shift tab -> element in focus is inside the dropdown triggered by a siblings of the element prev in focus
				if(focusElementParentParent && focusElementParentParent == prevFocusElementParent) {
					if(prevFocusElementSibling) hideLevel(list, prevFocusElementSibling);
					return;
				}
				
				if(prevFocusElementParent && Util.hasClass(prevFocusElementParent, 'header-v2__nav-list--is-visible')) {
					hideLevel(list, prevFocusElementParent);
				}
			}
		});
	};

	function hideSubLevels(list) {
		var visibleSubLevels = list.dropdown.getElementsByClassName('header-v2__nav-list--is-visible');
		if(visibleSubLevels.length == 0) return;
		while (visibleSubLevels[0]) {
			hideLevel(list, visibleSubLevels[0]);
	 	}
	 	var hoveredItems = list.dropdown.getElementsByClassName('header-v2__nav-link--hover');
	 	while (hoveredItems[0]) {
			Util.removeClass(hoveredItems[0], 'header-v2__nav-link--hover');
	 	}
	};

	function showLevel(list, level, bool) {
		if(bool == undefined) {
			//check if the sublevel needs to be open to the left
			Util.removeClass(level, 'header-v2__nav-dropdown--nested-left');
			var boundingRect = level.getBoundingClientRect();
			if(window.innerWidth - boundingRect.right < 5 && boundingRect.left + window.scrollX > 2*boundingRect.width) Util.addClass(level, 'header-v2__nav-dropdown--nested-left');
		}
		Util.addClass(level, 'header-v2__nav-list--is-visible');
	};

	function hideLevel(list, level) {
		if(!Util.hasClass(level, 'header-v2__nav-list--is-visible')) return;
		Util.removeClass(level, 'header-v2__nav-list--is-visible');
		
		level.addEventListener('transition', function cb(){
			level.removeEventListener('transition', cb);
			Util.removeClass(level, 'header-v2__nav-dropdown--nested-left');
		});
	};

	var mainHeader = document.getElementsByClassName('js-header-v2');
	if(mainHeader.length > 0) {
		var menuTrigger = mainHeader[0].getElementsByClassName('js-anim-menu-btn')[0],
			firstFocusableElement = getMenuFirstFocusable();

		// we'll use these to store the node that needs to receive focus when the mobile menu is closed 
		var focusMenu = false;

		menuTrigger.addEventListener('anim-menu-btn-clicked', function(event){ // toggle menu visibility an small devices
			Util.toggleClass(document.getElementsByClassName('header-v2__nav')[0], 'header-v2__nav--is-visible', event.detail);
			Util.toggleClass(mainHeader[0], 'header-v2--expanded', event.detail);
			menuTrigger.setAttribute('aria-expanded', event.detail);
			if(event.detail) firstFocusableElement.focus(); // move focus to first focusable element
			else if(focusMenu) {
				focusMenu.focus();
				focusMenu = false;
			}
		});

		// take care of submenu
		var mainList = mainHeader[0].getElementsByClassName('header-v2__nav-list--main');
		if(mainList.length > 0) {
			for( var i = 0; i < mainList.length; i++) {
				(function(i){
					new menuAim({ // use diagonal movement detection for main submenu
			      menu: mainList[i],
			      activate: function(row) {
			      	var submenu = row.getElementsByClassName('header-v2__nav-dropdown');
			      	if(submenu.length == 0 ) return;
			      	Util.addClass(submenu[0], 'header-v2__nav-list--is-visible');
			      	resetDropdownStyle(submenu[0], true);
			      },
			      deactivate: function(row) {
			      	var submenu = row.getElementsByClassName('header-v2__nav-dropdown');
			      	if(submenu.length == 0 ) return;
			      	Util.removeClass(submenu[0], 'header-v2__nav-list--is-visible');
			      	resetDropdownStyle(submenu[0], false);
			      },
			      exitMenu: function() {
			        return true;
			      },
			      submenuSelector: '.header-v2__nav-item--has-children',
			      submenuDirection: 'below'
			    });

			    // take care of focus event for main submenu
					var subMenu = mainList[i].getElementsByClassName('header-v2__nav-item--main');
					for(var j = 0; j < subMenu.length; j++) {(function(j){if(Util.hasClass(subMenu[j], 'header-v2__nav-item--has-children')) new Submenu(subMenu[j]);})(j);};
				})(i);
			}
		}

		// if data-animation-offset is set -> check scrolling
		var animateHeader = mainHeader[0].getAttribute('data-animation');
		if(animateHeader && animateHeader == 'on') {
			var scrolling = false,
				scrollOffset = (mainHeader[0].getAttribute('data-animation-offset')) ? parseInt(mainHeader[0].getAttribute('data-animation-offset')) : 400,
				mainHeaderHeight = mainHeader[0].offsetHeight,
				mainHeaderWrapper = mainHeader[0].getElementsByClassName('header-v2__wrapper')[0];

			window.addEventListener("scroll", function(event) {
				if( !scrolling ) {
					scrolling = true;
					(!window.requestAnimationFrame) ? setTimeout(function(){checkMainHeader();}, 250) : window.requestAnimationFrame(checkMainHeader);
				}
			});

			function checkMainHeader() {
				var windowTop = window.scrollY || document.documentElement.scrollTop;
				Util.toggleClass(mainHeaderWrapper, 'header-v2__wrapper--is-fixed', windowTop >= mainHeaderHeight);
				Util.toggleClass(mainHeaderWrapper, 'header-v2__wrapper--slides-down', windowTop >= scrollOffset);
				scrolling = false;
			};
		}

		// listen for key events
		window.addEventListener('keyup', function(event){
			// listen for esc key
			if( (event.keyCode && event.keyCode == 27) || (event.key && event.key.toLowerCase() == 'escape' )) {
				// close navigation on mobile if open
				if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger)) {
					focusMenu = menuTrigger; // move focus to menu trigger when menu is close
					menuTrigger.click();
				}
			}
			// listen for tab key
			if( (event.keyCode && event.keyCode == 9) || (event.key && event.key.toLowerCase() == 'tab' )) {
				// close navigation on mobile if open when nav loses focus
				if(menuTrigger.getAttribute('aria-expanded') == 'true' && isVisible(menuTrigger) && !document.activeElement.closest('.js-header-v2')) menuTrigger.click();
			}
		});

		// listen for resize
		var resizingId = false;
		window.addEventListener('resize', function() {
			clearTimeout(resizingId);
			resizingId = setTimeout(doneResizing, 500);
		});

		function doneResizing() {
			if( !isVisible(menuTrigger) && Util.hasClass(mainHeader[0], 'header-v2--expanded')) menuTrigger.click();
		};

		function getMenuFirstFocusable() {
			var focusableEle = mainHeader[0].getElementsByClassName('header-v2__nav')[0].querySelectorAll('[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex]:not([tabindex="-1"]), [contenteditable], audio[controls], video[controls], summary'),
				firstFocusable = false;
			for(var i = 0; i < focusableEle.length; i++) {
				if( focusableEle[i].offsetWidth || focusableEle[i].offsetHeight || focusableEle[i].getClientRects().length ) {
					firstFocusable = focusableEle[i];
					break;
				}
			}

			return firstFocusable;
		};
	}

	function resetDropdownStyle(dropdown, bool) {
		if(!bool) {
			dropdown.addEventListener('transitionend', function cb(){
				dropdown.removeAttribute('style');
				dropdown.removeEventListener('transitionend', cb);
			});
		} else {
			var boundingRect = dropdown.getBoundingClientRect();
			if(window.innerWidth - boundingRect.right < 5 && boundingRect.left + window.scrollX > 2*boundingRect.width) {
				var left = parseFloat(window.getComputedStyle(dropdown).getPropertyValue('left'));
				dropdown.style.left = (left + window.innerWidth - boundingRect.right - 5) + 'px';
			}
		}
	};

	function isVisible(element) {
		return (element.offsetWidth || element.offsetHeight || element.getClientRects().length);
	};
}());
// File#: _3_select-autocomplete
// Usage: codyhouse.co/license
(function() {
  var SelectAuto = function(element) {
    this.element = element;
    this.input = this.element.getElementsByClassName('js-autocomplete__input');
    this.resetBtn = this.element.getElementsByClassName('js-select-auto__input-btn');
    this.select = this.element.getElementsByClassName('js-select-auto__select');
    this.selectedValue = false; // value of the <option> the user selected
    this.selectOptions = []; // autocomplete list extracted from the <select> element
    this.focusOutId = false; // keep track of focus status
    this.autocompleteResults = this.element.getElementsByClassName('js-autocomplete__results');
    initSelectAuto(this);
  };

  function initSelectAuto(element) {
    if(element.select.length == 0) return;
    initDataResults(element); // populate autocomplete list
    Util.addClass(element.select[0], 'is-hidden'); // hide native <select> element
    initAutocomplete(element);
    initSelectAutoEvents(element);
  };

  function initDataResults(element) {
    // create the list of possible results based on the <select> input
    var optgroups = element.select[0].getElementsByTagName('optgroup');
    if(optgroups.length > 0) {
      for(var i = 0; i < optgroups.length; i++) {
        pushOptgroup(element, optgroups[i]);
      }
    } else {
      // no <optgroup>s -> loop through <options>
      pushOptions(element, element.select[0].getElementsByTagName('option'));
    }
  };

  function pushOptgroup(element, optgroup) {
    // push <optgroup> item
    var item = {};
    item.label = optgroup.getAttribute('label');
    item.template = 'optgroup';
    item = setCustomData(item, optgroup);
    element.selectOptions.push(item);
    // now push <option>s
    pushOptions(element, optgroup.getElementsByTagName('option'));
  };

  function pushOptions(element, options) {
    for(var i = 0; i < options.length; i++) {
      pushSingleOption(element, options[i]);
    };
  };

  function pushSingleOption(element, option) {
    // do not push <option>s without a value
    if(!option.getAttribute('value')) return;
    var item = {};
    item.label = option.text;
    item.template = 'option';
    item.value = option.value;
    item = setCustomData(item, option);
    element.selectOptions.push(item);
  };

  function setCustomData(obj, element) {
    // get custom data-attributes added to <option>s/<optgroup>s and add them to the autocomplete list
    var dataset = element.dataset;
    for (var prop in dataset) {
      if (Object.prototype.hasOwnProperty.call(dataset, prop)) {
        obj[prop] = dataset[prop];
      }
    }
    return obj;
  };
  
  function initAutocomplete(element) {
    // CodyHouse Autocomplete component
    // more info: https://codyhouse.co/ds/components/info/autocomplete
    new Autocomplete({
      element: element.element,
      characters: 0,
      searchData: function(value, cb, eventType) {
        selectAutoSearch(element, value, cb, eventType);
      },
      onClick: function(option, obj, event, cb) {
        selectAutoClick(element, option, obj, event, cb);
      }
    });
  };

  function selectAutoSearch(element, query, cb, eventType) {
    // get search results
    // more info: https://codyhouse.co/ds/components/info/autocomplete#search-data

    if(eventType == 'focus') { 
      // show all results when input is first in focus
      var data = JSON.parse(JSON.stringify(element.selectOptions));
    } else {
      // filter results
      var data = element.selectOptions.filter(function(item){
        // return item if item['label'] contains 'query' or if it is an <optgroup>
        return (query == '' || item['template'] == 'optgroup') ? true : item['label'].toLowerCase().indexOf(query.toLowerCase()) > -1;
      });
  
      // remove empty <optgroup>s
      var i = data.length;
      while (i--) {
        if (data[i].template == 'optgroup' && ( i == data.length - 1 || data[i+1].template == 'optgroup') ) { 
          data.splice(i, 1);
        } 
      }
    }

    // add a custom class to the selected <option> in the autocomplete list
    for(var i = 0; i < data.length; i++) {
      if(element.selectedValue && data[i].value && data[i].value == element.selectedValue && data[i].template != 'optgroup') {
        data[i].class = 'select-auto__option--selected';
      } else if(data[i].class) {
        delete data[i].class;
      }
    }

    if(data.length == 0) { // fallback for no results found
      data = [{
        label: 'No results',
        template: 'no-results'
      }];
    }

    // required by the Autocomplete component
    cb(data);
  };

  function selectAutoClick(element, option, obj, event, cb) {
    // an option in the autocomplete list has been selected
    if(option.getAttribute('data-autocomplete-template') != 'option') return;
    // get selected value + selected label
    var value = option.querySelector('[data-autocomplete-value]').innerText;
    var label = option.querySelector('[data-autocomplete-label]').innerText;
    resetSelectAuto(element, value, label);
    cb(); // this closes the autocomplete
  };

  function initSelectAutoEvents(element) {
    // on focus out -> reset input to initial value or to '' if the option was not selected
    element.input[0].addEventListener('focusout', function(event) {
      if(element.focusOutId) clearTimeout(element.focusOutId);
      element.focusOutId = setTimeout(function(){
        if(!element.element.contains(document.activeElement) || element.resetBtn[0].contains(document.activeElement)) {
          checkSelectAuto(element);
        }
      }, 100);
    });

    // when clicking on x -> reset selection to false
    if(element.resetBtn.length > 0) {
      element.resetBtn[0].addEventListener('click', function(event) {
        event.preventDefault();
        resetSelectAuto(element, false, '');
        element.input[0].focus();
      });
    }
  };

  function checkSelectAuto(element) {
    // check if we need to reset the value of the autocomplete input -> used when input loses focus
    var selectedLabel = !element.selectedValue ? '' : element.select[0].options[element.select[0].selectedIndex].text;
    if(element.input[0].value == selectedLabel) return;
    
    // user typed one of the possible options
    var optionInList = optionSelectedInList(element);
    if(optionInList[0]) {
      // update <select> element and return
      resetSelectAuto(element, optionInList[2], optionInList[1]);
      return;
    }

    (element.input[0].value == '') 
      ? resetSelectAuto(element, false, '')
      : resetSelectAuto(element, element.selectedValue, selectedLabel);
  };

  function optionSelectedInList(element) {
    var inList = false,
      label = '',
      value = false;
    for(var i = 0; i < element.selectOptions.length; i++) {
      if(element.selectOptions[i].template == 'option' && element.selectOptions[i].label.toLowerCase() == element.input[0].value.toLowerCase()) {
        inList = true;
        label = element.selectOptions[i].label;
        value = element.selectOptions[i].value;
        break;
      }
    }
    return [inList, label, value];
  };

  function resetSelectAuto(element, value, label) {
    // a new <option> has been selected
    element.input[0].value = label;
    element.selectedValue = value;
    Util.toggleClass(element.element, 'select-auto--selection-done', value);
    if(value === false) { // no value set
      element.select[0].selectedIndex = -1;
    } else { 
      element.select[0].value = value;
    }
    element.select[0].dispatchEvent(new Event('change'));
  };

  // init the SelectAuto object
  var selectAuto = document.getElementsByClassName('js-select-auto');
  if( selectAuto.length > 0 ) {
    for( var i = 0; i < selectAuto.length; i++) {
      (function(i){new SelectAuto(selectAuto[i]);})(i);
    }
  }
}());