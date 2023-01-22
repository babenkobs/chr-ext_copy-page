sendMessage({type:'isServerSiteSettings'}, function(response){
    console.log('site settings')
    console.log(response)
    if (response == 'yes') {
        menuLinks = document.querySelector('.serverSettings')
        menuLinks.classList.remove('hidden')
        menuGenerateBtn = document.querySelector('#btn-site-config')
        menuGenerateBtn.onclick = function(){
            sendMessage({
                "type":"setServerSiteSettings"
            })
        }
    }
})
