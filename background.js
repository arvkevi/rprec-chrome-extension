function fetchSimilarArticles(slug) {
    const url = `https://realpython-recommender.herokuapp.com/articles/similar/doc2vec/${encodeURIComponent(slug)}/`;

    return fetch(url).then(function (response) {
        if (!response.ok) {
            throw new Error(`Recommendation request failed with status ${response.status}`);
        }
        return response.json();
    });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message !== "start" || typeof request.slug !== "string" || !request.slug) {
        return;
    }

    chrome.storage.local.get(request.slug, function (stored) {
        if (chrome.runtime.lastError) {
            sendResponse({ ok: false, error: chrome.runtime.lastError.message });
            return;
        }

        if (stored[request.slug]) {
            sendResponse({ ok: true, data: stored[request.slug] });
            return;
        }

        fetchSimilarArticles(request.slug)
            .then(function (data) {
                chrome.storage.local.set({ [request.slug]: data }, function () {
                    if (chrome.runtime.lastError) {
                        sendResponse({ ok: false, error: chrome.runtime.lastError.message });
                        return;
                    }
                    sendResponse({ ok: true, data: data });
                });
            })
            .catch(function (error) {
                console.error("Unable to fetch similar articles:", error);
                sendResponse({ ok: false, error: error.message });
            });
    });

    return true;
});