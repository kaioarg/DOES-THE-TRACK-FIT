
// Function to get Spotify Access Token
async function getSpotifyAccessToken() {
    const response = await fetch('https://open.spotify.com/get_access_token?reason=transport&productType=web_player');
    const data = await response.json();
    return data.accessToken;
}

// Extract ID from Spotify URL
function extractIdFromUrl(url) {
    const match = url.match(/([a-zA-Z0-9]{22})$/);
    return match ? match[1] : null;
}

// Remaining functions are the same, but use the Fetch API directly instead of node-fetch...

// ... (other functions: getPlaylistTracks, getTrackAudioFeatures, getAverageFeaturesOfPlaylist, doesTrackFitInPlaylist) ...

// Main function to execute the comparison when the button is clicked
async function compareFeatures() {
    const playlistUrl = document.getElementById('playlist-url').value;
    const trackUrl = document.getElementById('track-url').value;

    const playlistId = extractIdFromUrl(playlistUrl);
    const trackId = extractIdFromUrl(trackUrl);

    if (!playlistId || !trackId) {
        alert('Por favor, ingrese URLs válidas de Spotify.');
        return;
    }

    // Call the API, compare features, and update the results in the "results-section" div...
    // This part will be implemented in the next step.
}


// Function to get playlist tracks
async function getPlaylistTracks(accessToken, playlistId) {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    return data.items;
}

// Function to get track audio features
async function getTrackAudioFeatures(accessToken, trackId) {
    const response = await fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    return response.json();
}

// ... (rest of the functions from the provided index.js, adapted for the browser) ...

// Updating the compareFeatures function to actually compare and display the results
async function compareFeatures() {
    const playlistUrl = document.getElementById('playlist-url').value;
    const trackUrl = document.getElementById('track-url').value;

    const playlistId = extractIdFromUrl(playlistUrl);
    const trackId = extractIdFromUrl(trackUrl);

    if (!playlistId || !trackId) {
        alert('Por favor, ingrese URLs válidas de Spotify.');
        return;
    }

    const accessToken = await getSpotifyAccessToken();
    const playlistAverageFeatures = await getAverageFeaturesOfPlaylist(accessToken, playlistId);
    const trackFeatures = await getTrackAudioFeatures(accessToken, trackId);
    const comparisonResults = doesTrackFitInPlaylist(trackFeatures, playlistAverageFeatures);

    let resultsHtml = '<h2>Resultados de la Comparación</h2>';
    let fitsOverall = true;
    for (const feature in comparisonResults) {
        const result = comparisonResults[feature];
        resultsHtml += `<h3>${feature.toUpperCase()}</h3>`;
        resultsHtml += `<p>Valor del track: ${result.trackValue.toFixed(2)}</p>`;
        resultsHtml += `<p>Promedio de la playlist: ${result.playlistAverage.toFixed(2)}</p>`;
        resultsHtml += `<p>Diferencia: ${result.difference.toFixed(2)}</p>`;
        resultsHtml += `<p>Encaja: ${result.fits}</p>`;
        if (!result.fits) fitsOverall = false;
    }

    resultsHtml += `<h2>El track ${fitsOverall ? 'encaja' : 'no encaja'} en la playlist.</h2>`;
    document.getElementById('results-section').innerHTML = resultsHtml;
}

