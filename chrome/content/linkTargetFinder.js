var linkTargetFinder = function () {
	var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	return {
		init : function () {
			gBrowser.addEventListener("load", function () {
				var autoRun = prefManager.getBoolPref("extensions.linktargetfinder.autorun");
				if (autoRun) {
					linkTargetFinder.run();
				}
			}, false);
			this.checkIcoToolbar(!autoRun);
		},
		
		checkIcoToolbar : function(enabled){
			let docButton = window.document.getElementById('link-target-finder-toolbar-button');
			if (docButton) {
				if (enabled){
					docButton.style.listStyleImage = "url('chrome://linktargetfinder/skin/toolbar-large.png')";
					docButton.setAttribute("tooltiptext", "Redirects enabled");
				} else {
					docButton.style.listStyleImage = "url('chrome://linktargetfinder/skin/toolbar-large-off.png')";
					docButton.setAttribute("tooltiptext", "Redirects disabled");
				}
			}
		},
			
		run : function () {
			var autoRun = prefManager.getBoolPref("extensions.linktargetfinder.autorun");
			prefManager.setBoolPref("extensions.linktargetfinder.autorun", !autoRun);
			this.checkIcoToolbar(!autoRun);

			//var head = content.document.getElementsByTagName("head")[0],
			//	style = content.document.getElementById("link-target-finder-style"),
			//	allLinks = content.document.getElementsByTagName("a"),
			//	foundLinks = 0;
			//
			//if (!style) {
			//	console.log("creando style");
			//	style = content.document.createElement("link");
			//	style.id = "link-target-finder-style";
			//	style.type = "text/css";
			//	style.rel = "stylesheet";
			//	style.href = "chrome://linktargetfinder/skin/skin.css";
			//	head.appendChild(style);
			//}	
			//
			//for (var i=0, il=allLinks.length; i<il; i++) {
			//	elm = allLinks[i];
			//	if (elm.getAttribute("target")) {
			//		elm.className += ((elm.className.length > 0)? " " : "") + "link-target-finder-selected";
			//		foundLinks++;
			//	}
			//}
			//if (foundLinks === 0) {
			//	alert("No se han encontrado enlaces con un atributo target");
			//}
			//else {
			//	alert("Found " + foundLinks + " links with a target attribute");
			//}	
		}
	};
}();
window.addEventListener("load", linkTargetFinder.init, false);


var httpModifyObserver = {
	TOPIC_MODIFY_REQUEST : 'http-on-modify-request', 
	//RE_URL_TO_REDIRECT : /bing/g,
	
	observe : function(aSubject, aTopic, aData) {
		//console.log('observing to: ' + aTopic);
		var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
		var autoRun = prefManager.getBoolPref("extensions.linktargetfinder.autorun");
		
		if (this.TOPIC_MODIFY_REQUEST == aTopic && autoRun) {
			let url;
			aSubject.QueryInterface(Components.interfaces.nsIHttpChannel);
			url = aSubject.URI.spec;
			var decoded = this.cleanUrlRedirect(url);
			
			if (decoded != url){
				console.log('Redirecting to: ' + decoded);
				//aSubject.setRequestHeader("Referer", "http://example.com", false);
				aSubject.redirectTo(Services.io.newURI(decoded, null, null));
			}
		}
	},
	
	cleanUrlRedirect : function(aUrl){
		var decUrl = decodeURIComponent(aUrl);
		var cutPos = decUrl.lastIndexOf('http');
		
		if (cutPos > 0){
			decUrl = decUrl.substring(cutPos);
			if (decUrl.indexOf('&') >= 0 && decUrl.indexOf('?') < 0 && (decUrl.indexOf('&')+1) < decUrl.length){
				//Transforma the first & in ?
				decUrl = decUrl.replace('&','?');
			}
			return decUrl;
		}
		return aUrl;
	}
};

Services.obs.addObserver(httpModifyObserver, 'http-on-modify-request', false);


