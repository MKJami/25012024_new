```javascript
let comments = [];
let currentURL = '';

// Fetch comments from Chrome Storage
function fetchComments() {
  chrome.storage.sync.get([currentURL], function(result) {
    if (result[currentURL]) {
      comments = result[currentURL];
    }
  });
}

// Save comment to Chrome Storage
function saveComment(comment) {
  comments.push(comment);
  let saveObj = {};
  saveObj[currentURL] = comments;
  chrome.storage.sync.set(saveObj, function() {
    console.log('Comment saved');
  });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'getComments') {
    fetchComments();
    sendResponse({comments: comments});
  } else if (request.message === 'saveComment') {
    saveComment(request.comment);
    sendResponse({status: 'Comment saved'});
  }
});

// Get the current URL
chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
  let url = tabs[0].url;
  currentURL = url;
});
```