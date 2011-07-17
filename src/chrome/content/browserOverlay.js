/**
 * Shortener namespace.
 */
if ("undefined" == typeof(Shortener)) {
  var Shortener = {};
};

/**
 * Controls the browser overlay for the Hello World extension.
 */
Shortener.BrowserOverlay = {
  init: function(aEvent) {
    var contextMenu = document.getElementById("contentAreaContextMenu");
    if (contextMenu)
      contextMenu.addEventListener("popupshowing", Shortener.BrowserOverlay.showHideContextMenuItems, false);
  },

  /**
   * Show/hide shortener menu items.
   */
  showHideContextMenuItems: function(aEvent) {
    var linkMenu = document.getElementById("shortener-context-link");
    linkMenu.hidden = !(gContextMenu.onLink);
  },

  _shorten: function(url, shortItem, qrItem) {
    shortItem.label = "Shortening...";
    qrItem.src = "";

    var xhr = new XMLHttpRequest();
    xhr.open('GET', "http://u.dmage.ru/api/add?url=" + encodeURIComponent(url), true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status != 200) {
          shortItem.label = "Error #" + xhr.status;
          if (xhr.responseText) {
            shortItem.label += ": " + xhr.responseText;
          }
          return;
        }

        var shortUrl = xhr.responseText;
        shortItem.label = shortUrl;
        qrItem.src = "http://qr.yandex.net/?action=generate&text=" + encodeURIComponent(shortUrl);
      }
    }
    xhr.send();
  },

  /**
   * Fill link menu items.
   */
  shortenLink: function() {
    var shortItem = document.getElementById("shortener-content-link-short");
    var qrItem = document.getElementById("shortener-content-link-qr");

    Shortener.BrowserOverlay._shorten(gContextMenu.linkURL, shortItem, qrItem);
  },

  /**
   * Fill page menu items.
   */
  shortenPage: function(aEvent) {
    var shortItem = document.getElementById("shortener-content-page-short");
    var qrItem = document.getElementById("shortener-content-page-qr");

    Shortener.BrowserOverlay._shorten(content.document.location.href, shortItem, qrItem);
  },

  /**
   * Copy label to clipboard.
   */
  copyToClipboard: function(aEvent) {
    gClipboardHelper = Components.classes["@mozilla.org/widget/clipboardhelper;1"].
    getService(Components.interfaces.nsIClipboardHelper);
    gClipboardHelper.copyString(aEvent.target.label);
  }
};

window.addEventListener("load", function() { Shortener.BrowserOverlay.init(); }, false);
