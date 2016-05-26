var http = require('http');
var url = require('url');  
   
function parseDate(pathname) {
  //pathname = "December%2015,%202015";
  pathname = pathname.replace(/%20/g, " ");
  
  //pathname = "Dec 15, 2014";
  //console.log(pathname);
  
  var regexNatural = /^(January|February|March|April|May|June|July|August|September|October|December) \d{1,2}, \d\d\d\d$/; 
  var regexUnix = /^\d+$/;
  //console.log(regex.toString());

  if (regexNatural.test(pathname)) {
    var date = new Date(pathname);
  } else if (regexUnix.test(pathname)) {
    date = new Date(parseInt(pathname, 10) * 1000);
  } else {
    console.log("Query did not match validation regex");
    return null;
  }

  if (isNaN(date.getDate())) {
    console.log("date is undefined");
    return null;
  } else {
    return date;
  }
} //end parseDate()
 
var server = http.createServer(function (req, res) {
  var pathname = url.parse(req.url, true)['pathname'].substring(1);
  var date = parseDate(pathname);
  if (date === null) {
    var json = JSON.stringify({natural: null, unixtime: null});
  }  else {
    var month = date.toLocaleString("en-us", { month: "long" });
    var day =date.getDate();
    var year = date.getFullYear();
    json = JSON.stringify({natural: month+" "+day+", "+year, unixtime: date.getTime() / 1000});
  }
  res.writeHead(200, { 'Content-Type': 'application/json' });  
  res.end(json)
});  

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});
