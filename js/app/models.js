(function(window, $, _, Parse) {
  "use strict";
  window.Storagr = window.Storagr || {};
  var Storagr = window.Storagr;

  Storagr.models = {
    // =======================================================
    // List your space model
    // =======================================================
    listYourSpace: Parse.Object.extend({
      className: "Listings",
      fileURL: [],
      file: "",

      fileSelectHandler: function(e) {
         var files = e.target.files || e.dataTransfer.files;
         this.file = files[0];
         this.upload();
      },

      upload: function() {
        var _this = this;
        var serverUrl = 'https://api.parse.com/1/files/' + _this.file.name;
        $.ajax({
          type: "POST",
          beforeSend: function(request) {
             request.setRequestHeader("X-Parse-Application-Id", '63jyWNcqFPNn3rFMwjk8cENuW5xNmKsWLZkGvlCj');
             request.setRequestHeader("X-Parse-REST-API-Key", 'Fh2cjxhHtxwYb6nAmTX7KXFhSLcsEaCXQRBLB8lK');
             request.setRequestHeader("Content-Type", _this.file.type);
          },
          url: serverUrl,
          data: _this.file,
          processData: false,
          contentType: false,
          success: function(data) {
            _this.fileURL[_this.fileURL.length] = data.url;
          },
          error: function(data) {
             var obj = jQuery.parseJSON(data);
             alert(obj.error);
          }
        });
      },

      submitForm: function() {
        this.set("title", $('#storage-title').val());
        this.set("description", $('#description').val());
        this.set("date_begin", $('#start-date').val());
        this.set("date_end", $('#end-date').val());
        this.set("images_url", this.fileURL);
        this.set("street_address", $('#str-address').val());
        this.set("postal_code", $('#str-postal').val());
        this.set("phone_number", $('#telephone').val());

        this.save();
      },

      getListings: function() {
        var query = new Parse.Query(this.className);
        query.find({
          success: function(results) {
            // for(var i in results){
            // for(var p in results[0].attributes)
            // console.log(results[0].attributes[p]);}
          },
          error: function(error) {
            alert("Error: " + error.code + " " + error.message);
          }
        });
      }
    })
  };

})(window, jQuery, _, Parse, undefined);
