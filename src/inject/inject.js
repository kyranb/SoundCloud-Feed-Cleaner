chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading

		if(!window.jQuery)
		{
		   var jq = document.createElement('script');
		   jq.type = "text/javascript";
		   jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";
		   document.getElementsByTagName('head')[0].appendChild(jq);
		   		// ... give time for script to load, then type.
				jQuery.noConflict();
		}

		//Remove JS errors
		if(!window.console) console = {log: function(s) {alert(s);}};

		var hidden_reposts = false;

		var showReposts = function() {

        	$( '.soundTitle__info' ).each(function() {
	  			$(this).closest('.soundList__item').show();
			});

		};

		var hideReposts = function() {

	       	$( '.soundTitle__info' ).each(function() {
	  			$(this).closest('.soundList__item').hide();
			});

		};

		var uploads_only = function() {


			$( "a:contains('Uploads Only')" ).addClass( 'active' );

			$( "a:contains('Stream')" ).removeClass( 'active' );
			$( "a:contains('Explore')" ).removeClass( 'active' );

			//Scroll down then up quickly to load more.
			window.scrollBy(0, 5000);
			window.scrollBy(0, -5000);


			hidden_reposts = true;
			hideReposts();

		};

		var reset_stream = function() {

        	$( "a:contains('Stream')" ).addClass( 'active' );

			$( "a:contains('Explore')" ).removeClass( 'active' );
			$( "a:contains('Uploads Only')" ).removeClass( 'active' );

			hidden_reposts = false;
			showReposts();

		};


		//Remove reposts when the user scrolls
		$(window).scroll(function()
		{
    		if ($(this).scrollTop() >= 5)// number of pixels
    		{

	        	if ( hidden_reposts )
	        	{
	        		hideReposts();
	        	}

    		}
		});



		//Inject Toggle switch to stream
		$('.streamExploreTabs__streamTab').append('<li class="g-tabs-item"><a class="g-tabs-link" id="uploads-only">Uploads Only</a></li>');

		//Add custom link handler to stream tab
		$( "a:contains('Stream')" ).attr("id","stream-only");

  		$(document).ready(function() {
  			$("#uploads-only").click( uploads_only );
		});

		$(document).ready(function() {
  			$("#stream-only").click( reset_stream );
		});





		// ----------------------------------------------------------

	}
	}, 10);
});