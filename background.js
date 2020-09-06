function fetchSimilarArticles(slug) {
    let recommenderUrl = 'https://realpython-recommender.herokuapp.com/';
    let doc2vecEndpoint = 'articles/similar/doc2vec/';
    let doc2vecUrl = recommenderUrl + doc2vecEndpoint + slug + '/';
    var slug = slug;

    fetch(doc2vecUrl)
        .then(
            function (response) {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                response.json().then(function (data) {
                    console.log(data);
                    chrome.storage.local.set({ [slug]: data });
                });
            }
        )
        .catch(function (err) {
            console.log('Fetch Error :-S', err);
        })
};

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.message === "start") {
            console.log("Someone pressed the button")
            chrome.storage.local.get(request.slug, function (data) {
                if (Object.keys(data).length === 0 && data.constructor === Object === true) {
                    fetchSimilarArticles(request.slug);
                    console.log("Fetched Similar Real Python articles");
                    function send() {
                        chrome.runtime.sendMessage({
                            message: "storage is ready"
                        })
                    };
                    setTimeout(send, 500);
                    return true;
                } else {
                    console.log("Slug already in local storage")
                    chrome.runtime.sendMessage({
                        message: "storage is ready"
                    });
                    return true
                }
            });
        } else {
            console.log("request.message was not equal to start")
            return true
        }
    }
);