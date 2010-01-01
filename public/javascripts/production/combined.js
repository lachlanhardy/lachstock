/*!
 * jQuery JavaScript Library v1.4a1
 * http://jquery.com/
 *
 * Copyright (c) 2009 John Resig
 * Dual licensed under the MIT and GPL licenses.
 * http://docs.jquery.com/License
 *
 * Date: Fri Dec 4 12:51:47 2009 -0500
 */
(function(window, undefined){

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return arguments.length === 0 ?
			rootjQuery :
			new jQuery.fn.init( selector, context );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// (both of which we optimize for)
	quickExpr = /^[^<]*(<[\w\W]+>)[^>]*$|^#([\w-]+)$/,

	// Is it a simple selector
	isSimple = /^.[^:#\[\.,]*$/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	rtrim = /(\s|\u00A0)+|(\s|\u00A0)+$/g,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent.toLowerCase(),

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwnProperty = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	indexOf = Array.prototype.indexOf;

jQuery.fn = jQuery.prototype = {
	init: function( selector, context ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			match = quickExpr.exec( selector );

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					doc = (context ? context.ownerDocument || context : document);

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						selector = [ doc.createElement( ret[1] ) ];

					} else {
						ret = buildFragment( [ match[1] ], [ doc ] );
						selector = (ret.cacheable ? ret.fragment.cloneNode(true) : ret.fragment).childNodes;
					}

				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					if ( elem ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $("TAG")
			} else if ( !context && /^\w+$/.test( selector ) ) {
				this.selector = selector;
				this.context = document;
				selector = document.getElementsByTagName( selector );

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return (context || rootjQuery).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return jQuery( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if (selector.selector !== undefined) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.isArray( selector ) ?
			this.setArray( selector ) :
			jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.4a1",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function(){
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this.slice(num)[ 0 ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = jQuery( elems || null );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Force the current matched set of elements to become
	// the specified array of elements (destroying the stack in the process)
	// You should use pushStack() in order to do this, but maintain the stack
	setArray: function( elems ) {
		// Resetting the length to 0, then using the native Array push
		// is a super-fast way to populate an object with array-like properties
		this.length = 0;
		push.apply( this, elems );

		return this;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {
		if ( !elem || typeof elem === "string" ) {
			return jQuery.inArray( this[0],
				// If it receives a string, the selector is used
				// If it receives nothing, the siblings are used
				elem ? jQuery( elem ) : this.parent().children() );
		}
		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	is: function( selector ) {
		return !!selector && jQuery.filter( selector, this ).length > 0;
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	// copy reference to target object
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging object literal values
				if ( deep && copy && jQuery.isObjectLiteral(copy) ) {
					// Don't extend not object literals
					var clone = src && jQuery.isObjectLiteral(src) ? src : {};

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		window.$ = _$;

		if ( deep ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return toString.call(obj) === "[object Function]";
	},

	isArray: function( obj ) {
		return toString.call(obj) === "[object Array]";
	},

	isObjectLiteral: function( obj ) {
		if ( toString.call(obj) !== "[object Object]" || typeof obj.nodeType === "number" ) {
			return false;
		}
		
		// not own constructor property must be Object
		if ( obj.constructor
		  && !hasOwnProperty.call(obj, "constructor")
		  && !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}
		
		//own properties are iterated firstly,
		//so to speed up, we can test last one if it is own or not
	
		var key;
		for ( key in obj ) {}
		
		return key === undefined || hasOwnProperty.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},

	// check if an element is in a (or is an) XML document
	isXMLDoc: function( elem ) {
		// documentElement is verified for cases where it doesn't yet exist
		// (such as loading iframes in IE - #4833)
		var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;
		return documentElement ? documentElement.nodeName !== "HTML" : false;
	},

	// Evalulates a script in a global context
	globalEval: function( data ) {
		if ( data && rnotwhite.test(data) ) {
			// Inspired by code by Andrea Giammarchi
			// http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
			var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");

			script.type = "text/javascript";

			if ( jQuery.support.scriptEval ) {
				script.appendChild( document.createTextNode( data ) );
			} else {
				script.text = data;
			}

			// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
			// This arises when a base node is used (#2709).
			head.insertBefore( script, head.firstChild );
			head.removeChild( script );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction(object);

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
			}
		}

		return object;
	},

	trim: function( text ) {
		return (text || "").replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			if ( array.length == null || typeof array === "string" || jQuery.isFunction(array) || array.setInterval ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array ) {
		if ( array.indexOf ) {
			return array.indexOf( elem );
		}

		for ( var i = 0, length = array.length; i < length; i++ ) {
			if ( array[ i ] === elem ) {
				return i;
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var pos, i = second.length;

		// We have to get length this way when IE & Opera overwrite the length
		// expando of getElementsByTagName
		if ( i && i.nodeType ) {
			for ( i = 0; second[i]; ++i ) {}
		}
		
		pos = i + first.length;
		
		// Correct length for non Arrays
		first.length = pos;
		
		while ( i ) {
			first[ --pos ] = second[ --i ];
		}

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [];

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			if ( !inv !== !callback( elems[ i ], i ) ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var ret = [], value;

		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			value = callback( elems[ i ], i, arg );

			if ( value != null ) {
				ret[ ret.length ] = value;
			}
		}

		return ret.concat.apply( [], ret );
	},

	// Use of jQuery.browser is deprecated.
	// It's included for backwards compatibility and plugins,
	// although they should work to migrate away.
	browser: {
		version: (/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/.exec(userAgent) || [0,'0'])[1],
		safari: /webkit/.test( userAgent ),
		opera: /opera/.test( userAgent ),
		msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
		mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
	}
});

if ( indexOf ) {
	jQuery.inArray = function( elem, array ) {
		return indexOf.call( array, elem );
	};
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}

// Mutifunctional method to get and set values to a collection
// The value/s can be optionally by executed if its a function
function access( elems, key, value, exec, fn ) {
	var l = elems.length;
	
	// Setting many attributes
	if ( typeof key === "object" ) {
			for (var k in key) {
				access(elems, k, key[k], exec, fn);
			}
		return elems;
	}
	
	// Setting one attribute
	if (value !== undefined) {
		// Optionally, function values get executed if exec is true
		exec = exec && jQuery.isFunction(value);
		
		for (var i = 0; i < l; i++) {
			var elem = elems[i],
				val = exec ? value.call(elem, i) : value;
			fn(elem, key, val);
		}
		return elems;
	}
	
	// Getting an attribute
	return l ? fn(elems[0], key) : null;
}

function now() {
	return (new Date).getTime();
}
var expando = "jQuery" + now(), uuid = 0, windowData = {};
var emptyObject = {};

jQuery.extend({
	cache: {},
	
	expando:expando,

	data: function( elem, name, data ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ], cache = jQuery.cache, thisCache;

		// Handle the case where there's no name immediately
		if ( !name && !id ) {
			return null;
		}

		// Compute a unique ID for the element
		if ( !id ) { 
			id = ++uuid;
		}

		// Avoid generating a new cache unless none exists and we
		// want to manipulate it.
		if ( cache[ id ] ) {
			thisCache = cache[ id ];
		} else if ( typeof data === "undefined" ) {
			thisCache = emptyObject;
		} else {
			thisCache = cache[ id ] = {};
		}
		
		// Prevent overriding the named cache with undefined values
		if ( data !== undefined ) {
			elem[ expando ] = id;
			thisCache[ name ] = data;
		}
		
		return name ? thisCache[ name ] : thisCache;
	},

	removeData: function( elem, name ) {
		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ], cache = jQuery.cache, thisCache = cache[ id ];

		// If we want to remove a specific section of the element's data
		if ( name ) {
			if ( thisCache ) {
				// Remove the section of cache data
				delete thisCache[ name ];

				// If we've removed all the data, remove the element's cache
				if ( jQuery.isEmptyObject(thisCache) ) {
					jQuery.removeData( elem );
				}
			}

		// Otherwise, we want to remove all of the element's data
		} else {
			// Clean up the element expando
			try {
				delete elem[ expando ];
			} catch( e ) {
				// IE has trouble directly removing the expando
				// but it's ok with using removeAttribute
				if ( elem.removeAttribute ) {
					elem.removeAttribute( expando );
				}
			}

			// Completely remove the data cache
			delete cache[ id ];
		}
	},
	
	queue: function( elem, type, data ) {
		if ( !elem ) { return; }

		type = (type || "fx") + "queue";
		var q = jQuery.data( elem, type );

		// Speed up dequeue by getting out quickly if this is just a lookup
		if ( !data ) { return q || []; }

		if ( !q || jQuery.isArray(data) ) {
			q = jQuery.data( elem, type, jQuery.makeArray(data) );
		} else {
			q.push( data );
		}
		return q;
	},

	dequeue: function( elem, type ){
		type = type || "fx";

		var queue = jQuery.queue( elem, type ), fn = queue.shift();

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) { fn = queue.shift(); }

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type == "fx" ) { queue.unshift("inprogress"); }

			fn.call(elem, function() { jQuery.dequeue(elem, type); });
		}
	}
});

jQuery.fn.extend({
	data: function( key, value ){
		if ( typeof key === "undefined" && this.length ) {
			return jQuery.data( this[0] );
		}

		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			var data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
			}
			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;
		} else {
			return this.trigger("setData" + parts[1] + "!", [parts[0], value]).each(function(){
				jQuery.data( this, key, value );
			});
		}
	},

	removeData: function( key ){
		return this.each(function(){
			jQuery.removeData( this, key );
		});
	},
	queue: function(type, data){
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function(i, elem){
			var queue = jQuery.queue( this, type, data );

			if ( type == "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function(type){
		return this.each(function(){
			jQuery.dequeue( this, type );
		});
	},

	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue( type, function() {
			var elem = this;
			setTimeout(function() {
				jQuery.dequeue( elem, type );
			}, time );
		});
	},

	clearQueue: function(type){
		return this.queue( type || "fx", [] );
	}
});
/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function( elem, types, handler, data ) {
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// For whatever reason, IE has trouble passing the window object
		// around, causing it to be cloned in the process
		if ( elem.setInterval && ( elem !== window && !elem.frameElement ) ) {
			elem = window;
		}

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid ) {
			handler.guid = this.guid++;
		}

		// if data is passed, bind to handler
		if ( data !== undefined ) {
			// Create temporary function pointer to original handler
			var fn = handler;

			// Create unique handler function, wrapped around original handler
			handler = this.proxy( fn );

			// Store data in unique handler
			handler.data = data;
		}

		// Init the element's event structure
		var events = jQuery.data( elem, "events" ) || jQuery.data( elem, "events", {} ),
			handle = jQuery.data( elem, "handle" ) || jQuery.data( elem, "handle", function() {
				// Handle the second event of a trigger and when
				// an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && !jQuery.event.triggered ?
					jQuery.event.handle.apply( arguments.callee.elem, arguments ) :
					undefined;
			});
		// Add elem as a property of the handle function
		// This is to prevent a memory leak with non-native
		// event in IE.
		handle.elem = elem;

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = types.split( /\s+/ );
		var type, i=0;
		while ( (type = types[ i++ ]) ) {
			// Namespaced event handlers
			var namespaces = type.split(".");
			type = namespaces.shift();
			handler.type = namespaces.slice(0).sort().join(".");

			// Get the current list of functions bound to this event
			var handlers = events[ type ],
				special = this.special[ type ] || {};

			

			// Init the event handler queue
			if ( !handlers ) {
				handlers = events[ type ] = {};

				// Check for a special event handler
				// Only use addEventListener/attachEvent if the special
				// events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, handler) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, handle, false );
					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, handle );
					}
				}
			}
			
			if ( special.add ) { 
				var modifiedHandler = special.add.call( elem, handler, data, namespaces, handlers ); 
				if ( modifiedHandler && jQuery.isFunction( modifiedHandler ) ) { 
					modifiedHandler.guid = modifiedHandler.guid || handler.guid; 
					handler = modifiedHandler; 
				} 
			} 
			
			// Add the function to the element's handler list
			handlers[ handler.guid ] = handler;

			// Keep track of which events have been used, for global triggering
			this.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	guid: 1,
	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler ) {
		// don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		var events = jQuery.data( elem, "events" ), ret, type, fn;

		if ( events ) {
			// Unbind all events for the element
			if ( types === undefined || (typeof types === "string" && types.charAt(0) === ".") ) {
				for ( type in events ) {
					this.remove( elem, type + (types || "") );
				}
			} else {
				// types is actually an event object here
				if ( types.type ) {
					handler = types.handler;
					types = types.type;
				}

				// Handle multiple events seperated by a space
				// jQuery(...).unbind("mouseover mouseout", fn);
				types = types.split(/\s+/);
				var i = 0;
				while ( (type = types[ i++ ]) ) {
					// Namespaced event handlers
					var namespaces = type.split(".");
					type = namespaces.shift();
					var all = !namespaces.length,
						cleaned = jQuery.map( namespaces.slice(0).sort() , function(nm){ return nm.replace(/[^\w\s\.\|`]/g, function(ch){return "\\"+ch  }) }),
						namespace = new RegExp("(^|\\.)" + cleaned.join("\\.(?:.*\\.)?") + "(\\.|$)"),
						special = this.special[ type ] || {};

					if ( events[ type ] ) {
						// remove the given handler for the given type
						if ( handler ) {
							fn = events[ type ][ handler.guid ];
							delete events[ type ][ handler.guid ];

						// remove all handlers for the given type
						} else {
							for ( var handle in events[ type ] ) {
								// Handle the removal of namespaced events
								if ( all || namespace.test( events[ type ][ handle ].type ) ) {
									delete events[ type ][ handle ];
								}
							}
						}

						if ( special.remove ) {
							special.remove.call( elem, namespaces, fn);
						}

						// remove generic event handler if no more handlers exist
						for ( ret in events[ type ] ) {
							break;
						}
						if ( !ret ) {
							if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
								if ( elem.removeEventListener ) {
									elem.removeEventListener( type, jQuery.data( elem, "handle" ), false );
								} else if ( elem.detachEvent ) {
									elem.detachEvent( "on" + type, jQuery.data( elem, "handle" ) );
								}
							}
							ret = null;
							delete events[ type ];
						}
					}
				}
			}

			// Remove the expando if it's no longer used
			for ( ret in events ) {
				break;
			}
			if ( !ret ) {
				var handle = jQuery.data( elem, "handle" );
				if ( handle ) {
					handle.elem = null;
				}
				jQuery.removeData( elem, "events" );
				jQuery.removeData( elem, "handle" );
			}
		}
	},

	// bubbling is internal
	trigger: function( event, data, elem /*, bubbling */ ) {
		// Event object or event type
		var type = event.type || event,
			bubbling = arguments[3];

		if ( !bubbling ) {
			event = typeof event === "object" ?
				// jQuery.Event object
				event[expando] ? event :
				// Object literal
				jQuery.extend( jQuery.Event(type), event ) :
				// Just the event type (string)
				jQuery.Event(type);

			if ( type.indexOf("!") >= 0 ) {
				event.type = type = type.slice(0, -1);
				event.exclusive = true;
			}

			// Handle a global trigger
			if ( !elem ) {
				// Don't bubble custom events when global (to avoid too much overhead)
				event.stopPropagation();
				// Only trigger if we've ever bound an event for it
				if ( this.global[ type ] ) {
					jQuery.each( jQuery.cache, function() {
						if ( this.events && this.events[type] ) {
							jQuery.event.trigger( event, data, this.handle.elem );
						}
					});
				}
			}

			// Handle triggering a single element

			// don't do events on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
				return undefined;
			}

			// Clean up in case it is reused
			event.result = undefined;
			event.target = elem;

			// Clone the incoming data, if any
			data = jQuery.makeArray( data );
			data.unshift( event );
		}

		event.currentTarget = elem;

		// Trigger the event, it is assumed that "handle" is a function
		var handle = jQuery.data( elem, "handle" );
		if ( handle ) {
			handle.apply( elem, data );
		}

		var nativeFn, nativeHandler;
		try {
			nativeFn = elem[ type ];
			nativeHandler = elem[ "on" + type ];
		// prevent IE from throwing an error for some elements with some event types, see #3533
		} catch (e) {}
		// Handle triggering native .onfoo handlers (and on links since we don't call .click() for links)
		if ( (!nativeFn || (jQuery.nodeName(elem, 'a') && type === "click")) && nativeHandler && nativeHandler.apply( elem, data ) === false ) {
			event.result = false;
		}

		// Trigger the native events (except for clicks on links)
		if ( !bubbling && nativeFn && !event.isDefaultPrevented() && !(jQuery.nodeName(elem, 'a') && type === "click") ) {
			this.triggered = true;
			try {
				nativeFn();
			// prevent IE from throwing an error for some hidden elements
			} catch (e) {}
		}

		this.triggered = false;

		if ( !event.isPropagationStopped() ) {
			var parent = elem.parentNode || elem.ownerDocument;
			if ( parent ) {
				jQuery.event.trigger( event, data, parent, true );
			}
		}
	},

	handle: function( event ) {
		// returned undefined or false
		var all, handlers;

		event = arguments[0] = jQuery.event.fix( event || window.event );
		event.currentTarget = this;

		// Namespaced event handlers
		var namespaces = event.type.split(".");
		event.type = namespaces.shift();

		// Cache this now, all = true means, any handler
		all = !namespaces.length && !event.exclusive;

		var namespace = new RegExp("(^|\\.)" + namespaces.slice(0).sort().join("\\.(?:.*\\.)?") + "(\\.|$)");

		handlers = ( jQuery.data(this, "events") || {} )[ event.type ];

		for ( var j in handlers ) {
			var handler = handlers[ j ];

			// Filter the functions by class
			if ( all || namespace.test(handler.type) ) {
				// Pass in a reference to the handler function itself
				// So that we can later remove it
				event.handler = handler;
				event.data = handler.data;

				var ret = handler.apply( this, arguments );

				if ( ret !== undefined ) {
					event.result = ret;
					if ( ret === false ) {
						event.preventDefault();
						event.stopPropagation();
					}
				}

				if ( event.isImmediatePropagationStopped() ) {
					break;
				}

			}
		}
	},

	props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

	fix: function( event ) {
		if ( event[ expando ] ) {
			return event;
		}

		// store a copy of the original event object
		// and "clone" to set read-only properties
		var originalEvent = event;
		event = jQuery.Event( originalEvent );

		for ( var i = this.props.length, prop; i; ) {
			prop = this.props[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary
		if ( !event.target ) {
			event.target = event.srcElement || document; // Fixes #1925 where srcElement might not be defined either
		}

		// check if target is a textnode (safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement ) {
			event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
		}

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var doc = document.documentElement, body = document.body;
			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}

		// Add which for key events
		if ( !event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode) ) {
			event.which = event.charCode || event.keyCode;
		}

		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !event.metaKey && event.ctrlKey ) {
			event.metaKey = event.ctrlKey;
		}

		// Add which for click: 1 == left; 2 == middle; 3 == right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button !== undefined ) {
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
		}

		return event;
	},

	proxy: function( fn, proxy, thisObject ) {
		if ( proxy !== undefined && !jQuery.isFunction( proxy ) ) {
			thisObject = proxy;
			proxy = undefined;
		}
		// FIXME: Should proxy be redefined to be applied with thisObject if defined?
		proxy = proxy || function() { return fn.apply( thisObject !== undefined ? thisObject : this, arguments ); };
		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || proxy.guid || this.guid++;
		// So proxy can be declared as an argument
		return proxy;
	},

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: bindReady,
			teardown: function() {}
		},

		live: {
			add: function( proxy, data, namespaces, live ) {
				jQuery.extend( proxy, data || {} );

				proxy.guid += data.selector + data.live; 
				jQuery.event.add( this, data.live, liveHandler, data ); 
				
			},

			remove: function( namespaces ) {
				if ( namespaces.length ) {
					var remove = 0, name = new RegExp("(^|\\.)" + namespaces[0] + "(\\.|$)");

					jQuery.each( (jQuery.data(this, "events").live || {}), function() {
						if ( name.test(this.type) ) {
							remove++;
						}
					});

					if ( remove < 1 ) {
						jQuery.event.remove( this, namespaces[0], liveHandler );
					}
				}
			},
			special: {}
		}
	}
};

jQuery.Event = function( src ){
	// Allow instantiation without the 'new' keyword
	if ( !this.preventDefault ) {
		return new jQuery.Event( src );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;
	// Event type
	} else {
		this.type = src;
	}

	// timeStamp is buggy for some events on Firefox(#3843)
	// So we won't rely on the native value
	this.timeStamp = now();

	// Mark it as fixed
	this[ expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		
		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();
		}
		// otherwise set the returnValue property of the original event to false (IE)
		e.returnValue = false;
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function(){
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};
// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function( event ) {
	// Check if mouse(over|out) are still within the same parent element
	var parent = event.relatedTarget;
	// Traverse up the tree
	while ( parent && parent != this ) {
		// Firefox sometimes assigns relatedTarget a XUL element
		// which we cannot access the parentNode property of
		try { parent = parent.parentNode; }
		// assuming we've left the element since we most likely mousedover a xul element
		catch(e) { break; }
	}

	if ( parent != this ) {
		// set the correct event type
		event.type = event.data;
		// handle event if we actually just moused on to a non sub-element
		jQuery.event.handle.apply( this, arguments );
	}

},

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
delegate = function( event ) {
	event.type = event.data;
	jQuery.event.handle.apply( this, arguments );
};

// Create mouseenter and mouseleave events
jQuery.each({
	mouseover: "mouseenter",
	mouseout: "mouseleave"
}, function( orig, fix ) {
	jQuery.event.special[ fix ] = {
		setup: function(data){
			jQuery.event.add( this, orig, data && data.selector ? delegate : withinElement, fix );
		},
		teardown: function(data){
			jQuery.event.remove( this, orig, data && data.selector ? delegate : withinElement );
		}
	};
});

// submit delegation
jQuery.event.special.submit = {
	setup: function( data, namespaces, fn ) {
		if ( !jQuery.support.submitBubbles && this.nodeName.toLowerCase() !== "form" ) {
			jQuery.event.add(this, "click.specialSubmit." + fn.guid, function( e ) {
				var elem = e.target, type = elem.type;

				if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
					return trigger( "submit", this, arguments );
				}
			});
	 
			jQuery.event.add(this, "keypress.specialSubmit." + fn.guid, function( e ) {
				var elem = e.target, type = elem.type;

				if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
					return trigger( "submit", this, arguments );
				}
			});
		}

		return false;
	},

	remove: function( namespaces, fn ) {
		jQuery.event.remove( this, "click.specialSubmit" + (fn ? "."+fn.guid : "") );
		jQuery.event.remove( this, "keypress.specialSubmit" + (fn ? "."+fn.guid : "") );
	}
};

// change delegation, happens here so we have bind.
jQuery.event.special.change = {
	filters: {
		click: function( e ) { 
			var elem = e.target;

			if ( elem.nodeName.toLowerCase() === "input" && elem.type === "checkbox" ) {
				return trigger( "change", this, arguments );
			}

			return changeFilters.keyup.call( this, e );
		}, 
		keyup: function( e ) { 
			var elem = e.target, data, index = elem.selectedIndex + "";

			if ( elem.nodeName.toLowerCase() === "select" ) {
				data = jQuery.data( elem, "_change_data" );
				jQuery.data( elem, "_change_data", index );

				if ( (elem.type === "select-multiple" || data != null) && data !== index ) {
					return trigger( "change", this, arguments );
				}
			}
		},
		beforeactivate: function( e ) {
			var elem = e.target;

			if ( elem.nodeName.toLowerCase() === "input" && elem.type === "radio" && !elem.checked ) {
				return trigger( "change", this, arguments );
			}
		},
		blur: function( e ) {
			var elem = e.target, nodeName = elem.nodeName.toLowerCase();

			if ( (nodeName === "textarea" || (nodeName === "input" && (elem.type === "text" || elem.type === "password")))
				&& jQuery.data(elem, "_change_data") !== elem.value ) {

				return trigger( "change", this, arguments );
			}
		},
		focus: function( e ) {
			var elem = e.target, nodeName = elem.nodeName.toLowerCase();

			if ( nodeName === "textarea" || (nodeName === "input" && (elem.type === "text" || elem.type === "password" ) ) ) {
				jQuery.data( elem, "_change_data", elem.value );
			}
		}
	},
	setup: function( data, namespaces, fn ) {
		// return false if we bubble
		if ( !jQuery.support.changeBubbles ) {
			for ( var type in changeFilters ) {
				jQuery.event.add( this, type + ".specialChange." + fn.guid, changeFilters[type] );
			}
		}
		
		// always want to listen for change for trigger
		return false;
	},
	remove: function( namespaces, fn ) {
		if ( !jQuery.support.changeBubbles ) {
			for ( var type in changeFilters ) {
				jQuery.event.remove( this, type + ".specialChange" + (fn ? "."+fn.guid : ""), changeFilters[type] );
			}
		}
	}
};

var changeFilters = jQuery.event.special.change.filters;

function trigger( type, elem, args ) {
	args[0].type = type;
	return jQuery.event.handle.apply( elem, args );
}

// Create "bubbling" focus and blur events
jQuery.each({
	focus: "focusin",
	blur: "focusout"
}, function( orig, fix ){
	var event = jQuery.event,
		handle = event.handle;
	
	function ieHandler() { 
		arguments[0].type = orig;
		return handle.apply(this, arguments);
	}

	event.special[orig] = {
		setup:function() {
			if ( this.addEventListener ) {
				this.addEventListener( orig, handle, true );
			} else {
				event.add( this, fix, ieHandler );
			}
		}, 
		teardown:function() { 
			if ( this.removeEventListener ) {
				this.removeEventListener( orig, handle, true );
			} else {
				event.remove( this, fix, ieHandler );
			}
		}
	};
});

jQuery.fn.extend({
	// TODO: make bind(), unbind() and one() DRY!
	bind: function( type, data, fn, thisObject ) {
		// Handle object literals
		if ( typeof type === "object" ) {
			for ( var key in type ) {
				this.bind(key, data, type[key], fn);
			}
			return this;
		}
		
		if ( jQuery.isFunction( data ) ) {
			thisObject = fn;
			fn = data;
			data = undefined;
		}
		fn = thisObject === undefined ? fn : jQuery.event.proxy( fn, thisObject );
		return type === "unload" ? this.one(type, data, fn, thisObject) : this.each(function() {
			jQuery.event.add( this, type, fn, data );
		});
	},

	one: function( type, data, fn, thisObject ) {
		// Handle object literals
		if ( typeof type === "object" ) {
			for ( var key in type ) {
				this.one(key, data, type[key], fn);
			}
			return this;
		}
		
		if ( jQuery.isFunction( data ) ) {
			thisObject = fn;
			fn = data;
			data = undefined;
		}
		fn = thisObject === undefined ? fn : jQuery.event.proxy( fn, thisObject );
		var one = jQuery.event.proxy( fn, function( event ) {
			jQuery( this ).unbind( event, one );
			return fn.apply( this, arguments );
		});
		return this.each(function() {
			jQuery.event.add( this, type, one, data );
		});
	},

	unbind: function( type, fn ) {
		// Handle object literals
		if ( typeof type === "object" && !type.preventDefault ) {
			for ( var key in type ) {
				this.unbind(key, type[key]);
			}
			return this;
		}
		
		return this.each(function() {
			jQuery.event.remove( this, type, fn );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},

	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			var event = jQuery.Event( type );
			event.preventDefault();
			event.stopPropagation();
			jQuery.event.trigger( event, data, this[0] );
			return event.result;
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments, i = 1;

		// link all the functions, so any of them can unbind this click handler
		while( i < args.length ) {
			jQuery.event.proxy( fn, args[ i++ ] );
		}

		return this.click( jQuery.event.proxy( fn, function( event ) {
			// Figure out which function to execute
			var lastToggle = ( jQuery.data( this, 'lastToggle' + fn.guid ) || 0 ) % i;
			jQuery.data( this, 'lastToggle' + fn.guid, lastToggle + 1 );

			// Make sure that clicks stop
			event.preventDefault();

			// and execute the function
			return args[ lastToggle ].apply( this, arguments ) || false;
		}));
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	ready: function( fn ) {
		// Attach the listeners
		bindReady();

		// If the DOM is already ready
		if ( jQuery.isReady ) {
			// Execute the function immediately
			fn.call( document, jQuery );

		// Otherwise, remember the function for later
		} else {
			// Add the function to the wait list
			jQuery.readyList.push( fn );
		}

		return this;
	},

	live: function( type, data, fn, thisObject ) {
		if ( jQuery.isFunction( data ) ) {
			if ( fn !== undefined ) {
				thisObject = fn;
			}
			fn = data;
			data = undefined;
		}
		jQuery( this.context ).bind( liveConvert( type, this.selector ), {
			data: data, selector: this.selector, live: type
		}, fn, thisObject );
		return this;
	},

	die: function( type, fn ) {
		jQuery( this.context ).unbind( liveConvert( type, this.selector ), fn ? { guid: fn.guid + this.selector + type } : null );
		return this;
	}
});

function liveHandler( event ) {
	var stop = true, elems = [], selectors = [], args = arguments,
		related, match, fn, elem, j, i, data,
		live = jQuery.extend({}, jQuery.data( this, "events" ).live);

	for ( j in live ) {
		fn = live[j];
		if ( fn.live === event.type ||
				fn.altLive && jQuery.inArray(event.type, fn.altLive) > -1 ) {

			data = fn.data;
			if ( !(data.beforeFilter && data.beforeFilter[event.type] && 
					!data.beforeFilter[event.type](event)) ) {
				selectors.push( fn.selector );
			}
		} else {
			delete live[j];
		}
	}

	match = jQuery( event.target ).closest( selectors, event.currentTarget );

	for ( i = 0, l = match.length; i < l; i++ ) {
		for ( j in live ) {
			fn = live[j];
			elem = match[i].elem;
			related = null;

			if ( match[i].selector === fn.selector ) {
				// Those two events require additional checking
				if ( fn.live === "mouseenter" || fn.live === "mouseleave" ) {
					related = jQuery( event.relatedTarget ).closest( fn.selector )[0];
				}

				if ( !related || related !== elem ) {
					elems.push({ elem: elem, fn: fn });
				}
			}
		}
	}

	for ( i = 0, l = elems.length; i < l; i++ ) {
		match = elems[i];
		event.currentTarget = match.elem;
		event.data = match.fn.data;
		if ( match.fn.apply( match.elem, args ) === false ) {
			stop = false;
			break;
		}
	}

	return stop;
}

function liveConvert( type, selector ) {
	return ["live", type, selector//.replace(/[^\w\s\.]/g, function(ch){ return "\\"+ch})
								  .replace(/\./g, "`")
								  .replace(/ /g, "|")].join(".");
}

jQuery.extend({
	isReady: false,
	readyList: [],
	// Handle when the DOM is ready
	ready: function() {
		// Make sure that the DOM is not already loaded
		if ( !jQuery.isReady ) {
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 13 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If there are functions bound, to execute
			if ( jQuery.readyList ) {
				// Execute all of them
				var fn, i = 0;
				while ( (fn = jQuery.readyList[ i++ ]) ) {
					fn.call( document, jQuery );
				}

				// Reset the list of functions
				jQuery.readyList = null;
			}

			// Trigger any bound ready events
			jQuery( document ).triggerHandler( "ready" );
		}
	}
});

var readyBound = false;

function bindReady() {
	if ( readyBound ) { return; }
	readyBound = true;

	// Catch cases where $(document).ready() is called after the
	// browser event has already occurred.
	if ( document.readyState === "complete" ) {
		return jQuery.ready();
	}

	// Mozilla, Opera and webkit nightlies currently support this event
	if ( document.addEventListener ) {
		// Use the handy event callback
		document.addEventListener( "DOMContentLoaded", function() {
			document.removeEventListener( "DOMContentLoaded", arguments.callee, false );
			jQuery.ready();
		}, false );

	// If IE event model is used
	} else if ( document.attachEvent ) {
		// ensure firing before onload,
		// maybe late but safe also for iframes
		document.attachEvent("onreadystatechange", function() {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( document.readyState === "complete" ) {
				document.detachEvent( "onreadystatechange", arguments.callee );
				jQuery.ready();
			}
		});

		// If IE and not a frame
		// continually check to see if the document is ready
		var toplevel = false;

		try {
			toplevel = window.frameElement == null;
		} catch(e){}

		if ( document.documentElement.doScroll && toplevel ) {
			(function() {
				if ( jQuery.isReady ) {
					return;
				}

				try {
					// If IE is used, use the trick by Diego Perini
					// http://javascript.nwbox.com/IEContentLoaded/
					document.documentElement.doScroll("left");
				} catch( error ) {
					setTimeout( arguments.callee, 0 );
					return;
				}

				// and execute any waiting functions
				jQuery.ready();
			})();
		}
	}

	// A fallback to window.onload, that will always work
	jQuery.event.add( window, "load", jQuery.ready );
}

jQuery.each( ("blur focus load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( fn ) {
		return fn ? this.bind( name, fn ) : this.trigger( name );
	};
});

// Prevent memory leaks in IE
// Window isn't included so as not to unbind existing unload events
// More info:
//  - http://isaacschlueter.com/2006/10/msie-memory-leaks/
/*@cc_on
jQuery( window ).bind( 'unload', function() {
	for ( var id in jQuery.cache ) {
		// Skip the window
		if ( id != 1 && jQuery.cache[ id ].handle ) {
			jQuery.event.remove( jQuery.cache[ id ].handle.elem );
		}
	}
});
@*/
(function(){

	jQuery.support = {};

	var root = document.documentElement,
		script = document.createElement("script"),
		div = document.createElement("div"),
		id = "script" + now();

	div.style.display = "none";
	div.innerHTML = '   <link/><table></table><a href="/a" style="color:red;float:left;opacity:.55;">a</a><select><option>text</option></select>';

	var all = div.getElementsByTagName("*"),
		a = div.getElementsByTagName("a")[0];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return;
	}

	jQuery.support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType == 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText insted)
		style: /red/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		opacity: a.style.opacity === "0.55",

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Will be defined later
		scriptEval: false,
		noCloneEvent: true,
		boxModel: null
	};

	script.type = "text/javascript";
	try {
		script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
	} catch(e){}

	root.insertBefore( script, root.firstChild );

	// Make sure that the execution of code works by injecting a script
	// tag with appendChild/createTextNode
	// (IE doesn't support this, fails, and uses .text instead)
	if ( window[ id ] ) {
		jQuery.support.scriptEval = true;
		delete window[ id ];
	}

	root.removeChild( script );

	if ( div.attachEvent && div.fireEvent ) {
		div.attachEvent("onclick", function click(){
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			jQuery.support.noCloneEvent = false;
			div.detachEvent("onclick", click);
		});
		div.cloneNode(true).fireEvent("onclick");
	}

	// Figure out if the W3C box model works as expected
	// document.body must exist before we can do this
	jQuery(function(){
		var div = document.createElement("div");
		div.style.width = div.style.paddingLeft = "1px";

		document.body.appendChild( div );
		jQuery.boxModel = jQuery.support.boxModel = div.offsetWidth === 2;
		document.body.removeChild( div ).style.display = 'none';
		div = null;
	});

	// Technique from Juriy Zaytsev
	// http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
	var eventSupported = function( eventName ) { 
		var el = document.createElement("div"); 
		eventName = "on" + eventName; 

		var isSupported = (eventName in el); 
		if ( !isSupported ) { 
			el.setAttribute(eventName, "return;"); 
			isSupported = typeof el[eventName] === "function"; 
		} 
		el = null; 

		return isSupported; 
	};
	
	jQuery.support.submitBubbles = eventSupported("submit");
	jQuery.support.changeBubbles = eventSupported("change");

	// release memory in IE
	root = script = div = all = a = null;
})();

jQuery.props = {
	"for": "htmlFor",
	"class": "className",
	readonly: "readOnly",
	maxlength: "maxLength",
	cellspacing: "cellSpacing",
	rowspan: "rowSpan",
	colspan: "colSpan",
	tabindex: "tabIndex",
	usemap: "useMap",
	frameborder: "frameBorder"
};
/*!
 * Sizzle CSS Selector Engine - v1.0
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function(){
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function(selector, context, results, seed) {
	results = results || [];
	var origContext = context = context || document;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var parts = [], m, set, checkSet, extra, prune = true, contextXML = isXML(context),
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	while ( (chunker.exec(""), m = chunker.exec(soFar)) !== null ) {
		soFar = m[3];
		
		parts.push( m[1] );
		
		if ( m[2] ) {
			extra = m[3];
			break;
		}
	}

	if ( parts.length > 1 && origPOS.exec( selector ) ) {
		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );
		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] )
					selector += parts.shift();

				set = posProcess( selector, set );
			}
		}
	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {
			var ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ? Sizzle.filter( ret.expr, ret.set )[0] : ret.set[0];
		}

		if ( context ) {
			var ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );
			set = ret.expr ? Sizzle.filter( ret.expr, ret.set ) : ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray(set);
			} else {
				prune = false;
			}

			while ( parts.length ) {
				var cur = parts.pop(), pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}
		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		throw "Syntax error, unrecognized expression: " + (cur || selector);
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );
		} else if ( context && context.nodeType === 1 ) {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}
		} else {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}
	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function(results){
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort(sortOrder);

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[i-1] ) {
					results.splice(i--, 1);
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function(expr, set){
	return Sizzle(expr, null, null, set);
};

Sizzle.find = function(expr, context, isXML){
	var set, match;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var type = Expr.order[i], match;
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice(1,1);

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace(/\\/g, "");
				set = Expr.find[ type ]( match, context, isXML );
				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = context.getElementsByTagName("*");
	}

	return {set: set, expr: expr};
};

Sizzle.filter = function(expr, set, inplace, not){
	var old = expr, result = [], curLoop = set, match, anyFound,
		isXMLFilter = set && set[0] && isXML(set[0]);

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.match[ type ].exec( expr )) != null ) {
				var filter = Expr.filter[ type ], found, item;
				anyFound = false;

				if ( curLoop == result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;
					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;
								} else {
									curLoop[i] = false;
								}
							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr == old ) {
			if ( anyFound == null ) {
				throw "Syntax error, unrecognized expression: " + expr;
			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],
	match: {
		ID: /#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]*)((?:\([^\)]+\)|[^\2\(\)]*)+)\2\))?/
	},
	leftMatch: {},
	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},
	attrHandle: {
		href: function(elem){
			return elem.getAttribute("href");
		}
	},
	relative: {
		"+": function(checkSet, part, isXML){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !/\W/.test(part),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag && !isXML ) {
				part = part.toUpperCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},
		">": function(checkSet, part, isXML){
			var isPartStr = typeof part === "string";

			if ( isPartStr && !/\W/.test(part) ) {
				part = isXML ? part : part.toUpperCase();

				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName === part ? parent : false;
					}
				}
			} else {
				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},
		"": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( !/\W/.test(part) ) {
				var nodeCheck = part = isXML ? part : part.toUpperCase();
				checkFn = dirNodeCheck;
			}

			checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
		},
		"~": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( typeof part === "string" && !/\W/.test(part) ) {
				var nodeCheck = part = isXML ? part : part.toUpperCase();
				checkFn = dirNodeCheck;
			}

			checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
		}
	},
	find: {
		ID: function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? [m] : [];
			}
		},
		NAME: function(match, context, isXML){
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [], results = context.getElementsByName(match[1]);

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},
		TAG: function(match, context){
			return context.getElementsByTagName(match[1]);
		}
	},
	preFilter: {
		CLASS: function(match, curLoop, inplace, result, not, isXML){
			match = " " + match[1].replace(/\\/g, "") + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").indexOf(match) >= 0) ) {
						if ( !inplace )
							result.push( elem );
					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},
		ID: function(match){
			return match[1].replace(/\\/g, "");
		},
		TAG: function(match, curLoop){
			for ( var i = 0; curLoop[i] === false; i++ ){}
			return curLoop[i] && isXML(curLoop[i]) ? match[1] : match[1].toUpperCase();
		},
		CHILD: function(match){
			if ( match[1] == "nth" ) {
				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
					match[2] == "even" && "2n" || match[2] == "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},
		ATTR: function(match, curLoop, inplace, result, not, isXML){
			var name = match[1].replace(/\\/g, "");
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},
		PSEUDO: function(match, curLoop, inplace, result, not){
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);
				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
					if ( !inplace ) {
						result.push.apply( result, ret );
					}
					return false;
				}
			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},
		POS: function(match){
			match.unshift( true );
			return match;
		}
	},
	filters: {
		enabled: function(elem){
			return elem.disabled === false && elem.type !== "hidden";
		},
		disabled: function(elem){
			return elem.disabled === true;
		},
		checked: function(elem){
			return elem.checked === true;
		},
		selected: function(elem){
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			elem.parentNode.selectedIndex;
			return elem.selected === true;
		},
		parent: function(elem){
			return !!elem.firstChild;
		},
		empty: function(elem){
			return !elem.firstChild;
		},
		has: function(elem, i, match){
			return !!Sizzle( match[3], elem ).length;
		},
		header: function(elem){
			return /h\d/i.test( elem.nodeName );
		},
		text: function(elem){
			return "text" === elem.type;
		},
		radio: function(elem){
			return "radio" === elem.type;
		},
		checkbox: function(elem){
			return "checkbox" === elem.type;
		},
		file: function(elem){
			return "file" === elem.type;
		},
		password: function(elem){
			return "password" === elem.type;
		},
		submit: function(elem){
			return "submit" === elem.type;
		},
		image: function(elem){
			return "image" === elem.type;
		},
		reset: function(elem){
			return "reset" === elem.type;
		},
		button: function(elem){
			return "button" === elem.type || elem.nodeName.toUpperCase() === "BUTTON";
		},
		input: function(elem){
			return /input|select|textarea|button/i.test(elem.nodeName);
		}
	},
	setFilters: {
		first: function(elem, i){
			return i === 0;
		},
		last: function(elem, i, match, array){
			return i === array.length - 1;
		},
		even: function(elem, i){
			return i % 2 === 0;
		},
		odd: function(elem, i){
			return i % 2 === 1;
		},
		lt: function(elem, i, match){
			return i < match[3] - 0;
		},
		gt: function(elem, i, match){
			return i > match[3] - 0;
		},
		nth: function(elem, i, match){
			return match[3] - 0 == i;
		},
		eq: function(elem, i, match){
			return match[3] - 0 == i;
		}
	},
	filter: {
		PSEUDO: function(elem, match, i, array){
			var name = match[1], filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || "").indexOf(match[3]) >= 0;
			} else if ( name === "not" ) {
				var not = match[3];

				for ( var i = 0, l = not.length; i < l; i++ ) {
					if ( not[i] === elem ) {
						return false;
					}
				}

				return true;
			}
		},
		CHILD: function(elem, match){
			var type = match[1], node = elem;
			switch (type) {
				case 'only':
				case 'first':
					while ( (node = node.previousSibling) )  {
						if ( node.nodeType === 1 ) return false;
					}
					if ( type == 'first') return true;
					node = elem;
				case 'last':
					while ( (node = node.nextSibling) )  {
						if ( node.nodeType === 1 ) return false;
					}
					return true;
				case 'nth':
					var first = match[2], last = match[3];

					if ( first == 1 && last == 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 
						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;
					if ( first == 0 ) {
						return diff == 0;
					} else {
						return ( diff % first == 0 && diff / first >= 0 );
					}
			}
		},
		ID: function(elem, match){
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},
		TAG: function(elem, match){
			return (match === "*" && elem.nodeType === 1) || elem.nodeName === match;
		},
		CLASS: function(elem, match){
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},
		ATTR: function(elem, match){
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value != check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},
		POS: function(elem, match, i, array){
			var name = match[2], filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS;

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + /(?![^\[]*\])(?![^\(]*\))/.source );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source );
}

var makeArray = function(array, results) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 );

// Provide a fallback method if it does not work
} catch(e){
	makeArray = function(array, results) {
		var ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );
		} else {
			if ( typeof array.length === "number" ) {
				for ( var i = 0, l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}
			} else {
				for ( var i = 0; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.compareDocumentPosition ? -1 : 1;
		}

		var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( "sourceIndex" in document.documentElement ) {
	sortOrder = function( a, b ) {
		if ( !a.sourceIndex || !b.sourceIndex ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.sourceIndex ? -1 : 1;
		}

		var ret = a.sourceIndex - b.sourceIndex;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( document.createRange ) {
	sortOrder = function( a, b ) {
		if ( !a.ownerDocument || !b.ownerDocument ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.ownerDocument ? -1 : 1;
		}

		var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
		aRange.setStart(a, 0);
		aRange.setEnd(a, 0);
		bRange.setStart(b, 0);
		bRange.setEnd(b, 0);
		var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date).getTime();
	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	var root = document.documentElement;
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
			}
		};

		Expr.filter.ID = function(elem, match){
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );
	root = form = null; // release memory in IE
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function(match, context){
			var results = context.getElementsByTagName(match[1]);

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";
	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {
		Expr.attrHandle.href = function(elem){
			return elem.getAttribute("href", 2);
		};
	}

	div = null; // release memory in IE
})();

if ( document.querySelectorAll ) (function(){
	var oldSizzle = Sizzle, div = document.createElement("div");
	div.innerHTML = "<p class='TEST'></p>";

	// Safari can't handle uppercase or unicode characters when
	// in quirks mode.
	if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
		return;
	}
	
	Sizzle = function(query, context, extra, seed){
		context = context || document;

		// Only use querySelectorAll on non-XML documents
		// (ID selectors don't work in non-HTML documents)
		if ( !seed && context.nodeType === 9 && !isXML(context) ) {
			try {
				return makeArray( context.querySelectorAll(query), extra );
			} catch(e){}
		}
		
		return oldSizzle(query, context, extra, seed);
	};

	for ( var prop in oldSizzle ) {
		Sizzle[ prop ] = oldSizzle[ prop ];
	}

	div = null; // release memory in IE
})();

if ( document.getElementsByClassName && document.documentElement.getElementsByClassName ) (function(){
	var div = document.createElement("div");
	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	if ( div.getElementsByClassName("e").length === 0 )
		return;

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 )
		return;

	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function(match, context, isXML) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	div = null; // release memory in IE
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	var sibDir = dir == "previousSibling" && !isXML;
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			if ( sibDir && elem.nodeType === 1 ){
				elem.sizcache = doneName;
				elem.sizset = i;
			}
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	var sibDir = dir == "previousSibling" && !isXML;
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			if ( sibDir && elem.nodeType === 1 ) {
				elem.sizcache = doneName;
				elem.sizset = i;
			}
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}
					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

var contains = document.compareDocumentPosition ?  function(a, b){
	return a.compareDocumentPosition(b) & 16;
} : function(a, b){
	return a !== b && (a.contains ? a.contains(b) : true);
};

var isXML = function(elem){
	return elem.nodeType === 9 && elem.documentElement.nodeName !== "HTML" ||
		!!elem.ownerDocument && elem.ownerDocument.documentElement.nodeName !== "HTML";
};

var posProcess = function(selector, context){
	var tmpSet = [], later = "", match,
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;

return;

window.Sizzle = Sizzle;

})();
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	slice = Array.prototype.slice;

// Implement the identical functionality for filter and not
var winnow = function( elements, qualifier, keep ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function(elem, i) {
			return !!qualifier.call( elem, i ) === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function(elem, i) {
			return (elem === qualifier) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function(elem) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, elements );
		}
	}

	return jQuery.grep(elements, function(elem, i) {
		return (jQuery.inArray( elem, qualifier ) >= 0) === keep;
	});
};

jQuery.fn.extend({
	find: function( selector ) {
		var ret = this.pushStack( "", "find", selector ), length = 0;

		for ( var i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( var n = length; n < ret.length; n++ ) {
					for ( var r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	closest: function( selectors, context ) {
		if ( jQuery.isArray( selectors ) ) {
			var ret = [], cur = this[0], match, matches = {}, selector;

			if ( cur && selectors.length ) {
				for ( var i = 0, l = selectors.length; i < l; i++ ) {
					selector = selectors[i];

					if ( !matches[selector] ) {
						matches[selector] = jQuery.expr.match.POS.test( selector ) ? 
							jQuery( selector, context || this.context ) :
							selector;
					}
				}

				while ( cur && cur.ownerDocument && cur !== context ) {
					for ( selector in matches ) {
						match = matches[selector];

						if ( match.jquery ? match.index(cur) > -1 : jQuery(cur).is(match) ) {
							ret.push({ selector: selector, elem: cur });
							delete matches[selector];
						}
					}
					cur = cur.parentNode;
				}
			}

			return ret;
		}

		var pos = jQuery.expr.match.POS.test( selectors ) ? 
			jQuery( selectors, context || this.context ) : null;

		return this.map(function(i, cur){
			while ( cur && cur.ownerDocument && cur !== context ) {
				if ( pos ? pos.index(cur) > -1 : jQuery(cur).is(selectors) ) {
					return cur;
				}
				cur = cur.parentNode;
			}
			return null;
		});
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context || this.context ) :
				jQuery.makeArray( selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( set[0] && (set[0].setInterval || set[0].nodeType === 9 || (set[0].parentNode && set[0].parentNode.nodeType !== 11)) ?
			jQuery.unique( all ) :
			all );
	},

	eq: function( i ) {
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, +i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function(elem, i){
			return callback.call( elem, i, elem );
		}));
	},

	andSelf: function() {
		return this.add( this.prevObject );
	},

	end: function() {
		return this.prevObject || jQuery(null);
	}
});

jQuery.each({
	parent: function(elem){return elem.parentNode;},
	parents: function(elem){return jQuery.dir(elem,"parentNode");},
	parentsUntil: function(elem,i,until){return jQuery.dir(elem,"parentNode",until);},
	next: function(elem){return jQuery.nth(elem,2,"nextSibling");},
	prev: function(elem){return jQuery.nth(elem,2,"previousSibling");},
	nextAll: function(elem){return jQuery.dir(elem,"nextSibling");},
	prevAll: function(elem){return jQuery.dir(elem,"previousSibling");},
	nextUntil: function(elem,i,until){return jQuery.dir(elem,"nextSibling",until);},
	prevUntil: function(elem,i,until){return jQuery.dir(elem,"previousSibling",until);},
	siblings: function(elem){return jQuery.sibling(elem.parentNode.firstChild,elem);},
	children: function(elem){return jQuery.sibling(elem.firstChild);},
	contents: function(elem){return jQuery.nodeName(elem,"iframe")?elem.contentDocument||elem.contentWindow.document:jQuery.makeArray(elem.childNodes);}
}, function(name, fn){
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );
		
		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call(arguments).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return jQuery.find.matches(expr, elems);
	},
	
	dir: function( elem, dir, until ) {
		var matched = [], cur = elem[dir];
		while ( cur && cur.nodeType !== 9 && (until === undefined || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});
jQuery.fn.extend({
	attr: function( name, value ) {
		return access(this, name, value, true, jQuery.attr);
	},

	addClass: function( value ) {
		if ( value && typeof value === "string" ) {
			var classNames = (value || "").split(/\s+/);

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className ) {
						elem.className = value;
					} else {
						var className = " " + elem.className + " ";
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( className.indexOf( " " + classNames[c] + " " ) < 0 ) {
								elem.className += " " + classNames[c];
							}
						}
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		if ( (value && typeof value === "string") || value === undefined ) {
			var classNames = (value || "").split(/\s+/);

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
					var className = " " + elem.className + " ";
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[c] + " ", " ");
						}
						elem.className = className.substring(1, className.length - 1);
					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ";
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if ( (" " + this[i].className + " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		if ( value === undefined ) {
			var elem = this[0];

			if ( elem ) {
				if( jQuery.nodeName( elem, 'option' ) ) {
					return (elem.attributes.value || {}).specified ? elem.value : elem.text;
				}
				// We need to handle select boxes special
				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type == "select-one";

					// Nothing was selected
					if ( index < 0 ) {
						return null;
					}
					// Loop through all the selected options
					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						if ( option.selected ) {
							// Get the specifc value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}
							// Multi-Selects return an array
							values.push( value );
						}
					}

					return values;
				}

				// Everything else, we just grab the value
				return (elem.value || "").replace(/\r/g, "");

			}

			return undefined;
		}

		// Typecast once if the value is a number
		if ( typeof value === "number" ) {
			value += '';
		}	
		var val = value;

		return this.each(function(){
			if(jQuery.isFunction(value)) {
				val = value.call(this);
				// Typecast each time if the value is a Function and the appended
				// value is therefore different each time.
				if( typeof val === "number" ) {
					val += ''; 
				}
			}
			
			if ( this.nodeType != 1 ) {
				return;
			}
			if ( jQuery.isArray(val) && /radio|checkbox/.test( this.type ) ) {
				this.checked = jQuery.inArray(this.value || this.name, val) >= 0;
			}
			else if ( jQuery.nodeName( this, "select" ) ) {
				var values = jQuery.makeArray(val);

				jQuery( "option", this ).each(function(){
					this.selected = jQuery.inArray( this.value || this.text, values ) >= 0;
				});

				if ( !values.length ) {
					this.selectedIndex = -1;
				}
			} else {
				this.value = val;
			}
		});
	}
});

jQuery.each({
	removeAttr: function( name ) {
		jQuery.attr( this, name, "" );
		if (this.nodeType == 1) {
			this.removeAttribute( name );
		}
	},

	toggleClass: function( classNames, state ) {
		var type = typeof classNames;
		if ( type === "string" ) {
			// toggle individual class names
			var isBool = typeof state === "boolean", className, i = 0,
				classNames = classNames.split( /\s+/ );
			while ( (className = classNames[ i++ ]) ) {
				// check each className given, space seperated list
				state = isBool ? state : !jQuery(this).hasClass( className );
				jQuery(this)[ state ? "addClass" : "removeClass" ]( className );
			}
		} else if ( type === "undefined" || type === "boolean" ) {
			if ( this.className ) {
				// store className if set
				jQuery.data( this, "__className__", this.className );
			}
			// toggle whole className
			this.className = this.className || classNames === false ? "" : jQuery.data( this, "__className__" ) || "";
		}
	}
}, function(name, fn){
	jQuery.fn[ name ] = function(){
		return this.each( fn, arguments );
	};
});

jQuery.extend({
	attr: function( elem, name, value ) {
		// don't set attributes on text and comment nodes
		if (!elem || elem.nodeType == 3 || elem.nodeType == 8) {
			return undefined;
		}
		if ( name in jQuery.fn && name !== "attr" ) {
			return jQuery(elem)[name](value);
		}
		
		var notxml = elem.nodeType !== 1 || !jQuery.isXMLDoc( elem ),
			// Whether we are setting (or getting)
			set = value !== undefined;

		// Try to normalize/fix the name
		name = notxml && jQuery.props[ name ] || name;

		// Only do all the following if this is a node (faster for style)
		if ( elem.nodeType === 1 ) {

			// These attributes require special treatment
			var special = /href|src|style/.test( name );

			// Safari mis-reports the default selected property of a hidden option
			// Accessing the parent's selectedIndex property fixes it
			if ( name == "selected" && elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}
			// If applicable, access the attribute via the DOM 0 way
			if ( name in elem && notxml && !special ) {
				if ( set ) {
					// We can't allow the type property to be changed (since it causes problems in IE)
					if ( name == "type" && /(button|input)/i.test(elem.nodeName) && elem.parentNode ) {
						throw "type property can't be changed";
					}
					elem[ name ] = value;
				}

				// browsers index elements by id/name on forms, give priority to attributes.
				if( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) ) {
					return elem.getAttributeNode( name ).nodeValue;
				}
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				if ( name == "tabIndex" ) {
					var attributeNode = elem.getAttributeNode( "tabIndex" );
					return attributeNode && attributeNode.specified
						? attributeNode.value
						: /(button|input|object|select|textarea)/i.test(elem.nodeName)
							? 0
							: /^(a|area)$/i.test(elem.nodeName) && elem.href
								? 0
								: undefined;
				}

				return elem[ name ];
			}

			if ( !jQuery.support.style && notxml && name == "style" ) {
				if ( set ) {
					elem.style.cssText = "" + value;
				}
				return elem.style.cssText;
			}

			if ( set ) {
				// convert the value to a string (all browsers do this but IE) see #1070
				elem.setAttribute( name, "" + value );
			}
			var attr = !jQuery.support.hrefNormalized && notxml && special
					// Some attributes require a special call on IE
					? elem.getAttribute( name, 2 )
					: elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return attr === null ? undefined : attr;
		}

		// elem is actually elem.style ... set the style
		// Using attr for specific style information is now deprecated. Use style insead.
		return jQuery.style(elem, name, value);
	}
});
var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /(<([\w:]+)[^>]*?)\/>/g,
	rselfClosing = /^(?:abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&\w+;/,
	fcloseTag = function(all, front, tag){
		return rselfClosing.test(tag) ?
			all :
			front + "></" + tag + ">";
	},
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		_default: [ 0, "", "" ]
	};

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		var ret = "";

		jQuery.each( this, function() {
			// Get the text from text nodes and CDATA nodes
			if ( this.nodeType === 3 || this.nodeType === 4 ) {
				ret += this.nodeValue;

			// Traverse everything else, except comment nodes
			} else if ( this.nodeType !== 8 ) {
				ret += jQuery.fn.text.call( this.childNodes );
			}
		});

		return ret;
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function() {
				jQuery(this).wrapAll( html.apply(this, arguments) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone();

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function(){
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append(this);
		}

		return this;
	},

	wrapInner: function( html ) {
		return this.each(function(){
			jQuery( this ).contents().wrapAll( html );
		});
	},

	wrap: function( html ) {
		return this.each(function(){
			jQuery( this ).wrapAll( html );
		});
	},

	unwrap: function() {
		return this.parent().each(function(){
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},
	
	append: function() {
		return this.domManip(arguments, true, function(elem){
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function(elem){
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function(elem){
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery(arguments[0]);
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function(elem){
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery(arguments[0]).toArray() );
			return set;
		}
	},

	clone: function( events ) {
		// Do the clone
		var ret = this.map(function(){
			if ( !jQuery.support.noCloneEvent && !jQuery.isXMLDoc(this) ) {
				// IE copies events bound via attachEvent when
				// using cloneNode. Calling detachEvent on the
				// clone will also remove the events from the orignal
				// In order to get around this, we use innerHTML.
				// Unfortunately, this means some modifications to
				// attributes in IE that are actually only stored
				// as properties will not be copied (such as the
				// the name attribute on an input).
				var html = this.outerHTML, ownerDocument = this.ownerDocument;
				if ( !html ) {
					var div = ownerDocument.createElement("div");
					div.appendChild( this.cloneNode(true) );
					html = div.innerHTML;
				}

				return jQuery.clean([html.replace(rinlinejQuery, "")
					.replace(rleadingWhitespace, "")], ownerDocument)[0];
			} else {
				return this.cloneNode(true);
			}
		});

		// Copy the events from the original to the clone
		if ( events === true ) {
			cloneCopyEvent( this, ret );
			cloneCopyEvent( this.find("*"), ret.find("*") );
		}

		// Return the cloned set
		return ret;
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !/<script/i.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			return this.after( value ).remove();
		} else {
			return this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value );
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, value = args[0], scripts = [];

		if ( jQuery.isFunction(value) ) {
			return this.each(function() {
				args[0] = value.call(this);
				return jQuery(this).domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			// If we're in a fragment, just use that instead of building a new one
			if ( args[0] && args[0].parentNode && args[0].parentNode.nodeType === 11 ) {
				results = { fragment: args[0].parentNode };
			} else {
				results = buildFragment( args, this, scripts );
			}

			first = results.fragment.firstChild;

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						results.cacheable || this.length > 1 || i > 0 ?
							results.fragment.cloneNode(true) :
							results.fragment
					);
				}
			}

			if ( scripts ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;

		function root( elem, cur ) {
			return jQuery.nodeName(elem, "table") ?
				(elem.getElementsByTagName("tbody")[0] ||
				elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
				elem;
		}
	}
});

function cloneCopyEvent(orig, ret) {
	var i = 0;

	ret.each(function(){
		if ( this.nodeName !== orig[i].nodeName ) {
			return;
		}

		var events = jQuery.data( orig[i], "events" );

		for ( var type in events ) {
			for ( var handler in events[ type ] ) {
				jQuery.event.add( this, type, events[ type ][ handler ], events[ type ][ handler ].data );
			}
		}
	});
}

function buildFragment(args, nodes, scripts){
	var fragment, cacheable, cached, cacheresults, doc;

	if ( args.length === 1 && typeof args[0] === "string" && args[0].length < 512 && args[0].indexOf("<option") < 0 ) {
		cacheable = true;
		cacheresults = jQuery.fragments[ args[0] ];
		if ( cacheresults ) {
			if ( cacheresults !== 1 ) {
				fragment = cacheresults;
			}
			cached = true;
		}
	}

	if ( !fragment ) {
		doc = (nodes && nodes[0] ? nodes[0].ownerDocument || nodes[0] : document);
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ args[0] ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
}

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function(name, original){
	jQuery.fn[ name ] = function( selector ) {
		var ret = [], insert = jQuery( selector );

		for ( var i = 0, l = insert.length; i < l; i++ ) {
			var elems = (i > 0 ? this.clone(true) : this).get();
			jQuery.fn[ original ].apply( jQuery(insert[i]), elems );
			ret = ret.concat( elems );
		}
		return this.pushStack( ret, name, insert.selector );
	};
});

jQuery.each({
	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		if ( !selector || jQuery.filter( selector, [ this ] ).length ) {
			if ( !keepData && this.nodeType === 1 ) {
				cleanData( this.getElementsByTagName("*") );
				cleanData( [ this ] );
			}

			if ( this.parentNode ) {
				 this.parentNode.removeChild( this );
			}
		}
	},

	empty: function() {
		// Remove element nodes and prevent memory leaks
		if ( this.nodeType === 1 ) {
			cleanData( this.getElementsByTagName("*") );
		}

		// Remove any remaining nodes
		while ( this.firstChild ) {
			this.removeChild( this.firstChild );
		}
	}
}, function(name, fn){
	jQuery.fn[ name ] = function(){
		return this.each( fn, arguments );
	};
});

jQuery.extend({
	clean: function( elems, context, fragment, scripts ) {
		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [], div = context.createElement("div");

		jQuery.each(elems, function(i, elem){
			if ( typeof elem === "number" ) {
				elem += '';
			}

			if ( !elem ) { return; }

			// Convert html string into DOM nodes
			if ( typeof elem === "string" && !rhtml.test( elem ) ) {
				elem = context.createTextNode( elem );

			} else if ( typeof elem === "string" ) {
				// Fix "XHTML"-style tags in all browsers
				elem = elem.replace(rxhtmlTag, fcloseTag);

				// Trim whitespace, otherwise indexOf won't work as expected
				var tag = (rtagName.exec( elem ) || ["", ""])[1].toLowerCase(),
					wrap = wrapMap[ tag ] || wrapMap._default,
					depth = wrap[0];

				// Go to html and back, then peel off extra wrappers
				div.innerHTML = wrap[1] + elem + wrap[2];

				// Move to the right depth
				while ( depth-- ) {
					div = div.lastChild;
				}

				// Remove IE's autoinserted <tbody> from table fragments
				if ( !jQuery.support.tbody ) {

					// String was a <table>, *may* have spurious <tbody>
					var hasBody = rtbody.test(elem),
						tbody = tag === "table" && !hasBody ?
							div.firstChild && div.firstChild.childNodes :

							// String was a bare <thead> or <tfoot>
							wrap[1] == "<table>" && !hasBody ?
								div.childNodes :
								[];

					for ( var j = tbody.length - 1; j >= 0 ; --j ) {
						if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
							tbody[ j ].parentNode.removeChild( tbody[ j ] );
						}
					}

				}

				// IE completely kills leading whitespace when innerHTML is used
				if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
					div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
				}

				elem = jQuery.makeArray( div.childNodes );
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}

		});

		if ( fragment ) {
			for ( var i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );
				} else {
					if ( ret[i].nodeType === 1 ) {
						ret.splice.apply( ret, [i + 1, 0].concat(jQuery.makeArray(ret[i].getElementsByTagName("script"))) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	}
});

function cleanData( elems ) {
	for ( var i = 0, elem, id; (elem = elems[i]) != null; i++ ) {
		if ( (id = elem[expando]) ) {
			delete jQuery.cache[ id ];
		}
	}
}
// exclude the following css properties to add px
var rexclude = /z-?index|font-?weight|opacity|zoom|line-?height/i,
	ralpha = /alpha\([^)]*\)/,
	ropacity = /opacity=([^)]*)/,
	rfloat = /float/i,
	rdashAlpha = /-([a-z])/ig,
	rupper = /([A-Z])/g,
	rnumpx = /^\d+(?:px)?$/i,
	rnum = /^\d/,

	// cache check for defaultView.getComputedStyle
	getComputedStyle = document.defaultView && document.defaultView.getComputedStyle,
	// normalize float css property
	styleFloat = jQuery.support.cssFloat ? "cssFloat" : "styleFloat",
	fcamelCase = function(all, letter){
		return letter.toUpperCase();
	};

jQuery.fn.css = function( name, value ) {
	return access( this, name, value, true, function( elem, name, value ) {
		if (value === undefined) {
			return jQuery.css( elem, name );
		}
		
		if ( typeof value === "number" && !rexclude.test(name) ) {
			value += "px";
		}

		jQuery.style( elem, name, value );
	});
};

jQuery.extend({
	style: function( elem, name, value ) {
		// don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
			return undefined;
		}

		// ignore negative width and height values #1599
		if ( (name === "width" || name === "height") && parseFloat(value) < 0 ) {
			value = undefined;
		}

		var style = elem.style || elem, set = value !== undefined;

		// IE uses filters for opacity
		if ( !jQuery.support.opacity && name === "opacity" ) {
			if ( set ) {
				// IE has trouble with opacity if it does not have layout
				// Force it by setting the zoom level
				style.zoom = 1;

				// Set the alpha filter to set the opacity
				var opacity = parseInt( value, 10 ) + '' === "NaN" ? "" : "alpha(opacity=" + value * 100 + ")";
				filter = style.filter || jQuery.curCSS( elem, 'filter' ) || ""
				style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : opacity;
			}

			return style.filter && style.filter.indexOf("opacity=") >= 0 ?
				(parseFloat( ropacity.exec(style.filter)[1] ) / 100) + '':
				"";
		}

		// Make sure we're using the right name for getting the float value
		if ( rfloat.test( name ) ) {
			name = styleFloat;
		}

		name = name.replace(rdashAlpha, fcamelCase);

		if ( set ) {
			style[ name ] = value;
		}

		return style[ name ];
	},

	css: function( elem, name, force, extra ) {
		if ( name === "width" || name === "height" ) {
			var val, props = { position: "absolute", visibility: "hidden", display:"block" }, which = name === "width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ];

			function getWH() {
				val = name === "width" ? elem.offsetWidth : elem.offsetHeight;

				if ( extra === "border" ) { return; }

				jQuery.each( which, function() {
					if ( !extra ) {
						val -= parseFloat(jQuery.curCSS( elem, "padding" + this, true)) || 0;
					}

					if ( extra === "margin" ) {
						val += parseFloat(jQuery.curCSS( elem, "margin" + this, true)) || 0;
					} else {
						val -= parseFloat(jQuery.curCSS( elem, "border" + this + "Width", true)) || 0;
					}
				});
			}

			if ( elem.offsetWidth !== 0 ) {
				getWH();
			} else {
				jQuery.swap( elem, props, getWH );
			}

			return Math.max(0, Math.round(val));
		}

		return jQuery.curCSS( elem, name, force );
	},

	curCSS: function( elem, name, force ) {
		var ret, style = elem.style, filter;

		// IE uses filters for opacity
		if ( !jQuery.support.opacity && name === "opacity" && elem.currentStyle ) {
			ret = ropacity.test(elem.currentStyle.filter || "") ?
				(parseFloat(RegExp.$1) / 100) + "" :
				"";

			return ret === "" ?
				"1" :
				ret;
		}

		// Make sure we're using the right name for getting the float value
		if ( rfloat.test( name ) ) {
			name = styleFloat;
		}

		if ( !force && style && style[ name ] ) {
			ret = style[ name ];

		} else if ( getComputedStyle ) {

			// Only "float" is needed here
			if ( rfloat.test( name ) ) {
				name = "float";
			}

			name = name.replace( rupper, "-$1" ).toLowerCase();

			var computedStyle = elem.ownerDocument.defaultView.getComputedStyle( elem, null );

			if ( computedStyle ) {
				ret = computedStyle.getPropertyValue( name );
			}

			// We should always get a number back from opacity
			if ( name === "opacity" && ret === "" ) {
				ret = "1";
			}

		} else if ( elem.currentStyle ) {
			var camelCase = name.replace(rdashAlpha, fcamelCase);

			ret = elem.currentStyle[ name ] || elem.currentStyle[ camelCase ];

			// From the awesome hack by Dean Edwards
			// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

			// If we're not dealing with a regular pixel number
			// but a number that has a weird ending, we need to convert it to pixels
			if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {
				// Remember the original values
				var left = style.left, rsLeft = elem.runtimeStyle.left;

				// Put in the new values to get a computed value out
				elem.runtimeStyle.left = elem.currentStyle.left;
				style.left = camelCase === "fontSize" ? "1em" : (ret || 0);
				ret = style.pixelLeft + "px";

				// Revert the changed values
				style.left = left;
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( var name in options ) {
			elem.style[ name ] = old[ name ];
		}
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function(elem){
		var width = elem.offsetWidth, height = elem.offsetHeight,
			 force = /^tr$/i.test( elem.nodeName ); // ticket #4512

		return width === 0 && height === 0 && !force ?
			true :
				width !== 0 && height !== 0 && !force ?
					false :
						jQuery.curCSS(elem, "display") === "none";
	};

	jQuery.expr.filters.visible = function(elem){
		return !jQuery.expr.filters.hidden(elem);
	};
}
var jsc = now(),
	rscript = /<script(.|\s)*?\/script>/g,
	rselectTextarea = /select|textarea/i,
	rinput = /text|hidden|password|search/i,
	jsre = /=\?(&|$)/,
	rquery = /\?/,
	rts = /(\?|&)_=.*?(&|$)/,
	rurl = /^(\w+:)?\/\/([^\/?#]+)/,
	r20 = /%20/g;

jQuery.fn.extend({
	// Keep a copy of the old load
	_load: jQuery.fn.load,

	load: function( url, params, callback ) {
		if ( typeof url !== "string" ) {
			return this._load( url );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf(" ");
		if ( off >= 0 ) {
			var selector = url.slice(off, url.length);
			url = url.slice(0, off);
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = null;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params );
				type = "POST";
			}
		}

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			context:this,
			complete: function(res, status){
				// If successful, inject the HTML into all the matched elements
				if ( status === "success" || status === "notmodified" ) {
					// See if a selector was specified
					this.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div />")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(res.responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						res.responseText );
				}

				if ( callback ) {
					this.each( callback, [res.responseText, status, res] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param(this.serializeArray());
	},
	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray(this.elements) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				(this.checked || rselectTextarea.test(this.nodeName) ||
					rinput.test(this.type));
		})
		.map(function(i, elem){
			var val = jQuery(this).val();

			return val == null ?
				null :
				jQuery.isArray(val) ?
					jQuery.map( val, function(val, i){
						return {name: elem.name, value: val};
					}) :
					{name: elem.name, value: val};
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(i,o){
	jQuery.fn[o] = function(f){
		return this.bind(o, f);
	};
});

jQuery.extend({

	get: function( url, data, callback, type ) {
		// shift arguments if data argument was omited
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = null;
		}

		return jQuery.ajax({
			type: "GET",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	getScript: function( url, callback ) {
		return jQuery.get(url, null, callback, "script");
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get(url, data, callback, "json");
	},

	post: function( url, data, callback, type ) {
		// shift arguments if data argument was omited
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = {};
		}

		return jQuery.ajax({
			type: "POST",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	ajaxSetup: function( settings ) {
		jQuery.extend( jQuery.ajaxSettings, settings );
	},

	ajaxSettings: {
		url: location.href,
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		username: null,
		password: null,
		*/
		// Create the request object; Microsoft failed to properly
		// implement the XMLHttpRequest in IE7, so we use the ActiveXObject when it is available
		// This function can be overriden by calling jQuery.ajaxSetup
		xhr: function(){
			return window.ActiveXObject ?
				new ActiveXObject("Microsoft.XMLHTTP") :
				new XMLHttpRequest();
		},
		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			script: "text/javascript, application/javascript",
			json: "application/json, text/javascript",
			text: "text/plain",
			_default: "*/*"
		}
	},

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajax: function( s ) {
		// Extend the settings, but re-extend 's' so that it can be
		// checked again later (in the test suite, specifically)
		s = jQuery.extend(true, {}, jQuery.ajaxSettings, s);
		
		var jsonp, status, data,
			callbackContext = s.context || window,
			type = s.type.toUpperCase();

		// convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param(s.data);
		}

		// Handle JSONP Parameter Callbacks
		if ( s.dataType === "jsonp" ) {
			if ( type === "GET" ) {
				if ( !jsre.test( s.url ) ) {
					s.url += (rquery.test( s.url ) ? "&" : "?") + (s.jsonp || "callback") + "=?";
				}
			} else if ( !s.data || !jsre.test(s.data) ) {
				s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
			}
			s.dataType = "json";
		}

		// Build temporary JSONP function
		if ( s.dataType === "json" && (s.data && jsre.test(s.data) || jsre.test(s.url)) ) {
			jsonp = "jsonp" + jsc++;

			// Replace the =? sequence both in the query string and the data
			if ( s.data ) {
				s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1");
			}

			s.url = s.url.replace(jsre, "=" + jsonp + "$1");

			// We need to make sure
			// that a JSONP style response is executed properly
			s.dataType = "script";

			// Handle JSONP-style loading
			window[ jsonp ] = function(tmp){
				data = tmp;
				success();
				complete();
				// Garbage collect
				window[ jsonp ] = undefined;
				try{ delete window[ jsonp ]; } catch(e){}
				if ( head ) {
					head.removeChild( script );
				}
			};
		}

		if ( s.dataType === "script" && s.cache === null ) {
			s.cache = false;
		}

		if ( s.cache === false && type === "GET" ) {
			var ts = now();

			// try replacing _= if it is there
			var ret = s.url.replace(rts, "$1_=" + ts + "$2");

			// if nothing was replaced, add timestamp to the end
			s.url = ret + ((ret === s.url) ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
		}

		// If data is available, append data to url for get requests
		if ( s.data && type === "GET" ) {
			s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
		}

		// Watch for a new set of requests
		if ( s.global && ! jQuery.active++ ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Matches an absolute URL, and saves the domain
		var parts = rurl.exec( s.url ),
			remote = parts && (parts[1] && parts[1] !== location.protocol || parts[2] !== location.host);

		// If we're requesting a remote document
		// and trying to load JSON or Script with a GET
		if ( s.dataType === "script" && type === "GET" && remote ) {
			var head = document.getElementsByTagName("head")[0] || document.documentElement;
			var script = document.createElement("script");
			script.src = s.url;
			if ( s.scriptCharset ) {
				script.charset = s.scriptCharset;
			}

			// Handle Script loading
			if ( !jsonp ) {
				var done = false;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function(){
					if ( !done && (!this.readyState ||
							this.readyState === "loaded" || this.readyState === "complete") ) {
						done = true;
						success();
						complete();

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}
					}
				};
			}

			// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
			// This arises when a base node is used (#2709 and #4378).
			head.insertBefore( script, head.firstChild );

			// We handle everything using the script element injection
			return undefined;
		}

		var requestDone = false;

		// Create the request object
		var xhr = s.xhr();

		// Open the socket
		// Passing null username, generates a login popup on Opera (#2865)
		if ( s.username ) {
			xhr.open(type, s.url, s.async, s.username, s.password);
		} else {
			xhr.open(type, s.url, s.async);
		}

		// Need an extra try/catch for cross domain requests in Firefox 3
		try {
			// Set the correct header, if data is being sent
			if ( s.data ) {
				xhr.setRequestHeader("Content-Type", s.contentType);
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[s.url] ) {
					xhr.setRequestHeader("If-Modified-Since", jQuery.lastModified[s.url]);
				}

				if ( jQuery.etag[s.url] ) {
					xhr.setRequestHeader("If-None-Match", jQuery.etag[s.url]);
				}
			}

			// Set header so the called script knows that it's an XMLHttpRequest
			// Only send the header if it's not a remote XHR
			if ( !remote ) {
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			}

			// Set the Accepts header for the server, depending on the dataType
			xhr.setRequestHeader("Accept", s.dataType && s.accepts[ s.dataType ] ?
				s.accepts[ s.dataType ] + ", */*" :
				s.accepts._default );
		} catch(e){}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && s.beforeSend.call(callbackContext, xhr, s) === false ) {
			// Handle the global AJAX counter
			if ( s.global && ! --jQuery.active ) {
				jQuery.event.trigger( "ajaxStop" );
			}

			// close opended socket
			xhr.abort();
			return false;
		}

		if ( s.global ) {
			trigger("ajaxSend", [xhr, s]);
		}

		// Wait for a response to come back
		var onreadystatechange = function(isTimeout){
			// The request was aborted, clear the interval and decrement jQuery.active
			if ( !xhr || xhr.readyState === 0 ) {
				if ( ival ) {
					// clear poll interval
					clearInterval( ival );
					ival = null;

					// Handle the global AJAX counter
					if ( s.global && ! --jQuery.active ) {
						jQuery.event.trigger( "ajaxStop" );
					}
				}

			// The transfer is complete and the data is available, or the request timed out
			} else if ( !requestDone && xhr && (xhr.readyState === 4 || isTimeout === "timeout") ) {
				requestDone = true;

				// clear poll interval
				if (ival) {
					clearInterval(ival);
					ival = null;
				}

				status = isTimeout === "timeout" ?
					"timeout" :
					!jQuery.httpSuccess( xhr ) ?
						"error" :
						s.ifModified && jQuery.httpNotModified( xhr, s.url ) ?
							"notmodified" :
							"success";

				if ( status === "success" ) {
					// Watch for, and catch, XML document parse errors
					try {
						// process the data (runs the xml through httpData regardless of callback)
						data = jQuery.httpData( xhr, s.dataType, s );
					} catch(e) {
						status = "parsererror";
					}
				}

				// Make sure that the request was successful or notmodified
				if ( status === "success" || status === "notmodified" ) {
					// JSONP handles its own success callback
					if ( !jsonp ) {
						success();
					}
				} else {
					jQuery.handleError(s, xhr, status);
				}

				// Fire the complete handlers
				complete();

				if ( isTimeout ) {
					xhr.abort();
				}

				// Stop memory leaks
				if ( s.async ) {
					xhr = null;
				}
			}
		};

		if ( s.async ) {
			// don't attach the handler to the request, just poll it instead
			var ival = setInterval(onreadystatechange, 13);

			// Timeout checker
			if ( s.timeout > 0 ) {
				setTimeout(function(){
					// Check to see if the request is still happening
					if ( xhr && !requestDone ) {
						onreadystatechange( "timeout" );
					}
				}, s.timeout);
			}
		}

		// Send the data
		try {
			xhr.send( type === "POST" || type === "PUT" ? s.data : null );
		} catch(e) {
			jQuery.handleError(s, xhr, null, e);
			// Fire the complete handlers
			complete();
		}

		// firefox 1.5 doesn't fire statechange for sync requests
		if ( !s.async ) {
			onreadystatechange();
		}

		function success(){
			// If a local callback was specified, fire it and pass it the data
			if ( s.success ) {
				s.success.call( callbackContext, data, status, xhr );
			}

			// Fire the global callback
			if ( s.global ) {
				trigger( "ajaxSuccess", [xhr, s] );
			}
		}

		function complete(){
			// Process result
			if ( s.complete ) {
				s.complete.call( callbackContext, xhr, status);
			}

			// The request was completed
			if ( s.global ) {
				trigger( "ajaxComplete", [xhr, s] );
			}

			// Handle the global AJAX counter
			if ( s.global && ! --jQuery.active ) {
				jQuery.event.trigger( "ajaxStop" );
			}
		}
		
		function trigger(type, args){
			(s.context ? jQuery(s.context) : jQuery.event).trigger(type, args);
		}

		// return XMLHttpRequest to allow aborting the request etc.
		return xhr;
	},

	handleError: function( s, xhr, status, e ) {
		// If a local callback was specified, fire it
		if ( s.error ) {
			s.error.call( s.context || window, xhr, status, e );
		}

		// Fire the global callback
		if ( s.global ) {
			(s.context ? jQuery(s.context) : jQuery.event).trigger( "ajaxError", [xhr, s, e] );
		}
	},

	// Counter for holding the number of active queries
	active: 0,

	// Determines if an XMLHttpRequest was successful or not
	httpSuccess: function( xhr ) {
		try {
			// IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
			return !xhr.status && location.protocol === "file:" ||
				// Opera returns 0 when status is 304
				( xhr.status >= 200 && xhr.status < 300 ) ||
				xhr.status === 304 || xhr.status === 1223 || xhr.status === 0;
		} catch(e){}

		return false;
	},

	// Determines if an XMLHttpRequest returns NotModified
	httpNotModified: function( xhr, url ) {
		var lastModified = xhr.getResponseHeader("Last-Modified"),
			etag = xhr.getResponseHeader("Etag");

		if ( lastModified ) {
			jQuery.lastModified[url] = lastModified;
		}

		if ( etag ) {
			jQuery.etag[url] = etag;
		}

		// Opera returns 0 when status is 304
		return xhr.status === 304 || xhr.status === 0;
	},

	httpData: function( xhr, type, s ) {
		var ct = xhr.getResponseHeader("content-type"),
			xml = type === "xml" || !type && ct && ct.indexOf("xml") >= 0,
			data = xml ? xhr.responseXML : xhr.responseText;

		if ( xml && data.documentElement.nodeName === "parsererror" ) {
			throw "parsererror";
		}

		// Allow a pre-filtering function to sanitize the response
		// s is checked to keep backwards compatibility
		if ( s && s.dataFilter ) {
			data = s.dataFilter( data, type );
		}

		// The filter can actually parse the response
		if ( typeof data === "string" ) {

			// If the type is "script", eval it in global context
			if ( type === "script" ) {
				jQuery.globalEval( data );
			}

			// Get the JavaScript object, if JSON is used.
			if ( type === "json" ) {
				if ( typeof JSON === "object" && JSON.parse ) {
					data = JSON.parse( data );
				} else {
					data = (new Function("return " + data))();
				}
			}
		}

		return data;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a ) {
		var s = [],
			param_traditional = jQuery.param.traditional;
		
		function add( key, value ){
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction(value) ? value() : value;
			s[ s.length ] = encodeURIComponent(key) + '=' + encodeURIComponent(value);
		}
		
		// If an array was passed in, assume that it is an array
		// of form elements
		if ( jQuery.isArray(a) || a.jquery ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});
			
		} else {
			// Encode parameters from object, recursively. If
			// jQuery.param.traditional is set, encode the "old" way
			// (the way 1.3.2 or older did it)
			jQuery.each( a, function buildParams( prefix, obj ) {
				
				if ( jQuery.isArray(obj) ) {
					jQuery.each( obj, function(i,v){
						// Due to rails' limited request param syntax, numeric array
						// indices are not supported. To avoid serialization ambiguity
						// issues, serialized arrays can only contain scalar values. php
						// does not have this issue, but we should go with the lowest
						// common denominator
						add( prefix + ( param_traditional ? "" : "[]" ), v );
					});
					
				} else if ( typeof obj == "object" ) {
					if ( param_traditional ) {
						add( prefix, obj );
						
					} else {
						jQuery.each( obj, function(k,v){
							buildParams( prefix ? prefix + "[" + k + "]" : k, v );
						});
					}
				} else {
					add( prefix, obj );
				}
			});
		}
		// Return the resulting serialization
		return s.join("&").replace(r20, "+");
	}

});
var elemdisplay = {},
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	];

