const uuidV4 = require('uuid/v4');
const { WebClient } = require('@slack/client');

const SLACK_WEB_CLIENT = new WebClient(`${process.env.SLACK_TOKEN}`);
console.log(process.env.SLACK_TOKEN);
module.exports = {
  async postEphemeral({ data } = {}) {
    try {
      console.log(JSON.stringify(data, null, 2));
      const slackResponse = await SLACK_WEB_CLIENT.chat.postEphemeral(data);
      return slackResponse;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  },
  // eslint-disable-next-line camelcase
  buildSlackTrackSearchResultMenu({ channel, response_url = null, user, spotifySearchData } = {}) {
    const slackRequest = {
      text: 'Search Results: Select a song from the dropdown',
      channel,
      user,
      response_type: 'ephemeral',
      attachments: [{
        text: 'Select a song',
        fallback: 'Something went wrong',
        callback_id: `SearchMenu_${uuidV4()}`,
        actions: [{
          name: 'songList',
          type: 'select',
        }],
      }],
    };

    slackRequest.attachments[0].actions[0].options = spotifySearchData.map(buildSlackTrackSelectMenuOptions);
    return { ...slackRequest };
  },

};

function buildSlackTrackSelectMenuOptions(spotifyData) {
  // const { url: imageUrl } = spotifyData.album.images.find(image => image.height === '64');
  const { artists: [{ name: artistName }] } = spotifyData;
  const { album: { name: albumName } } = spotifyData;
  const { name: trackName } = spotifyData;
  const { uri: trackUri } = spotifyData;
  return {
    text: `${artistName}, ${albumName}: ${trackName}`,
    value: trackUri,
  };
}
