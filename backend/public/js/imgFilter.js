const iconsContainer = document.querySelector('.imgIcons');

async function render() {
     try {
        const token = localStorage.getItem("Token");
        const res = await fetch('http://localhost:3000/api/imgFilter', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const iconsData = await res.json();
        iconsContainer.innerHTML = iconsData.map(icon => `
            <a href="${icon.href}" class="imgIcon">
                <img src="${icon.imgSrc}" alt="${icon.alt}">
            </a>
        `).join('');
   
    } catch (error) {
        alert("Проблема с получением данных!");
    }
}

document.addEventListener("DOMContentLoaded", render);
