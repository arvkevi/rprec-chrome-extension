
function requestSimilarArticles(event) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var activeTab = tabs[0];
    let slug = tabs[0].url.split('/').slice(-2, -1)[0];
    chrome.runtime.sendMessage({ message: "start", slug: slug });
  });
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "storage is ready") {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        var slug = tabs[0].url.split('/').slice(-2, -1)[0];
        var outputDiv = document.getElementById("tab-list");
        chrome.storage.local.get([slug], function (data) {
          console.log(data);
          var similarData = data[slug];
          var realPythonUrl = 'https://realpython.com/'
          console.log(similarData);
          if (tabs[0].favIconUrl != undefined) {
            outputDiv.innerHTML = ""
            var htmlStr = `
            <table class="table">
              <thead>
                  <tr>
                    <th>Top 3 Similar Slugs</th>
                    <th>Similarity Score</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                    <td><a href="${realPythonUrl}${JSON.stringify(similarData[0].similar_slug).replace(/\"/g, "")}" target="_blank">${JSON.stringify(similarData[0].similar_slug).replace(/\"/g, "")}</a> <i class="fas fa-external-link-square-alt" style="color:#1E344A;"></i></td>
                    <td style="text-align:center">${JSON.stringify(similarData[0].doc2vec_similarity.toFixed(2)).replace(/\"/g, "")}</td>
                  </tr>
                  <tr>
                    <td><a href="${realPythonUrl}${JSON.stringify(similarData[1].similar_slug).replace(/\"/g, "")}" target="_blank">${JSON.stringify(similarData[1].similar_slug).replace(/\"/g, "")}</a> <i class="fas fa-external-link-square-alt" style="color:#1E344A;"></i></td>
                    <td style="text-align:center">${JSON.stringify(similarData[1].doc2vec_similarity.toFixed(2)).replace(/\"/g, "")}</td>
                  </tr>
                  <tr>
                    <td><a href="${realPythonUrl}${JSON.stringify(similarData[2].similar_slug).replace(/\"/g, "")}" target="_blank">${JSON.stringify(similarData[2].similar_slug).replace(/\"/g, "")}</a> <i class="fas fa-external-link-square-alt" style="color:#1E344A;"></i></td>
                    <td style="text-align:center">${JSON.stringify(similarData[2].doc2vec_similarity.toFixed(2)).replace(/\"/g, "")}</td>
                  </tr>
              </tbody>
            </table>
            `
            outputDiv.innerHTML += htmlStr
          }
        });
      });
    }
});

document.getElementById('getSimilarArticles').onclick = requestSimilarArticles;
