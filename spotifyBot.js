const botBuilder = require('claudia-bot-builder');
const { searchSpotify, playTrack } = require('./spotifyService');
// const got = require('got');
// const { WebClient } = require('@slack/client');
// const spotifyTestData = require('./testSpotifyResponse.json');

// https://github.com/claudiajs/claudia-bot-builder/blob/master/docs/API.md#message-object-structure

module.exports = botBuilder(async (message) => {
  const { originalRequest: slackResponse } = message;
  console.log(slackResponse);
  console.log('PLAY TRACK', await playTrack('1234'));
  // const slackWebClient = new WebClient(process.env.SPOTIFY_TOKEN);
  const [artist, track] = message.text.split(',');

  if (!artist || !track) {
    return 'Please enter an Artist and Track like this: Whitney Houston, I Wanna Dance With Somebody';
  }
  const { tracks: { items: hits } = [] } = await searchSpotify(artist, track);
  if (hits.length === 0) {
    return 'Sorry we could not find the song you were looking for, try again';
  }
  console.log('hits', hits);
  return 'just the hits';
  // const slackResponse = hits.map((data) => {
  //   return {

  //   }
  // })

  // const testResponse = spotifyTestData.map((data) => {
  //   const { url: imageUrl } = data.album.images.find((image) =>  image.height === '64');
  //   return {
  //     image: imageUrl,
  //     actions: [{
  //       options: [{
  //         title: `${artists[0].name}, ${data.name}, ${album.name}`,
  //         value: {
  //           uri:`${data.uri}`,
  //           id: `${data.id}`,
  //         }
  //       }]
  //     }]

  //   }
  // })


  // return songForm
  //   .addAttachment('SR1')
  //   .addTitle('Choose and artist and album')
  //   .addField('Enter Artist', 'artist')
  //   .addField('Enter Album Title', 'album')
  //   .addField('Enter Song Title', 'track')
  //   .get();
  // console.log(songResponse);
  // const { artist, track } = req.query;
  // const cleanArtist = artist.replace(/\s/g, '+');
  // const cleanTrack = track.replace(/\s/g, '+');
  // const encodedParams = `${cleanArtist}+${cleanTrack}`;
  // const spotifySearchData = await searchSpotify(message.text);
}, { platforms: ['slack', 'slackSlashCommand'] });

