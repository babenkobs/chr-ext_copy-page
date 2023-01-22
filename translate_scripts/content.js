const tag = ['SCRIPT','svg','FORM','VIDEO']

function getChildNodes(elem, data){
    elem.childNodes.forEach(function(item){
        if (! tag.includes(item.nodeName) && item.textContent.replace(/\s+/g,'') != ''){
            if (item.nodeType == Node.TEXT_NODE){
                data.searchReplaceArray.forEach(function(data){
                    item.nodeValue = item.nodeValue.replace(new RegExp(data.search, "gi"), data.replace)
                })            
            } else if (item.childNodes != undefined) 
                    getChildNodes(item, data)
        }
    })      
}

function searchReplace(data) {
    titleElem = document.querySelector('title')
    descriptionElem = getDescription()
    body = document.body

    data.searchReplaceArray.forEach(function(data){
        if (titleElem) {
            titleElem.innerHTML = titleElem.innerHTML.replace(new RegExp(data.search, "gi"), data.replace)
        }
        if (descriptionElem) {
            descriptionElem.content = descriptionElem.content.replace(new RegExp(data.search, "gi"), data.replace)
        }
    })

    getChildNodes(body, data)
}
