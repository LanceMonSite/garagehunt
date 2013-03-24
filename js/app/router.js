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

      index: function() {
        new Storagr.views.indexPage();
      },

      listYourSpace: function() {
        new Storagr.views.listYourSpacePage();
      }
    })
  };
})(window, jQuery, _, Parse, undefined);
