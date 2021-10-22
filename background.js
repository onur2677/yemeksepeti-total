chrome.browserAction.onClicked.addListener(function() {
    chrome.tabs.create({ url: "https://www.yemeksepeti.com/hesabim/onceki-siparislerim" })
});

chrome.webRequest.onCompleted.addListener(
    function(details) {
        chrome.tabs.query({
            active: true,
            currentWindow: true
        }, function(tabs) {
            if (tabs[0]) {
                chrome.tabs.sendMessage(
                    tabs[0].id, { from: 'background', subject: 'request' })
            }
        })
    }, {
        urls: [
            "https://www.yemeksepeti.com/Account/GetOrderHistory",
        ],
        types: ["xmlhttprequest"]
    }, ["responseHeaders"])