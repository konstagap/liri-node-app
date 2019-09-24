require("dotenv").config();
var axios = require("axios");
var keys = require("./keys.js");
var moment = require("moment");
moment().format();
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");

//movies search
var nodeRequest = process.argv[2];
//user input ==>
var userInput = process.argv[3];
//if we have all queries make a search by user input
if (nodeRequest === "movie-this" && userInput) {
  movieSearch(userInput);
  // if user input is not there, show Mr.Nobody info
} else if (nodeRequest === "movie-this" && !userInput) {
  movieSearch("Mr. Nobody");
}
//movie search function
function movieSearch(userMovie) {
  // requiring axio and assigning it to variable
  //adding user query to url to send a request
  var queryUrl =
    "http://www.omdbapi.com/?t=" + userMovie + "&y=&plot=short&apikey=trilogy";
  axios
    .get(queryUrl)
    .then(function(response) {
      //       * Title of the movie.
      console.log("Movie Title: " + response.data.Title);
      //       * Year the movie came out.
      console.log("Released: " + response.data.Year);
      //       * IMDB Rating of the movie.
      console.log("IMDB rating : " + response.data.imdbRating);
      //       * Rotten Tomatoes Rating of the movie.
      console.log("Rotten Tomatoes Rating : " + response.data.Ratings[1].Value);
      //       * Country where the movie was produced.
      console.log("Country produced: " + response.data.Country);
      //       * Language of the movie.
      console.log("Language: " + response.data.Language);
      //       * Plot of the movie.
      console.log("Plot: " + response.data.Plot);
      //       * Actors in the movie.
      console.log("Actors: " + response.data.Actors);
    })
    .catch(function(err) {
      console.log(err);
    });
}

//!!!!!!!! SPOTIFY!!!!!!!!
if (nodeRequest === "spotify-this-song" && userInput) {
  songSearch(userInput, 0);
}
// * If no song is provided then your program will default to "The Sign" by Ace of Base.
else if (nodeRequest === "spotify-this-song" && !userInput) {
  songSearch("The Sign", 4);
}
function songSearch(userSong, songNumber) {
  spotify
    .search({ type: "track", query: userSong })
    .then(function(response) {
      console.log("Song: " + response.tracks.items[songNumber].name);
      // * Artist(s)
      console.log(
        "Artist: " + response.tracks.items[songNumber].artists[0].name
      );
      // * The album that the song is from
      console.log("Album: " + response.tracks.items[songNumber].album.name);
      // * A preview link of the song from Spotify
      console.log(
        "Link to Spotify: " +
          response.tracks.items[songNumber].external_urls.spotify
      );
      console.log(
        "__________________________________________________________________________"
      );
    })
    .catch(function(err) {
      console.log(err);
    });
}

//BANDS IN TOWN!

if (nodeRequest === "concert-this") {
  concertSearch(userInput);
}

function concertSearch(userConcert) {
  var axios = require("axios");
  var queryUrl =
    "https://rest.bandsintown.com/artists/" +
    userConcert +
    "/events?app_id=codingbootcamp";
  axios
    .get(queryUrl)
    .then(function(response) {
      for (let i = 0; i < 5; i++) {
        // * Name of the venue
        console.log("Name of the venue: " + response.data[i].venue.name);
        // * Venue location
        console.log(
          "Venue location: " +
            response.data[i].venue.city +
            " " +
            response.data[i].venue.region +
            " " +
            response.data[i].venue.country
        );
        // * Date of the Event (use moment to format this as "MM/DD/YYYY")
        console.log(
          "Date of the Event: " +
            moment(response.data[i].datetime).format("LLLL")
        );

        console.log(
          "__________________________________________________________________________"
        );
      }
    })
    .catch(function(err) {
      console.log(err);
    });
}

// do-what-it-says

if (nodeRequest === "do-what-it-says") {
  fs.readFile("random.txt", "utf8", function(error, data) {
    var dataArr = data.split(",");
    if (dataArr[0]==="spotify-this-song") {
      songSearch(dataArr[1],0)
    }
    if (dataArr[0]==="movie-this") {
      movieSearch(dataArr[1])
    }
    if (dataArr[0]==="concert-this") {
      concertSearch(dataArr[1])
    }
  });
}
