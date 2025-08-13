const url = "http://localhost:5678/api/";
const filterHTML = document.getElementById("filters");
let works = new Set();
let filtersList= new Set();
let categoriesWorks = [{
    "id": 0,
    "name": "Tous"
}];
async function loadProjects() {
    try {
        const response = await fetch(url + "works");

        if (!response.ok) {
            throw new Error(`Erreur HTTP : ${response.status}`); //exception status (400/500//501/502)
        }

        const data = await response.json();
        works = data;
        console.log(response);
        console.log(works);
        createProjects(works);
    } catch (error) {
        console.error("Erreur lors de la récupération des projets :", error.message);
    }
}


function createProjects(tabGallery) {
    const gallery = document.querySelector(".gallery");
    if (!gallery) {
        console.error("Élément '.gallery' introuvable dans le DOM.");
        return;
    }

    gallery.innerHTML = ""; 

    tabGallery.forEach((gallerie) => {
        const figure = createFigure(gallerie);
        gallery.appendChild(figure);
    });
}

// Crée un élément <figure>
function createFigure(gallerie) {
    const figure = document.createElement("figure");
    figure.id = `figure${gallerie.id}`;

    const img = document.createElement("img");
    img.src = gallerie.imageUrl;
    img.alt = gallerie.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = gallerie.title;
    figcaption.className = "figcaptionIndex";                                                                   

    figure.appendChild(img);
    figure.appendChild(figcaption);

    return figure;
}
// Chargement des filtres (catégories) depuis l'API
async function loadFilters() {
    try {
        const response = await fetch(url + "categories");
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

        const categories = await response.json();
        filtersList =categories;

        // Ajout manuel de la catégorie "Tous" en première position
        const allCategories = [{ id: 0, name: "Tous" }, ...filtersList];

        createFilters(allCategories);
        activateDefaultFilter();
        
    } catch (error) {
        console.error("Erreur lors du chargement des filtres :", error.message);
        alert("Une erreur est survenue ! Veuillez contacter l'administrateur.");
    }
}

// Création et affichage des boutons filtres
function createFilters(categoryList) {
    const filterHTML = document.querySelector(".filters");
    if (!filterHTML) {
        console.error("Élément '.filters' introuvable dans le DOM.");
        return;
    }

    filterHTML.innerHTML = "";

    categoryList.forEach((category) => {
        const filterButton = createFilter(category);
        filterHTML.appendChild(filterButton);
    });
}

// Création d’un bouton filtre individuel
function createFilter(category) {
    const button = document.createElement("div");
    button.textContent = category.name;
    button.id = category.id;
    button.className = "filter";

    button.addEventListener("click", () => {
        // Mise à jour du style : bouton actif
        button.classList.toggle("couleur-inversee");

        document.querySelectorAll(".filter").forEach((otherButton) => {
            if (otherButton !== button) {
                otherButton.classList.remove("couleur-inversee");
            }
        });

        resetFilters(category.id);

        // Filtrage des projets
        if (category.id == 0) {
            createProjects(works); // Affiche tous les projets
        } else {
            const filteredWorks = works.filter(
                (work) => work.categoryId == category.id
            );
            createProjects(filteredWorks);
        }
    });

    return button;
}

// Mise à jour des boutons sélectionnés visuellement
function resetFilters(selectedId) {
    document.querySelectorAll(".filter").forEach((btn) => {
        if (btn.id == selectedId.toString()) {
            btn.classList.add("button-selected");
        } else {
            btn.classList.remove("button-selected");
        }
    });
}
function activateDefaultFilter() {
    const allButton = document.getElementById("0");
    if (allButton) {
        allButton.classList.add("button-selected", "couleur-inversee");
    }
}


function checkIfConnected() {
    const isConnected = !!localStorage.getItem("token");
  
    // Éléments communs
    const login = document.getElementById("login");
    const logout = document.getElementById("logout");
    const filtres = document.querySelector(".filters");
    const barreNoir = document.querySelector(".barreNoir");
    const btnsModifier = document.querySelectorAll(".btnModifier");
    if (isConnected) {
      login.style.display = "none";
      logout.style.display = "block";
      filtres.style.display = "none";
      barreNoir.style.display = "flex";
  
      btnsModifier.forEach(btn => {
        btn.style.display = "flex";
      });
    } else {
      login.style.display = "block";
      logout.style.display = "none";
      filtres.style.display = "flex";
      barreNoir.style.display = "none";
  
      btnsModifier.forEach(btn => {
        btn.style.display = "none";
      });
    }
  }
  const displayLogout = document.getElementById("logout");
  // Ajoute un écouteur d'événement "click" à l'élément "displayLogout".
  displayLogout.addEventListener("click",() =>{
    // Supprime l'élément "token" stocké dans le localStorage du navigateur.
    window.localStorage.removeItem("token");
    // redirect to offline homepage
    window.location.href = "/FrontEnd/index.html";
  });


// Lancer le chargement des projets au démarrage
checkIfConnected();
loadProjects();
loadFilters();
