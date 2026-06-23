
document.addEventListener("DOMContentLoaded", (event)=>{
    if (isUserAuth()) {
        const LogInBtn = document.querySelector(".HLogIn");
        const LogInLogo = document.querySelector(".IconAccount");
        LogInBtn.classList.add("hiden");
        LogInLogo.classList.add("view");
    }
    
});

function isUserAuth(){
    const Auth = localStorage.getItem("Auth");
    return Auth !== null && Auth !== '';  
}

document.addEventListener("click", (event)=>{
    const AuthTarget = event.target.closest('[data-event-id]');
    if (!AuthTarget) {
        return 0;
    }
    if (!isUserAuth()) {
        event.preventDefault();
        event.stopPropagation();
        const AuthUrl = AuthTarget.getAttribute('data-event-id');
        localStorage.setItem("SaveUrl", AuthUrl);
        window.location.href = "../pages/SignIn.html";
    }
    
});


const htmlBlock = document.documentElement;

function theme(){
    const savedTheme = localStorage.getItem('userThemeColor');
    if (savedTheme) {
        if (savedTheme === "dark") {
            htmlBlock.classList.add("themeDark");
        }
    }else{
        localStorage.setItem("userThemeColor", "light");
    }
}

theme();

const href = new URL(window.location.href);
const src = document.querySelector(".src");
src.innerHTML = href.pathname.slice(0, href.pathname.indexOf("."));
if (src && href.pathname.includes(".")) {
    src.innerHTML = href.pathname.slice(0, href.pathname.indexOf("."));
}


const interfaceTheme = document.querySelector(".BigLogo");


if(interfaceTheme){
    interfaceTheme.addEventListener('click', ()=>{
        if (htmlBlock.classList.contains("themeDark")) {
            htmlBlock.classList.remove("themeDark");
            localStorage.setItem("userThemeColor", "light");
        }else{
            htmlBlock.classList.add("themeDark");
            localStorage.setItem("userThemeColor", "dark");
        }
    });

}






