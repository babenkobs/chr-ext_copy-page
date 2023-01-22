console.log('app.js works')

if (window.location.href.includes('https://accounts.fozzy.com/index.php?m=DNSManager2&mg-action=editZone')) {
    fozzy_delete_btns = document.querySelectorAll('button[data-act="removeRecord"]')
    console.log(fozzy_delete_btns)
    fozzy_delete_btns.forEach(function(item){
        item.onclick = function(){
            document.addEventListener("keyup", event => {
                if(event.key !== "Enter") return; // Use `.key` instead.
                document.querySelector(".modal-dialog .btn.btn-danger").click(); // Things you want to do.
                event.preventDefault(); // No need to `return false;`.
            });
        }
    })
}

if (window.location.href.includes(':1500/ispmgr')){
    var oldHref = document.location.href;

    var bodyList = document.querySelector("body")

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (oldHref != document.location.href) {
                oldHref = document.location.href;
                if (window.location.href.includes('/list/file/')) {
                    bbs_deleteAndUpload_btn = document.querySelector('.bbs_deleteAndUpload_btn')
                    bbs_unarchive_btn = document.querySelector('.bbs_unarchive_btn')
                    if (window.location.href.includes('name=www') || window.location.href.includes('name=data')){
                        bbs_deleteAndUpload_btn.remove()
                        bbs_unarchive_btn.remove()
                    } else if (!bbs_deleteAndUpload_btn) {
                        addISPMDeleteButton()
                        addISPNUnarchiveButton()
                    }
                }
            }
        });
    });

    var config = {
        childList: true,
        subtree: true
    };

    observer.observe(bodyList, config);
}

function getDescription(){
    description = ''

    var metas = document.getElementsByTagName('meta');
      for(var i in metas) {
        if (typeof(metas[i].name) != 'undefined' && metas[i].name.toLowerCase() == "description") {
          description = metas[i]
        }
    }

    return description
}

function getTitle(){
    title = document.querySelector('title')

    if (title) {
        title = title.innerText
    } else {
        title = ''
    }

    return title

}

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        console.log(message.data)
        switch(message.data.type) {
            case "getSeo":
                if (!/translate.google.com/.test(window.location.href) && !/tilda.cc/.test(window.location.href)) {
                    chrome.storage.sync.set({ 'title': getTitle() });
                    chrome.storage.sync.set({ 'description': getDescription().content });
                }
            break;

            case "pointerStatus":
                if (document.querySelector('body').style.pointerEvents == 'none') {
                    sendResponse('none')
                } else {
                    sendResponse('auto')
                }
            break;

            case "pointerOff":
                document.querySelectorAll('*').forEach((item)=>{item.style.pointerEvents = 'auto'})
            break;

            case "pointerOn":
                document.querySelectorAll('*').forEach((item)=>{item.style.pointerEvents = 'none'})
            break;

            case "searchReplace":
                searchReplace(message.data)
            break;

            case "generateMenuLinks":
                generateMenuLinks()
            break;

            case "MenuIsOpen":
                if (menuEditIsOpen() != null) {
                    sendResponse('yes')
                } else {
                    sendResponse('no')
                }

            case "isServerSiteSettings":
                if (/\/form\/site.edit\//.test(window.location.href)) {
                    sendResponse('yes')
                } else {
                    sendResponse('no')
                }
            break;

            case "setServerSiteSettings":
                setConfigSiteServer()
            break;
       }
    }
);

