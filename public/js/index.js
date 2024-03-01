async function changeLang(lang){
    const langElement = document.getElementById('lang');
    let redirectUrl = '/main/';

    if (lang === 'en' || window.location.pathname === '/main') {
        langElement.className = 'fi fi-gb';
    } else {
        langElement.className = 'fi fi-ru';
        redirectUrl += 'ru';
    }

    window.location.href = redirectUrl;
}