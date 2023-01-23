function cleanTranslatedHtml(html) {
    // Remove google translate marks in the page
    if (html.classList.length === 1) {
        html.removeAttribute("class")
    } else {
        html.classList.remove("translated-ltr")
    }

    html.querySelector('#goog-gt-tt').remove()
    html.querySelector('.goog-te-spinner-pos').remove()
    html.querySelector('link[href="https://translate.googleapis.com/translate_static/css/translateelement.css"]').remove()

    // Translate not translated text
    meta = html.querySelector('meta[property="og:title"]')
    if (meta) {
        meta.content = document.querySelector('title').innerHTML
    }

    page = new XMLSerializer().serializeToString(document.doctype) + document.getElementsByTagName('html')[0].outerHTML
    page = page.replace(new RegExp('<font style="vertical-align: inherit;">|</font>','g'),'')
    return page
}

// CASE SWITCHER
chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        console.log(message.data)
        switch(message.data.type) {

            case "copyPage":
                html = document.querySelector('html')
                page = ''
                if (html.classList.contains("translated-ltr")) {
                    description = html.querySelector('meta[name="description"]')
                    if (description) {
                        fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' + html.lang + '&dt=t&q=' + encodeURI(description.content))
                            .then(response => response.json())
                            .then(data => {
                                description.content = data[0][0][0]
                                page = cleanTranslatedHtml(html)
                                sendResponse(page)
                                return true
                                console.log('fetched description')
                            })
                        return true

                    } else { // if not description
                        sendResponse(cleanTranslatedHtml(html))
                        return true
                    }

                } else { // if not translated
                    page = new XMLSerializer().serializeToString(document.doctype) + document.getElementsByTagName('html')[0].outerHTML
                    sendResponse(page);
                    return true
                }
            break; // copyPage
       }
        return true
    }
);

