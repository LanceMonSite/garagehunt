var app_router;
window.Views = {
  // =======================================================
  // Main App View
  // =======================================================
  storagr: Parse.View.extend({
    el: "body",

    initialize: function() {
      // Initiate the router
      app_router = new Router.AppRouter();

      app_router.on('route:login', function(actions) {
        console.log(actions)
          new Views.loginModal();
      });

      // Start Backbone history a necessary step for bookmarkable URL's
      Parse.history.start({pushState: true});
    },

    events: {
      "click #js-menu-login": "showModalLogin",
      "click #js-menu-signup": "showModalSignup",

      "click #js-menu-listyourspace": "pivotToListYourSpace"
    },

    showModalLogin: function() {
      new Views.loginModal();
      this.$el.off('click', '#js-menu-login');
      app_router.route('login','login');
    },

    showModalSignup: function() {
      new Views.signupModal();
      this.$el.off('click', '#js-menu-signup');
    },

    pivotToListYourSpace: function() {
      new Views.listYourSpacePage();
      app_router.route('new','new');
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
  // List Your Space - Page
  // =======================================================
  listYourSpacePage: Parse.View.extend({
    template: renderTemplate,

    initialize: function () {
      this.render();
    },

    render: function() {
      $('#js-page').empty().append(this.template('list-your-space.html', {}));
    }
  })
  // =======================================================
  // Login View
  // =======================================================
  // loginModal: Parse.View.extend({

  //   el: "body",
  //   tagName: "div",
  //   className: "login-modal-tmpl",

  //   initialize: function () {
  //     this.render();
  //   },

  //   template: _.template(TMPL.loginModal),

  //   render: function () {
  //     $("body").addClass("modal");
  //     $(this.el).append(this.template());
  //     $("#email").focus();
  //     return this;
  //   },

  //   events: {
  //     "click .icon-remove": "closeModal",
  //     "click .modal-coverall": "closeModal",
  //     "click #log-in": "login",
  //     "click #signup": "signUp",
  //     "keypress #password": "updateOnEnter"
  //   },

  //   closeModal: function () {
  //     $("body").removeClass("modal");
  //     $(".login-modal-tmpl, .modal-coverall, #login").remove();
  //   },

  //   login: function () {

  //     var emailField = $("#email").val(),
  //       passwordField = $("#password").val(),
  //       rememberMeField = $("#remember-me").val(),
  //       self = this;

  //     Parse.User.logIn(emailField, passwordField, {
  //       success: function (user) {
  //         // Close the Modal
  //         self.closeModal();
  //         // Run the Successful Login method
  //         self.successLogin();

  //         // Add something else useful here

  //       },
  //       error: function (user, error) {
  //         console.log("An Error Occured", "User: ", user, "Error: ", error);
  //       }
  //     });
  //   },

  //   signUp: function () {
  //     var emailField = $("#email").val(),
  //       passwordField = $("#password").val(),
  //       rememberMeField = $("#remember-me").val(),
  //       self = this;

  //     window.user = new Parse.User();
  //     user.set({
  //       "username": emailField,
  //       "password": passwordField,
  //       "email": emailField
  //     });

  //     user.signUp(null, {
  //       success: function (user) {
  //         // Close the Modal
  //         self.closeModal();

  //         // Add something else useful here

  //       },
  //       error: function (user, error) {
  //         // Show the error message somewhere and let the user try again.
  //         alert("Error: " + error.code + " " + error.message);
  //       }
  //     });
  //   },

  //   updateOnEnter: function (e) {
  //     if (e.keyCode == 13) {
  //       this.login();
  //     }
  //   },

  //   successLogin: function (data, rememberMe, loginInfo, newUser) {

  //     // Here is where something useful would go

  //   }

  // })

};

function renderTemplate(tmpl_name, tmpl_data) {
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
}