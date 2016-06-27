console.log('SoundCloud Feed Cleaner: Starting.')

$(document).ready(function() {
  // Shared Variables
  var HID_REPOSTS   = false
  var HIDDEN_TRACKS = []

  // Object (read: class) to contain functions (read: methods)
  var SoundCloudFeedCleaner = {
    // Returns tabs element
    tabsElement: function() { return $('.streamExploreTabs__streamTab') },

    // Shows the reposted tracks
    showReposts: function() {
      $('.soundList__item').each(function(index, element){
        if ($(this).has('.soundContext__repost')){
          $(this).closest('.soundList__item').show()
        }
      })
    },

    // Hides the reposted tracks
    hideReposts: function() {
      repostsInCurrentFeed = []

      $('.soundList__item').each(function(index, element){
        var trackName = $(this).find('.soundTitle__title').text().trim().toLowerCase()
        var userName  = $(this).find('.soundContext__usernameLink').text().trim().toLowerCase()
        var trackUrl  = $(this).find('.soundTitle__title').attr('href')

        if ($(this).has(".soundContext__repost") && ! trackName.includes(userName)) {
          repostsInCurrentFeed.push(trackUrl)
          $(this).closest('.soundList__item').hide()
        }
      })

      HIDDEN_TRACKS = repostsInCurrentFeed
    },

    // Switches to the 'Uploads Only' tab
    uploadsOnly: function() {
      $("a:contains('Uploads Only')").addClass('active')
      $("a:contains('Stream')").removeClass('active')
      $("a:contains('Explore')").removeClass('active')

      HID_REPOSTS = true
      SoundCloudFeedCleaner.hideReposts()
    },

    // Resets to the 'Stream' tab
    resetStream: function() {
      $("a:contains('Stream')").addClass('active')
      $("a:contains('Explore')").removeClass('active')
      $("a:contains('Uploads Only')").removeClass('active')

      HID_REPOSTS = false
      SoundCloudFeedCleaner.showReposts()
    },

    // Simply adds the callback argument to the end of the event loop
    withTimeout: function(callback) {
      setTimeout(function() { callback() }, 0)
    },

    // Creates the clickable 'Uploads Only' tab
    appendUploadsTab: function() {
      SoundCloudFeedCleaner.withTimeout(function() {
        SoundCloudFeedCleaner.tabsElement().append(
          "<li class='g-tabs-item'><a class='g-tabs-link sfc__uploads-only-tab'>Uploads Only</a></li>"
        )
      })
    },

    // These comments are fking useless, read the code
    appendIdTagtoStreamTab: function() {
      SoundCloudFeedCleaner.withTimeout(function() {
        $("a:contains('Stream')").addClass('sfc__stream-tab')
      })
    },

    // Ensure that the player doesn't queue up a track hidden from the DOM
    managePlaybackQueue: function() {
      var nowPlayingTrackUrl = $(".playbackSoundBadge").children().attr("href");

      if (nowPlayingTrackUrl != undefined) {
        if ($.inArray(nowPlayingTrackUrl, HIDDEN_TRACKS) > -1) {
          $(".skipControl__next").trigger("click")
        }
      }
    },

    // Check if the 'Uploads Only' tab is active
    uploadsTabActive: function() {
      return $('.sfc__uploads-only-tab').hasClass('active')
    },

    // Remove reposts if on 'Uploads Only' tab
    //   This is required because of the lazy loading SoundCloud
    //   uses where it will continue to feed you reposts
    groomFeed: function() {
      if (SoundCloudFeedCleaner.uploadsTabActive())
        SoundCloudFeedCleaner.hideReposts();
    }
  }

  // Render the 'Uploads Only' tab and add hook to Stream tab
  SoundCloudFeedCleaner.appendUploadsTab()
  SoundCloudFeedCleaner.appendIdTagtoStreamTab()

  // Check that the current track is not a hidden one every 2 seconds
  setInterval(function() { SoundCloudFeedCleaner.managePlaybackQueue() }, 2000)

  // Keep cleaning feed (every 5 seconds) as you remain with the tab active
  setInterval(function(){ SoundCloudFeedCleaner.groomFeed() }, 5000)

  // This is kinda hacky, but basically we want to also add this to the end of the event loop
  //   because we are trying to listen to events on elements that don't actually exist yet. So we
  //   put these listeners after they have been rendered.
  //
  // The correct way to do this is something like:
  //   SoundCloudFeedCleaner.tabsElement().on('click', '.sfc__uploads-only-tab', function() { ... })
  // but for whatever reason that doesn't work. Or in other words: "urgh... javascript"
  setTimeout(function() {
    $('.sfc__uploads-only-tab').on('click', function() { SoundCloudFeedCleaner.uploadsOnly() })
    $('.sfc__stream-tab').on('click', function() { SoundCloudFeedCleaner.resetStream() })
  })

  console.log('SoundCloud Feed Cleaner: Successfully started.')
})
