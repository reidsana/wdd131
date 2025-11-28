
const temples = [
    {
        templeName: "Salt Lake Temple",
        location: "Salt Lake City, Utah",
        dedicated: "1893",
        area: 382207,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/salt-lake-temple/salt-lake-temple-15669-main.jpg"
    },
    {
        templeName: "Laie Hawaii Temple",
        location: "Laie, Hawaii",
        dedicated: "1919",
        area: 47224,
        imageUrl:"https://churchofjesuschristtemples.org/assets/img/temples/laie-hawaii-temple/laie-hawaii-temple-7370-main.jpg"
    },
    {
        templeName: "Paris France Temple",
        location: "Paris, France",
        dedicated: "2017",
        area: 44175,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/paris-france-temple/paris-france-temple-2056-main.jpg"
    },
    
    {
        templeName: "Calgary Alberta Temple",
        location: "Calgary, Alberta",
        dedicated: "2012",
        area: 33000,
        imageUrl:"https://churchofjesuschristtemples.org/assets/img/temples/calgary-alberta-temple/calgary-alberta-temple-13199-main.jpg"
    },
    {
        templeName: "Rome Italy Temple",
        location: "Rome, Italy",
        dedicated: "2019",
        area: 41000,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/rome-italy-temple/rome-italy-temple-2642-main.jpg"
    },
    {
        templeName: "Tokyo Japan Temple",
        location: "Tokyo, Japan",
        dedicated: "1980",
        area: 52000,
        imageUrl: "https://churchofjesuschristtemples.org/assets/img/temples/tokyo-japan-temple/tokyo-japan-temple-26340-main.jpg"
    }
];



function createTempleCard(temple) {
    const card = document.createElement("div");
    card.classList.add("temple-card");

    card.innerHTML = `
        <img src="${temple.imageUrl}" loading="lazy" alt="${temple.templeName}">
        <h3>${temple.templeName}</h3>
        <p><strong>Location:</strong> ${temple.location}</p>
        <p><strong>Dedicated:</strong> ${temple.dedicated}</p>
        <p><strong>Area:</strong> ${temple.area.toLocaleString()} sq ft</p>
    `;

    return card;
}

function displayTemples(filteredList) {
    const container = document.getElementById("templeContainer");
    container.innerHTML = "";
    filteredList.forEach(temple => container.appendChild(createTempleCard(temple)));
}



function filterTemples(criteria) {
    let result = temples;

    if (criteria === "old") {
        result = temples.filter(t => Number(t.dedicated) < 1900);
    } 
    else if (criteria === "new") {
        result = temples.filter(t => Number(t.dedicated) > 2000);
    } 
    else if (criteria === "large") {
        result = temples.filter(t => t.area > 90000);
    } 
    else if (criteria === "small") {
        result = temples.filter(t => t.area < 10000);
    }

    displayTemples(result);
}



document.querySelectorAll(".primary-nav a").forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        filterTemples(link.dataset.filter);
    });
});


document.getElementById("hamburger").addEventListener("click", () => {
    document.getElementById("navMenu").classList.toggle("open");
});


document.getElementById("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = "Last Modified: " + document.lastModified;


displayTemples(temples);

