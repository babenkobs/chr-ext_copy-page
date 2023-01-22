console.log('popup.js!!!')
popupTitle = document.querySelector('.title')
popupDescription = document.querySelector('.description')
btnPointer = document.querySelector('.pointer')


function sendMessage(data, somefunction = (response)=>{}) {
    console.log('sending')
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {"data": data}, function(response){
            somefunction(response)
        })
    })
}

popupTitle.onclick = popupDescription.onclick = function(){
    navigator.clipboard.writeText(this.innerText);
    this.classList.add('greenBackground')
}

btnPointer.onclick = function(){
    if (this.classList.contains('greenBackground')) {
        this.classList.remove('greenBackground')
        sendMessage({"type":'pointerOff'})
    } else {
        this.classList.add('greenBackground')
        sendMessage({"type":'pointerOn'})
    }
}

var updatePopup = () => {
    chrome.storage.sync.get(['title', 'description'], function (data) {
        popupTitle.innerText = data.title
        popupDescription.innerText = data.description
        console.log('updatePopup')
    });
}

sendMessage({"type":'pointerStatus'}, (response)=>{
    if (response == 'none') btnPointer.classList.add('greenBackground')
})
sendMessage({"type":'getSeo'}, updatePopup)
