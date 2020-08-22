var webPage = require('webpage');
var page = webPage.create();

page.open('http://m.bing.com', function(status) {

  console.log(page.evaluate);
  var title = page.evaluate(function() {
    return document.title;
  });

  console.log(title);
  phantom.exit();

});