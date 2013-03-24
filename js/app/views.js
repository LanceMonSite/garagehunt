(function(window, $, _, Parse) {
  "use strict";
  window.Storagr = window.Storagr || {};
  var Storagr = window.Storagr;

  // Function that runs in blocking mode to fetch the templates
  var renderTemplate = function renderTemplate(tmpl_name, tmpl_data) {
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
          // TODO: only slide if not visible
          $('#js-bsload').slideDown(100);
        },
        complete: function() {
          $('#js-bsload').slideUp(100);
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
    currentPage: ""
  };

  Storagr.mvc = {
    views: {

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
        new Storagr.views.menu();
      }
    }),

    // =======================================================
    // Menu navar
    // =======================================================
    menu: Parse.View.extend({
      el: 'div',
      template: renderTemplate,

      initialize: function () {
        this.render();
      },

      events: {
        "click #js-menu-login": "showModalLogin",
        "click #js-menu-signup": "showModalSignup",

        "click #js-menu-listyourspace": "pivotToListYourSpace",
        "click #js-dropdown": "dropUserMenu"
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

      dropUserMenu: function() {
        console.log("msg");
        var $dropdown = $('#js-user-dropdown');
        $dropdown.toggleClass("open");
        $dropdown.foundation();
      },

      render: function() {
        var promiseTmpl = this.template('menu.html', {});
        if (typeof promiseTmpl === "string") {
          $('#js-menu').html(promiseTmpl);
        } else {
          promiseTmpl.done(function(tmpl){
            $('#js-menu').html(tmpl);
          });
        }
      }
    }),

    // =======================================================
    // Login - Modal
    // =======================================================
    loginModal: Parse.View.extend({
      el: 'div',
      template: renderTemplate,

      initialize: function () {
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
          $('#js-bsload').slideDown(100);
        }
        e.preventDefault();
      },

      signInUser: function($nodeArr) {
        Parse.User.logIn($nodeArr[1].val(), $nodeArr[2].val(), {
          success: function(user) {
            $('#js-bsload').slideUp(100);
            $('#js-login-modal').find('.close-reveal-modal').trigger('click');
            $nodeArr[0].find("#js-lo-submit").removeAttr("disabled");
            $nodeArr[0][0].reset();
          },
          error: function(user, error) {
            $('#js-bsload').slideUp(100);
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
        var promiseTmpl = this.template('login.html', {});
        if (typeof promiseTmpl === "string") {
          $('#js-login-modal').foundation('reveal', 'open');
        } else {
          promiseTmpl.done(function(tmpl){
            $('#js-modals-section').append(tmpl);
            $('#js-login-modal').foundation('reveal', 'open');
          });
        }
      }
    }),

    // =======================================================
    // Signup - Modal
    // =======================================================
    signupModal: Parse.View.extend({
      el: 'div',
      template: renderTemplate,

      initialize: function () {
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
          $('#js-bsload').slideDown(100);
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
            $('#js-bsload').slideUp(100);
            $('#js-signup-modal').find('.close-reveal-modal').trigger('click');
            $nodeArr[0].find("#js-su-submit").removeAttr("disabled");
            $nodeArr[0][0].reset();
          },
          error: function(user, error) {
            $('#js-bsload').slideUp(100);
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
        var promiseTmpl = this.template('signup.html', {});
        if (typeof promiseTmpl === "string") {
          $('#js-signup-modal').foundation('reveal', 'open');
        } else {
          promiseTmpl.done(function(tmpl){
            $('#js-modals-section').append(tmpl);
            $('#js-signup-modal').foundation('reveal', 'open');
          });
        }
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
        var promiseTmpl = this.template('home.html', {});
        if (typeof promiseTmpl === "string") {
          $('#js-page').empty().html(promiseTmpl);
        } else {
          promiseTmpl.done(function(tmpl){
            $('#js-page').empty().html(tmpl);
          });
        }
      }
    }),

    // =======================================================
    // List Your Space - Page
    // =======================================================
    listYourSpacePage: Parse.View.extend({
      el: "div",
      model: new Storagr.models.listYourSpace(),
      template: renderTemplate,

      initialize: function () {
        if (Storagr.state.currentPage !== "!/list-your-space") {
          this.render();
          Storagr.state.currentPage = "!/list-your-space";
        }
        this.model.getListings();
      },

      events: {
        "change #js-storage-image": "fileSelectHandler",
        "submit #js-storage-form": "submitForm"
      },

      fileSelectHandler: function(e) {
        this.model.fileSelectHandler(e);
      },

      upload: function() {
        this.model.upload();
      },

      submitForm: function(e) {
        e.preventDefault();
        this.model.submitForm();
      },

      render: function() {
        var promiseTmpl = this.template('list-your-space.html', {});
        if (typeof promiseTmpl === "string") {
          $('#js-page').empty().html(promiseTmpl);
        } else {
          promiseTmpl.done(function(tmpl) {
            $('#js-page').empty().html(tmpl);
          });
        }
      }
    })
  };
})(window, jQuery, _, Parse, undefined);
