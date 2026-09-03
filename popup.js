function showMessage(message) {
  const output = document.getElementById("tab-list");
  output.replaceChildren();
  output.textContent = message;
}

function renderSimilarArticles(similarArticles) {
  if (!Array.isArray(similarArticles) || similarArticles.length === 0) {
    showMessage("Real Python Recommender works when viewing a Real Python article.");
    return;
  }

  const output = document.getElementById("tab-list");
  const table = document.createElement("table");
  table.className = "table";
  const header = table.createTHead().insertRow();
  ["Top 3 Similar Pages", "Similarity Score"].forEach(function (label) {
    const cell = document.createElement("th");
    cell.textContent = label;
    header.appendChild(cell);
  });

  const body = table.createTBody();
  similarArticles.slice(0, 3).forEach(function (article) {
    if (typeof article.similar_slug !== "string" || typeof article.doc2vec_similarity !== "number") {
      return;
    }

    const row = body.insertRow();
    const title = row.insertCell();
    const link = document.createElement("a");
    link.href = new URL(article.similar_slug, "https://realpython.com/").href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = article.similar_slug;
    title.appendChild(link);
    const score = row.insertCell();
    score.textContent = article.doc2vec_similarity.toFixed(2);
  });

  output.replaceChildren(table);
}

function requestSimilarArticles() {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    const activeTab = tabs[0];
    if (!activeTab || !activeTab.url) {
      showMessage("Unable to read the active tab.");
      return;
    }

    const pathParts = new URL(activeTab.url).pathname.split("/").filter(Boolean);
    const slug = pathParts[pathParts.length - 1];
    if (!slug) {
      showMessage("Real Python Recommender works when viewing a Real Python article.");
      return;
    }

    chrome.runtime.sendMessage({ message: "start", slug: slug }, function (response) {
      if (chrome.runtime.lastError || !response || !response.ok) {
        showMessage("Unable to retrieve similar articles. Please try again.");
        return;
      }
      renderSimilarArticles(response.data);
    });
  });
}

document.getElementById("getSimilarArticles").addEventListener("click", requestSimilarArticles);
