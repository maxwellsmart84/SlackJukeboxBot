const got = require('got');

const BASE_SPOTIFY_REQ = got.extend({
  baseUrl: 'https://api.spotify.com',
  query: { limit: 3 },
  json: true,
});


module.export = {
  async searchSpotify({ artist, track } = {}) {
    const cleanParams = `artist:${encodeURIComponent(artist)}track:${encodeURIComponent(track)}`;
    const uri = `/search?q=${cleanParams}`;
    const { access_token: token } = await authSpotify();
    try {
      const reply = await BASE_SPOTIFY_REQ.get(`/v1${uri}`, {
        uri,
        headers: { Authorization: `Bearer ${token}` },
        qsParseOptions: { encode: false },
        qs: {
          // q: params,
          limit: 6,
        },
        json: true,
      });
      return reply;
    } catch (err) {
      console.error('SEARCH SPOTIFY', err);
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
    const reply = await got.post('https://accounts.spotify.com/api/token', {
      form: { grant_type: 'client_credentials' },
      headers: { Authorization: `Basic ${authString}` },
      json: true,
    });
    return reply;
  } catch (err) {
    console.error('AUTH SPOTIFY', err);
    throw new Error(err);
  }
}
