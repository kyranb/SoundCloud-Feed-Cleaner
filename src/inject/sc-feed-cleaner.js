chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {
			clearInterval(readyStateCheckInterval);
			// ----------------------------------------------------------
			// This part of the script triggers when page is done loading

			//Soundcloud's site is already loaded with javascript, what's a little bit more going to do ;)
			if(!window.jQuery) {
			   var jq = document.createElement('script');
			   jq.type = "text/javascript";
			   jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js";
			   document.getElementsByTagName('head')[0].appendChild(jq);
			   		// ... give time for jQuery to load, then check.
					jQuery.noConflict();
			}

			// Remove JS errors, (SoundCloud's javascript tries to draw on a non-existant canvas...)
			//console = {log: function(s) {alert(s);}};

			var hidden_reposts = false;
			var hidden_tracks = [];

			//If hidden, return reposts to the stream
			function showReposts() {
				$( ".soundList__item" ).each( function( index, element ){
							if($(this).has(".soundContext__repost")){
									$(this).closest('.soundList__item').show();
							}
							hidden_tracks = [];
				});
			};

			// Prevent reposts from being visible in the stream
			function hideReposts() {
				$( ".soundList__item" ).each( function( index, element ){
				    	var trackName = $( this ).find('.soundTitle__title').text().trim().toLowerCase();
							var userName = $(this).find('.soundContext__usernameLink').text().trim().toLowerCase();
							var trackUrl = $(this).find(".soundTitle__title").attr("href")

							if($(this).has(".soundContext__repost")){
								if( !trackName.includes(userName) ){
									console.log('hidden: ' + userName + trackName)
									hidden_tracks.push(trackUrl);
									$(this).closest('.soundList__item').hide();
								}
								else{
									console.log('kept: ' + userName + trackName)
								}
							}
							else{
								console.log('kept: ' + userName + trackName)
							}
				});
			};

			function removePromoted() {
			    $(".sc-promoted-icon").closest("li").remove()
			}

			// Remove all sounds that a user has reposted within their stream.
			var uploads_only = function() {
				$( "a:contains('Uploads Only')" ).addClass( 'active' );

				$( "a:contains('Stream')" ).removeClass( 'active' );
				$( "a:contains('Explore')" ).removeClass( 'active' );

				//Quickly scroll down, then return to initiate the loading of extra lazy loading content.
				window.scrollBy(0, 2000);
				window.scrollBy(0, -2000);

				hidden_reposts = true;
				hideReposts();
			};

			// Return the Stream to how it appears normally
			var reset_stream = function() {
	      $( "a:contains('Stream')" ).addClass( 'active' );

				$( "a:contains('Explore')" ).removeClass( 'active' );
				$( "a:contains('Uploads Only')" ).removeClass( 'active' );

				hidden_reposts = false;
				showReposts();
			};


			setInterval(function() {
			  var nowPlayingTrackUrl = $(".playbackSoundBadge").children().attr("href");
			  if(nowPlayingTrackUrl != undefined) {
			  	console.log(nowPlayingTrackUrl);
			  	if($.inArray(nowPlayingTrackUrl, hidden_tracks) > -1){
			        $(".skipControl__next").trigger("click");
			    }
			  }
			}, 500)

			//Continue filtering/removing reposts when the user scrolls down
			$(window).scroll(function()
			{
	    		var NumberOfPixelsScrolled = 10;
	    		//To prevent uncesserary processing, only filter posts after each significant scroll.
	    		if ($(this).scrollTop() % NumberOfPixelsScrolled === 0 ) {
		        	// Only filter if the user has chosen to do so.
		        	if ( hidden_reposts ) {
		        		hideReposts();
		        	}
							//Remove promted tracks as well.
		        	removePromoted();
	    		}
			});


			// Add a custom 'Uploads Only' stream filter button to the DOM.
			$('.streamExploreTabs__streamTab').append('<li class="g-tabs-item"><a class="g-tabs-link" id="uploads-only">Uploads Only</a></li>');

			// Add a custom id tag to the deafult Stream li nav item so that we have something to bind the listener to.
			$( "a:contains('Stream')" ).attr("id","stream-only");

	  	// Remove soundcloud reposts when clicking the 'Uploads Only' li nav item.
	  	$(document).ready(function() {
	  		$("#uploads-only").click( uploads_only );
			});

	  	// Include soundcloud reposts when clicking the 'Stream' li nav item.
			$(document).ready(function() {
	  			$("#stream-only").click( reset_stream );
			});

			// End of Script to be injected to the SoundCloud Stream
			// ----------------------------------------------------------

		}
	}, 10);
});
