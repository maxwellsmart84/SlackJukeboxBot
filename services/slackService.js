const uuidV4 = require('uuid/v4');
const { WebClient } = require('@slack/client');

const SLACK_WEB_CLIENT = new WebClient(process.env.SLACK_TOKEN);
module.exports = {
  async postEphermal({ data } = {}) {
    try {
      const slackResponse = await SLACK_WEB_CLIENT.postEphermal(data);
      return slackResponse;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  },
  // eslint-disable-next-line camelcase
  buildSlackTrackSearchResultMenu({ channel, response_url, user, spotifySearchData } = {}) {
    const slackRequest = {
      channel,
      response_url,
      response_type: 'ephemeral',
      user,
      attachments: [{
        title: 'Select a song',
        fallback: 'Something went wrong',
        callback_id: `SearchMenu_${uuidV4()}`,
      }],
    };

    slackRequest.attachments[0].actions = spotifySearchData.map(buildSlackTrackSelectMenuActions);
    return { ...slackRequest };
  },

};

function buildSlackTrackSelectMenuActions(spotifyData) {
  // const { url: imageUrl } = spotifyData.album.images.find(image => image.height === '64');
  const { artists: [{ name: artistName }] } = spotifyData;
  const { album: { name: albumName } } = spotifyData;
  const { name: trackName } = spotifyData;
  const { uri: trackUri } = spotifyData;
  return {
    name: 'songList',
    type: 'select',
    options: [{
      title: `${artistName}, ${albumName}: ${trackName}`,
      value: trackUri,
    }],
  };
}
