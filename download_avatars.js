var request = require('request');
var fs = require('fs');
var secrets = require('./secrets');
var myArgs = process.argv.slice(2);

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  if (repoOwner === undefined || repoName === undefined) {
    console.log("Error: Please enter valid repo owner and repo name as arguments.");
  } else {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': "token " + secrets.GITHUB_TOKEN
      }
    };
    request(options, function(err, res, body) {
      cb(err, body);
    });
  }
}

getRepoContributors(myArgs[0], myArgs[1], function(err, result) {
  console.log("Errors:", err);
  var userList = JSON.parse(result);
  userList.forEach(function(user) {
    var url = user.avatar_url;
    var path = "avatars/" + user.login + ".jpg";
    downloadImageByURL(url, path);
  });
});


function downloadImageByURL(url, filepath) {
  request(url)
    .on('error', function(err) {
      throw err;
    })
    .pipe(fs.createWriteStream(filepath))
    .on('finish', function() {
      console.log('Download Complete!');
    });
}



