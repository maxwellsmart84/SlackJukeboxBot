const got = require('got');

const BASE_SPOTIFY_REQ = got.extend({
  baseUrl: 'https://api.spotify.com',
  json: true,
});


module.exports = {
  async searchSpotify({ artist, track } = {}) {
    const cleanParams = `artist:${encodeURIComponent(artist.trim())}%20track:${encodeURIComponent(track.trim())}`;
    const uri = `v1/search?&type=track&limit=3&q=${cleanParams}`;
    const { access_token: token } = await authSpotify();
    try {
      const { body: reply } = await BASE_SPOTIFY_REQ.get(uri, {
        uri,
        headers: { Authorization: `Bearer ${token}` },
        qsParseOptions: { encode: false },
      });
      return reply;
    } catch (err) {
      console.error('SEARCH SPOTIFY ERROR', err);
      throw new Error(err);
    }
  },
  async playTrack({ trackId } = {}) {
    console.log('PLAY TRACK');
    return trackId;
  },
};


async function authSpotify() {
  const authString = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
  try {
    const { body: reply } = await got.post('https://accounts.spotify.com/api/token', {
      form: true,
      body: { grant_type: 'client_credentials' },
      headers: { Authorization: `Basic ${authString}` },
      json: true,
    });
    return reply;
  } catch (err) {
    console.error('AUTH SPOTIFY ERROR', err);
    throw new Error(err);
  }
}
