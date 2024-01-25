```javascript
let comments = [];
let currentURL = '';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ comments: [] });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'getComments') {
    chrome.storage.sync.get(['comments'], (result) => {
      comments = result.comments;
      sendResponse({ comments: comments.filter(comment => comment.url === currentURL) });
    });
  } else if (request.message === 'saveComment') {
    comments.push(request.data);
    chrome.storage.sync.set({ comments: comments }, () => {
      sendResponse({ status: 'Comment saved' });
    });
  } else if (request.message === 'getQuote') {
    fetch('https://api.quotable.io/random')
      .then(response => response.json())
      .then(data => {
        sendResponse({ quote: data.content, author: data.author });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  return true;
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    currentURL = changeInfo.url;
  }
});
```