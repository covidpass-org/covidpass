function updatePage() {

    let dataUrl = localStorage.getItem('pdfDataUrl');
    const myLinkElement = document.getElementById('mylink');

    if (dataUrl != undefined) {

        let script = `function showData(base64URL){
                    var win = window.open();
                    win.document.write('<iframe src="' + base64URL  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>');
                } showData('${dataUrl}');`;

        let hrefValue = `javascript:${script};`;
        myLinkElement.setAttribute('href', hrefValue);

    } else {
        if (navigator.userAgent.indexOf('Safari') != -1) {
            myLinkElement.textContent = 'Sorry. This feature requires the use of Safari as default browser. You can change it in Settings - Chrome/Firefox';
        } else {
            myLinkElement.textContent = 'Original receipt not available locally. Please re-create your wallet pass. Thanks.';
        }
    }
}