//const STATE_START = Ci.nsIWebProgressListener.STATE_START;
//const STATE_STOP = Ci.nsIWebProgressListener.STATE_STOP;
//var myListener = {
//    QueryInterface: XPCOMUtils.generateQI(["nsIWebProgressListener",
//                                           "nsISupportsWeakReference"]),
//
//    onStateChange: function(aWebProgress, aRequest, aFlag, aStatus) {
//        // If you use myListener for more than one tab/window, use
//        // aWebProgress.DOMWindow to obtain the tab/window which triggers the state change
//        if (aFlag & STATE_START) {
//            // This fires when the load event is initiated
//			alert("Inicio Pagina");
//        }
//        if (aFlag & STATE_STOP) {
//            // This fires when the load finishes
//			alert("Stop Pagina");
//        }
//    },
//
//    onLocationChange: function(aProgress, aRequest, aURI) {
//        // This fires when the location bar changes; that is load event is confirmed
//        // or when the user switches tabs. If you use myListener for more than one tab/window,
//        // use aProgress.DOMWindow to obtain the tab/window which triggered the change.
//		alert("On location change");
//    },
//
//    // For definitions of the remaining functions see related documentation
//    onProgressChange: function(aWebProgress, aRequest, curSelf, maxSelf, curTot, maxTot) {},
//    onStatusChange: function(aWebProgress, aRequest, aStatus, aMessage) {},
//    onSecurityChange: function(aWebProgress, aRequest, aState) {}
//}
//gBrowser.addProgressListener(myListener);

//var myExtension = {
//    oldURL: null,
//
//    init: function() {
//        gBrowser.addProgressListener(this);
//		alert('Init');
//    },
//
//    uninit: function() {
//        gBrowser.removeProgressListener(this);
//		alert('Uninit');
//    },
//
//    processNewURL: function(aURI) {
//        if (aURI.spec == this.oldURL) return;
//
//        // now we know the url is new...
//        alert('La url es: ' + aURI.spec);
//		
//        this.oldURL = aURI.spec;
//    },
//
//    // nsIWebProgressListener
//    QueryInterface: XPCOMUtils.generateQI(["nsIWebProgressListener",
//                                           "nsISupportsWeakReference"]),
//
//    onLocationChange: function(aProgress, aRequest, aURI) {
//        this.processNewURL(aURI);
//    },
//
//    onStateChange: function() {},
//    onProgressChange: function() {},
//    onStatusChange: function() {},
//    onSecurityChange: function() {}
//};
//
//window.addEventListener("load", function() { myExtension.init() }, false);
//window.addEventListener("unload", function() { myExtension.uninit() }, false);

//var httpResponseObserver = {
//	TOPIC_MODIFY_REQUEST : 'http-on-examine-response', 
//	RE_URL_TO_CANCEL : /www.meristation.es/g,
//	
//	observe : function(aSubject, aTopic, aData) {
//	  //console.log('observando: ' + aTopic);
//	  if (this.TOPIC_MODIFY_REQUEST == aTopic) {
//		let url;
//
//		aSubject.QueryInterface(Components.interfaces.nsIHttpChannel);
//		url = aSubject.URI.spec;
//		//console.log('observe: ' + url);
//		//if (RE_URL_TO_MODIFY.test(url)) { // RE_URL_TO_MODIFY is a regular expression.
//		//if (url == 'https://www.google.es') { // RE_URL_TO_MODIFY is a regular expression.
//		//	aSubject.setRequestHeader("Referer", "http://example.com", false);
//		//} else 
//		if (this.RE_URL_TO_CANCEL.test(url)) { // RE_URL_TO_CANCEL is a regular expression.
//			aSubject.cancel(Components.results.NS_BINDING_ABORTED);
//			console.log('Cancelando: ' + aTopic);
//		} 
//	  }
//	}
//};

//Services.obs.addObserver(httpResponseObserver, 'http-on-examine-response', false);
// Services.obs.removeObserver(httpResponseObserver, 'http-on-examine-response'); // call this when you dont want to listen anymore