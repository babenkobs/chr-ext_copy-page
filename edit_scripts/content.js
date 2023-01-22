function setConfigSiteServer() {
    setOpt().then(function(){
        buttonCreate = document.querySelector("isp-form-button .ispui-button.ispui-button_theme_primary")
        //buttonCreate.click()
    })
}

function setOpt() {
    return new Promise(function(resolve, reject) {
        //compressionLevelElem = document.querySelector("isp-formly-slider-field").shadowRoot.querySelector("ispui-slider")
        //compressionLevelElem.setAttribute("value", "5")

        //cacheConfigurationElem = document.querySelector("[name='site_srv_cache']")
        //cacheConfigurationElem.click()

        //Cache period (click on select input and click "unlimited" option)
        //document.querySelector("#formly_63_select_site_expire_times_3 > ispui-select-button-legend").click()
        //delay(500).then(() => document.querySelector("#isp-dynamic-form-scrollable-container > ispui-dropdown-popup > div > ispui-dropdown-content > div > ispui-select-list > div:nth-child(5)").click());

        ddosProtectionElem = document.querySelector("[name='site_ddosshield']")
        ddosProtectionElem.click()

        redirectElem = document.querySelector("[name='site_redirect_http']")
        redirectElem.click()

        hstsElem = document.querySelector("[name='site_hsts']")
        hstsElem.click()

        resolve()
    })
}


function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function clickChooseFile() {
    chooseFile = document.querySelector('ngispui-file > div > span.ngispui-file__link.ngispui-file__link_is_active.ng-star-inserted')
    if (!chooseFile) {
        setTimeout(clickChooseFile, 100)
    } else {
        chooseFile.click()
    }
}

function checkDOMChange(){
    agreeDeleteBtn = document.querySelector('.ispui-confirm__button-group .ispui-button_theme_primary')
    if (!agreeDeleteBtn) {
        setTimeout( checkDOMChange, 100 )
    } else {
        agreeDeleteBtn.click()
        uploadBtn = document.querySelector('button.button_name_upload')
        console.log(uploadBtn)
        delay(1000).then(() => uploadBtn.click());
        clickChooseFile()
    }
}

function agreeExtract(){
    btn = document.querySelector('.ispui-button.ispui-button_theme_primary')
    if (!btn){
        setTimeout(agreeExtract, 100)
    } else {
        btn.click()
    }
}
function checkArchiveDropdown(){
    extractBtn = document.querySelector('button.button_name_extract')
    if (!extractBtn) {
        setTimeout(checkArchiveDropdown, 100)
    } else {
        extractBtn.click()
        agreeExtract()
    }
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function hardClick(selector) {
    //Create custom click event on select all button, because default does not work
    var evt = document.createEvent('MouseEvents')
    evt.initMouseEvent('mousedown', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    if (typeof selector === 'string' || selector instanceof String){
        document.querySelectorAll(selector)[0].dispatchEvent(evt)
    } else {
        selector.dispatchEvent(evt)
    }
}

function addISPNUnarchiveButton(){
    var xpath = "//span[text()='Edit']";
    var matchingElement = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    editBtn = matchingElement.closest('isp-toolbar-list-button')
    div = document.createElement('div')
    div.classList.add('toolbar__group', 'ng-star-inserted', 'bbs_unarchive_btn')
    div.innerHTML = `
    <span class="toolgroup-label" style="
    padding: 8px 5px;
    display: flex;
    background: #1bff007a;
    cursor: pointer;
    font-weight: 700;
">Unarchive</span>`
    editBtn.parentNode.insertBefore(div, editBtn.nextSibling)
    div.onclick = ()=>{
        child = document.querySelector('[data-ispui-tooltip-text$=".zip"]')
        parent = child.closest('.ispui-table__row.table__row')
        checkBtn = parent.querySelector('.ispui-table__td.table__checkbox-cell.ng-star-inserted')
        hardClick(checkBtn)
        archiveBtn = getByXpath("//span[text()='Archive']").closest('ispui-dropdown')
        archiveBtn.setAttribute('type', 'click')
        archiveBtn.click()

        checkArchiveDropdown()
    }
}

function addISPMDeleteButton(){
    editBtn = getByXpath("//span[text()='Edit']").closest('isp-toolbar-list-button')
    div = document.createElement('div')
    div.classList.add('toolbar__group', 'ng-star-inserted', 'bbs_deleteAndUpload_btn')
    div.innerHTML = `
    <span class="toolgroup-label" style="
    padding: 8px 5px;
    display: flex;
    background: #ff52007a;
    cursor: pointer;
    font-weight: 700;
">Delete all and upload</span>`
    editBtn.parentNode.insertBefore(div, editBtn.nextSibling)
    div.onclick = ()=>{
        hardClick('#layout-main-page > isp-list > isp-table > ispui-tooltip-wrapper > ispui-table-resizer > table > thead > tr > th.ispui-table__th.table__checkbox-cell > div')
        //Изменить атрибут hover на click и после этого кликнуть
        editBtn2 = getByXpath("//span[text()='Edit']").closest('ispui-dropdown')
        editBtn2.setAttribute('type', 'click')
        editBtn2.click()

        deleteBtn = document.querySelector('button.button_name_delete')
        deleteBtn.click()

        checkDOMChange()
    }
}

function getByXpath(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