function genFx( type, num ){
	var obj = {};
	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function(){
		obj[ this ] = type;
	});
	return obj;
}

jQuery.fn.extend({
	show: function( speed, callback ) {
		if ( speed != null ) {
			return this.animate( genFx("show", 3), speed, callback);
		} else {
			for ( var i = 0, l = this.length; i < l; i++ ){
				var old = jQuery.data(this[i], "olddisplay");

				this[i].style.display = old || "";

				if ( jQuery.css(this[i], "display") === "none" ) {
					var nodeName = this[i].nodeName, display;

					if ( elemdisplay[ nodeName ] ) {
						display = elemdisplay[ nodeName ];
					} else {
						var elem = jQuery("<" + nodeName + " />").appendTo("body");

						display = elem.css("display");
						if ( display === "none" ) {
							display = "block";
						}
						elem.remove();

						elemdisplay[ nodeName ] = display;
					}

					jQuery.data(this[i], "olddisplay", display);
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( var i = 0, l = this.length; i < l; i++ ){
				this[i].style.display = jQuery.data(this[i], "olddisplay") || "";
			}

			return this;
		}
	},

	hide: function( speed, callback ) {
		if ( speed != null ) {
			return this.animate( genFx("hide", 3), speed, callback);
		} else {
			for ( var i = 0, l = this.length; i < l; i++ ){
				var old = jQuery.data(this[i], "olddisplay");
				if ( !old && old !== "none" ){
					jQuery.data(this[i], "olddisplay", jQuery.css(this[i], "display"));
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( var i = 0, l = this.length; i < l; i++ ){
				this[i].style.display = "none";
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2 ){
		var bool = typeof fn === "boolean";

		return jQuery.isFunction(fn) && jQuery.isFunction(fn2) ?
			this._toggle.apply( this, arguments ) :
			fn == null || bool ?
				this.each(function(){
					var state = bool ? fn : jQuery(this).is(":hidden");
					jQuery(this)[ state ? "show" : "hide" ]();
				}) :
				this.animate(genFx("toggle", 3), fn, fn2);
	},

	fadeTo: function(speed,to,callback){
		return this.filter(":hidden").css('opacity', 0).show().end()
					.animate({opacity: to}, speed, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);

		return this[ optall.queue === false ? "each" : "queue" ](function(){

			var opt = jQuery.extend({}, optall), p,
				hidden = this.nodeType == 1 && jQuery(this).is(":hidden"),
				self = this;

			for ( p in prop ) {
				var name = p.replace(rdashAlpha, fcamelCase);

				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
					p = name;
				}

				if ( prop[p] == "hide" && hidden || prop[p] == "show" && !hidden ) {
					return opt.complete.call(this);
				}
				if ( ( p == "height" || p == "width" ) && this.style ) {
					// Store display property
					opt.display = jQuery.css(this, "display");

					// Make sure that nothing sneaks out
					opt.overflow = this.style.overflow;
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}
			opt.curAnim = jQuery.extend({}, prop);

			jQuery.each( prop, function(name, val){
				var e = new jQuery.fx( self, opt, name );

				if ( /toggle|show|hide/.test(val) ) {
					e[ val == "toggle" ? hidden ? "show" : "hide" : val ]( prop );
				} else {
					var parts = /^([+-]=)?([\d+-.]+)(.*)$/.exec(val),
						start = e.cur(true) || 0;

					if ( parts ) {
						var end = parseFloat(parts[2]),
							unit = parts[3] || "px";

						// We need to compute starting value
						if ( unit != "px" ) {
							self.style[ name ] = (end || 1) + unit;
							start = ((end || 1) / e.cur(true)) * start;
							self.style[ name ] = start + unit;
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ((parts[1] == "-=" ? -1 : 1) * end) + start;
						}
						e.custom( start, end, unit );
					} else {
						e.custom( start, val, "" );
					}
				}
			});

			if ( jQuery.isEmptyObject( prop ) ) {
				return optall.complete.call(this);
			}

			// For JS strict compliance
			return true;
		});
	},

	stop: function(clearQueue, gotoEnd){
		var timers = jQuery.timers;

		if (clearQueue) {
			this.queue([]);
		}
		this.each(function(){
			// go in reverse order so anything added to the queue during the loop is ignored
			for ( var i = timers.length - 1; i >= 0; i-- ) {
				if ( timers[i].elem == this ) {
					if (gotoEnd) {
						// force the next step to be the last
						timers[i](true);
					}
					timers.splice(i, 1);
				}
			}
		});

		// start the next in the queue if the last step wasn't forced
		if (!gotoEnd) {
			this.dequeue();
		}
		return this;
	}

});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show", 1),
	slideUp: genFx("hide", 1),
	slideToggle: genFx("toggle", 1),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" }
}, function( name, props ){
	jQuery.fn[ name ] = function( speed, callback ){
		return this.animate( props, speed, callback );
	};
});

jQuery.extend({

	speed: function(speed, easing, fn) {
		var opt = typeof speed === "object" ? speed : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			jQuery.fx.speeds[opt.duration] || jQuery.fx.speeds._default;

		// Queueing
		opt.old = opt.complete;
		opt.complete = function(){
			if ( opt.queue !== false ) {
				jQuery(this).dequeue();
			}
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ){
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		if ( !options.orig ) {
			options.orig = {};
		}
	}

});

jQuery.fx.prototype = {

	// Simple function for setting a style value
	update: function(){
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}
		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );

		// Set display property to block for height/width animations
		if ( ( this.prop == "height" || this.prop == "width" ) && this.elem.style ) {
			this.elem.style.display = "block";
		}
	},

	// Get the current size
	cur: function(force){
		if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
			return this.elem[ this.prop ];
		}
		var r = parseFloat(jQuery.css(this.elem, this.prop, force));
		return r && r > -10000 ? r : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0;
	},

	// Start an animation from one number to another
	custom: function(from, to, unit){
		this.startTime = now();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || "px";
		this.now = this.start;
		this.pos = this.state = 0;

		var self = this;
		function t(gotoEnd){
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval(jQuery.fx.tick, 13);
		}
	},

	// Simple 'show' function
	show: function(){
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any
		// flash of content
		this.custom(this.prop == "width" || this.prop == "height" ? 1 : 0, this.cur());

		// Start by showing the element
		jQuery(this.elem).show();
	},

	// Simple 'hide' function
	hide: function(){
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom(this.cur(), 0);
	},

	// Each step of an animation
	step: function(gotoEnd){
		var t = now();

		if ( gotoEnd || t >= this.options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			this.options.curAnim[ this.prop ] = true;

			var done = true;
			for ( var i in this.options.curAnim ) {
				if ( this.options.curAnim[i] !== true ) {
					done = false;
				}
			}
			if ( done ) {
				if ( this.options.display != null ) {
					// Reset the overflow
					this.elem.style.overflow = this.options.overflow;

					// Reset the display
					this.elem.style.display = this.options.display;
					if ( jQuery.css(this.elem, "display") == "none" ) {
						this.elem.style.display = "block";
					}
				}

				// Hide the element if the "hide" operation was done
				if ( this.options.hide ) {
					jQuery(this.elem).hide();
				}
				// Reset the properties, if the item has been hidden or shown
				if ( this.options.hide || this.options.show ){
					for ( var p in this.options.curAnim ) {
						jQuery.style(this.elem, p, this.options.orig[p]);
					}
				}
				// Execute the complete function
				this.options.complete.call( this.elem );
			}

			return false;
		} else {
			var n = t - this.startTime;
			this.state = n / this.options.duration;

			// Perform the easing function, defaults to swing
			this.pos = jQuery.easing[this.options.easing || (jQuery.easing.swing ? "swing" : "linear")](this.state, n, 0, 1, this.options.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);

			// Perform the next step of the animation
			this.update();
		}

		return true;
	}

};

jQuery.extend( jQuery.fx, {

	tick:function(){
		var timers = jQuery.timers;

		for ( var i = 0; i < timers.length; i++ ) {
			if ( !timers[i]() ) {
				timers.splice(i--, 1);
			}
		}
		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},
		
	stop:function(){
		clearInterval( timerId );
		timerId = null;
	},
	
	speeds:{
		slow: 600,
 		fast: 200,
 		// Default speed
 		_default: 400
	},

	step: {

		opacity: function(fx){
			jQuery.style(fx.elem, "opacity", fx.now);
		},

		_default: function(fx){
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = fx.now + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function(elem){
		return jQuery.grep(jQuery.timers, function(fn){
			return elem === fn.elem;
		}).length;
	};
}
if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];
		if ( !elem || !elem.ownerDocument ) { return null; }
		if ( options ) { 
			return this.each(function() {
				jQuery.offset.setOffset( this, options );
			});
		}
		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		var box = elem.getBoundingClientRect(), doc = elem.ownerDocument, body = doc.body, docElem = doc.documentElement,
			clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
			top  = box.top  + (self.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop ) - clientTop,
			left = box.left + (self.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft) - clientLeft;
		return { top: top, left: left };
	};
} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];
		if ( !elem || !elem.ownerDocument ) { return null; }
		if ( options ) { 
			return this.each(function() {
				jQuery.offset.setOffset( this, options );
			});
		}
		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		jQuery.offset.initialize();

		var offsetParent = elem.offsetParent, prevOffsetParent = elem,
			doc = elem.ownerDocument, computedStyle, docElem = doc.documentElement,
			body = doc.body, defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop, left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) { break; }

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && /^t(able|d|h)$/i.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent, offsetParent = elem.offsetParent;
			}

			if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {
	initialize: function() {
		var body = document.body, container = document.createElement('div'), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat( jQuery.curCSS(body, 'marginTop', true) ) || 0,
			html = '<div style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;"><div></div></div><table style="position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;" cellpadding="0" cellspacing="0"><tr><td></td></tr></table>';

		jQuery.extend( container.style, { position: 'absolute', top: 0, left: 0, margin: 0, border: 0, width: '1px', height: '1px', visibility: 'hidden' } );

		container.innerHTML = html;
		body.insertBefore( container, body.firstChild );
		innerDiv = container.firstChild;
		checkDiv = innerDiv.firstChild;
		td = innerDiv.nextSibling.firstChild.firstChild;

		this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
		this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

		checkDiv.style.position = 'fixed', checkDiv.style.top = '20px';
		// safari subtracts parent border width here which is 5px
		this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
		checkDiv.style.position = checkDiv.style.top = '';

		innerDiv.style.overflow = 'hidden', innerDiv.style.position = 'relative';
		this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

		this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

		body.removeChild( container );
		body = container = innerDiv = checkDiv = table = td = null;
		jQuery.offset.initialize = function(){};
	},

	bodyOffset: function( body ) {
		var top = body.offsetTop, left = body.offsetLeft;

		jQuery.offset.initialize();

		if ( jQuery.offset.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.curCSS(body, 'marginTop',  true) ) || 0;
			left += parseFloat( jQuery.curCSS(body, 'marginLeft', true) ) || 0;
		}

		return { top: top, left: left };
	},
	
	setOffset: function( elem, options ) {
		// set position first, in-case top/left are set even on static elem
		if ( /static/.test( jQuery.curCSS( elem, 'position' ) ) ) {
			elem.style.position = 'relative';
		}
		var curElem   = jQuery( elem ),
			curOffset = curElem.offset(),
			curTop    = parseInt( jQuery.curCSS( elem, 'top',  true ), 10 ) || 0,
			curLeft   = parseInt( jQuery.curCSS( elem, 'left', true ), 10)  || 0,
			props     = {
				top:  (options.top  - curOffset.top)  + curTop,
				left: (options.left - curOffset.left) + curLeft
			};
		
		if ( 'using' in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({
	position: function() {
		if ( !this[0] ) { return null; }

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = /^body|html$/i.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.curCSS(elem, 'marginTop',  true) ) || 0;
		offset.left -= parseFloat( jQuery.curCSS(elem, 'marginLeft', true) ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.curCSS(offsetParent[0], 'borderTopWidth',  true) ) || 0;
		parentOffset.left += parseFloat( jQuery.curCSS(offsetParent[0], 'borderLeftWidth', true) ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function(){
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!/^body|html$/i.test(offsetParent.nodeName) && jQuery.css(offsetParent, 'position') === 'static') ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ['Left', 'Top'], function(i, name) {
	var method = 'scroll' + name;

	jQuery.fn[ method ] = function(val) {
		var elem = this[0], win;
		
		if ( !elem ) { return null; }

		if ( val !== undefined ) {
			// Set the scroll offset
			return this.each(function() {
				win = getWindow( this );

				win ?
					win.scrollTo(
						!i ? val : jQuery(win).scrollLeft(),
						 i ? val : jQuery(win).scrollTop()
					) :
					this[ method ] = val;
			});
		} else {
			win = getWindow( elem );

			// Return the scroll offset
			return win ? ('pageXOffset' in win) ? win[ i ? 'pageYOffset' : 'pageXOffset' ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}
	};
});

function getWindow( elem ) {
	return ("scrollTo" in elem && elem.document) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function(i, name){

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn["inner" + name] = function(){
		return this[0] ?
			jQuery.css( this[0], type, false, "padding" ) :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn["outer" + name] = function(margin) {
		return this[0] ?
			jQuery.css( this[0], type, false, margin ? "margin" : "border" ) :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) { return null; }
		return ("scrollTo" in elem && elem.document) ? // does it walk and quack like a window?
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			elem.document.compatMode === "CSS1Compat" && elem.document.documentElement[ "client" + name ] ||
			elem.document.body[ "client" + name ] :

			// Get document width or height
			(elem.nodeType === 9) ? // is it a document
				// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
				Math.max(
					elem.documentElement["client" + name],
					elem.body["scroll" + name], elem.documentElement["scroll" + name],
					elem.body["offset" + name], elem.documentElement["offset" + name]
				) :

				// Get or set width or height on the element
				size === undefined ?
					// Get width or height on the element
					jQuery.css( elem, type ) :

					// Set the width or height on the element (default to pixels if value is unitless)
					this.css( type, typeof size === "string" ? size : size + "px" );
	};

});
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

})(window);


/*
 * JavaScript Pretty Date
 * Copyright (c) 2008 John Resig (jquery.com)
 * Licensed under the MIT license.
 */

// Takes an ISO time and returns a string representing how
// long ago the date represents.
function prettyDate(time){
	var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
		diff = (((new Date()).getTime() - date.getTime()) / 1000),
		day_diff = Math.floor(diff / 86400);
			
	if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
		return;
			
	return day_diff == 0 && (
			diff < 60 && "just now" ||
			diff < 120 && "1 minute ago" ||
			diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
			diff < 7200 && "1 hour ago" ||
			diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
		day_diff == 1 && "Yesterday" ||
		day_diff < 7 && day_diff + " days ago" ||
		day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
}

// If jQuery is included in the page, adds a jQuery plugin to handle it as well
if ( typeof jQuery != "undefined" )
	jQuery.fn.prettyDate = function(){
		return this.each(function(){
			var date = prettyDate(this.title);
			if ( date )
				jQuery(this).text( date );
		});
	};


/*
 * Raphael 1.0 RC1.1 - JavaScript Vector Library
 *
 * Copyright (c) 2008 - 2009 Dmitry Baranovskiy (http://raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */


window.Raphael=(function(){var x=/[, ]+/,F=document,l=window,p={was:"Raphael" in window,is:window.Raphael},E=function(){return J.apply(E,arguments);},B={},O={cx:0,cy:0,fill:"#fff","fill-opacity":1,font:'10px "Arial"',"font-family":'"Arial"',"font-size":"10","font-style":"normal","font-weight":400,gradient:0,height:0,href:"http://raphaeljs.com/",opacity:1,path:"M0,0",r:0,rotation:0,rx:0,ry:0,scale:"1 1",src:"",stroke:"#000","stroke-dasharray":"","stroke-linecap":"butt","stroke-linejoin":"butt","stroke-miterlimit":0,"stroke-opacity":1,"stroke-width":1,target:"_blank","text-anchor":"middle",title:"Raphael",translation:"0 0",width:0,x:0,y:0},T={cx:"number",cy:"number",fill:"colour","fill-opacity":"number","font-size":"number",height:"number",opacity:"number",path:"path",r:"number",rotation:"csv",rx:"number",ry:"number",scale:"csv",stroke:"colour","stroke-opacity":"number","stroke-width":"number",translation:"csv",width:"number",x:"number",y:"number"},U=["click","dblclick","mousedown","mousemove","mouseout","mouseover","mouseup"];E.version="1.0 RC1.1";E.type=(window.SVGAngle||document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")?"SVG":"VML");E.svg=!(E.vml=E.type=="VML");E.idGenerator=0;E.fn={};E.isArray=function(R){return Object.prototype.toString.call(R)=="[object Array]";};E.setWindow=function(R){l=R;F=l.document;};E.hsb2rgb=w(function(AE,AC,AI){if(typeof AE=="object"&&"h" in AE&&"s" in AE&&"b" in AE){AI=AE.b;AC=AE.s;AE=AE.h;}var z,AA,AJ;if(AI==0){return{r:0,g:0,b:0,hex:"#000"};}if(AE>1||AC>1||AI>1){AE/=255;AC/=255;AI/=255;}var AB=Math.floor(AE*6),AF=(AE*6)-AB,y=AI*(1-AC),e=AI*(1-(AC*AF)),AK=AI*(1-(AC*(1-AF)));z=[AI,e,y,y,AK,AI,AI][AB];AA=[AK,AI,AI,e,y,y,AK][AB];AJ=[y,y,AK,AI,AI,e,y][AB];z*=255;AA*=255;AJ*=255;var AG={r:z,g:AA,b:AJ},R=Math.round(z).toString(16),AD=Math.round(AA).toString(16),AH=Math.round(AJ).toString(16);if(R.length==1){R="0"+R;}if(AD.length==1){AD="0"+AD;}if(AH.length==1){AH="0"+AH;}AG.hex="#"+R+AD+AH;return AG;},E);E.rgb2hsb=w(function(R,e,AC){if(typeof R=="object"&&"r" in R&&"g" in R&&"b" in R){AC=R.b;e=R.g;R=R.r;}if(typeof R=="string"){var AE=E.getRGB(R);R=AE.r;e=AE.g;AC=AE.b;}if(R>1||e>1||AC>1){R/=255;e/=255;AC/=255;}var AB=Math.max(R,e,AC),i=Math.min(R,e,AC),z,y,AA=AB;if(i==AB){return{h:0,s:0,b:AB};}else{var AD=(AB-i);y=AD/AB;if(R==AB){z=(e-AC)/AD;}else{if(e==AB){z=2+((AC-R)/AD);}else{z=4+((R-e)/AD);}}z/=6;if(z<0){z+=1;}if(z>1){z-=1;}}return{h:z,s:y,b:AA};},E);E._path2string=function(){var y="",AB;for(var e=0,z=this.length;e<z;e++){for(var R=0,AA=this[e].length;R<AA;R++){y+=this[e][R];R&&R!=AA-1&&(y+=",");}e!=z-1&&(y+="\n");}return y.replace(/,(?=-)/g,"");};function w(y,e,R){function i(){var z=Array.prototype.splice.call(arguments,0,arguments.length),AA=z.join("\u25ba");i.cache=i.cache||{};i.count=i.count||[];if(AA in i.cache){return R?R(i.cache[AA]):i.cache[AA];}if(i.count.length>1000){delete i.cache[i.count.unshift()];}i.count.push(AA);i.cache[AA]=y.apply(e,z);return R?R(i.cache[AA]):i.cache[AA];}return i;}E.getRGB=w(function(R){var AE={aliceblue:"#f0f8ff",amethyst:"#96c",antiquewhite:"#faebd7",aqua:"#0ff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",black:"#000",blanchedalmond:"#ffebcd",blue:"#00f",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#0ff",darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",deepskyblue:"#00bfff",dimgray:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",fuchsia:"#f0f",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred:"#cd5c5c",indigo:"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgreen:"#90ee90",lightgrey:"#d3d3d3",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",lightsalmon:"#ffa07a",lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#789",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#0f0",limegreen:"#32cd32",linen:"#faf0e6",magenta:"#f0f",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",red:"#f00",rosybrown:"#bc8f8f",royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#fff",whitesmoke:"#f5f5f5",yellow:"#ff0",yellowgreen:"#9acd32"},AA;if((R+"").toLowerCase() in AE){R=AE[R.toString().toLowerCase()];}if(!R){return{r:0,g:0,b:0,hex:"#000"};}if(R=="none"){return{r:-1,g:-1,b:-1,hex:"none"};}var i,y,AD,AB=(R+"").match(/^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgb\(\s*([\d\.]+\s*,\s*[\d\.]+\s*,\s*[\d\.]+)\s*\)|rgb\(\s*([\d\.]+%\s*,\s*[\d\.]+%\s*,\s*[\d\.]+%)\s*\)|hs[bl]\(\s*([\d\.]+\s*,\s*[\d\.]+\s*,\s*[\d\.]+)\s*\)|hs[bl]\(\s*([\d\.]+%\s*,\s*[\d\.]+%\s*,\s*[\d\.]+%)\s*\))\s*$/i);if(AB){if(AB[2]){AD=parseInt(AB[2].substring(5),16);y=parseInt(AB[2].substring(3,5),16);i=parseInt(AB[2].substring(1,3),16);}if(AB[3]){AD=parseInt(AB[3].substring(3)+AB[3].substring(3),16);y=parseInt(AB[3].substring(2,3)+AB[3].substring(2,3),16);i=parseInt(AB[3].substring(1,2)+AB[3].substring(1,2),16);}if(AB[4]){AB=AB[4].split(/\s*,\s*/);i=parseFloat(AB[0]);y=parseFloat(AB[1]);AD=parseFloat(AB[2]);}if(AB[5]){AB=AB[5].split(/\s*,\s*/);i=parseFloat(AB[0])*2.55;y=parseFloat(AB[1])*2.55;AD=parseFloat(AB[2])*2.55;}if(AB[6]){AB=AB[6].split(/\s*,\s*/);i=parseFloat(AB[0]);y=parseFloat(AB[1]);AD=parseFloat(AB[2]);return E.hsb2rgb(i,y,AD);}if(AB[7]){AB=AB[7].split(/\s*,\s*/);i=parseFloat(AB[0])*2.55;y=parseFloat(AB[1])*2.55;AD=parseFloat(AB[2])*2.55;return E.hsb2rgb(i,y,AD);}var AB={r:i,g:y,b:AD},e=Math.round(i).toString(16),z=Math.round(y).toString(16),AC=Math.round(AD).toString(16);(e.length==1)&&(e="0"+e);(z.length==1)&&(z="0"+z);(AC.length==1)&&(AC="0"+AC);AB.hex="#"+e+z+AC;AA=AB;}else{AA={r:-1,g:-1,b:-1,hex:"none"};}return AA;},E);E.getColor=function(e){var i=this.getColor.start=this.getColor.start||{h:0,s:1,b:e||0.75},R=this.hsb2rgb(i.h,i.s,i.b);i.h+=0.075;if(i.h>1){i.h=0;i.s-=0.2;if(i.s<=0){this.getColor.start={h:0,s:1,b:i.b};}}return R.hex;};E.getColor.reset=function(){delete this.start;};E.parsePathString=w(function(R){if(!R){return null;}var i={a:7,c:6,h:1,l:2,m:2,q:4,s:4,t:2,v:1,z:0},e=[];if(E.isArray(R)&&E.isArray(R[0])){e=S(R);}if(!e.length){(R+"").replace(/([achlmqstvz])[\s,]*((-?\d*\.?\d*(?:e[-+]?\d+)?\s*,?\s*)+)/ig,function(z,y,AC){var AB=[],AA=y.toLowerCase();AC.replace(/(-?\d*\.?\d*(?:e[-+]?\d+)?)\s*,?\s*/ig,function(AE,AD){AD&&AB.push(+AD);});while(AB.length>=i[AA]){e.push([y].concat(AB.splice(0,i[AA])));if(!i[AA]){break;}}});}e.toString=E._path2string;return e;});var a=w(function(AG){if(!AG){return{x:0,y:0,width:0,height:0};}AG=o(AG);var AD=0,AC=0,z=[],e=[];for(var AA=0,AF=AG.length;AA<AF;AA++){if(AG[AA][0]=="M"){AD=AG[AA][1];AC=AG[AA][2];z.push(AD);e.push(AC);}else{var AB=j(AD,AC,AG[AA][1],AG[AA][2],AG[AA][3],AG[AA][4],AG[AA][5],AG[AA][6]);z=z.concat(AB.min.x,AB.max.x);e=e.concat(AB.min.y,AB.max.y);}}var R=Math.min.apply(0,z),AE=Math.min.apply(0,e);return{x:R,y:AE,width:Math.max.apply(0,z)-R,height:Math.max.apply(0,e)-AE};}),S=function(AB){var y=[];if(!E.isArray(AB)||!E.isArray(AB&&AB[0])){AB=E.parsePathString(AB);}for(var e=0,z=AB.length;e<z;e++){y[e]=[];for(var R=0,AA=AB[e].length;R<AA;R++){y[e][R]=AB[e][R];}}y.toString=E._path2string;return y;},C=w(function(AA){if(!E.isArray(AA)||!E.isArray(AA&&AA[0])){AA=E.parsePathString(AA);}var AG=[],AI=0,AH=0,AL=0,AK=0,z=0;if(AA[0][0]=="M"){AI=AA[0][1];AH=AA[0][2];AL=AI;AK=AH;z++;AG.push(["M",AI,AH]);}for(var AD=z,AM=AA.length;AD<AM;AD++){var R=AG[AD]=[],AJ=AA[AD];if(AJ[0]!=AJ[0].toLowerCase()){R[0]=AJ[0].toLowerCase();switch(R[0]){case"a":R[1]=AJ[1];R[2]=AJ[2];R[3]=AJ[3];R[4]=AJ[4];R[5]=AJ[5];R[6]=+(AJ[6]-AI).toFixed(3);R[7]=+(AJ[7]-AH).toFixed(3);break;case"v":R[1]=+(AJ[1]-AH).toFixed(3);break;case"m":AL=AJ[1];AK=AJ[2];default:for(var AC=1,AE=AJ.length;AC<AE;AC++){R[AC]=+(AJ[AC]-((AC%2)?AI:AH)).toFixed(3);}}}else{R=AG[AD]=[];if(AJ[0]=="m"){AL=AJ[1]+AI;AK=AJ[2]+AH;}for(var AB=0,e=AJ.length;AB<e;AB++){AG[AD][AB]=AJ[AB];}}var AF=AG[AD].length;switch(AG[AD][0]){case"z":AI=AL;AH=AK;break;case"h":AI+=+AG[AD][AF-1];break;case"v":AH+=+AG[AD][AF-1];break;default:AI+=+AG[AD][AF-2];AH+=+AG[AD][AF-1];}}AG.toString=E._path2string;return AG;},0,S),V=w(function(AA){if(!E.isArray(AA)||!E.isArray(AA&&AA[0])){AA=E.parsePathString(AA);}var AF=[],AH=0,AG=0,AK=0,AJ=0,z=0;if(AA[0][0]=="M"){AH=+AA[0][1];AG=+AA[0][2];AK=AH;AJ=AG;z++;AF[0]=["M",AH,AG];}for(var AD=z,AL=AA.length;AD<AL;AD++){var R=AF[AD]=[],AI=AA[AD];if(AI[0]!=(AI[0]+"").toUpperCase()){R[0]=(AI[0]+"").toUpperCase();switch(R[0]){case"A":R[1]=AI[1];R[2]=AI[2];R[3]=AI[3];R[4]=AI[4];R[5]=AI[5];R[6]=+(AI[6]+AH);R[7]=+(AI[7]+AG);break;case"V":R[1]=+AI[1]+AG;break;case"H":R[1]=+AI[1]+AH;break;case"M":AK=+AI[1]+AH;AJ=+AI[2]+AG;default:for(var AC=1,AE=AI.length;AC<AE;AC++){R[AC]=+AI[AC]+((AC%2)?AH:AG);}}}else{for(var AB=0,e=AI.length;AB<e;AB++){AF[AD][AB]=AI[AB];}}switch(R[0]){case"Z":AH=AK;AG=AJ;break;case"H":AH=R[1];break;case"V":AG=R[1];break;default:AH=AF[AD][AF[AD].length-2];AG=AF[AD][AF[AD].length-1];}}AF.toString=E._path2string;return AF;},null,S),D=function(e,y,R,i){return[e,y,R,i,R,i];},W=function(e,y,AA,z,R,i){return[2/3*e+1/3*AA,2/3*y+1/3*z,2/3*e+1/3*R,2/3*y+1/3*i,R,i];},P=function(AK,Ao,AT,AR,AL,AF,AA,AJ,An,AM){var AQ=Math.PI*120/180,R=Math.PI/180*(+AL||0),AX=[],AU,Ak=w(function(Ap,As,i){var Ar=Ap*Math.cos(i)-As*Math.sin(i),Aq=Ap*Math.sin(i)+As*Math.cos(i);return{x:Ar,y:Aq};});if(!AM){AU=Ak(AK,Ao,-R);AK=AU.x;Ao=AU.y;AU=Ak(AJ,An,-R);AJ=AU.x;An=AU.y;var e=Math.cos(Math.PI/180*AL),AH=Math.sin(Math.PI/180*AL),AZ=(AK-AJ)/2,AY=(Ao-An)/2;AT=Math.max(AT,Math.abs(AZ));AR=Math.max(AR,Math.abs(AY));var z=AT*AT,Ac=AR*AR,Ae=(AF==AA?-1:1)*Math.sqrt(Math.abs((z*Ac-z*AY*AY-Ac*AZ*AZ)/(z*AY*AY+Ac*AZ*AZ))),AO=Ae*AT*AY/AR+(AK+AJ)/2,AN=Ae*-AR*AZ/AT+(Ao+An)/2,AE=Math.asin((Ao-AN)/AR),AD=Math.asin((An-AN)/AR);AE=AK<AO?Math.PI-AE:AE;AD=AJ<AO?Math.PI-AD:AD;AE<0&&(AE=Math.PI*2+AE);AD<0&&(AD=Math.PI*2+AD);if(AA&&AE>AD){AE=AE-Math.PI*2;}if(!AA&&AD>AE){AD=AD-Math.PI*2;}}else{AE=AM[0];AD=AM[1];AO=AM[2];AN=AM[3];}var AI=AD-AE;if(Math.abs(AI)>AQ){var AP=AD,AS=AJ,AG=An;AD=AE+AQ*(AA&&AD>AE?1:-1);AJ=AO+AT*Math.cos(AD);An=AN+AR*Math.sin(AD);AX=P(AJ,An,AT,AR,AL,0,AA,AS,AG,[AD,AP,AO,AN]);}var AC=Math.cos(AE),Am=Math.sin(AE),AB=Math.cos(AD),Al=Math.sin(AD),AI=AD-AE,Aa=Math.tan(AI/4),Ad=4/3*AT*Aa,Ab=4/3*AR*Aa,Aj=[AK,Ao],Ai=[AK+Ad*Am,Ao-Ab*AC],Ah=[AJ+Ad*Al,An-Ab*AB],Af=[AJ,An];Ai[0]=2*Aj[0]-Ai[0];Ai[1]=2*Aj[1]-Ai[1];if(AM){return[Ai,Ah,Af].concat(AX);}else{AX=[Ai,Ah,Af].concat(AX).join(",").split(",");var AV=[];for(var Ag=0,AW=AX.length;Ag<AW;Ag++){AV[Ag]=Ag%2?Ak(AX[Ag-1],AX[Ag],R).y:Ak(AX[Ag],AX[Ag+1],R).x;}return AV;}},Z=w(function(e,R,AO,AM,AB,AA,AD,AC,AI){var AG=Math.pow(1-AI,3)*e+Math.pow(1-AI,2)*3*AI*AO+(1-AI)*3*AI*AI*AB+Math.pow(AI,3)*AD,AE=Math.pow(1-AI,3)*R+Math.pow(1-AI,2)*3*AI*AM+(1-AI)*3*AI*AI*AA+Math.pow(AI,3)*AC,AK=e+2*AI*(AO-e)+AI*AI*(AB-2*AO+e),AJ=R+2*AI*(AM-R)+AI*AI*(AA-2*AM+R),AN=AO+2*AI*(AB-AO)+AI*AI*(AD-2*AB+AO),AL=AM+2*AI*(AA-AM)+AI*AI*(AC-2*AA+AM),AH=(1-AI)*e+AI*AO,AF=(1-AI)*R+AI*AM,z=(1-AI)*AB+AI*AD,i=(1-AI)*AA+AI*AC;return{x:AG,y:AE,m:{x:AK,y:AJ},n:{x:AN,y:AL},start:{x:AH,y:AF},end:{x:z,y:i}};}),j=w(function(e,R,z,i,AM,AL,AI,AF){var AK=(AM-2*z+e)-(AI-2*AM+z),AH=2*(z-e)-2*(AM-z),AE=e-z,AC=(-AH+Math.sqrt(AH*AH-4*AK*AE))/2/AK,AA=(-AH-Math.sqrt(AH*AH-4*AK*AE))/2/AK,AG=[R,AF],AJ=[e,AI],AD=Z(e,R,z,i,AM,AL,AI,AF,AC>0&&AC<1?AC:0),AB=Z(e,R,z,i,AM,AL,AI,AF,AA>0&&AA<1?AA:0);AJ=AJ.concat(AD.x,AB.x);AG=AG.concat(AD.y,AB.y);AK=(AL-2*i+R)-(AF-2*AL+i);AH=2*(i-R)-2*(AL-i);AE=R-i;AC=(-AH+Math.sqrt(AH*AH-4*AK*AE))/2/AK;AA=(-AH-Math.sqrt(AH*AH-4*AK*AE))/2/AK;AD=Z(e,R,z,i,AM,AL,AI,AF,AC>0&&AC<1?AC:0);AB=Z(e,R,z,i,AM,AL,AI,AF,AA>0&&AA<1?AA:0);AJ=AJ.concat(AD.x,AB.x);AG=AG.concat(AD.y,AB.y);return{min:{x:Math.min.apply(Math,AJ),y:Math.min.apply(Math,AG)},max:{x:Math.max.apply(Math,AJ),y:Math.max.apply(Math,AG)}};}),o=w(function(AK,AF){var z=V(AK),AG=AF&&V(AF),AH={x:0,y:0,bx:0,by:0,X:0,Y:0},R={x:0,y:0,bx:0,by:0,X:0,Y:0},AB=function(AL,AM){if(!AL){return["C",AM.x,AM.y,AM.x,AM.y,AM.x,AM.y];}switch(AL[0]){case"M":AM.X=AL[1];AM.Y=AL[2];break;case"A":AL=["C"].concat(P(AM.x,AM.y,AL[1],AL[2],AL[3],AL[4],AL[5],AL[6],AL[7]));break;case"S":var i=AM.x+(AM.x-(AM.bx||AM.x)),AN=AM.y+(AM.y-(AM.by||AM.y));AL=["C",i,AN,AL[1],AL[2],AL[3],AL[4]];break;case"T":var i=AM.x+(AM.x-(AM.bx||AM.x)),AN=AM.y+(AM.y-(AM.by||AM.y));AL=["C"].concat(W(AM.x,AM.y,i,AN,AL[1],AL[2]));break;case"Q":AL=["C"].concat(W(AM.x,AM.y,AL[1],AL[2],AL[3],AL[4]));break;case"L":AL=["C"].concat(D(AM.x,AM.y,AL[1],AL[2]));break;case"H":AL=["C"].concat(D(AM.x,AM.y,AL[1],AM.y));break;case"V":AL=["C"].concat(D(AM.x,AM.y,AM.x,AL[1]));break;case"Z":AL=["C"].concat(D(AM.x,AM.y,AM.X,AM.Y));break;}return AL;},e=function(AL,AM){if(AL[AM].length>7){AL[AM].shift();var AN=AL[AM];while(AN.length){AL.splice(AM++,0,["C"].concat(AN.splice(0,6)));}AL.splice(AM,1);AI=Math.max(z.length,AG&&AG.length||0);}},y=function(AP,AO,AM,AL,AN){if(AP&&AO&&AP[AN][0]=="M"&&AO[AN][0]!="M"){AO.splice(AN,0,["M",AL.x,AL.y]);AM.bx=0;AM.by=0;AM.x=AP[AN][1];AM.y=AP[AN][2];AI=Math.max(z.length,AG&&AG.length||0);}};for(var AD=0,AI=Math.max(z.length,AG&&AG.length||0);AD<AI;AD++){z[AD]=AB(z[AD],AH);e(z,AD);AG&&(AG[AD]=AB(AG[AD],R));AG&&e(AG,AD);y(z,AG,AH,R,AD);y(AG,z,R,AH,AD);var AC=z[AD],AJ=AG&&AG[AD],AA=AC.length,AE=AG&&AJ.length;AH.bx=AC[AA-4]||0;AH.by=AC[AA-3]||0;AH.x=AC[AA-2];AH.y=AC[AA-1];R.bx=AG&&(AJ[AE-4]||0);R.by=AG&&(AJ[AE-3]||0);R.x=AG&&AJ[AE-2];R.y=AG&&AJ[AE-1];}return AG?[z,AG]:z;},null,S),L=w(function(AG){if(typeof AG=="string"){AG=AG.split(/\s*\-\s*/);var y=AG.shift();if(y.toLowerCase()=="v"){y=90;}else{if(y.toLowerCase()=="h"){y=0;}else{y=parseFloat(y);}}y=-y;var AE={angle:y,type:"linear",dots:[],vector:[0,0,Math.cos(y*Math.PI/180).toFixed(3),Math.sin(y*Math.PI/180).toFixed(3)]},AF=1/(Math.max(Math.abs(AE.vector[2]),Math.abs(AE.vector[3]))||1);AE.vector[2]*=AF;AE.vector[3]*=AF;if(AE.vector[2]<0){AE.vector[0]=-AE.vector[2];AE.vector[2]=0;}if(AE.vector[3]<0){AE.vector[1]=-AE.vector[3];AE.vector[3]=0;}AE.vector[0]=AE.vector[0];AE.vector[1]=AE.vector[1];AE.vector[2]=AE.vector[2];AE.vector[3]=AE.vector[3];for(var AB=0,AH=AG.length;AB<AH;AB++){var R={},AD=AG[AB].match(/^([^:]*):?([\d\.]*)/);R.color=E.getRGB(AD[1]).hex;AD[2]&&(R.offset=AD[2]+"%");AE.dots.push(R);}for(var AB=1,AH=AE.dots.length-1;AB<AH;AB++){if(!AE.dots[AB].offset){var e=parseFloat(AE.dots[AB-1].offset||0),z=false;for(var AA=AB+1;AA<AH;AA++){if(AE.dots[AA].offset){z=AE.dots[AA].offset;break;}}if(!z){z=100;AA=AH;}z=parseFloat(z);var AC=(z-e)/(AA-AB+1);for(;AB<AA;AB++){e+=AC;AE.dots[AB].offset=e+"%";}}}return AE;}else{return AG;}}),f=function(){var i,e,AA,z,R;if(typeof arguments[0]=="string"||typeof arguments[0]=="object"){if(typeof arguments[0]=="string"){i=F.getElementById(arguments[0]);}else{i=arguments[0];}if(i.tagName){if(arguments[1]==null){return{container:i,width:i.style.pixelWidth||i.offsetWidth,height:i.style.pixelHeight||i.offsetHeight};}else{return{container:i,width:arguments[1],height:arguments[2]};}}}else{if(typeof arguments[0]=="number"&&arguments.length>3){return{container:1,x:arguments[0],y:arguments[1],width:arguments[2],height:arguments[3]};}}},A=function(R,i){var e=this;for(var y in i){if(i.hasOwnProperty(y)&&!(y in R)){switch(typeof i[y]){case"function":(function(z){R[y]=R===e?z:function(){return z.apply(e,arguments);};})(i[y]);break;case"object":R[y]=R[y]||{};A.call(this,R[y],i[y]);break;default:R[y]=i[y];break;}}}};if(E.svg){var n=function(R){return +R+(Math.floor(R)==R)*0.5;};var Y=function(AA){for(var e=0,y=AA.length;e<y;e++){if(AA[e][0].toLowerCase()!="a"){for(var R=1,z=AA[e].length;R<z;R++){AA[e][R]=n(AA[e][R]);}}else{AA[e][6]=n(AA[e][6]);AA[e][7]=n(AA[e][7]);}}return AA;};E.toString=function(){return"Your browser supports SVG.\nYou are running Rapha\u00ebl "+this.version;};var v=function(R,y){var e=F.createElementNS(y.svgns,"path");y.canvas&&y.canvas.appendChild(e);var i=new K(e,y);i.type="path";d(i,{fill:"none",stroke:"#000",path:R});return i;};var m=function(AC,AA,AD){AA=L(AA);var z=F.createElementNS(AD.svgns,(AA.type||"linear")+"Gradient");z.id="r"+(E.idGenerator++).toString(36);if(AA.vector&&AA.vector.length){z.setAttribute("x1",AA.vector[0]);z.setAttribute("y1",AA.vector[1]);z.setAttribute("x2",AA.vector[2]);z.setAttribute("y2",AA.vector[3]);}AD.defs.appendChild(z);var AB=true;for(var e=0,y=AA.dots.length;e<y;e++){var R=F.createElementNS(AD.svgns,"stop");if(AA.dots[e].offset){AB=false;}R.setAttribute("offset",AA.dots[e].offset?AA.dots[e].offset:(e==0)?"0%":"100%");R.setAttribute("stop-color",E.getRGB(AA.dots[e].color).hex||"#fff");z.appendChild(R);}if(AB&&typeof AA.dots[y-1].opacity!="undefined"){R.setAttribute("stop-opacity",AA.dots[y-1].opacity);}AC.setAttribute("fill","url(#"+z.id+")");AC.style.fill="";AC.style.opacity=1;AC.style.fillOpacity=1;AC.setAttribute("opacity",1);AC.setAttribute("fill-opacity",1);};var Q=function(e){var R=e.getBBox();e.pattern.setAttribute("patternTransform","translate(".concat(R.x,",",R.y,")"));};var d=function(AF,AM){var AI={"":[0],none:[0],"-":[3,1],".":[1,1],"-.":[3,1,1,1],"-..":[3,1,1,1,1,1],". ":[1,3],"- ":[4,3],"--":[8,3],"- .":[4,3,1,3],"--.":[8,3,1,3],"--..":[8,3,1,3,1,3]},AK=AF.node,AG=AF.attrs,AC=AF.attr("rotation"),z=function(AU,AT){AT=AI[(AT+"").toLowerCase()];if(AT){var AR=AU.attrs["stroke-width"]||"1",AO={round:AR,square:AR,butt:0}[AU.attrs["stroke-linecap"]||AM["stroke-linecap"]]||0,AS=[];for(var AP=0,AQ=AT.length;AP<AQ;AP++){AS.push(AT[AP]*AR+((AP%2)?1:-1)*AO);}AT=AS.join(",");AK.setAttribute("stroke-dasharray",AT);}};parseInt(AC,10)&&AF.rotate(0,true);for(var AJ in AM){if(!(AJ in O)){continue;}var AH=AM[AJ];AG[AJ]=AH;switch(AJ){case"href":case"title":case"target":var AL=AK.parentNode;if(AL.tagName.toLowerCase()!="a"){var i=F.createElementNS(AF.paper.svgns,"a");AL.insertBefore(i,AK);i.appendChild(AK);AL=i;}AL.setAttributeNS(AF.paper.xlink,AJ,AH);break;case"path":if(AH&&AF.type=="path"){AG.path=Y(V(AH));AK.setAttribute("d",AG.path);}case"width":AK.setAttribute(AJ,AH);if(AG.fx){AJ="x";AH=AG.x;}else{break;}case"x":if(AG.fx){AH=-AG.x-(AG.width||0);}case"rx":case"cx":AK.setAttribute(AJ,AH);AF.pattern&&Q(AF);break;case"height":AK.setAttribute(AJ,AH);if(AG.fy){AJ="y";AH=AG.y;}else{break;}case"y":if(AG.fy){AH=-AG.y-(AG.height||0);}case"ry":case"cy":AK.setAttribute(AJ,AH);AF.pattern&&Q(AF);break;case"r":if(AF.type=="rect"){AK.setAttribute("rx",AH);AK.setAttribute("ry",AH);}else{AK.setAttribute(AJ,AH);}break;case"src":if(AF.type=="image"){AK.setAttributeNS(AF.paper.xlink,"href",AH);}break;case"stroke-width":AK.style.strokeWidth=AH;AK.setAttribute(AJ,AH);if(AG["stroke-dasharray"]){z(AF,AG["stroke-dasharray"]);}break;case"stroke-dasharray":z(AF,AH);break;case"rotation":AC=AH;AF.rotate(AH,true);break;case"translation":var AA=(AH+"").split(x);AF.translate((+AA[0]+1||2)-1,(+AA[1]+1||2)-1);break;case"scale":var AA=(AH+"").split(x);AF.scale(+AA[0]||1,+AA[1]||+AA[0]||1,+AA[2]||null,+AA[3]||null);break;case"fill":var y=(AH+"").match(/^url\(['"]?([^\)]+)['"]?\)$/i);if(y){var e=F.createElementNS(AF.paper.svgns,"pattern"),AE=F.createElementNS(AF.paper.svgns,"image");e.id="r"+(E.idGenerator++).toString(36);e.setAttribute("x",0);e.setAttribute("y",0);e.setAttribute("patternUnits","userSpaceOnUse");AE.setAttribute("x",0);AE.setAttribute("y",0);AE.setAttributeNS(AF.paper.xlink,"href",y[1]);e.appendChild(AE);var AN=F.createElement("img");AN.style.position="absolute";AN.style.top="-9999em";AN.style.left="-9999em";AN.onload=function(){e.setAttribute("width",this.offsetWidth);e.setAttribute("height",this.offsetHeight);AE.setAttribute("width",this.offsetWidth);AE.setAttribute("height",this.offsetHeight);F.body.removeChild(this);B.safari();};F.body.appendChild(AN);AN.src=y[1];AF.paper.defs.appendChild(e);AK.style.fill="url(#"+e.id+")";AK.setAttribute("fill","url(#"+e.id+")");AF.pattern=e;AF.pattern&&Q(AF);break;}delete AM.gradient;delete AG.gradient;if(typeof AG.opacity!="undefined"&&typeof AM.opacity=="undefined"){AK.style.opacity=AG.opacity;AK.setAttribute("opacity",AG.opacity);}if(typeof AG["fill-opacity"]!="undefined"&&typeof AM["fill-opacity"]=="undefined"){AK.style.fillOpacity=AG["fill-opacity"];AK.setAttribute("fill-opacity",AG["fill-opacity"]);}case"stroke":AK.style[AJ]=E.getRGB(AH).hex;AK.setAttribute(AJ,E.getRGB(AH).hex);break;case"gradient":m(AK,AH,AF.paper);break;case"opacity":case"fill-opacity":if(AG.gradient){var R=F.getElementById(AK.getAttribute("fill").replace(/^url\(#|\)$/g,""));if(R){var AB=R.getElementsByTagName("stop");AB[AB.length-1].setAttribute("stop-opacity",AH);}break;}default:AJ=="font-size"&&(AH=parseInt(AH,10)+"px");var AD=AJ.replace(/(\-.)/g,function(AO){return AO.substring(1).toUpperCase();});AK.style[AD]=AH;AK.setAttribute(AJ,AH);break;}}s(AF,AM);parseInt(AC,10)&&AF.rotate(AC,true);};var k=1.2;var s=function(R,z){if(R.type!="text"||!("text" in z||"font" in z||"font-size" in z||"x" in z||"y" in z)){return ;}var AE=R.attrs,e=R.node,AG=e.firstChild?parseInt(F.defaultView.getComputedStyle(e.firstChild,"").getPropertyValue("font-size"),10):10;if("text" in z){while(e.firstChild){e.removeChild(e.firstChild);}var y=(z.text+"").split("\n");for(var AA=0,AF=y.length;AA<AF;AA++){var AC=F.createElementNS(R.paper.svgns,"tspan");AA&&AC.setAttribute("dy",AG*k);AA&&AC.setAttribute("x",AE.x);AC.appendChild(F.createTextNode(y[AA]));e.appendChild(AC);}}else{var y=e.getElementsByTagName("tspan");for(var AA=0,AF=y.length;AA<AF;AA++){AA&&y[AA].setAttribute("dy",AG*k);AA&&y[AA].setAttribute("x",AE.x);}}e.setAttribute("y",AE.y);var AB=R.getBBox(),AD=AE.y-(AB.y+AB.height/2);AD&&e.setAttribute("y",AE.y+AD);};var K=function(e,R){var y=0,i=0;this[0]=e;this.node=e;this.paper=R;this.attrs=this.attrs||{};this.transformations=[];this._={tx:0,ty:0,rt:{deg:0,cx:0,cy:0},sx:1,sy:1};};K.prototype.rotate=function(e,R,y){if(e==null){if(this._.rt.cx){return[this._.rt.deg,this._.rt.cx,this._.rt.cy].join(" ");}return this._.rt.deg;}var i=this.getBBox();e=(e+"").split(x);if(e.length-1){R=parseFloat(e[1]);y=parseFloat(e[2]);}e=parseFloat(e[0]);if(R!=null){this._.rt.deg=e;}else{this._.rt.deg+=e;}(y==null)&&(R=null);this._.rt.cx=R;this._.rt.cy=y;R=R==null?i.x+i.width/2:R;y=y==null?i.y+i.height/2:y;if(this._.rt.deg){this.transformations[0]="rotate(".concat(this._.rt.deg," ",R," ",y,")");}else{this.transformations[0]="";}this.node.setAttribute("transform",this.transformations.join(" "));return this;};K.prototype.hide=function(){this.node.style.display="none";return this;};K.prototype.show=function(){this.node.style.display="block";return this;};K.prototype.remove=function(){this.node.parentNode.removeChild(this.node);};K.prototype.getBBox=function(){if(this.type=="path"){return a(this.attrs.path);}if(this.node.style.display=="none"){this.show();var y=true;}var AC={};try{AC=this.node.getBBox();}catch(AA){}finally{AC=AC||{};}if(this.type=="text"){AC={x:AC.x,y:Infinity,width:AC.width,height:0};for(var R=0,z=this.node.getNumberOfChars();R<z;R++){var AB=this.node.getExtentOfChar(R);(AB.y<AC.y)&&(AC.y=AB.y);(AB.y+AB.height-AC.y>AC.height)&&(AC.height=AB.y+AB.height-AC.y);}}y&&this.hide();return AC;};K.prototype.attr=function(){if(arguments.length==1&&typeof arguments[0]=="string"){if(arguments[0]=="translation"){return this.translate();}if(arguments[0]=="rotation"){return this.rotate();}if(arguments[0]=="scale"){return this.scale();}return this.attrs[arguments[0]];}if(arguments.length==1&&E.isArray(arguments[0])){var R={};for(var e in arguments[0]){R[arguments[0][e]]=this.attrs[arguments[0][e]];}return R;}if(arguments.length==2){var i={};i[arguments[0]]=arguments[1];d(this,i);}else{if(arguments.length==1&&typeof arguments[0]=="object"){d(this,arguments[0]);}}return this;};K.prototype.toFront=function(){this.node.parentNode.appendChild(this.node);return this;};K.prototype.toBack=function(){if(this.node.parentNode.firstChild!=this.node){this.node.parentNode.insertBefore(this.node,this.node.parentNode.firstChild);}return this;};K.prototype.insertAfter=function(R){if(R.node.nextSibling){R.node.parentNode.insertBefore(this.node,R.node.nextSibling);}else{R.node.parentNode.appendChild(this.node);}return this;};K.prototype.insertBefore=function(R){var e=R.node;e.parentNode.insertBefore(this.node,e);return this;};var b=function(e,R,AB,AA){R=n(R);AB=n(AB);var z=F.createElementNS(e.svgns,"circle");z.setAttribute("cx",R);z.setAttribute("cy",AB);z.setAttribute("r",AA);z.setAttribute("fill","none");z.setAttribute("stroke","#000");if(e.canvas){e.canvas.appendChild(z);}var i=new K(z,e);i.attrs=i.attrs||{};i.attrs.cx=R;i.attrs.cy=AB;i.attrs.r=AA;i.attrs.stroke="#000";i.type="circle";return i;};var h=function(i,R,AD,e,AB,AC){R=n(R);AD=n(AD);var AA=F.createElementNS(i.svgns,"rect");AA.setAttribute("x",R);AA.setAttribute("y",AD);AA.setAttribute("width",e);AA.setAttribute("height",AB);if(AC){AA.setAttribute("rx",AC);AA.setAttribute("ry",AC);}AA.setAttribute("fill","none");AA.setAttribute("stroke","#000");if(i.canvas){i.canvas.appendChild(AA);}var z=new K(AA,i);z.attrs=z.attrs||{};z.attrs.x=R;z.attrs.y=AD;z.attrs.width=e;z.attrs.height=AB;z.attrs.stroke="#000";if(AC){z.attrs.rx=z.attrs.ry=AC;}z.type="rect";return z;};var G=function(e,R,AC,AB,AA){R=n(R);AC=n(AC);var z=F.createElementNS(e.svgns,"ellipse");z.setAttribute("cx",R);z.setAttribute("cy",AC);z.setAttribute("rx",AB);z.setAttribute("ry",AA);z.setAttribute("fill","none");z.setAttribute("stroke","#000");if(e.canvas){e.canvas.appendChild(z);}var i=new K(z,e);i.attrs=i.attrs||{};i.attrs.cx=R;i.attrs.cy=AC;i.attrs.rx=AB;i.attrs.ry=AA;i.attrs.stroke="#000";i.type="ellipse";return i;};var N=function(i,AC,R,AD,e,AB){var AA=F.createElementNS(i.svgns,"image");AA.setAttribute("x",R);AA.setAttribute("y",AD);AA.setAttribute("width",e);AA.setAttribute("height",AB);AA.setAttribute("preserveAspectRatio","none");AA.setAttributeNS(i.xlink,"href",AC);if(i.canvas){i.canvas.appendChild(AA);}var z=new K(AA,i);z.attrs=z.attrs||{};z.attrs.src=AC;z.attrs.x=R;z.attrs.y=AD;z.attrs.width=e;z.attrs.height=AB;z.type="image";return z;};var g=function(e,R,AB,AA){var z=F.createElementNS(e.svgns,"text");z.setAttribute("x",R);z.setAttribute("y",AB);z.setAttribute("text-anchor","middle");if(e.canvas){e.canvas.appendChild(z);}var i=new K(z,e);i.attrs=i.attrs||{};i.attrs.text=AA;i.attrs.x=R;i.attrs.y=AB;i.type="text";d(i,{font:O.font,stroke:"none",fill:"#000",text:AA});return i;};var c=function(e,R){this.width=e||this.width;this.height=R||this.height;this.canvas.setAttribute("width",this.width);this.canvas.setAttribute("height",this.height);return this;};var J=function(){var z=f.apply(null,arguments),i=z.container,e=z.x,AC=z.y,AA=z.width,R=z.height;if(!i){throw new Error("SVG container not found.");}B.canvas=F.createElementNS(B.svgns,"svg");B.canvas.setAttribute("width",AA||512);B.width=AA||512;B.canvas.setAttribute("height",R||342);B.height=R||342;if(i==1){F.body.appendChild(B.canvas);B.canvas.style.position="absolute";B.canvas.style.left=e+"px";B.canvas.style.top=AC+"px";}else{if(i.firstChild){i.insertBefore(B.canvas,i.firstChild);}else{i.appendChild(B.canvas);}}i={canvas:B.canvas,clear:function(){while(this.canvas.firstChild){this.canvas.removeChild(this.canvas.firstChild);}this.defs=F.createElementNS(B.svgns,"defs");this.canvas.appendChild(this.defs);}};for(var AB in B){if(AB!="create"){i[AB]=B[AB];}}A.call(i,i,E.fn);i.clear();i.raphael=E;return i;};B.remove=function(){this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas);};B.svgns="http://www.w3.org/2000/svg";B.xlink="http://www.w3.org/1999/xlink";B.safari=function(){if({"Apple Computer, Inc.":1,"Google Inc.":1}[navigator.vendor]){var R=this.rect(-this.width,-this.height,this.width*3,this.height*3).attr({stroke:"none"});setTimeout(function(){R.remove();});}};}if(E.vml){var X=function(AB){var z=o(AB);for(var e=0,y=z.length;e<y;e++){z[e][0]=(z[e][0]+"").toLowerCase();z[e][0]=="z"&&(z[e][0]="x");for(var R=1,AA=z[e].length;R<AA;R++){z[e][R]=Math.round(z[e][R]);}}return(z+"");};E.toString=function(){return"Your browser doesn\u2019t support SVG. Assuming it is Internet Explorer and falling down to VML.\nYou are running Rapha\u00ebl "+this.version;};var v=function(R,AA){var y=u("group"),AB=y.style;AB.position="absolute";AB.left=0;AB.top=0;AB.width=AA.width+"px";AB.height=AA.height+"px";y.coordsize=AA.coordsize;y.coordorigin=AA.coordorigin;var i=u("shape"),e=i.style;e.width=AA.width+"px";e.height=AA.height+"px";i.path="";i.coordsize=this.coordsize;i.coordorigin=this.coordorigin;y.appendChild(i);var z=new K(i,y,AA);z.isAbsolute=true;z.type="path";z.path=[];z.Path="";if(R){z.attrs.path=E.parsePathString(R);z.node.path=X(z.attrs.path);}d(z,{fill:"none",stroke:"#000"});z.setBox();AA.canvas.appendChild(y);return z;};var d=function(i,z){i.attrs=i.attrs||{};var y=i.node,AF=i.attrs,AJ=y.style,AI,AD=i;for(var AC in z){AF[AC]=z[AC];}z.href&&(y.href=z.href);z.title&&(y.title=z.title);z.target&&(y.target=z.target);if(z.path&&i.type=="path"){AF.path=E.parsePathString(z.path);y.path=X(AF.path);}if(z.rotation!=null){i.rotate(z.rotation,true);}if(z.translation){AI=(z.translation+"").split(x);i.translate(AI[0],AI[1]);}if(z.scale){AI=(z.scale+"").split(x);i.scale(+AI[0]||1,+AI[1]||+AI[0]||1,+AI[2]||null,+AI[3]||null);}if(i.type=="image"&&z.src){y.src=z.src;}if(i.type=="image"&&z.opacity){y.filterOpacity=" progid:DXImageTransform.Microsoft.Alpha(opacity="+(z.opacity*100)+")";AJ.filter=(y.filterMatrix||"")+(y.filterOpacity||"");}z.font&&(AJ.font=z.font);z["font-family"]&&(AJ.fontFamily='"'+z["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g,"")+'"');z["font-size"]&&(AJ.fontSize=z["font-size"]);z["font-weight"]&&(AJ.fontWeight=z["font-weight"]);z["font-style"]&&(AJ.fontStyle=z["font-style"]);if(z.opacity!=null||z["stroke-width"]!=null||z.fill!=null||z.stroke!=null||z["stroke-width"]!=null||z["stroke-opacity"]!=null||z["fill-opacity"]!=null||z["stroke-dasharray"]!=null||z["stroke-miterlimit"]!=null||z["stroke-linejoin"]!=null||z["stroke-linecap"]!=null){y=i.shape||y;var AH=(y.getElementsByTagName("fill")&&y.getElementsByTagName("fill")[0]),e=false;!AH&&(e=AH=u("fill"));if("fill-opacity" in z||"opacity" in z){var AB=((+AF["fill-opacity"]+1||2)-1)*((+AF.opacity+1||2)-1);AB<0&&(AB=0);AB>1&&(AB=1);AH.opacity=AB;}z.fill&&(AH.on=true);if(AH.on==null||z.fill=="none"){AH.on=false;}if(AH.on&&z.fill){var AA=z.fill.match(/^url\(([^\)]+)\)$/i);if(AA){AH.src=AA[1];AH.type="tile";}else{AH.color=E.getRGB(z.fill).hex;AH.src="";AH.type="solid";}}e&&y.appendChild(AH);var AG=(y.getElementsByTagName("stroke")&&y.getElementsByTagName("stroke")[0]),R=false;!AG&&(R=AG=u("stroke"));if((z.stroke&&z.stroke!="none")||z["stroke-width"]||z["stroke-opacity"]!=null||z["stroke-dasharray"]||z["stroke-miterlimit"]||z["stroke-linejoin"]||z["stroke-linecap"]){AG.on=true;}(z.stroke=="none"||AG.on==null||z.stroke==0||z["stroke-width"]==0)&&(AG.on=false);AG.on&&z.stroke&&(AG.color=E.getRGB(z.stroke).hex);var AB=((+AF["stroke-opacity"]+1||2)-1)*((+AF.opacity+1||2)-1);AB<0&&(AB=0);AB>1&&(AB=1);AG.opacity=AB;z["stroke-linejoin"]&&(AG.joinstyle=z["stroke-linejoin"]||"miter");AG.miterlimit=z["stroke-miterlimit"]||8;z["stroke-linecap"]&&(AG.endcap={butt:"flat",square:"square",round:"round"}[z["stroke-linecap"]]||"miter");z["stroke-width"]&&(AG.weight=(parseFloat(z["stroke-width"])||1)*12/16);if(z["stroke-dasharray"]){var AE={"-":"shortdash",".":"shortdot","-.":"shortdashdot","-..":"shortdashdotdot",". ":"dot","- ":"dash","--":"longdash","- .":"dashdot","--.":"longdashdot","--..":"longdashdotdot"};AG.dashstyle=AE[z["stroke-dasharray"]]||"";}R&&y.appendChild(AG);}if(AD.type=="text"){var AJ=B.span.style;AF.font&&(AJ.font=AF.font);AF["font-family"]&&(AJ.fontFamily=AF["font-family"]);AF["font-size"]&&(AJ.fontSize=AF["font-size"]);AF["font-weight"]&&(AJ.fontWeight=AF["font-weight"]);AF["font-style"]&&(AJ.fontStyle=AF["font-style"]);B.span.innerHTML=AD.node.string.replace(/</g,"&#60;").replace(/&/g,"&#38;").replace(/\n/g,"<br>");AD.W=AF.w=B.span.offsetWidth;AD.H=AF.h=B.span.offsetHeight;AD.X=AF.x;AD.Y=AF.y+Math.round(AD.H/2);switch(AF["text-anchor"]){case"start":AD.node.style["v-text-align"]="left";AD.bbx=Math.round(AD.W/2);break;case"end":AD.node.style["v-text-align"]="right";AD.bbx=-Math.round(AD.W/2);break;default:AD.node.style["v-text-align"]="center";break;}}};var M=function(e,R,z,y){var i=Math.round(Math.atan((parseFloat(z)-parseFloat(e))/(parseFloat(y)-parseFloat(R)))*57.29)||0;if(!i&&parseFloat(e)<parseFloat(R)){i=180;}i-=180;if(i<0){i+=360;}return i;};var m=function(AC,AB){AB=L(AB);AC.attrs=AC.attrs||{};var e=AC.attrs,AA=AC.node.getElementsByTagName("fill");AC.attrs.gradient=AB;AC=AC.shape||AC.node;if(AA.length){AA=AA[0];}else{AA=u("fill");}if(AB.dots.length){AA.on=true;AA.method="none";AA.type=((AB.type+"").toLowerCase()=="radial")?"gradientTitle":"gradient";if(typeof AB.dots[0].color!="undefined"){AA.color=E.getRGB(AB.dots[0].color).hex;}if(typeof AB.dots[AB.dots.length-1].color!="undefined"){AA.color2=E.getRGB(AB.dots[AB.dots.length-1].color).hex;}var AD=[];for(var y=0,z=AB.dots.length;y<z;y++){if(AB.dots[y].offset){AD.push(AB.dots[y].offset+" "+E.getRGB(AB.dots[y].color).hex);}}var R=typeof AB.dots[AB.dots.length-1].opacity=="undefined"?(typeof e.opacity=="undefined"?1:e.opacity):AB.dots[AB.dots.length-1].opacity;if(AD.length){AA.colors.value=AD.join(",");R=typeof e.opacity=="undefined"?1:e.opacity;}else{AA.colors&&(AA.colors.value="0% "+AA.color);}AA.opacity=R;if(typeof AB.angle!="undefined"){AA.angle=(-AB.angle+270)%360;}else{if(AB.vector){AA.angle=M.apply(null,AB.vector);}}if((AB.type+"").toLowerCase()=="radial"){AA.focus="100%";AA.focusposition="0.5 0.5";}}};var K=function(z,AB,R){var AA=0,i=0,e=0,y=1;this[0]=z;this.node=z;this.X=0;this.Y=0;this.attrs={};this.Group=AB;this.paper=R;this._={tx:0,ty:0,rt:{deg:0},sx:1,sy:1};};K.prototype.rotate=function(e,R,i){if(e==null){if(this._.rt.cx){return[this._.rt.deg,this._.rt.cx,this._.rt.cy].join(" ");}return this._.rt.deg;}e=(e+"").split(x);if(e.length-1){R=parseFloat(e[1]);i=parseFloat(e[2]);}e=parseFloat(e[0]);if(R!=null){this._.rt.deg=e;}else{this._.rt.deg+=e;}(i==null)&&(R=null);this._.rt.cx=R;this._.rt.cy=i;this.setBox(this.attrs,R,i);this.Group.style.rotation=this._.rt.deg;return this;};K.prototype.setBox=function(AB,AC,AA){var e=this.Group.style,AD=(this.shape&&this.shape.style)||this.node.style;AB=AB||{};for(var AE in AB){this.attrs[AE]=AB[AE];}AC=AC||this._.rt.cx;AA=AA||this._.rt.cy;var AH=this.attrs,AK,AJ,AL,AG;switch(this.type){case"circle":AK=AH.cx-AH.r;AJ=AH.cy-AH.r;AL=AG=AH.r*2;break;case"ellipse":AK=AH.cx-AH.rx;AJ=AH.cy-AH.ry;AL=AH.rx*2;AG=AH.ry*2;break;case"rect":case"image":AK=AH.x;AJ=AH.y;AL=AH.width||0;AG=AH.height||0;break;case"text":this.textpath.v=["m",Math.round(AH.x),", ",Math.round(AH.y-2),"l",Math.round(AH.x)+1,", ",Math.round(AH.y-2)].join("");AK=AH.x-Math.round(this.W/2);AJ=AH.y-this.H/2;AL=this.W;AG=this.H;break;case"path":if(!this.attrs.path){AK=0;AJ=0;AL=this.paper.width;AG=this.paper.height;}else{var AF=a(this.attrs.path);AK=AF.x;AJ=AF.y;AL=AF.width;AG=AF.height;}break;default:AK=0;AJ=0;AL=this.paper.width;AG=this.paper.height;break;}AC=(AC==null)?AK+AL/2:AC;AA=(AA==null)?AJ+AG/2:AA;var z=AC-this.paper.width/2,AI=AA-this.paper.height/2;if(this.type=="path"||this.type=="text"){(e.left!=z+"px")&&(e.left=z+"px");(e.top!=AI+"px")&&(e.top=AI+"px");this.X=this.type=="text"?AK:-z;this.Y=this.type=="text"?AJ:-AI;this.W=AL;this.H=AG;(AD.left!=-z+"px")&&(AD.left=-z+"px");(AD.top!=-AI+"px")&&(AD.top=-AI+"px");}else{(e.left!=z+"px")&&(e.left=z+"px");(e.top!=AI+"px")&&(e.top=AI+"px");this.X=AK;this.Y=AJ;this.W=AL;this.H=AG;(e.width!=this.paper.width+"px")&&(e.width=this.paper.width+"px");(e.height!=this.paper.height+"px")&&(e.height=this.paper.height+"px");(AD.left!=AK-z+"px")&&(AD.left=AK-z+"px");(AD.top!=AJ-AI+"px")&&(AD.top=AJ-AI+"px");(AD.width!=AL+"px")&&(AD.width=AL+"px");(AD.height!=AG+"px")&&(AD.height=AG+"px");var AM=(+AB.r||0)/(Math.min(AL,AG));if(this.type=="rect"&&this.arcsize!=AM&&(AM||this.arcsize)){var R=u(AM?"roundrect":"rect");R.arcsize=AM;this.Group.appendChild(R);this.node.parentNode.removeChild(this.node);this.node=R;this.arcsize=AM;d(this,this.attrs);this.setBox(this.attrs);}}};K.prototype.hide=function(){this.Group.style.display="none";return this;};K.prototype.show=function(){this.Group.style.display="block";return this;};K.prototype.getBBox=function(){if(this.type=="path"){return a(this.attrs.path);}return{x:this.X+(this.bbx||0),y:this.Y,width:this.W,height:this.H};};K.prototype.remove=function(){this[0].parentNode.removeChild(this[0]);this.Group.parentNode.removeChild(this.Group);this.shape&&this.shape.parentNode.removeChild(this.shape);};K.prototype.attr=function(){if(arguments.length==1&&typeof arguments[0]=="string"){if(arguments[0]=="translation"){return this.translate();}if(arguments[0]=="rotation"){return this.rotate();}if(arguments[0]=="scale"){return this.scale();}return this.attrs[arguments[0]];}if(this.attrs&&arguments.length==1&&E.isArray(arguments[0])){var R={};for(var e=0,y=arguments[0].length;e<y;e++){R[arguments[0][e]]=this.attrs[arguments[0][e]];}return R;}var z;if(arguments.length==2){z={};z[arguments[0]]=arguments[1];}if(arguments.length==1&&typeof arguments[0]=="object"){z=arguments[0];}if(z){if(z.gradient){m(this,z.gradient);}if(z.text&&this.type=="text"){this.node.string=z.text;}d(this,z);this.setBox(this.attrs);}return this;};K.prototype.toFront=function(){this.Group.parentNode.appendChild(this.Group);return this;};K.prototype.toBack=function(){if(this.Group.parentNode.firstChild!=this.Group){this.Group.parentNode.insertBefore(this.Group,this.Group.parentNode.firstChild);}return this;};K.prototype.insertAfter=function(R){if(R.Group.nextSibling){R.Group.parentNode.insertBefore(this.Group,R.Group.nextSibling);}else{R.Group.parentNode.appendChild(this.Group);}return this;};K.prototype.insertBefore=function(R){R.Group.parentNode.insertBefore(this.Group,R.Group);return this;};var b=function(e,AE,AD,R){var AA=u("group"),z=AA.style,i=u("oval"),AC=i.style;z.position="absolute";z.left=0;z.top=0;z.width=e.width+"px";z.height=e.height+"px";AA.coordsize=e.coordsize;AA.coordorigin=e.coordorigin;AA.appendChild(i);var AB=new K(i,AA,e);AB.type="circle";d(AB,{stroke:"#000",fill:"none"});AB.attrs.cx=AE;AB.attrs.cy=AD;AB.attrs.r=R;AB.setBox({x:AE-R,y:AD-R,width:R*2,height:R*2});e.canvas.appendChild(AA);return AB;};var h=function(e,AE,AD,AF,AA,R){var AB=u("group"),z=AB.style,i=u(R?"roundrect":"rect"),AG=(+R||0)/(Math.min(AF,AA));i.arcsize=AG;z.position="absolute";z.left=0;z.top=0;z.width=e.width+"px";z.height=e.height+"px";AB.coordsize=e.coordsize;AB.coordorigin=e.coordorigin;AB.appendChild(i);var AC=new K(i,AB,e);AC.type="rect";d(AC,{stroke:"#000"});AC.arcsize=AG;AC.setBox({x:AE,y:AD,width:AF,height:AA,r:+R});e.canvas.appendChild(AB);return AC;};var G=function(R,AF,AE,i,e){var AB=u("group"),AA=AB.style,z=u("oval"),AD=z.style;AA.position="absolute";AA.left=0;AA.top=0;AA.width=R.width+"px";AA.height=R.height+"px";AB.coordsize=R.coordsize;AB.coordorigin=R.coordorigin;AB.appendChild(z);var AC=new K(z,AB,R);AC.type="ellipse";d(AC,{stroke:"#000"});AC.attrs.cx=AF;AC.attrs.cy=AE;AC.attrs.rx=i;AC.attrs.ry=e;AC.setBox({x:AF-i,y:AE-e,width:i*2,height:e*2});R.canvas.appendChild(AB);return AC;};var N=function(e,R,AF,AE,AG,AA){var AB=u("group"),z=AB.style,i=u("image"),AD=i.style;z.position="absolute";z.left=0;z.top=0;z.width=e.width+"px";z.height=e.height+"px";AB.coordsize=e.coordsize;AB.coordorigin=e.coordorigin;i.src=R;AB.appendChild(i);var AC=new K(i,AB,e);AC.type="image";AC.attrs.src=R;AC.attrs.x=AF;AC.attrs.y=AE;AC.attrs.w=AG;AC.attrs.h=AA;AC.setBox({x:AF,y:AE,width:AG,height:AA});e.canvas.appendChild(AB);return AC;};var g=function(e,AF,AE,AG){var AB=u("group"),AA=AB.style,z=u("shape"),AD=z.style,AH=u("path"),R=AH.style,i=u("textpath");AA.position="absolute";AA.left=0;AA.top=0;AA.width=e.width+"px";AA.height=e.height+"px";AB.coordsize=e.coordsize;AB.coordorigin=e.coordorigin;AH.v=["m",Math.round(AF),", ",Math.round(AE),"l",Math.round(AF)+1,", ",Math.round(AE)].join("");AH.textpathok=true;AD.width=e.width;AD.height=e.height;AA.position="absolute";AA.left=0;AA.top=0;AA.width=e.width;AA.height=e.height;i.string=AG;i.on=true;z.appendChild(i);z.appendChild(AH);AB.appendChild(z);var AC=new K(i,AB,e);AC.shape=z;AC.textpath=AH;AC.type="text";AC.attrs.text=AG;AC.attrs.x=AF;AC.attrs.y=AE;AC.attrs.w=1;AC.attrs.h=1;d(AC,{font:O.font,stroke:"none",fill:"#000"});AC.setBox();e.canvas.appendChild(AB);return AC;};var c=function(i,R){var e=this.canvas.style;this.width=i||this.width;this.height=R||this.height;e.width=this.width+"px";e.height=this.height+"px";e.clip="rect(0 "+this.width+"px "+this.height+"px 0)";this.canvas.coordsize=this.width+" "+this.height;return this;};F.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)");try{!F.namespaces.rvml&&F.namespaces.add("rvml","urn:schemas-microsoft-com:vml");var u=function(R){return F.createElement("<rvml:"+R+' class="rvml">');};}catch(t){var u=function(R){return F.createElement("<"+R+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');};}var J=function(){var z=f.apply(null,arguments),e=z.container,AE=z.height,AF,i=z.width,AD=z.x,AC=z.y;if(!e){throw new Error("VML container not found.");}var AB=B.canvas=F.createElement("div"),AA=AB.style;i=parseFloat(i)||"512px";AE=parseFloat(AE)||"342px";B.width=i;B.height=AE;B.coordsize=i+" "+AE;B.coordorigin="0 0";B.span=F.createElement("span");AF=B.span.style;AB.appendChild(B.span);AF.position="absolute";AF.left="-99999px";AF.top="-99999px";AF.padding=0;AF.margin=0;AF.lineHeight=1;AF.display="inline";AA.width=i+"px";AA.height=AE+"px";AA.position="absolute";AA.clip="rect(0 "+i+"px "+AE+"px 0)";if(e==1){F.body.appendChild(AB);AA.left=AD+"px";AA.top=AC+"px";e={style:{width:i,height:AE}};}else{e.style.width=i;e.style.height=AE;if(e.firstChild){e.insertBefore(AB,e.firstChild);}else{e.appendChild(AB);}}for(var R in B){e[R]=B[R];}A.call(e,e,E.fn);e.clear=function(){while(AB.firstChild){AB.removeChild(AB.firstChild);}};e.raphael=E;return e;};B.remove=function(){this.canvas.parentNode.removeChild(this.canvas);};B.safari=function(){};}var H=(function(){if(F.addEventListener){return function(z,i,e,R){var y=function(AA){return e.call(R,AA);};z.addEventListener(i,y,false);return function(){z.removeEventListener(i,y,false);return true;};};}else{if(F.attachEvent){return function(AA,y,i,e){var z=function(AB){return i.call(e,AB||l.event);};AA.attachEvent("on"+y,z);var R=function(){AA.detachEvent("on"+y,z);return true;};if(y=="mouseover"){AA.attachEvent("onmouseenter",z);return function(){AA.detachEvent("onmouseenter",z);return R();};}else{if(y=="mouseout"){AA.attachEvent("onmouseleave",z);return function(){AA.detachEvent("onmouseleave",z);return R();};}}return R;};}}})();for(var q=U.length;q--;){(function(R){K.prototype[R]=function(e){if(typeof e=="function"){this.events=this.events||{};this.events[R]=this.events[R]||{};this.events[R][e]=this.events[R][e]||[];this.events[R][e].push(H(this.shape||this.node,R,e,this));}return this;};K.prototype["un"+R]=function(e){this.events&&this.events[R]&&this.events[R][e]&&this.events[R][e].length&&this.events[R][e].shift()()&&!this.events[R][e].length&&delete this.events[R][e];};})(U[q]);}B.circle=function(R,i,e){return b(this,R,i,e);};B.rect=function(R,AA,e,i,z){return h(this,R,AA,e,i,z);};B.ellipse=function(R,z,i,e){return G(this,R,z,i,e);};B.path=function(R){return v(E.format.apply(E,arguments),this);};B.image=function(z,R,AA,e,i){return N(this,z,R,AA,e,i);};B.text=function(R,i,e){return g(this,R,i,e);};B.set=function(R){arguments.length>1&&(R=Array.prototype.splice.call(arguments,0,arguments.length));return new I(R);};B.setSize=c;K.prototype.stop=function(){clearTimeout(this.animation_in_progress);return this;};K.prototype.scale=function(AJ,AI,z,e){if(AJ==null&&AI==null){return{x:this._.sx,y:this._.sy,toString:function(){return +this.x.toFixed(3)+" "+(+this.y.toFixed(3));}};}AI=AI||AJ;!+AI&&(AI=AJ);var AN,AL,AM,AK,AZ=this.attrs;if(AJ!=0){var AH=this.getBBox(),AE=AH.x+AH.width/2,AB=AH.y+AH.height/2,AY=AJ/this._.sx,AX=AI/this._.sy;z=(+z||z==0)?z:AE;e=(+e||e==0)?e:AB;var AG=Math.round(AJ/Math.abs(AJ)),AD=Math.round(AI/Math.abs(AI)),AQ=this.node.style,Ab=z+(AE-z)*AG*AY,Aa=e+(AB-e)*AD*AX;switch(this.type){case"rect":case"image":var AF=AZ.width*AG*AY,AP=AZ.height*AD*AX,AC=Ab-AF/2,AA=Aa-AP/2;this.attr({width:AF,height:AP,x:AC,y:AA});break;case"circle":case"ellipse":this.attr({rx:AZ.rx*AY,ry:AZ.ry*AX,r:AZ.r*AY,cx:Ab,cy:Aa});break;case"path":var AS=C(AZ.path),AT=true;for(var AV=0,AO=AS.length;AV<AO;AV++){var AR=AS[AV];if(AR[0].toUpperCase()=="M"&&AT){continue;}else{AT=false;}if(E.svg&&AR[0].toUpperCase()=="A"){AR[AS[AV].length-2]*=AY;AR[AS[AV].length-1]*=AX;AR[1]*=AY;AR[2]*=AX;AR[5]=+(AG+AD?!!+AR[5]:!+AR[5]);}else{for(var AU=1,AW=AR.length;AU<AW;AU++){AR[AU]*=(AU%2)?AY:AX;}}}var R=a(AS),AN=Ab-R.x-R.width/2,AL=Aa-R.y-R.height/2;AS=C(AS);AS[0][1]+=AN;AS[0][2]+=AL;this.attr({path:AS.join(" ")});break;}if(this.type in {text:1,image:1}&&(AG!=1||AD!=1)){if(this.transformations){this.transformations[2]="scale(".concat(AG,",",AD,")");this.node.setAttribute("transform",this.transformations.join(" "));AN=(AG==-1)?-AZ.x-(AF||0):AZ.x;AL=(AD==-1)?-AZ.y-(AP||0):AZ.y;this.attr({x:AN,y:AL});AZ.fx=AG-1;AZ.fy=AD-1;}else{this.node.filterMatrix=" progid:DXImageTransform.Microsoft.Matrix(M11=".concat(AG,", M12=0, M21=0, M22=",AD,", Dx=0, Dy=0, sizingmethod='auto expand', filtertype='bilinear')");AQ.filter=(this.node.filterMatrix||"")+(this.node.filterOpacity||"");}}else{if(this.transformations){this.transformations[2]="";this.node.setAttribute("transform",this.transformations.join(" "));AZ.fx=0;AZ.fy=0;}else{this.node.filterMatrix="";AQ.filter=(this.node.filterMatrix||"")+(this.node.filterOpacity||"");}}AZ.scale=[AJ,AI,z,e].join(" ");this._.sx=AJ;this._.sy=AI;}return this;};E.easing_formulas={linear:function(R){return R;},"<":function(R){return Math.pow(R,3);},">":function(R){return Math.pow(R-1,3)+1;},"<>":function(R){R=R*2;if(R<1){return Math.pow(R,3)/2;}R-=2;return(Math.pow(R,3)+2)/2;},backIn:function(e){var R=1.70158;return e*e*((R+1)*e-R);},backOut:function(e){e=e-1;var R=1.70158;return e*e*((R+1)*e+R)+1;},elastic:function(i){if(i==0||i==1){return i;}var e=0.3,R=e/4;return Math.pow(2,-10*i)*Math.sin((i-R)*(2*Math.PI)/e)+1;},bounce:function(y){var e=7.5625,i=2.75,R;if(y<(1/i)){R=e*y*y;}else{if(y<(2/i)){y-=(1.5/i);R=e*y*y+0.75;}else{if(y<(2.5/i)){y-=(2.25/i);R=e*y*y+0.9375;}else{y-=(2.625/i);R=e*y*y+0.984375;}}}return R;}};K.prototype.animate=function(AR,AI,AH,z){clearTimeout(this.animation_in_progress);if(typeof AH=="function"||!AH){z=AH||null;}var AL={},e={},AF={},AE={x:0,y:0};for(var AJ in AR){if(AJ in T){AL[AJ]=this.attr(AJ);(typeof AL[AJ]=="undefined")&&(AL[AJ]=O[AJ]);e[AJ]=AR[AJ];switch(T[AJ]){case"number":AF[AJ]=(e[AJ]-AL[AJ])/AI;break;case"colour":AL[AJ]=E.getRGB(AL[AJ]);var AK=E.getRGB(e[AJ]);AF[AJ]={r:(AK.r-AL[AJ].r)/AI,g:(AK.g-AL[AJ].g)/AI,b:(AK.b-AL[AJ].b)/AI};break;case"path":var AA=o(AL[AJ],e[AJ]);AL[AJ]=AA[0];e[AJ]=AA[1];AF[AJ]=[];for(var AN=0,AD=AL[AJ].length;AN<AD;AN++){AF[AJ][AN]=[0];for(var AM=1,AP=AL[AJ][AN].length;AM<AP;AM++){AF[AJ][AN][AM]=(e[AJ][AN][AM]-AL[AJ][AN][AM])/AI;}}break;case"csv":var R=(AR[AJ]+"").split(x),AC=(AL[AJ]+"").split(x);switch(AJ){case"translation":AL[AJ]=[0,0];AF[AJ]=[R[0]/AI,R[1]/AI];break;case"rotation":AL[AJ]=(AC[1]==R[1]&&AC[2]==R[2])?AC:[0,R[1],R[2]];AF[AJ]=[(R[0]-AL[AJ][0])/AI,0,0];break;case"scale":AR[AJ]=R;AL[AJ]=(AL[AJ]+"").split(x);AF[AJ]=[(R[0]-AL[AJ][0])/AI,(R[1]-AL[AJ][1])/AI,0,0];}e[AJ]=R;}}}var y=+new Date,AG=0,AQ=function(i){return +i>255?255:+i;},AB=this;(function AO(){var AT=new Date-y,Ab={},AS;if(AT<AI){var AZ=E.easing_formulas[AH]?E.easing_formulas[AH](AT/AI):AT/AI;for(var AX in AL){switch(T[AX]){case"number":AS=+AL[AX]+AZ*AI*AF[AX];break;case"colour":AS="rgb("+[AQ(Math.round(AL[AX].r+AZ*AI*AF[AX].r)),AQ(Math.round(AL[AX].g+AZ*AI*AF[AX].g)),AQ(Math.round(AL[AX].b+AZ*AI*AF[AX].b))].join(",")+")";break;case"path":AS=[];for(var AV=0,Ac=AL[AX].length;AV<Ac;AV++){AS[AV]=[AL[AX][AV][0]];for(var AU=1,AW=AL[AX][AV].length;AU<AW;AU++){AS[AV][AU]=+AL[AX][AV][AU]+AZ*AI*AF[AX][AV][AU];}AS[AV]=AS[AV].join(" ");}AS=AS.join(" ");break;case"csv":switch(AX){case"translation":var Aa=AF[AX][0]*(AT-AG),AY=AF[AX][1]*(AT-AG);AE.x+=Aa;AE.y+=AY;AS=[Aa,AY].join(" ");break;case"rotation":AS=+AL[AX][0]+AZ*AI*AF[AX][0];AL[AX][1]&&(AS+=","+AL[AX][1]+","+AL[AX][2]);break;case"scale":AS=[+AL[AX][0]+AZ*AI*AF[AX][0],+AL[AX][1]+AZ*AI*AF[AX][1],(2 in AR[AX]?AR[AX][2]:""),(3 in AR[AX]?AR[AX][3]:"")].join(" ");}break;}Ab[AX]=AS;}AB.attr(Ab);AB.animation_in_progress=setTimeout(AO);E.svg&&B.safari();}else{(AE.x||AE.y)&&AB.translate(-AE.x,-AE.y);AB.attr(AR);clearTimeout(AB.animation_in_progress);E.svg&&B.safari();(typeof z=="function")&&z.call(AB);}AG=AT;})();return this;};K.prototype.translate=function(R,i){if(R==null){return{x:this._.tx,y:this._.ty};}this._.tx+=+R;this._.ty+=+i;switch(this.type){case"circle":case"ellipse":this.attr({cx:+R+this.attrs.cx,cy:+i+this.attrs.cy});break;case"rect":case"image":case"text":this.attr({x:+R+this.attrs.x,y:+i+this.attrs.y});break;case"path":var e=C(this.attrs.path);e[0][1]+=+R;e[0][2]+=+i;this.attr({path:e});break;}return this;};var I=function(R){this.items=[];this.length=0;if(R){for(var e=0,y=R.length;e<y;e++){if(R[e]&&(R[e].constructor==K||R[e].constructor==I)){this[this.items.length]=this.items[this.items.length]=R[e];this.length++;}}}};I.prototype.push=function(){var z,R;for(var e=0,y=arguments.length;e<y;e++){z=arguments[e];if(z&&(z.constructor==K||z.constructor==I)){R=this.items.length;this[R]=this.items[R]=z;this.length++;}}return this;};I.prototype.pop=function(){delete this[this.length--];return this.items.pop();};for(var r in K.prototype){I.prototype[r]=(function(R){return function(){for(var e=0,y=this.items.length;e<y;e++){this.items[e][R].apply(this.items[e],arguments);}return this;};})(r);}I.prototype.attr=function(e,AB){if(e&&E.isArray(e)&&typeof e[0]=="object"){for(var R=0,AA=e.length;R<AA;R++){this.items[R].attr(e[R]);}}else{for(var y=0,z=this.items.length;y<z;y++){this.items[y].attr.apply(this.items[y],arguments);}}return this;};I.prototype.getBBox=function(){var R=[],AC=[],e=[],AA=[];for(var z=this.items.length;z--;){var AB=this.items[z].getBBox();R.push(AB.x);AC.push(AB.y);e.push(AB.x+AB.width);AA.push(AB.y+AB.height);}R=Math.min.apply(Math,R);AC=Math.min.apply(Math,AC);return{x:R,y:AC,width:Math.max.apply(Math,e)-R,height:Math.max.apply(Math,AA)-AC};};E.registerFont=function(e){if(!e.face){return e;}this.fonts=this.fonts||{};var y={w:e.w,face:{},glyphs:{}},i=e.face["font-family"];for(var AB in e.face){y.face[AB]=e.face[AB];}if(this.fonts[i]){this.fonts[i].push(y);}else{this.fonts[i]=[y];}if(!e.svg){y.face["units-per-em"]=parseInt(e.face["units-per-em"],10);for(var z in e.glyphs){var AA=e.glyphs[z];y.glyphs[z]={w:AA.w,k:{},d:AA.d&&"M"+AA.d.replace(/[mlcxtrv]/g,function(AC){return{l:"L",c:"C",x:"z",t:"m",r:"l",v:"c"}[AC]||"M";})+"z"};if(AA.k){for(var R in AA.k){y.glyphs[z].k[R]=AA.k[R];}}}}return e;};B.getFont=function(AD,AE,e,z){z=z||"normal";e=e||"normal";AE=+AE||{normal:400,bold:700,lighter:300,bolder:800}[AE]||400;var AA=E.fonts[AD];if(!AA){var y=new RegExp("(^|\\s)"+AD.replace(/[^\w\d\s+!~.:_-]/g,"")+"(\\s|$)","i");for(var R in E.fonts){if(y.test(R)){AA=E.fonts[R];break;}}}var AB;if(AA){for(var AC=0,AF=AA.length;AC<AF;AC++){AB=AA[AC];if(AB.face["font-weight"]==AE&&(AB.face["font-style"]==e||!AB.face["font-style"])&&AB.face["font-stretch"]==z){break;}}}return AB;};B.print=function(AG,AF,AD,e,AK){var AB=this.set(),AE=(AD+"").split(""),R=0,AJ="",AA;typeof e=="string"&&(e=this.getFont(e));if(e){AA=(AK||16)/e.face["units-per-em"];for(var AC=0,AH=AE.length;AC<AH;AC++){var z=AC&&e.glyphs[AE[AC-1]]||{},AI=e.glyphs[AE[AC]];R+=AC?(z.w||e.w)+(z.k&&z.k[AE[AC]]||0):0;AI&&AI.d&&AB.push(this.path(AI.d).attr({fill:"#000",stroke:"none",translation:[R,0]}));}AB.scale(AA,AA,0,AF).translate(AG,(AK||16)/2);}return AB;};E.format=function(e){var R=E.isArray(arguments[1])?[0].concat(arguments[1]):arguments;e&&typeof e=="string"&&R.length-1&&(e=e.replace(/\{(\d+)\}/g,function(z,y){return R[++y]||"";}));return e;};E.ninja=function(){var R=window.Raphael;if(p.was){window.Raphael=p.is;}else{try{delete window.Raphael;}catch(i){window.Raphael=void (0);}}return R;};E.el=K.prototype;return E;})();

/*!
 * g.Raphael 0.3 - Charting library, based on Raphaël
 *
 * Copyright (c) 2009 Dmitry Baranovskiy (http://g.raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
(function(){Raphael.fn.g=Raphael.fn.g||{};Raphael.fn.g.markers={disc:"disc",o:"disc",square:"square",s:"square",triangle:"triangle",t:"triangle",star:"star","*":"star",cross:"cross",x:"cross",plus:"plus","+":"plus",arrow:"arrow","->":"arrow"};Raphael.fn.g.txtattr={font:"12px Arial, sans-serif"};Raphael.fn.g.colors=[];var B=[0.6,0.2,0.05,0.1333,0.75,0];for(var A=0;A<10;A++){if(A<B.length){Raphael.fn.g.colors.push("hsb("+B[A]+", .75, .75)");}else{Raphael.fn.g.colors.push("hsb("+B[A-B.length]+", 1, .5)");}}Raphael.fn.g.text=function(C,E,D){return this.text(C,E,D).attr(this.g.txtattr);};Raphael.fn.g.labelise=function(C,E,D){if(C){return(C+"").replace(/(##+(?:\.#+)?)|(%%+(?:\.%+)?)/g,function(F,H,G){if(H){return(+E).toFixed(H.replace(/^#+\.?/g,"").length);}if(G){return(E*100/D).toFixed(G.replace(/^%+\.?/g,"").length)+"%";}});}else{return(+E).toFixed(0);}};Raphael.fn.g.finger=function(I,H,D,J,E,F,G){if((E&&!J)||(!E&&!D)){return G?"":this.path();}F={square:"square",sharp:"sharp",soft:"soft"}[F]||"round";var L;J=Math.round(J);D=Math.round(D);I=Math.round(I);H=Math.round(H);switch(F){case"round":if(!E){var C=Math.floor(J/2);if(D<C){C=D;L=["M",I+0.5,H+0.5-Math.floor(J/2),"l",0,0,"a",C,Math.floor(J/2),0,0,1,0,J,"l",0,0,"z"];}else{L=["M",I+0.5,H+0.5-C,"l",D-C,0,"a",C,C,0,1,1,0,J,"l",C-D,0,"z"];}}else{var C=Math.floor(D/2);if(J<C){C=J;L=["M",I-Math.floor(D/2)+0.001,H+0.001,"l",0,0,"a",Math.floor(D/2),C,0,0,1,D,0,"l",0,0,"z"];}else{L=["M",I-C+0.001,H+0.001,"l",0,C-J,"a",C,C,0,1,1,D,0,"l",0,J-C,"z"];}}break;case"sharp":if(!E){var K=Math.floor(J/2);L=["M",I+0.5,H+0.5+K,"l",0,-J,Math.max(D-K,0),0,Math.min(K,D),K,-Math.min(K,D),K+(K*2<J),"z"];}else{var K=Math.floor(D/2);L=["M",I+K+0.001,H+0.001,"l",-D,0,0,-Math.max(J-K,0),K,-Math.min(K,J),K,Math.min(K,J),K,"z"];}break;case"square":if(!E){L=["M",I,H+Math.floor(J/2),"l",0,-J,D,0,0,J,"z"];}else{L=["M",I+0.001+Math.floor(D/2),H-0.001,"l",1-D,0,0,-J,D-1,0,"z"];}break;case"soft":var C;if(!E){C=Math.min(D,Math.round(J/5));L=["M",I+0.5,H+0.5-Math.floor(J/2),"l",D-C,0,"a",C,C,0,0,1,C,C,"l",0,J-C*2,"a",C,C,0,0,1,-C,C,"l",C-D,0,"z"];}else{C=Math.min(Math.round(D/5),J);L=["M",I-Math.floor(D/2),H,"l",0,C-J,"a",C,C,0,0,1,C,-C,"l",D-2*C,0,"a",C,C,0,0,1,C,C,"l",0,J-C,"z"];}}if(G){return L.join(",");}else{return this.path(L);}};Raphael.fn.g.disc=function(C,E,D){return this.circle(C,E,D);};Raphael.fn.g.line=function(C,E,D){return this.rect(C-D,E-D/5,2*D,2*D/5);};Raphael.fn.g.square=function(C,E,D){D=D*0.7;return this.rect(C-D,E-D,2*D,2*D);};Raphael.fn.g.triangle=function(C,E,D){D*=1.75;return this.path("M".concat(C,",",E,"m0-",D*0.58,"l",D*0.5,",",D*0.87,"-",D,",0z"));};Raphael.fn.g.star=function(C,I,H,D){D=D||H*0.5;var G=["M",C,I+D,"L"],F;for(var E=1;E<10;E++){F=E%2?H:D;G=G.concat([(C+F*Math.sin(E*Math.PI*0.2)).toFixed(3),(I+F*Math.cos(E*Math.PI*0.2)).toFixed(3)]);}G.push("z");return this.path(G);};Raphael.fn.g.cross=function(C,E,D){D=D/2.5;return this.path("M".concat(C-D,",",E,"l",[-D,-D,D,-D,D,D,D,-D,D,D,-D,D,D,D,-D,D,-D,-D,-D,D,-D,-D,"z"]));};Raphael.fn.g.plus=function(C,E,D){D=D/2;return this.path("M".concat(C-D/2,",",E-D/2,"l",[0,-D,D,0,0,D,D,0,0,D,-D,0,0,D,-D,0,0,-D,-D,0,0,-D,"z"]));};Raphael.fn.g.arrow=function(C,E,D){return this.path("M".concat(C-D*0.7,",",E-D*0.4,"l",[D*0.6,0,0,-D*0.4,D,D*0.8,-D,D*0.8,0,-D*0.4,-D*0.6,0],"z"));};Raphael.fn.g.tag=function(C,J,I,H,F){H=H||0;F=F==null?5:F;I=I==null?"$9.99":I;var E=0.5522*F,D=this.set(),G=3;D.push(this.path().attr({fill:"#000",stroke:"none"}));D.push(this.text(C,J,I).attr(this.g.txtattr).attr({fill:"#fff"}));D.update=function(){this.rotate(0,C,J);var L=this[1].getBBox();if(L.height>=F*2){this[0].attr({path:["M",C,J+F,"a",F,F,0,1,1,0,-F*2,F,F,0,1,1,0,F*2,"m",0,-F*2-G,"a",F+G,F+G,0,1,0,0,(F+G)*2,"L",C+F+G,J+L.height/2+G,"l",L.width+2*G,0,0,-L.height-2*G,-L.width-2*G,0,"L",C,J-F-G].join(",")});}else{var K=Math.sqrt(Math.pow(F+G,2)-Math.pow(L.height/2+G,2));this[0].attr({path:["M",C,J+F,"c",-E,0,-F,E-F,-F,-F,0,-E,F-E,-F,F,-F,E,0,F,F-E,F,F,0,E,E-F,F,-F,F,"M",C+K,J-L.height/2-G,"a",F+G,F+G,0,1,0,0,L.height+2*G,"l",F+G-K+L.width+2*G,0,0,-L.height-2*G,"L",C+K,J-L.height/2-G].join(",")});}this[1].attr({x:C+F+G+L.width/2,y:J});H=(360-H)%360;this.rotate(H,C,J);H>90&&H<270&&this[1].attr({x:C-F-G-L.width/2,y:J,rotation:[180+H,C,J]});return this;};D.update();return D;};Raphael.fn.g.popupit=function(H,G,I,D,N){D=D==null?2:D;N=N||5;H=Math.round(H)+0.5;G=Math.round(G)+0.5;var F=I.getBBox(),J=Math.round(F.width/2),E=Math.round(F.height/2),M=[0,J+N*2,0,-J-N*2],K=[-E*2-N*3,-E-N,0,-E-N],C=["M",H-M[D],G-K[D],"l",-N,(D==2)*-N,-Math.max(J-N,0),0,"a",N,N,0,0,1,-N,-N,"l",0,-Math.max(E-N,0),(D==3)*-N,-N,(D==3)*N,-N,0,-Math.max(E-N,0),"a",N,N,0,0,1,N,-N,"l",Math.max(J-N,0),0,N,!D*-N,N,!D*N,Math.max(J-N,0),0,"a",N,N,0,0,1,N,N,"l",0,Math.max(E-N,0),(D==1)*N,N,(D==1)*-N,N,0,Math.max(E-N,0),"a",N,N,0,0,1,-N,N,"l",-Math.max(J-N,0),0,"z"].join(","),L=[{x:H,y:G+N*2+E},{x:H-N*2-J,y:G},{x:H,y:G-N*2-E},{x:H+N*2+J,y:G}][D];I.translate(L.x-J-F.x,L.y-E-F.y);return this.path(C).attr({fill:"#000",stroke:"none"}).insertBefore(I.node?I:I[0]);};Raphael.fn.g.popup=function(C,I,H,D,F){D=D==null?2:D;F=F||5;H=H||"$9.99";var E=this.set(),G=3;E.push(this.path().attr({fill:"#000",stroke:"none"}));E.push(this.text(C,I,H).attr(this.g.txtattr).attr({fill:"#fff"}));E.update=function(L,K,M){L=L||C;K=K||I;var O=this[1].getBBox(),P=O.width/2,N=O.height/2,S=[0,P+F*2,0,-P-F*2],Q=[-N*2-F*3,-N-F,0,-N-F],J=["M",L-S[D],K-Q[D],"l",-F,(D==2)*-F,-Math.max(P-F,0),0,"a",F,F,0,0,1,-F,-F,"l",0,-Math.max(N-F,0),(D==3)*-F,-F,(D==3)*F,-F,0,-Math.max(N-F,0),"a",F,F,0,0,1,F,-F,"l",Math.max(P-F,0),0,F,!D*-F,F,!D*F,Math.max(P-F,0),0,"a",F,F,0,0,1,F,F,"l",0,Math.max(N-F,0),(D==1)*F,F,(D==1)*-F,F,0,Math.max(N-F,0),"a",F,F,0,0,1,-F,F,"l",-Math.max(P-F,0),0,"z"].join(","),R=[{x:L,y:K+F*2+N},{x:L-F*2-P,y:K},{x:L,y:K-F*2-N},{x:L+F*2+P,y:K}][D];if(M){this[0].animate({path:J},500,">");this[1].animate(R,500,">");}else{this[0].attr({path:J});this[1].attr(R);}return this;};return E.update(C,I);};Raphael.fn.g.flag=function(C,H,G,F){F=F||0;G=G||"$9.99";var D=this.set(),E=3;D.push(this.path().attr({fill:"#000",stroke:"none"}));D.push(this.text(C,H,G).attr(this.g.txtattr).attr({fill:"#fff"}));D.update=function(I,L){this.rotate(0,I,L);var K=this[1].getBBox(),J=K.height/2;this[0].attr({path:["M",I,L,"l",J+E,-J-E,K.width+2*E,0,0,K.height+2*E,-K.width-2*E,0,"z"].join(",")});this[1].attr({x:I+J+E+K.width/2,y:L});F=360-F;this.rotate(F,I,L);F>90&&F<270&&this[1].attr({x:I-r-E-K.width/2,y:L,rotation:[180+F,I,L]});return this;};return D.update(C,H);};Raphael.fn.g.label=function(C,F,E){var D=this.set();D.push(this.rect(C,F,10,10).attr({stroke:"none",fill:"#000"}));D.push(this.text(C,F,E).attr(this.g.txtattr).attr({fill:"#fff"}));D.update=function(){var H=this[1].getBBox(),G=Math.min(H.width+10,H.height+10)/2;this[0].attr({x:H.x-G/2,y:H.y-G/2,width:H.width+G,height:H.height+G,r:G});};D.update();return D;};Raphael.fn.g.labelit=function(E){var D=E.getBBox(),C=Math.min(20,D.width+10,D.height+10)/2;return this.rect(D.x-C/2,D.y-C/2,D.width+C,D.height+C,C).attr({stroke:"none",fill:"#000"}).insertBefore(E[0]);};Raphael.fn.g.drop=function(C,H,G,E,F){E=E||30;F=F||0;var D=this.set();D.push(this.path(["M",C,H,"l",E,0,"A",E*0.4,E*0.4,0,1,0,C+E*0.7,H-E*0.7,"z"]).attr({fill:"#000",stroke:"none",rotation:[22.5-F,C,H]}));F=(F+90)*Math.PI/180;D.push(this.text(C+E*Math.sin(F),H+E*Math.cos(F),G).attr(this.g.txtattr).attr({"font-size":E*12/30,fill:"#fff"}));D.drop=D[0];D.text=D[1];return D;};Raphael.fn.g.blob=function(D,J,I,H){var H=(+H+1?H:45)+90,F=12,C=Math.PI/180,G=F*12/12;var E=this.set();E.push(this.path().attr({fill:"#000",stroke:"none"}));E.push(this.text(D+F*Math.sin((H)*C),J+F*Math.cos((H)*C)-G/2,I).attr(this.g.txtattr).attr({"font-size":G,fill:"#fff"}));E.update=function(P,O,T){P=P||D;O=O||J;var V=this[1].getBBox(),a=Math.max(V.width+G,F*25/12),U=Math.max(V.height+G,F*25/12),L=P+F*Math.sin((H-22.5)*C),W=O+F*Math.cos((H-22.5)*C),N=P+F*Math.sin((H+22.5)*C),Z=O+F*Math.cos((H+22.5)*C),c=(N-L)/2,b=(Z-W)/2,M=a/2,K=U/2,S=-Math.sqrt(Math.abs(M*M*K*K-M*M*b*b-K*K*c*c)/(M*M*b*b+K*K*c*c)),R=S*M*b/K+(N+L)/2,Q=S*-K*c/M+(Z+W)/2;if(T){this.animate({x:R,y:Q,path:["M",D,J,"L",N,Z,"A",M,K,0,1,1,L,W,"z"].join(",")},500,">");}else{this.attr({x:R,y:Q,path:["M",D,J,"L",N,Z,"A",M,K,0,1,1,L,W,"z"].join(",")});}return this;};E.update(D,J);return E;};Raphael.fn.g.colorValue=function(F,E,D,C){return"hsb("+[Math.min((1-F/E)*0.4,1),D||0.75,C||0.75]+")";};Raphael.fn.g.snapEnds=function(I,J,H){var F=I,K=J;if(F==K){return{from:F,to:K,power:0};}function L(M){return Math.abs(M-0.5)<0.25?Math.floor(M)+0.5:Math.round(M);}var G=(K-F)/H,C=Math.floor(G),E=C,D=0;if(C){while(E){D--;E=Math.floor(G*Math.pow(10,D))/Math.pow(10,D);}D++;}else{while(!C){D=D||1;C=Math.floor(G*Math.pow(10,D))/Math.pow(10,D);D++;}D&&D--;}var K=L(J*Math.pow(10,D))/Math.pow(10,D);if(K<J){K=L((J+0.5)*Math.pow(10,D))/Math.pow(10,D);}var F=L((I-(D>0?0:0.5))*Math.pow(10,D))/Math.pow(10,D);return{from:F,to:K,power:D};};Raphael.fn.g.axis=function(N,M,I,W,F,b,G,e,H,C){C=C==null?2:C;H=H||"t";b=b||10;var V=H=="|"||H==" "?["M",N+0.5,M,"l",0,0.001]:G==1||G==3?["M",N+0.5,M,"l",0,-I]:["M",N,M+0.5,"l",I,0],P=this.g.snapEnds(W,F,b),c=P.from,R=P.to,a=P.power,Z=0,S=this.set();d=(R-c)/b;var L=c,K=a>0?a:0;O=I/b;if(+G==1||+G==3){var D=M,Q=(G-1?1:-1)*(C+3+!!(G-1));while(D>=M-I){H!="-"&&H!=" "&&(V=V.concat(["M",N-(H=="+"||H=="|"?C:!(G-1)*C*2),D+0.5,"l",C*2+1,0]));S.push(this.text(N+Q,D,(e&&e[Z++])||(Math.round(L)==L?L:+L.toFixed(K))).attr(this.g.txtattr).attr({"text-anchor":G-1?"start":"end"}));L+=d;D-=O;}if(Math.round(D+O-(M-I))){H!="-"&&H!=" "&&(V=V.concat(["M",N-(H=="+"||H=="|"?C:!(G-1)*C*2),M-I+0.5,"l",C*2+1,0]));S.push(this.text(N+Q,M-I,(e&&e[Z])||(Math.round(L)==L?L:+L.toFixed(K))).attr(this.g.txtattr).attr({"text-anchor":G-1?"start":"end"}));}}else{var E=N,L=c,K=a>0?a:0,Q=(G?-1:1)*(C+9+!G),O=I/b,T=0,U=0;while(E<=N+I){H!="-"&&H!=" "&&(V=V.concat(["M",E+0.5,M-(H=="+"?C:!!G*C*2),"l",0,C*2+1]));S.push(T=this.text(E,M+Q,(e&&e[Z++])||(Math.round(L)==L?L:+L.toFixed(K))).attr(this.g.txtattr));var J=T.getBBox();if(U>=J.x-5){S.pop(S.length-1).remove();}else{U=J.x+J.width;}L+=d;E+=O;}if(Math.round(E-O-N-I)){H!="-"&&H!=" "&&(V=V.concat(["M",N+I+0.5,M-(H=="+"?C:!!G*C*2),"l",0,C*2+1]));S.push(this.text(N+I,M+Q,(e&&e[Z])||(Math.round(L)==L?L:+L.toFixed(K))).attr(this.g.txtattr));}}var g=this.path(V);g.text=S;g.all=this.set([g,S]);g.remove=function(){this.text.remove();this.constructor.prototype.remove.call(this);};return g;};Raphael.el.lighter=function(D){D=D||2;var C=[this.attrs.fill,this.attrs.stroke];this.fs=this.fs||[C[0],C[1]];C[0]=Raphael.rgb2hsb(Raphael.getRGB(C[0]).hex);C[1]=Raphael.rgb2hsb(Raphael.getRGB(C[1]).hex);C[0].b=Math.min(C[0].b*D,1);C[0].s=C[0].s/D;C[1].b=Math.min(C[1].b*D,1);C[1].s=C[1].s/D;this.attr({fill:"hsb("+[C[0].h,C[0].s,C[0].b]+")",stroke:"hsb("+[C[1].h,C[1].s,C[1].b]+")"});};Raphael.el.darker=function(D){D=D||2;var C=[this.attrs.fill,this.attrs.stroke];this.fs=this.fs||[C[0],C[1]];C[0]=Raphael.rgb2hsb(Raphael.getRGB(C[0]).hex);C[1]=Raphael.rgb2hsb(Raphael.getRGB(C[1]).hex);C[0].s=Math.min(C[0].s*D,1);C[0].b=C[0].b/D;C[1].s=Math.min(C[1].s*D,1);C[1].b=C[1].b/D;this.attr({fill:"hsb("+[C[0].h,C[0].s,C[0].b]+")",stroke:"hsb("+[C[1].h,C[1].s,C[1].b]+")"});};Raphael.el.original=function(){if(this.fs){this.attr({fill:this.fs[0],stroke:this.fs[1]});delete this.fs;}};})();

/*
 * g.Raphael 0.3 - Charting library, based on Raphaël
 *
 * Copyright (c) 2009 Dmitry Baranovskiy (http://g.raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
Raphael.fn.g.piechart=function(E,D,N,B,K){K=K||{};var J=this,L=[],G=this.set(),M=this.set(),I=this.set(),R=[],T=B.length,U=0,X=0,W=0,C=9,V=true;M.covers=G;if(T==1){I.push(this.circle(E,D,N).attr({fill:this.g.colors[0],stroke:opt.stroke||"#fff","stroke-width":K.strokewidth==null?1:K.strokewidth}));G.push(this.circle(E,D,N).attr({fill:"#000",opacity:0,"stroke-width":3}));X=B[0];B[0]={value:B[0],order:0,valueOf:function(){return this.value;}};I[0].middle={x:E,y:D};I[0].mangle=180;}else{function Q(e,d,Y,g,c,l){var i=Math.PI/180,a=e+Y*Math.cos(-g*i),Z=e+Y*Math.cos(-c*i),f=e+Y/2*Math.cos(-(g+(c-g)/2)*i),k=d+Y*Math.sin(-g*i),j=d+Y*Math.sin(-c*i),b=d+Y/2*Math.sin(-(g+(c-g)/2)*i),h=["M",e,d,"L",a,k,"A",Y,Y,0,+(Math.abs(c-g)>180),1,Z,j,"z"];h.middle={x:f,y:b};return h;}for(var S=0;S<T;S++){X+=B[S];B[S]={value:B[S],order:S,valueOf:function(){return this.value;}};}B.sort(function(Z,Y){return Y.value-Z.value;});for(var S=0;S<T;S++){if(V&&B[S]*360/X<=1.5){C=S;V=false;}if(S>C){V=false;B[C].value+=B[S];B[C].others=true;W=B[C].value;}}T=Math.min(C+1,B.length);W&&B.splice(T)&&(B[C].others=true);for(var S=0;S<T;S++){var F=U-360*B[S]/X/2;if(!S){U=90-F;F=U-360*B[S]/X/2;}if(K.init){var H=Q(E,D,1,U,U-360*B[S]/X).join(",");}var P=Q(E,D,N,U,U-=360*B[S]/X);var O=this.path(K.init?H:P).attr({fill:K.colors&&K.colors[S]||this.g.colors[S]||"#666",stroke:K.stroke||"#fff","stroke-width":(K.strokewidth==null?1:K.strokewidth),"stroke-linejoin":"round"});O.value=B[S];O.middle=P.middle;O.mangle=F;L.push(O);I.push(O);K.init&&O.animate({path:P.join(",")},(+K.init-1)||1000,">");}for(var S=0;S<T;S++){var O=J.path(L[S].attr("path")).attr({fill:"#000",opacity:0,"stroke-width":3});K.href&&K.href[S]&&O.attr({href:K.href[S]});O.attr=function(){};G.push(O);I.push(O);}}M.hover=function(b,Z){Z=Z||function(){};var a=this;for(var Y=0;Y<T;Y++){(function(d,e,c){var f={sector:d,cover:e,cx:E,cy:D,mx:d.middle.x,my:d.middle.y,mangle:d.mangle,r:N,value:B[c],total:X,label:a.labels&&a.labels[c]};e.mouseover(function(){b.call(f);}).mouseout(function(){Z.call(f);});})(I[Y],G[Y],Y);}return this;};M.each=function(a){var Z=this;for(var Y=0;Y<T;Y++){(function(c,d,b){var e={sector:c,cover:d,cx:E,cy:D,x:c.middle.x,y:c.middle.y,mangle:c.mangle,r:N,value:B[b],total:X,label:Z.labels&&Z.labels[b]};a.call(e);})(I[Y],G[Y],Y);}return this;};M.click=function(a){var Z=this;for(var Y=0;Y<T;Y++){(function(c,d,b){var e={sector:c,cover:d,cx:E,cy:D,mx:c.middle.x,my:c.middle.y,mangle:c.mangle,r:N,value:B[b],total:X,label:Z.labels&&Z.labels[b]};d.click(function(){a.call(e);});})(I[Y],G[Y],Y);}return this;};M.inject=function(Y){Y.insertBefore(G[0]);};var A=function(f,a,Z,Y){var m=E+N+N/5,l=D,e=l+10;f=f||[];Y=(Y&&Y.toLowerCase&&Y.toLowerCase())||"east";Z=J.g.markers[Z&&Z.toLowerCase()]||"disc";M.labels=J.set();for(var d=0;d<T;d++){var n=I[d].attr("fill"),b=B[d].order,c;B[d].others&&(f[b]=a||"Others");f[b]=J.g.labelise(f[b],B[d],X);M.labels.push(J.set());M.labels[d].push(J.g[Z](m+5,e,5).attr({fill:n,stroke:"none"}));M.labels[d].push(c=J.text(m+20,e,f[b]||B[b]).attr(J.g.txtattr).attr({fill:K.legendcolor||"#000","text-anchor":"start"}));G[d].label=M.labels[d];e+=c.getBBox().height*1.2;}var g=M.labels.getBBox(),k={east:[0,-g.height/2],west:[-g.width-2*N-20,-g.height/2],north:[-N-g.width/2,-N-g.height-10],south:[-N-g.width/2,N+10]}[Y];M.labels.translate.apply(M.labels,k);M.push(M.labels);};if(K.legend){A(K.legend,K.legendothers,K.legendmark,K.legendpos);}M.push(I,G);M.series=I;M.covers=G;return M;};

var drawGraphs = function () {
  if ($("ul.taglist").length != 0) {

    // grab the data values from the page 
    var tags = [],
        tag_count = [],
        tag_label = [],
        tag_href = [];
    $("a:not(.common)", "ul.taglist").each(function(i) {
      var $tag = $(this);
      tags.push({value: parseFloat($tag.attr("data-tag_count")), text: $tag.text(), href: $tag.attr("href")});
    });
    
    // structure the data
    tags = tags.sort(function (a, b) {
      return b.value - a.value;
    }).splice(0, 10);
    for (var i=0, ii = tags.length; i < ii; i++) {
      tag_count.push(tags[i].value);
      tag_label.push("%% - " + tags[i].text);
      tag_href.push(tags[i].href);
    }
    
    // Create a canvas
    $("<div id=\"graph\"/>").insertAfter($("h1", "#tagspace"));
    var r = Raphael("graph", "30em", "16em");
    
    // Draw piechart
    var pie = r.g.piechart(300, 120, 100, tag_count, {legend: tag_label, legendpos: "west", href: tag_href});
    pie.labels.attr({font: '1.1em "Helvetica Neue"', translation: "-50 0"});

    // Assign hrefs to legend labels
    $(pie.labels).each(function (i) {
      pie.labels[i].attr({href: tag_href[i]});
    });

    // Set up funky hover states
    pie.hover(function () {
        this.sector.stop();
        this.sector.animate({scale: [1.1, 1.1, this.cx, this.cy]}, 500, "elastic");
        if (this.label) {
            this.label[0].stop();
            this.label[0].animate({scale: 1.5}, 250);
            this.label[1].attr({fill: "#ff8000"});
        }
    }, function () {
        this.sector.animate({scale: [1, 1, this.cx, this.cy]}, 500, "bounce");
        if (this.label) {
            this.label[0].animate({scale: 1}, 250);
            this.label[1].attr({fill: "#000"});
        }
    });
  }
};

function twitterCallback2(json) {

  var status = $(document.createElement("strong"));
  var twitters = json;
  var username = "";
  var tweetText = "";
  
  for (var i=0, ii = twitters.length; i<ii; i++){
    username = twitters[i].user.screen_name;
    
    tweetText = twitters[i].text;
        
    if (tweetText.substr(0,1) != "@"){
      
      // URL regex. I think that's everything, but it's probably not
      var statusText = twitters[i].text.replace(/((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi,'<a href="$1">$1</a>');
      
      // real comments
      statusText = statusText.replace(/(\s@+[a-zA-Z_]{1,})/gi,'<a href="http://twitter.com/$1">$1</a>');
      
      // real comments
      statusText = statusText.replace(/(http:\/\/twitter.com\/\s@)/gi, 'http://twitter.com/');
      
      $(status).html(statusText);  
      
      var statusLink = $("<a>Permalink</a>"); 
      statusLink.attr({
        href: "http://twitter.com/" + username + "/statuses/" + twitters[i].id,
        id: "status-link"
      });
      
      break;
    }
  }
  
  // just in case I've managed to do 10 replies without a straight-up tweet
  if (!$(status).text() == "") {
    var para = $(document.createElement("p"));
    para.append(status).append(statusLink);

    $("#status").empty().append(para);
  }
}

var addTwitter = function() {
    if ($("#status").length != 0) {
        var script = $(document.createElement("script"));
          script.attr("src", "http://twitter.com/statuses/user_timeline/lachlanhardy.json?callback=twitterCallback2&count=10");

          $("body").append(script);

    }
};


var addRSSbutton = function() {
  var $rssLink = $("#rss-button"),
      paper = Raphael("rss-button", "60", "60"),
      icon = paper.set();

  $rssLink.children("span").hide();
  $rssLink.css({
    background: "transparent",
    margin: 0,
    width: "51px"
  });
  icon.push(
    paper.circle(8, 50, 8), 
    paper.path("M38.777, 58.5 H27.412 c0-15.139-12.273-27.412-27.412-27.412 l0, 0 V19.723 C21.416, 19.723, 38.777, 37.083, 38.777, 58.5z"), 
    paper.path("M46.8, 58.5 c0-25.847-20.953-46.8-46.8-46.8 V0 c32.308, 0, 58.5, 26.191, 58.5, 58.5 H46.8z")
  ).attr({
    fill : "#fff",
    stroke : "#fff"
  });
};

function githubActivity() {
  if ($("#github").length != 0) {

    var username = "lachlanhardy";
    var url = "";

    $.getJSON("http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20atom%20where%20url%3D%22http%3A%2F%2Fgithub.com%2F" + username + ".atom%22&format=json&callback=?",
    function(feed){

     var item = feed.query.results.entry; 
     $(item).each(function(i){
       var v = item[i].id;
       var idValue = v.match(/([^\/]*):([^\/]*)\/([^\/]*)$/);
       var eventType = idValue[2];

       // only for CommitEvents right now - need to bust out other events as options
       switch(eventType) {
         case 'CommitEvent':
           if (url == "") {
             url = item[i].link.href;
             titleText = " committed to ";
             return url;
             return titleText;
           }
           break;
         case 'FollowEvent':
           //
           break;
         case 'GistEvent':
           //
           break;
         case 'WikiEvent':
           //
           break;
       }
     });

     // grabbing details from URL
     var v = url.match(/http:\/\/github.com\/([^\/]*)\/([^\/]*)\/commit\/([^\/]*)$/);
     var user = v[1];
     var repo = v[2];
     var id = v[3];
     var repoName = user + "/" + repo;

     $.getJSON("http://github.com/api/v1/json/" + repoName + "/commit/" + id + "?callback=?",
       function(data){

         // creating initial elements
         var dl = $(document.createElement("dl"));
         var dt = $(document.createElement("dt"));
         var dtStrong = $(document.createElement("strong"));

         // linking username with REL microformat
         var dtUser = $(document.createElement("a"));
         dtUser.attr("href", "http://github.com/" + username).attr("rel", "me").text(username);

         // Adding username and eventText to dtStrong
         dtStrong.append(dtUser).append(titleText);

         // Linking repo name
         var repoAnchor = $(document.createElement("a"));
         repoAnchor.attr("href", "http://github.com/" + repoName).text(repoName);
         dtStrong.append(repoAnchor);

         // Building date for prettifying
         var dateSpan = $(document.createElement("span"));
         var dateTime = parseDate(data.commit.committed_date); // converts date to format Pretty Date recognises
         dateSpan.addClass("date").text(dateTime).attr("title", dateTime);
         dateSpan.prettyDate();
         setInterval(function(){ dateSpan.prettyDate(); }, 5000);

         // add dtStrong and dateSpan to DT
         dt.append(dtStrong).append(dateSpan);

         // Linking message to commit
         var ddMessage = $(document.createElement("dd"));
         messageAnchor = $(document.createElement("a"));
         messageAnchor.attr("href", url).text(data.commit.message);
         ddMessage.append(messageAnchor);

         // Listing all changed files
         var ddFilenames = $(document.createElement("dd"));
         ddFilenames.addClass("filenames");
         var filenamesUl = $(document.createElement("ul"));
         $(data.commit.modified).each(function(i){
           filenamesUl.append($(document.createElement("li")).text(data.commit.modified[i].filename));
         });
         ddFilenames.append(filenamesUl);

         // Adding content to DL
         dl.append(dt).append(ddMessage).append(ddFilenames);

         // Replacing static HTML with new hottness
         $("#github p").replaceWith(dl);

       });
    });
  }
}

function parseDate(dateTime) {
  var timeZone = 10; // or "-3" as appropriate
  
  // TODO: need to add date changing functionality too
  dateTime = dateTime.substring(0,19) + "Z";
  var theirTime = dateTime.substring(11,13);
  var ourTime = parseInt(theirTime,1) + 7 + timeZone;
  if (ourTime > 24) {
    ourTime = ourTime - 24;
  };
  dateTime = dateTime.replace("T" + theirTime, "T" + ourTime);
  return dateTime;
};


(function($){  
    $.fn.flickrPolaroid = function(options) {  

        var defaults = {
            tags: "lachlanhardy"
        };
        var options = $.extend(defaults, options);

        return this.each(function() {  
            canvas = $(this);
            
            function flickrPic(data) {

                var arr = jQuery.makeArray(data);
                var rndNum = Math.ceil(Math.random() * (data.items.length - 1));
                var item = data.items[rndNum];

                $("<a/>").attr("href", item.link)
                         .attr("id", "polaroid")
                         .prependTo(canvas);

                var imgWidth = parseInt(item.description.match(/width="(\d*)/)[1], 10);
                var imgHeight = parseInt(item.description.match(/height="(\d*)/)[1], 10);

                var paperWidth = (imgWidth + 40);
                var paperHeight = (imgHeight + 60);

                var rotations = [2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];
                var rotation = Math.ceil(Math.random() * (rotations.length - 1));

                var r = Raphael("polaroid", paperWidth + 100, paperHeight + 100);

                r.rect(55, 63, paperWidth, paperHeight).attr({
                  fill: "#000",
                  opacity: .15,
                  stroke: "#000",
                  "stroke-width": 4,
                  "stroke-opacity": .3
                }).rotate(rotations[rotation] - 1);

                r.rect(50, 55, paperWidth, paperHeight).attr({
                  fill: "#fff",
                  stroke: "#ddd",
                  "stroke-width": 2,
                  "stroke-opacity": .3
                }).rotate(rotations[rotation]);   

                canvas.css("margin", "-1.5em 0 1em 0");
                r.image(item.media.m, 70, 75, imgWidth, imgHeight).rotate(rotations[rotation]);

                var author = item.author;
                author = author.match(/\(([a-zA-z0-9 *]*)\)/);

                r.text(paperWidth - 85, paperHeight + 40, "Taken by " + author[1])
                 .attr({"font": '700 10px "Zapfino", "Marker Felt", "Papyrus", "URW Chancery L"'})
                 .rotate(rotations[rotation] - 2);

                var refreshLink = $("<a/>").text("Try another image.")
                                           .attr("id", "refresh-link")
                                           .attr("href", "#refresh")
                                           .click(function(e){
                                               canvas.css("margin", "0 0 1em 0");
                                               $("p span", canvas).remove();
                                               refreshLink.remove();
                                               r.remove();
                                               flickrPic(data);
                                               e.preventDefault();
                                           });

                $("p", canvas).append(" <span>Not me?</span> ").append(refreshLink);

            }

            function callFlickr() {
            $.getJSON("http://api.flickr.com/services/feeds/photos_public.gne?tags=" + options.tags +" &format=json&jsoncallback=?",
                function(data){
                    var text = $("p span", canvas);
                    $("#polaroid").add(text).add("#refresh-link").remove();

                    flickrPic(data);
                });
            };
            
            callFlickr();
            
            setInterval(callFlickr, 36000000); // 10 hourly updates - like we need it!
        });  
    };  
})(jQuery);


$(document).ready(function(){
  // making sexy unobtrusive CSS possible since 2006
  $("html").addClass("js");

  addRSSbutton();
  addTwitter();
  drawGraphs();
  $("#flickr-pic").flickrPolaroid();
  githubActivity();
});