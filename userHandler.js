/**
 * handle user decisions for any black url
 */
window.addEventListener('load', function load(event)
{
    var closeTabBtn = document.getElementById('closeTabBtn');
    var backBtn = document.getElementById('backBtn');
    var backHomeBtn = document.getElementById('backHomeBtn');
    var continueBtn = document.getElementById('continueBtn');
    var alwaysContinueBtn = document.getElementById('alwaysContinueBtn');
    var addToEnv= {};

    if(closeTabBtn){
        /**
         * user chose to close the current tab
         */
        closeTabBtn.onclick = function() {
            console.log("closing tab");
            chrome.tabs.getCurrent(function (tab) {
                chrome.tabs.remove(tab.id, function () {
                });
            });
        }
    }
    if(backBtn){
        /**
         * user chose to go back to previous page
         */
        console.log("going back");
        try{
            backBtn.onclick = function(){
                chrome.tabs.getCurrent(function (tab) {
                    chrome.tabs.goBack(tab.id);
                });
            }
        }
        catch(err){
            /**
             * in case there is no previous page, stay at the warning page
             */
            var warning_page = chrome.runtime.getURL("warning_page.html");
            chrome.tabs.update({ url: warning_page });
        }

    }
    if (backHomeBtn){
        /**
         * user chose to go to home page
         */
        console.log("going home");
        backHomeBtn.onclick = function(){
            var home = "https://www.google.com";
            chrome.tabs.update({ url: home });
        }
    }
    if(continueBtn){
        /**
         * user chose to continue once
         */
        console.log("continuing once");
        continueBtn.onclick = function(){
            chrome.storage.local.get(["currentUrl"], function(environment){
                var url = environment.currentUrl;
                addToEnv[url] = 1;
                chrome.storage.local.set(addToEnv);
                chrome.tabs.update({ url: url});
            });
        }
    }
    if(alwaysContinueBtn){
        /**
         * user chose to continue and never ask again
         */
        console.log("continuing always");
        alwaysContinueBtn.onclick = function(){
            chrome.storage.local.get(["currentUrl"], function(environment){
                var url = environment.currentUrl;
                addToEnv[url] = 2;
                chrome.storage.local.set(addToEnv, function(){});
                chrome.tabs.update({url: url}, function () {});
            });
        }
    }
});
