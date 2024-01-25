```javascript
let comments = [];
let currentURL = '';
let quote = '';

document.getElementById('submitComment').addEventListener('click', saveComment);
document.getElementById('optionsButton').addEventListener('click', openOptions);

function fetchComments() {
  chrome.runtime.sendMessage({message: 'getComments', url: currentURL}, function(response) {
    comments = response.comments;
    displayComments();
  });
}

function saveComment() {
  const commentBox = document.getElementById('commentBox');
  const comment = commentBox.value.trim();
  if (comment) {
    chrome.runtime.sendMessage({message: 'saveComment', url: currentURL, comment: comment}, function(response) {
      commentBox.value = '';
      fetchComments();
    });
  }
}

function displayQuote() {
  chrome.runtime.sendMessage({message: 'getQuote'}, function(response) {
    quote = response.quote;
    document.getElementById('quoteDisplay').innerText = quote.text;
    document.getElementById('popupContainer').style.backgroundColor = quote.color;
  });
}

function openOptions() {
  chrome.runtime.openOptionsPage();
}

function initPopup() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    currentURL = tabs[0].url;
    fetchComments();
    displayQuote();
  });
}

document.addEventListener('DOMContentLoaded', initPopup);
```