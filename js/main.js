(function(window, $, _, Parse) {
  Parse.initialize(
    "63jyWNcqFPNn3rFMwjk8cENuW5xNmKsWLZkGvlCj",
    "UZfcStAw3ws7E5H0yoofeKvyKy1uyGY4GouAu8Dk"
  );

  $(document).ready(function() {
    // Initializes the MVC
    new Storagr.views.main();

    //===================
    //list-your-space.html
    //===================
      $('#space-type').change(function(){
        if($(this).val() == "parking"){
          $('#storage-form').hide();
          $('#parking-form').show();
          $('#storage-parking-form').hide();
        }
        else if($(this).val() == "storage"){
          $('#parking-form').hide();
          $('#storage-form').show();
          $('#storage-parking-form').hide();
        }
        else if($(this).val() == "both"){
          $('#parking-form').hide();
          $('#storage-form').hide();
          $('#storage-parking-form').show();
        }
      });

      $('#start-date').datepicker({
         onClose: function(dateText, inst) {
            $('#end-date').focus();
          }
         });
      $('#end-date').datepicker();
      $('#prk-start-date').datepicker({
         onClose: function(dateText, inst) {
            $('#prk-end-date').focus();
          }
         });
      $('#prk-end-date').datepicker();

    //=====================
    //attic-in-plateau.html
    //=====================
      $('#book-start-date').datepicker({
         onClose: function(dateText, inst) {
            $('#book-end-date').focus();
          }
         });
      $('#book-end-date').datepicker();

      //FOR USER SQ CHOICE BEFORE CHECKOUT
      $( "#slider-sqft-final" ).slider({
      min: 25,
      max: 200,
      step: 25,
      value: 100,
      slide: function( event, ui ) {

      $('.current-sqft').html(ui.value);
      // CALCULATE TOTAL COST FOR USER
      var postPrice = $('#post-price').attr('data-sqft');
      var userSqftChoice = $('.current-sqft').html();
      var sliderCalcTotal = (postPrice * userSqftChoice);
      $('.current-total').html("$" + parseFloat(sliderCalcTotal).toFixed(2));
      }
      });
      $('.current-sqft').html( $( "#slider-sqft-final" ).slider( "value" ));
      var finalTotal = ($('#post-price').attr('data-sqft')) * ($('.current-sqft').html());
      $('.current-total').html("$" + parseFloat(finalTotal).toFixed(2));

    //=====================
    //search-result.html
    //=====================
      //ON MOBILE SHOW SEARCH AGAIN OPTIONS
      $('.search-result-topbar').on("click", ".redo-search", function(){
          $(this).hide();
          $('.search-again-form').show();
      });

      //FOR PRICE SLIDER
      $( "#slider-price-range" ).slider({
      range: true,
      min: 25,
      max: 299,
      values: [ 25, 299 ],
      slide: function( event, ui ) {

      $('#slider-price-min').html("$" + ((ui.values[ 0 ])/100.0) + "/sq.ft");
      $('#slider-price-max').html("$" + ((ui.values[ 1 ])/100.0) + "/sq.ft");
      }
      });
      $('#slider-price-min').html("$0.25/sq.ft");
      $('#slider-price-max').html("$2.99/sq.ft");

      //FOR SQ.FT SLIDER
      $( "#slider-sqft-range" ).slider({
      range: true,
      min: 25,
      max: 500,
      step: 25,
      values: [ 25, 500 ],
      slide: function( event, ui ) {

      $('#slider-sqft-min').html(ui.values[ 0 ] + " sq.ft");
      $('#slider-sqft-max').html(ui.values[ 1 ] + " sq.ft");
      }
      });

      $('#slider-sqft-min').html( $( "#slider-sqft-range" ).slider( "values", 0 ) + " sq.ft");
      $('#slider-sqft-max').html( $( "#slider-sqft-range" ).slider( "values", 1 ) + "+ sq.ft");

    //==========================================
    //search-result.html + attic-in-plateau.html
    //==========================================
      $('.ui-slider').removeClass('ui-widget-content');
      $('.ui-slider-handle').removeClass('ui-state-focus ui-state-default ui-corner-all');
      $('.ui-slider-handle').on("mouseenter", function(){
          $(this).removeClass('ui-state-hover');
      });

  });
})(window, jQuery, _, Parse, undefined);
