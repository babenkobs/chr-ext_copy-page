
async function sendMessage(data, somefunction = ()=>{}) {
    console.log('sending')
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {"data": data}, function(response){
            somefunction(response)
        })
    })
}

document.querySelector('.copypage-btn').onclick = function(){
    sendMessage({"type":'copyPage'}, response=>{
        console.log(response)
        navigator.clipboard.writeText(response)
    })
}
