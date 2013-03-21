(function(window, $, _, Parse) {
  "use strict";
  window.Storagr = window.Storagr || {};
  var Storagr = window.Storagr;

  // Function that runs in blocking mode to fetch the templates
  var renderTemplate = function renderTemplate(tmpl_name, tmpl_data) {
    if (!renderTemplate.tmpl_cache) {
      renderTemplate.tmpl_cache = {};
    }
    if (!renderTemplate.tmpl_cache[tmpl_name]) {
      var tmpl_dir = '/html';
      var tmpl_url = tmpl_dir + '/' + tmpl_name;
      var tmpl_string;
      $.ajax({
        url: tmpl_url,
        method: 'GET',
        async: false,
        dataType: 'html',
        beforeSend: function() {
          $('#js-bsload').slideDown(100);
        },
        success: function(data) {
          tmpl_string = data;
        },
        complete: function() {
          $('#js-bsload').slideUp(100);
        }
      });
      renderTemplate.tmpl_cache[tmpl_name] = _.template(tmpl_string);
    }
    return renderTemplate.tmpl_cache[tmpl_name](tmpl_data);
  };

  Storagr.state = {
    currentPage: "/"
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
      },

      events: {
        "click #js-menu-login": "showModalLogin",
        "click #js-menu-signup": "showModalSignup",

        "click #js-menu-listyourspace": "pivotToListYourSpace"
      },

      showModalLogin: function() {
        new Storagr.views.loginModal();
        this.$el.off('click', '#js-menu-login');
      },

      showModalSignup: function() {
        new Storagr.views.signupModal();
        this.$el.off('click', '#js-menu-signup');
      },

      pivotToListYourSpace: function() {
        new Storagr.views.listYourSpacePage();
      }
    }),

    // =======================================================
    // Login - Modal
    // =======================================================
    loginModal: Parse.View.extend({
      template: renderTemplate,

      initialize: function () {
        this.render();
      },

      submitLogin: function(e) {
        if ($(this).parsley('validate')) {
          // Ajax stuff goes here
          $($this).hide();
        }
        e.preventDefault();
      },

      render: function() {
        $('body').append(this.template('login.html', {}));
        $('#login-form').on('submit', this.submitLogin);
      }
    }),

    // =======================================================
    // Signup - Modal
    // =======================================================
    signupModal: Parse.View.extend({
      template: renderTemplate,

      initialize: function () {
        this.render();
      },

      slideSignUpForm: function() {
        var $signup = $('#js-signup-modal');
        $(this).hide();
        $signup.find('#signup-form').slideDown();
        $signup.find('.fb-or-email').text('"Create Account"');
      },

      submitSignup: function(e) {
        if ($(this).parsley('validate')) {
          // Ajax stuff goes here
          $($this).hide();
        }
        e.preventDefault();
      },

      render: function() {
        $('body').append(this.template('signup.html', {}));
        $('#js-show-signup-form').on('click', this.slideSignUpForm);
        $('#signup-form').on('submit', this.submitSignup);
      }
    }),

    // =======================================================
    // Index - Page
    // =======================================================
    indexPage: Parse.View.extend({
      template: renderTemplate,

      initialize: function () {
        if (Storagr.state.currentPage !== "/") {
          this.render();
          Storagr.state.currentPage = "/";
        }
      },

      render: function() {
        $('#js-page').empty().html(this.template('home.html', {}));
      }
    }),

    // =======================================================
    // List Your Space - Page
    // =======================================================
    listYourSpacePage: Parse.View.extend({
      template: renderTemplate,

      initialize: function () {
        if (Storagr.state.currentPage !== "!/list-your-space") {
          this.render();
          Storagr.state.currentPage = "!/list-your-space";
        }
      },

      render: function() {
        $('#js-page').empty().html(this.template('list-your-space.html', {}));
      }
    })
  };
})(window, jQuery, _, Parse, undefined);
