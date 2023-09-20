
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    try {
        const response = await fetch('https://open.spotify.com/get_access_token?reason=transport&productType=web_player');
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch Spotify access token' });
    }
}
