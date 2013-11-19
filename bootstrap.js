
function australess(document) {

  // states to test:
  // * theme on/off
  // * nothing in back history
  // * nothing in forward history
  // * something in back history
  // * something in forward history
  // * ltr
  // * multiple windows at start
  // * new windows added after start

  // make back button match other toolbar buttons
  var back = document.querySelector('#back-button, #back-button:not(:-moz-lwtheme), #back-button:-moz-lwtheme, #back-button:-moz-window-inactive, #back-button:-moz-window-inactive:not(:-moz-lwtheme)')
  back.style.listStyleImage = 'url("chrome://browser/skin/Toolbar.png")'
  back.style.listStyleType = 'none'
  back.style.background = 'none'
  back.style.backgroundImage = 'none'
  back.style.MozImageRegion = 'rect(0px, 54px, 18px, 36px)'
  back.style.borderRadius = '0px'
  back.style.clipPath = 'none'
  back.style.width = '22px'
  back.style.minWidth = '22px'
  back.style.height = '22px'
  back.style.padding = '0px'
  back.style.paddingBottom = '1px'
  back.style.marginLeft = '0px'
  back.style.marginRight = '2px'
  back.style.paddingRight = '2px'
  back.style.border = 'none'
  back.style.boxShadow = 'none'
  
  // make forward button match other toolbar buttons
  var fwd = document.querySelector('#forward-button, #forward-button:not(:-moz-lwtheme), #forward-button:-moz-lwtheme, #forward-button:-moz-window-inactive, #forward-button:-moz-window-inactive:not(:-moz-lwtheme)')
  fwd.style.borderTop = 'none'
  fwd.style.borderBottom = 'none'
  fwd.style.borderLeft = 'none'
  fwd.style.boxShadow = 'none'
  fwd.style.paddingLeft = '0px'
  fwd.style.marginRight = '4px'
  fwd.style.width = '22px'
  fwd.style.minWidth = '22px'
  fwd.style.borderRight = 'none'
  fwd.style.background = 'none'
  
  // remove the keyhole
  document.querySelector('#osx-keyhole-forward-clip-path').remove()
  document.querySelector('#osx-urlbar-back-button-clip-path').remove()

  // reduce titlebar height
  var tb = document.querySelector('#titlebar')
  tb.height = '33px'
}


// boilerplate window watcher stuff from mossop's blog
const Cc = Components.classes;
const Ci = Components.interfaces;

var WindowListener = {
  setupBrowserUI: function(window) {
    let document = window.document;

    // do it
    australess(document)
  },

  tearDownBrowserUI: function(window) {
    let document = window.document;

    // Take any steps to remove UI or anything from the browser window
    // document.getElementById() etc. will work here
  },

  // nsIWindowMediatorListener functions
  onOpenWindow: function(xulWindow) {
    // A new window has opened
    let domWindow = xulWindow.QueryInterface(Ci.nsIInterfaceRequestor)
                             .getInterface(Ci.nsIDOMWindow);

    // Wait for it to finish loading
    domWindow.addEventListener("load", function listener() {
      domWindow.removeEventListener("load", listener, false);

      // If this is a browser window then setup its UI
      if (domWindow.document.documentElement.getAttribute("windowtype") == "navigator:browser")
        WindowListener.setupBrowserUI(domWindow);
    }, false);
  },

  onCloseWindow: function(xulWindow) {
  },

  onWindowTitleChange: function(xulWindow, newTitle) {
  }
};

function startup(data, reason) {
  let wm = Cc["@mozilla.org/appshell/window-mediator;1"].
           getService(Ci.nsIWindowMediator);

  // Get the list of browser windows already open
  let windows = wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);

    WindowListener.setupBrowserUI(domWindow);
  }

  // Wait for any new browser windows to open
  wm.addListener(WindowListener);
}

function shutdown(data, reason) {
  // When the application is shutting down we normally don't have to clean
  // up any UI changes made
  if (reason == APP_SHUTDOWN)
    return;

  let wm = Cc["@mozilla.org/appshell/window-mediator;1"].
           getService(Ci.nsIWindowMediator);

  // Get the list of browser windows already open
  let windows = wm.getEnumerator("navigator:browser");
  while (windows.hasMoreElements()) {
    let domWindow = windows.getNext().QueryInterface(Ci.nsIDOMWindow);

    WindowListener.tearDownBrowserUI(domWindow);
  }

  // Stop listening for any new browser windows to open
  wm.removeListener(WindowListener);
}
