require('dotenv').config();
var request = require('request');
var fs = require('fs');
var myArgs = process.argv.slice(2);

console.log('Welcome to the GitHub Avatar Downloader!');

if (myArgs.length <= 1) {
    console.log("Error: Please enter at least two arguments.");
    process.exit();
  }


repoStatus(myArgs[0], myArgs[1], function (status) {
  switch(status) {
    // When repo is not found
    case 404:
      console.log("Error: Not a valid git repo");
      break;
    // When credentials aren't valid
    case 401:
      // If .env file is missing:
      if (fs.existsSync("./.env") === false) {
        var filename = ".env";
        fs.closeSync(fs.openSync(filename, 'w'));
        console.log("Error: Could not find .env file in directory. A new one has been created. Please provide your GitHub authentication token in the .env file.");
      // If github token is missing:
      } else if (process.env.GITHUB_TOKEN === undefined) {
        console.log("Error: Github token cannot be found in .env file!");
      // Otherwise, the token is incorrect:
      } else {
        console.log("Error: Github token not valid!");
      }
      break;
    // When repo is valid
    case 200:
      getRepoContributors(myArgs[0], myArgs[1], function(err, result) {
        if (err) {
          throw err;
        } else {
          console.log("No errors reported!");
          if (fs.existsSync("./avatars") === false) {
            fs.mkdir("./avatars");
          }
          var userList = JSON.parse(result);
          userList.forEach(function(user) {
            var url = user.avatar_url;
            var path = "avatars/" + user.login + ".jpg";
            downloadImageByURL(url, path);
          });
          console.log('Download(s) complete!');
        }
      });
      break;
  }
});

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': "token " + process.env.GITHUB_TOKEN
      }
    };
  request(options, function(err, res, body) {
    cb(err, body);
  });
}


function downloadImageByURL(url, filepath) {
  request(url)
    .on('error', function(err) {
      throw err;
    })
    .pipe(fs.createWriteStream(filepath))
    .on('finish', function() {
    });
}

function repoStatus(owner, name, callback) {
  var options = {
    url: "https://api.github.com/repos/" + owner + "/" + name + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': "token " + process.env.GITHUB_TOKEN
    }
  };
  request(options)
    .on('error', function(err) {
      throw err;
    })
    .on('response', function(response) {
      callback(response.statusCode);
  });
}

