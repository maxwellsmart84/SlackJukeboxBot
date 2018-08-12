const botBuilder = require('claudia-bot-builder');
const { searchSpotify, playTrack } = require('./spotifyService');
// const got = require('got');
// const { WebClient } = require('@slack/client');
// const spotifyTestData = require('./testSpotifyResponse.json');

// https://github.com/claudiajs/claudia-bot-builder/blob/master/docs/API.md#message-object-structure

module.exports = botBuilder(async (message) => {
  const { originalRequest: slackResponse } = message;
  // eslint-disable-next-line camelcase
  const { channel_id, response_url, user_id: user } = slackResponse;


  //   { token: '4IyKwyYE3bgwZaQ5XF8kt8HJ',
  // team_id: 'T31PFQN2F',
  // team_domain: 'blumpkinclub',
  // channel_id: 'C365JEZFY',
  // channel_name: 'bot-testing',
  // user_id: 'U3410GZMM',
  // user_name: 'maxwellsmart84',
  // command: '/remotecontrol',
  // text: 'Arcade Fire, Suburbs',
  // response_url: 'https://hooks.slack.com/commands/T31PFQN2F/416249902887/baayAAaRgiavIL0D03FsJ6F2',
  // trigger_id: '415079950675.103797838083.e933247ecbeb17993fbc8c67a3126bb5' }
  // const slackWebClient = new WebClient(process.env.SPOTIFY_TOKEN);
  const [artist, track] = message.text.split(',');

  if (!artist || !track) {
    return 'Please enter an Artist and Track like this: Whitney Houston, I Wanna Dance With Somebody';
  }
  const { tracks: { items: hits } = [] } = await searchSpotify({ artist, track });
  if (hits.length === 0) {
    return 'Sorry we could not find the song you were looking for, try again';
  }
  console.log('SPOTIFY SEARCH RESPONSE', hits);
  const slackRequest = {
    channel_id,
    response_url,
    user,
    attachments: [{}],
  };
  return 'just the hits';
  // const slackMenuData = hits.map(data => ({}));

  // const testResponse = spotifyTestData.map((data) => {
  //   const { url: imageUrl } = data.album.images.find(image => image.height === '64');
  //   return {
  //     fallback: 'Something went wrong',
  //     text: 'Select a song from the search results',
  //     image_url: imageUrl,
  //     actions: [{
  //       name: 'songList',
  //       type: 'select',
  //       options: [{
  //         title: `${artists[0].name}, ${data.name}, ${album.name}`,
  //         value: {
  //           uri: `${data.uri}`,
  //           id: `${data.id}`,
  //         },
  //       }],
  //     }],

  //   };
  // });


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

