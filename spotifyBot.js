const botBuilder = require('claudia-bot-builder');
const { searchSpotify } = require('./services/spotifyService');
const { buildSlackTrackSearchResultMenu, postEphemeral } = require('./services/slackService');
// const got = require('got');
// const spotifyTestData = require('./testSpotifyResponse.json');

// https://github.com/claudiajs/claudia-bot-builder/blob/master/docs/API.md#message-object-structure

module.exports = botBuilder(async (message, originalApiRequest) => {
  const { originalRequest: slackResponse } = message;
  console.log('-------slack request---------', slackResponse);
  console.log('-------original request---------', originalApiRequest);
  // eslint-disable-next-line camelcase
  const { channel_id: channel, response_url, user_id: user } = slackResponse;

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
  const { tracks: { items: spotifySearchData } = [] } = await searchSpotify({ artist, track });
  if (spotifySearchData.length === 0) {
    return 'Sorry we could not find the song you were looking for, try again';
  }
  const slackMenuData = buildSlackTrackSearchResultMenu({
    channel,
    response_url,
    user,
    spotifySearchData,
  });
  const trackSelection = await postEphemeral({ data: slackMenuData });
  console.log('SLACK RESPONSE', trackSelection);
  // return 'just the hits';
  // eslint-disable-next-line camelcase,no-shadow
  return 'DEFAULT RETURN TEXT';
});

