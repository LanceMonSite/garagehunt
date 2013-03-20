window.Router = {
 AppRouter: Parse.Router.extend({
    routes: {
      "login": "login",
      "*actions": "defaultRoute" // matches http://example.com/#anything-here
    }
  })
};