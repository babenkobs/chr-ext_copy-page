
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
        this.classList.add('greenBackground')
        navigator.clipboard.writeText(response)
    })
}

document.querySelector('.editpage-btn').onclick = function(){
    if (this.classList.contains('greenBackground')) {
        sendMessage({"type":'notEditPage'})
        this.classList.remove('greenBackground')
    } else {
        sendMessage({"type":'editPage'})
        this.classList.add('greenBackground')
    }
}
