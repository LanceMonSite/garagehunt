(function(window, $, _, Parse) {
  "use strict";
  window.Storagr = window.Storagr || {};
  var Storagr = window.Storagr;
  _.templateSettings.variable = "rc";

  // Function that runs in blocking mode to fetch the templates
  var renderTemplate = function(tmpl_name, tmpl_data) {
    var ajaxPromise, dff = $.Deferred();
    if (!renderTemplate.tmpl_cache) {
      renderTemplate.tmpl_cache = {};
    }
    if (!renderTemplate.tmpl_cache[tmpl_name]) {
      var tmpl_dir = '/html';
      var tmpl_url = tmpl_dir + '/' + tmpl_name;
      var tmpl_string;
      ajaxPromise = $.ajax({
        url: tmpl_url,
        method: 'GET',
        dataType: 'html',
        beforeSend: function() {
          if (Storagr.state.$loader.is(":hidden")) {
            Storagr.state.$loader.show();
          }
        },
        complete: function() {
          Storagr.state.$loader.hide();
        }
      });

      $.when(ajaxPromise).done(function(data){
        tmpl_string = data;
        renderTemplate.tmpl_cache[tmpl_name] = _.template(tmpl_string);
        dff.resolve(renderTemplate.tmpl_cache[tmpl_name](tmpl_data));
      });

      return dff.promise();
    } else {
      return renderTemplate.tmpl_cache[tmpl_name](tmpl_data);
    }
  };

  Storagr.state = {
    currentPage: "",
    $loader: $('#js-bsload')
  };

  Storagr.mvc = {
    views: {
      // NAV
    },

    models: {
    }
  };

  Storagr.views = {
    // =======================================================
    // Main App View
    // =======================================================
    main: Parse.View.extend({
      el: "body",
      initialize: function() {
        // Initialize the router module
        new Storagr.routes.AppRouter();
        Parse.history.start();

        // Initialize the menu
        Storagr.mvc.views.nav = new Storagr.views.menu();
      }
    }),

    // =======================================================
    // Menu navar
    // =======================================================
    menu: Parse.View.extend({
      el: '#js-menu',
      template: _.template( $('#tmpl-navbar').html() ),

      initialize: function() {
        var user = Parse.User.current();
        var data = {};
        var fullname;
        if (user) {
          fullname = user.get("fullname");
          data.name = fullname.substring(0, fullname.indexOf(' '));
          data.isSocial = false;
        }
        this.render(data);
      },

      events: {
        "click #js-menu-login": "showModalLogin",
        "click #js-menu-signup": "showModalSignup",

        "click #js-menu-listyourspace": "pivotToListYourSpace",

        "click .js-logout": "logoutUser"
      },

      showModalLogin: function() {
        new Storagr.views.loginModal();
      },

      showModalSignup: function() {
        new Storagr.views.signupModal();
      },

      pivotToListYourSpace: function() {
        new Storagr.views.listYourSpacePage();
      },

      logoutUser: function() {
        Parse.User.logOut();
        this.render({});
      },

      render: function(data) {
        this.$el.html(this.template(data));
        $(document.body).foundation();
      }
    }),

    // =======================================================
    // Login - Modal
    // =======================================================
    loginModal: Parse.View.extend({
      el: '#js-modals-section',
      template: renderTemplate,

      initialize: function() {
        this.render();
      },

      events: {
        "submit #js-login-form": "submitLogin",
        "click #js-lo-show-passwd": "showPassword"
      },

      submitLogin: function(e) {
        var $nodeArr;
        var $target = $(e.target);
        if ($target.parsley('validate')) {
          $nodeArr = [
            $target,
            $target.find('#js-lo-email'),
            $target.find('#js-lo-password')
          ];
          $target.find("#js-lo-submit").attr("disabled", "true");
          this.signInUser($nodeArr);
          Storagr.state.$loader.show();
        }
        e.preventDefault();
      },

      signInUser: function($nodeArr) {
        Parse.User.logIn($nodeArr[1].val(), $nodeArr[2].val(), {
          success: function(user) {
            var data = {};
            var fullname;

            Storagr.state.$loader.hide();
            $('#js-login-modal').find('.close-reveal-modal').trigger('click');
            $nodeArr[0].find("#js-lo-submit").removeAttr("disabled");
            $nodeArr[0][0].reset();

            fullname = user.get("fullname");
            data.name = fullname.substring(0, fullname.indexOf(' '));
            data.isSocial = false;
            Storagr.mvc.views.nav.render(data);
          },
          error: function(user, error) {
            Storagr.state.$loader.hide();
            $nodeArr[0].find("#js-lo-submit").removeAttr("disabled");
            alert("Error: " + error.code + " " + error.message);
          }
        });
      },

      showPassword: function(e) {
        var $target = $(e.target);
        if ($target.is(':checked')) {
          $('#js-lo-password').attr('type', 'text');
        } else {
          $('#js-lo-password').attr('type', 'password');
        }
      },

      render: function() {
        var _this = this;
        var promiseTmpl = this.template('login.html', {});
        if (typeof promiseTmpl === "string") {
          $('#js-login-modal').foundation('reveal', 'open');
        } else {
          promiseTmpl.done(function(tmpl) {
            _this.$el.append(tmpl);
            $('#js-login-modal').foundation('reveal', 'open');
          });
        }
      }
    }),

    // =======================================================
    // Signup - Modal
    // =======================================================
    signupModal: Parse.View.extend({
      el: '#js-modals-section',
      template: renderTemplate,

      initialize: function() {
        this.render();
      },

      events: {
        "click #js-show-signup-form": "slideSignUpForm",
        "submit #js-signup-form": "submitSignup",
        "click #js-su-show-passwd": "showPassword"
      },

      slideSignUpForm: function(e) {
        var $target = $(e.target);
        var $signup = $('#js-signup-modal');
        $target.hide();
        $signup.find('#js-signup-form').slideDown();
        $signup.find('.fb-or-email').text('"Create Account"');
        $('#js-su-fullname').focus();
      },

      submitSignup: function(e) {
        var $nodeArr;
        var $target = $(e.target);
        if ($target.parsley('validate')) {
          $nodeArr = [
            $target,
            $target.find('#js-su-fullname'),
            $target.find('#js-su-email'),
            $target.find('#js-su-password')
          ];
          $target.find("#js-su-submit").attr("disabled", "true");
          this.signUpUser($nodeArr);
          Storagr.state.$loader.show();
        }
        e.preventDefault();
      },

      signUpUser: function($nodeArr) {
        var user = new Parse.User();
        user.set("fullname", $nodeArr[1].val());
        user.set("username", $nodeArr[2].val());
        user.set("password", $nodeArr[3].val());

        user.signUp(null, {
          success: function(user) {
            var data = {};
            var fullname;

            Storagr.state.$loader.hide();
            $('#js-signup-modal').find('.close-reveal-modal').trigger('click');
            $nodeArr[0].find("#js-su-submit").removeAttr("disabled");
            $nodeArr[0][0].reset();

            fullname = user.get("fullname");
            data.name = fullname.substring(0, fullname.indexOf(' '));
            data.isSocial = false;
            Storagr.mvc.views.nav.render(data);
          },
          error: function(user, error) {
            Storagr.state.$loader.hide();
            $nodeArr[0].find("#js-su-submit").removeAttr("disabled");
            alert("Error: " + error.code + " " + error.message);
          }
        });
      },

      showPassword: function(e) {
        var $target = $(e.target);
        if ($target.is(':checked')) {
          $('#js-su-password').attr('type', 'text');
        } else {
          $('#js-su-password').attr('type', 'password');
        }
      },

      render: function() {
        var _this = this;
        var promiseTmpl = this.template('signup.html', {});
        if (typeof promiseTmpl === "string") {
          $('#js-signup-modal').foundation('reveal', 'open');
        } else {
          promiseTmpl.done(function(tmpl){
            _this.$el.append(tmpl);
            $('#js-signup-modal').foundation('reveal', 'open');
          });
        }
      }
    }),

    // =======================================================
    // Index - Page
    // =======================================================
    indexPage: Parse.View.extend({
      el: "#js-page",
      template: renderTemplate,

      initialize: function() {
        if (Storagr.state.currentPage !== "/") {
          this.render();
          Storagr.state.currentPage = "/";
        }
      },

      render: function() {
        var _this = this;
        var promiseTmpl = this.template('home.html', {});
        if (typeof promiseTmpl === "string") {
          _this.$el.html(promiseTmpl);
        } else {
          promiseTmpl.done(function(tmpl) {
            _this.$el.html(tmpl);
          });
        }
      }
    }),

    // =======================================================
    // List Your Space - Page
    // =======================================================
    listYourSpacePage: Parse.View.extend({
      el: "#js-page",
      template: renderTemplate,

      initialize: function() {
        if (Storagr.state.currentPage !== "!/list-your-space") {
          this.render();
          Storagr.state.currentPage = "!/list-your-space";
        }
      },

      render: function() {
        var _this = this;
        var promiseTmpl = this.template('list-your-space.html', {});
        if (typeof promiseTmpl === "string") {
          _this.$el.html(promiseTmpl);
        } else {
          promiseTmpl.done(function(tmpl) {
            _this.$el.html(tmpl);
          });
        }
      }
    })
  };
})(window, jQuery, _, Parse, undefined);
