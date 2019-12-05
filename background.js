var redirect_url= chrome.runtime.getURL("warning_page.html");

function wait(x){
    /**
     * busy wait x milliseconds
     */
    var start = new Date().getTime();
    var end = start;
    while(end < start + x) {
        end = new Date().getTime();
    }
}

function updateCurrentUrl(url) {
    /**
     * update environment:
     *  let the system know what is the url the user tries to browse
     */
    console.log("updating environment variable: 'currentUrl' = " + url);
    chrome.storage.local.set({"currentUrl": url}, function(){});
}

function updateRedirectUrl(url) {
    /**
     * check the environment to handle url appropriately:
     *  env[url] == 0 -> url hasn't been handled before, go to "warning_page.html" and let the user decide what to do
     *  env[url] == 1 -> user wants to browse url anyway, but next time he will try to browse this url, ask him again
     *  env[url] == 2 -> browse the url anyway, as the user wished
     */
    var addToEnv = {};
    chrome.storage.local.get([url], function(environment){
        if(environment[url] === 2){
            redirect_url= url;
            console.log(redirect_url + ": always allow");
        }
        else if(/*!(url in environment) ||*/ environment[url] === 1){
            redirect_url= url;
            addToEnv[url] = 0;
            chrome.storage.local.set(addToEnv);
            console.log(redirect_url + ": allow once");
        }
        else{
            redirect_url = chrome.runtime.getURL("warning_page.html");
            addToEnv[url] = 1;
            chrome.storage.local.set(addToEnv);
            console.log(redirect_url + ": ask user what he wants to do");
        }
    });
}

function redirect(details){

    updateCurrentUrl(details.url);

    updateRedirectUrl(details.url);

    // wait 1.5 seconds before start executing (system stability)
    wait(1500);

    console.log("redirecting to: " + redirect_url);
    return {redirectUrl: redirect_url};
}

/**
 * before any web request that about to occur:
 *  if it black, handle it by activating the function 'redirect'
 */
chrome.webRequest.onBeforeRequest.addListener(
    redirect,
    {urls: blacklist},
    ["blocking"]);
