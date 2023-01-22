btnSearchReplace = document.querySelector('#btn-search-replace')
inputSearch = document.querySelector('input[name="search"]')
inputReplace = document.querySelector('input[name="replace"]')

function searchReplaceControls() {
    buttonsDublicate = document.querySelectorAll('.searchReplace .dublicate')
    buttonsDublicate.forEach(function(item){
        item.onclick = ()=>{
            Block = item.closest('.searchReplace')
            Block.parentNode.insertBefore(Block.cloneNode(true), Block.nextSibling)
            searchReplaceControls()
        }
    })

    buttonsDelete = document.querySelectorAll('.searchReplace .delete')
    buttonsDelete.forEach(function(item){
        item.onclick = ()=>{
            Block = item.closest('.searchReplace')
            Block.remove()
            searchReplaceControls()
            storeSearchReplaceInputs()
        }
    })

    buttonsSwap = document.querySelectorAll('.searchReplace .swap')
    buttonsSwap.forEach(function(item){
        item.onclick = ()=>{
            console.log('swapclick')
            Block = item.closest('.searchReplace')
            inputSearch = Block.querySelector('input[name="search"]')
            inputReplace = Block.querySelector('input[name="replace"]')
            inputSearchVal = inputSearch.value
            inputReplaceVal = inputReplace.value
            console.log(inputSearchVal)
            console.log(inputReplaceVal)
            inputSearch.value = inputReplaceVal
            inputReplace.value = inputSearchVal
            storeSearchReplaceInputs()
        }
    })


    inputsBlocks = document.querySelectorAll('.searchReplace')
    searchReplaceArray = []
    inputsBlocks.forEach(function(item){
        inputSearch = item.querySelector('input[name="search"]')
        inputReplace = item.querySelector('input[name="replace"]')

        inputSearch.oninput = inputReplace.oninput = function(){
            storeSearchReplaceInputs()
        }
    })

}

function storeSearchReplaceInputs() {
    inputsBlocks = document.querySelectorAll('.searchReplace')
    searchReplaceArray = []
    inputsBlocks.forEach(function(item){
        searchReplaceArray.push({
            'search': item.querySelector('input[name="search"]').value,
            'replace': item.querySelector('input[name="replace"]').value,
        })
    })

    chrome.storage.sync.set({ 'searchReplaceArray': searchReplaceArray });
}


searchReplaceControls()

btnSearchReplace.onclick = function(){
    cityBlock = document.querySelector('.cityReplace-block')
    inputsBlocks = document.querySelectorAll('.searchReplace')
    searchReplaceArray = []
    inputsBlocks.forEach(function(item){
        searchReplaceArray.push({
            'search': item.querySelector('input[name="search"]').value,
            'replace': item.querySelector('input[name="replace"]').value,
        })
    })
    console.log(cityBlock.querySelector('[name="citySearch"]').value)
    sendMessage({"type": 'searchReplace',
        "searchReplaceArray": searchReplaceArray,
        "searchReplaceCity": {
            "search": cityBlock.querySelector('[name="citySearch"]').value,
            "replace": cityBlock.querySelector('[name="cityReplace"]').value,
            "cities": city
        }
    }, sendMessage({"type":'getSeo'}, updatePopup))
}

chrome.storage.sync.get(['searchReplaceArray'], function (data) {

    if (data.searchReplaceArray) {
        data.searchReplaceArray.forEach((item, index)=>{
            if (index == 0) {
                inputSearch.value = item.search
                inputReplace.value = item.replace
            } else {
                searchReplaceBlock = document.querySelectorAll('.searchReplace')
                if (searchReplaceBlock.lenght == 1) {
                    searchReplaceBlock = searchReplaceBlock[0]
                } else {
                    searchReplaceBlock = searchReplaceBlock[searchReplaceBlock.length - 1]
                }
                searchReplaceBlock2 = searchReplaceBlock.cloneNode(true)
                searchReplaceBlock2.querySelector('[name="search"]').value = item.search
                searchReplaceBlock2.querySelector('[name="replace"]').value = item.replace
                searchReplaceBlock.parentNode.insertBefore(searchReplaceBlock2, searchReplaceBlock.nextSibling)
                searchReplaceControls()
            }
        })
    }
});


