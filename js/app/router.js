(function(window, $, _, Parse) {
  "use strict";
  window.Storagr = window.Storagr || {};
  var Storagr = window.Storagr;

  Storagr.routes = {
    AppRouter: Parse.Router.extend({
      routes: {
        "": "index",
        "!/list-your-space": "listYourSpace"
      },

      listYourSpace: function() {
        new Storagr.views.listYourSpacePage();
      },

      index: function() {
        new Storagr.views.indexPage();
      }
    })
  };
})(window, jQuery, _, Parse, undefined);
