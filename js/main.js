(function() {
  Parse.initialize(
    "nYOW9blioKxaqbHySYryq4t220leMIcZhIjKc4ap",
    "0CaMVQlg64NyfvDf4zH9ILsvzLpAQoqBQmk44S08"
  );

  $(document).ready(function() {
    // Initializes DOM manipulation for zurb
    $(this).foundation();

    // Initializes the MVC
    new Views.storagr();

    //homepage images text dropdown
    $('.img-wrapper').on('mouseenter', (function() {
      $(this).find('.img-caption').css('top', '0');
    })).on('mouseleave', (function() {
      $(this).find('.img-caption').css('top', '-220px');
    }));


    //DISPLAY CORRECT 'LIST YOUR SPACE' FORM
    // $('#space-type').change(function() {
    //   if ($(this).val() == "parking") {
    //     $('#storage-form').hide();
    //     $('#parking-form').show();
    //     $('#storage-parking-form').hide();
    //   } else if ($(this).val() == "storage") {
    //     $('#parking-form').hide();
    //     $('#storage-form').show();
    //     $('#storage-parking-form').hide();
    //   } else if ($(this).val() == "both") {
    //     $('#parking-form').hide();
    //     $('#storage-form').hide();
    //     $('#storage-parking-form').show();
    //   }
    // });
/*
    //ENABLE DATEPICKERS
    $('#start-date').datepicker();
    $('#end-date').datepicker();
    $('#prk-start-date').datepicker();
    $('#prk-end-date').datepicker();
    $('#book-start-date').datepicker();
    $('#book-end-date').datepicker();

    //SHOW SEARCH BAR TO CHANGE CITY (SEARCH RESULT PAGE)
    $('.change-city').click(function() {
      $('.search-city-small').show();
    });

    //SLIDER RANGE FOR INPUTS
    //FOR PRICE SLIDE
    $("#slider-price-range").slider({
      range: true,
      min: 0,
      max: 300,
      values: [75, 300],
      slide: function(event, ui) {

        $('#slider-price-min').html("$" + ui.values[0]);
        $('#slider-price-max').html("$" + ui.values[1]);
      }
    });
    $('#slider-price-min').html("$" + $("#slider-price-range").slider("values", 0));
    $('#slider-price-max').html("$" + $("#slider-price-range").slider("values", 1) + "+");

    //FOR SQ.FT SLIDE
    $("#slider-sqft-range").slider({
      range: true,
      min: 25,
      max: 300,
      step: 25,
      values: [25, 300],
      slide: function(event, ui) {

        $('#slider-sqft-min').html(ui.values[0] + " sq.ft");
        $('#slider-sqft-max').html(ui.values[1] + " sq.ft");
      }
    });

    $('#slider-sqft-min').html($("#slider-sqft-range").slider("values", 0) + " sq.ft");
    $('#slider-sqft-max').html($("#slider-sqft-range").slider("values", 1) + "+ sq.ft");

    //FOR USER SQ CHOICE BEFORE CHECKOUT
    $("#slider-sqft-final").slider({
      min: 25,
      max: 200,
      step: 25,
      value: 100,
      slide: function(event, ui) {

        $('#slider-sqft-amount').html(ui.value + " <br/>sq.ft");
      }
    });

    $('#slider-sqft-amount').html($("#slider-sqft-final").slider("value") + " <br/>sq.ft");

  });

  //ON MOBILE SHOW SEARCH AGAIN OPTIONS
  $('.search-result-topbar').on("click", ".redo-search", function() {
    $(this).hide();
    $('.search-again-form').show();
  });

  //CUSTOMIZING JQUERY UI SLIDER -- AKA HACK THE BEAST
    $('.ui-slider').removeClass('ui-widget-content');
    $('.ui-slider-handle').removeClass('ui-state-focus ui-state-default ui-corner-all');
    $('.ui-slider-handle').on("mouseenter", function() {
      $(this).removeClass('ui-state-hover');
    });
*/
  });
})();
