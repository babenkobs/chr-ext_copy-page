function delElem(elem) {
    item = html.querySelector(elem)
    if (item) {
        item.remove()
    }
}
function cleanTranslatedHtml(html) {
    // Remove google translate marks in the page
    if (html.classList.length === 1) {
        html.removeAttribute("class")
    } else {
        html.classList.remove("translated-ltr")
    }

    // Set locale
    locale = document.querySelector('meta[property="og:locale"]')
    if (locale) locale.content = locale.content.replace(/^.{2}/g, html.lang)
    gttt = html.querySelector('#goog-gt-')
    if (gttt) {
        gttt.remove()
        delElem('.goog-te-spinner-pos')
        delElem('#goog-gt-')
        delElem('link[href="https://translate.googleapis.com/translate_static/css/translateelement.css"]')
        delElem('link[href^="https://www.gstatic.com/"]')
    }

    // Translate not translated text
    meta = html.querySelector('meta[property="og:title"]')
    if (meta) meta.content = document.querySelector('title').innerHTML
    meta = html.querySelector('meta[property="twitter:title"]')
    if (meta) meta.content = document.querySelector('title').innerHTML

    // Отримання елемента <script> за допомогою класу
    const ldJson = document.querySelector('.yoast-schema-graph');
    if (ldJson) {
        // Розпарсювання JSON з елемента <script>
        const ldData = JSON.parse(ldJson.textContent);

        // Заміна тексту властивості "name"
        ldData.name = document.querySelector('title').innerHTML

        // Перезапис JSON з новим текстом
        ldJson.textContent = JSON.stringify(ldData);
    }


    // Remove edit attributes
    document.body.removeAttribute('contenteditable')
    document.designMode='off'

    page = new XMLSerializer().serializeToString(document.doctype) + document.getElementsByTagName('html')[0].outerHTML
    page = page.replace(new RegExp('<font style="vertical-align: inherit;">|</font>','g'),'')
    page = page.replace(new RegExp('banner-1-optin.css\?.*?"','g'),'banner-1-optin.css"')
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
                fontVertical = document.querySelector('font[style="vertical-align: inherit;"]')
                if (fontVertical) {
                    description = html.querySelector('meta[name="description"]')
                    if (description) {
                        fetch('https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=' + html.lang + '&dt=t&q=' + encodeURI(description.content))
                            .then(response => response.json())
                            .then(data => {
                                //Translate description
                                description.content = data[0][0][0]
                                meta = document.querySelector('meta[property="og:description"]')
                                if (meta) meta.content = data[0][0][0]
                                meta = document.querySelector('meta[property="twitter:description"]')
                                if (meta) meta.content = data[0][0][0]
                                page = cleanTranslatedHtml(html)
                                sendResponse(page)
                                return true
                            })
                        return true

                    } else { // if not description
                        sendResponse(cleanTranslatedHtml(html))
                        return true
                    }

                } else { // if not translated
                    // Remove edit attributes
                    document.body.removeAttribute('contenteditable')
                    document.designMode='off'
                    page = new XMLSerializer().serializeToString(document.doctype) + document.getElementsByTagName('html')[0].outerHTML
                    sendResponse(page);
                    return true
                }
            break; // copyPage

            case "editPage":
                document.body.contentEditable = 'true'
                document.designMode='on'
                return true
                break;

            case "notEditPage":
                document.body.removeAttribute('contenteditable')
                document.designMode='off'
                return true
                break;
       }
        return true
    }
);

