var request = require('request');
var secrets = require('./secrets');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': "token " + secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
    console.log(res.headers);
    cb(err, body);
  });

  // request(options)
  //   .on('error', function(err) {
  //     throw err;
  //   })
  //   .on('response', function(response) {
  //     console.log('Download started...');
  //     console.log('Response Status Code: ' + response.statusCode);
  //     console.log('Response Message: ' + response.statusMessage);
  //     console.log('Content Type: ' + response.headers['content-type']);
  //   })
  //   .on('end', function(body) {

  //     // cb(err, body);
  //   });
}

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  var userList = JSON.parse(result);
  userList.forEach(function(user) {
    console.log("Result: " + user.avatar_url);
  });
});