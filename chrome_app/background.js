// Runs this function when the application is opened
chrome.app.runtime.onLaunched.addListener(function() {

  // Create a new window using the file `./window.html`
  chrome.app.window.create('window.html', {
    // Make the window 400px by 500px
    'bounds': {
      'width': 1000,
      'height': 1000
    },
    resizable: false
  });

    console.log('test insur');
});
