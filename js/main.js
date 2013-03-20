$(document).ready(function () {
	$(document).foundation();

	//homepage images text dropdown
	$('.img-wrapper').on('mouseenter', (function(){
		$(this).find('.img-caption').css('top', '0');
	})).on('mouseleave', (function(){
		$(this).find('.img-caption').css('top', '-220px');
	}));
	
	//show signup form on signup popup
	$('.show-signup-form').on('click', function(){
		$('.signup-form').show();
		$(this).hide();
		$('.fb-or-email').text("Create Account");
	});

	//FORM VALIDATIONS HERE
	$('#signup-form .button').click(function() {
        if($('#signup-form').parsley('validate')){
            //ajax stuff goes here
            $('#signup-form').hide();
        }
        return false;
    });
    $('#login-form .button').click(function() {
        if($('#login-form').parsley('validate')){
            //ajax stuff goes here
            $('#login-form').hide();
        }
        return false;
    });

    //DISPLAY CORRECT 'LIST YOUR SPACE' FORM
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

    //ENABLE DATEPICKERS
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
    $('#book-start-date').datepicker({
       onClose: function(dateText, inst) {
          $('#book-end-date').focus();
        }
       });
    $('#book-end-date').datepicker();
    // ENABLE NEXT FOCUS ON DATEPICKER SELECT

    //SHOW SEARCH BAR TO CHANGE CITY (SEARCH RESULT PAGE)
    $('.change-city').click(function(){
    $('.search-city-small').show();
    })

    //SLIDER RANGE FOR INPUTS
    $(function() {
        //FOR PRICE SLIDE
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

        //FOR SQ.FT SLIDE
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
        var sliderCalcTotal = (postPrice * userSqftChoice)
        $('.current-total').html("$" + parseFloat(sliderCalcTotal).toFixed(2));
        }
        });
        $('.current-sqft').html( $( "#slider-sqft-final" ).slider( "value" ));

        var finalTotal = ($('#post-price').attr('data-sqft')) * ($('.current-sqft').html())

         $('.current-total').html("$" +
                parseFloat(finalTotal).toFixed(2)
            );
    });
    
    //ON MOBILE SHOW SEARCH AGAIN OPTIONS
    $('.search-result-topbar').on("click", ".redo-search", function(){
        $(this).hide();
        $('.search-again-form').show();
    });

    //CUSTOMIZING JQUERY UI SLIDER -- AKA HACK THE BEAST
    $(function (){
        $('.ui-slider').removeClass('ui-widget-content');
        $('.ui-slider-handle').removeClass('ui-state-focus ui-state-default ui-corner-all');
        $('.ui-slider-handle').on("mouseenter", function(){
            $(this).removeClass('ui-state-hover');
        });
    });
});