
// modale 
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.querySelector("#modal1");
    const openButtons = document.querySelectorAll(".btnModifier");
    const closeButtons = document.querySelectorAll(".js-modal-close");

    // Ouvre la modale et insère les projets
    function openModal() {
        toggleModalVisibility(modal, true);
        renderProjectList(modal.querySelector(".projets-modal"));
    }

    // Ferme la modale
    function closeModal() {
        toggleModalVisibility(modal, false);
    }

    // Toggle affichage et accessibilité de la modale
    function toggleModalVisibility(modal, isVisible) {
        modal.style.display = isVisible ? "block" : "none";
        modal.setAttribute("aria-hidden", String(!isVisible));
    }

    // Crée et insère les projets dans la modale
    function renderProjectList(projetFigure) {
        projetFigure.innerHTML = "";
        for (const work of works) {
            const figure = createFigureModale(work);
            projetFigure.appendChild(figure);
        }
    }

    // Événements pour ouvrir la modale
    openButtons.forEach(button => button.addEventListener("click", openModal));

    // Événements pour fermer la modale (croix)
    closeButtons.forEach(button => button.addEventListener("click", closeModal));

    // Fermer la modale en cliquant à l'extérieur
    window.addEventListener("click", event => {
        if (event.target === modal) closeModal();
    });
});

function closeModal() {
  const modal = document.querySelector("#modal1");
        toggleModalVisibility(modal, false);
    }
     function toggleModalVisibility(modal, isVisible) {
        modal.style.display = isVisible ? "block" : "none";
        modal.setAttribute("aria-hidden", String(!isVisible));
    }

// Création dynamique d'une figure 
function createFigureModale(work) {
    const figure = document.createElement("figure");
    figure.id = `figureModale${work.id}`;

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const caption = document.createElement("figcaption");
    caption.textContent = "";
    caption.className = "editer";

    const deleteIcon = document.createElement("i");
    deleteIcon.className = "fas fa-trash-alt delete-icon";
   
    figure.append(img, caption, deleteIcon);

    // Ajoute un gestionnaire d'événement pour la suppression lorsque l'icône est cliquée
    deleteIcon.addEventListener("click", function () {
      const value = confirm(
        "Etes vous sur de bien vouloir supprimer le projet de numero:" +
          work.id +
          " ?"
      );
      if (value) {
        // Appelle une fonction de suppression en utilisant l'ID de l'élément work
        deleteWork(work.id);
      }
    });
     
    figure.append(img, caption, deleteIcon);
    return figure;
}


// Gère la confirmation puis la suppression d’un projet
function handleDelete(workId) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le projet numéro : ${workId} ?`)) {
        deleteWork(workId);// à faire
    }
}

// seconde modale 

const addPhotoBtn = document.querySelector(".add-photo");
const modalAdd = document.querySelector("#js-modal-add-project");
const modalFirst = document.querySelector("#js-modal-first");
const returnBtn = modalAdd.querySelector(".js-modal-return");


// Empêche la fermeture en cliquant dans la modale d'ajout
modalAdd.addEventListener("click", e => e.stopPropagation());

// Affiche la modale d’ajout de projet
addPhotoBtn.addEventListener("click", () => {
    modalAdd.style.display = null;
    modalFirst.style.display = "none";
    modalAdd.setAttribute("aria-hidden", "false");
    loadCategoriesIntoSelect("categories");
});

// Fermer la modale d’ajout et revenir à la liste
returnBtn.addEventListener("click", () => {
    modalAdd.style.display = "none";
    modalFirst.style.display = "flex";
    modalAdd.setAttribute("aria-hidden", "true");
});


// Chargement des catégories dans un <select>

async function loadCategoriesIntoSelect(selectId) {
    try {
        const response = await fetch(`${url}categories`);
        if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);

        const categories = await response.json();
        const select = document.getElementById(selectId);
        select.innerHTML = ""; // Réinitialise les options

        // Option par défaut
        const defaultOption = new Option("-- Sélectionnez une catégorie --", "");
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        // Ajout des options dynamiques
        categories.forEach(({ id, name }) => {
            select.appendChild(new Option(name, id));
        });
    } catch (error) {
        console.error("Erreur lors du chargement des catégories :", error.message);
    }
}







    function deleteWork(workId) {
  const token = localStorage.getItem("token"); // Récupérer le jeton d'accès
  fetch("http://localhost:5678/api/works/" + workId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Ajouter le jeton d'accès à l'en-tête
    },
  })
    .then(function (response) {
      // element supprimer
      if (response.status == 204) {
        
        // mettre à jour le tableau global
        console.log(works);
        works = works.filter((element) => element.id != workId);
        console.log(works);

        //Agir sur les figures de la page index et enlever l'element supprimeé depuis le dom
        document.getElementById("figure" + workId).remove();
        //Eliminer aussi l'element supprimer depuis le dom
        document.getElementById("figureModale" + workId).remove();
      }
      if (response.status == 401) {
        alert(
          "votre token est expiré !"
        );
      }
    })
    .catch(function (error) {
      console.log("Erreur lors de la suppression : " + error.message);
    });
}

// On commence par récupérer tous les éléments HTML dont on a besoin dans une seule variable "elements"
const elements = {
  image: document.getElementById("imgPreview"),               // L'image à afficher en aperçu
  imageFormDisplay: document.querySelector(".imageFormDisplay"), // Le conteneur de l'image
  faImage: document.querySelector(".fa-image"),               // L'icône par défaut avant upload
  fileUpload: document.querySelector(".file-upload"),         // Le bouton de chargement de fichier
  photoInput: document.querySelector("#photo-input"),         // Le champ d'entrée du fichier
  fileFormat: document.querySelector(".fileFormat"),          // Texte ou icône de format de fichier
  removeBtn: document.querySelector(".remove"),               // Le bouton de suppression d'image
  titleInput: document.getElementById("title-photo"),         // Champ de titre de l'image
  categoriesInput: document.getElementById("categories"),     // Menu déroulant de catégorie
  validerButton: document.getElementById("validerButton")     // Bouton pour valider
};

// Fonction pour supprimer l'image et réinitialiser l'affichage
function removeImage() {
  // On définit ce qu'on veut afficher ou cacher
  const displayStates = {
    imageFormDisplay: "none",
    faImage: "block",
    fileUpload: "block",
    photoInput: "none",
    fileFormat: "block"
  };

  // On applique chaque état d'affichage aux bons éléments
  for (const [key, display] of Object.entries(displayStates)) {
    elements[key].style.display = display;
  }

  // On vide l'image affichée
  elements.image.src = "";
}

// Fonction pour gérer le changement de fichier (lorsqu'on sélectionne une image)
function changeImage(event) {
  const file = event.target.files[0]; // On récupère le fichier sélectionné

  // Vérifie si un fichier a été sélectionné
  if (!file) return;

  // Vérifie si le fichier est bien une image
  if (!file.type.match("image.*")) {
    alert("Le fichier sélectionné n'est pas une image.");
    return removeImage();
  }

  // Vérifie si le fichier fait moins de 4 Mo
  if (file.size > 4 * 1024 * 1024) {
    alert("Le fichier est de grande taille (max 4 Mo).");
    return removeImage();
  }

  // On lit le fichier pour l'afficher en aperçu
  const reader = new FileReader();
  reader.onload = function (event) {
    // On affiche l'image en aperçu
    elements.image.src = event.target.result;

    // Mise à jour de l'affichage pour montrer uniquement ce qu'on veut
    const displayStates = {
      imageFormDisplay: "flex",
      faImage: "none",
      fileUpload: "none",
      photoInput: "none",
      fileFormat: "none"
    };

    for (const [key, display] of Object.entries(displayStates)) {
      elements[key].style.display = display;
    }
  };

  // On lit le fichier sous forme d'URL pour pouvoir l'afficher
  reader.readAsDataURL(file);
}
// Mise en place des événements (actions lorsque l'utilisateur interagit)
elements.photoInput.addEventListener("change", changeImage);             // Quand on choisit une image
elements.removeBtn.addEventListener("click", removeImage);               // Quand on clique sur "supprimer"
elements.titleInput.addEventListener("input", validateForm);            // Quand on tape un titre
elements.categoriesInput.addEventListener("change", validateForm);      // Quand on choisit une catégorie

//  Sélection du formulaire modal
const modalForm = document.querySelector(".modal-form");

//Fonction pour valider le formulaire (active le bouton si tout est rempli)
function validateForm() {
  const titleValid = elements.titleInput.value.trim() !== "";           // Le titre est-il rempli ?
  const categoryValid = elements.categoriesInput.value !== "";          // Une catégorie est-elle sélectionnée ?
  const imageSelected = elements.photoInput.files[0];                   // Une image a-t-elle été choisie ?

  // Si tout est bon, on active le bouton
  if (titleValid && categoryValid && imageSelected) {
    elements.validerButton.classList.add("green-button");
    return true;
  } else {
    elements.validerButton.classList.remove("green-button");
    return false;
  }
}


// Intercepter l'envoi du formulaire pour le contrôler manuellement
modalForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Empêche le rechargement automatique de la page

  //  Vérifie que tous les champs sont bien remplis grâce à la fonction validateForm()
  if (!validateForm()) {
    alert("Veuillez remplir tous les champs !");
    return;
  }

  //  Tous les champs sont valides, on prépare les données pour l'envoi
  const file = elements.photoInput.files[0]; // Récupère l'image sélectionnée

  const formData = new FormData();           // Crée un objet FormData (clé/valeurs)
  formData.append("title", elements.titleInput.value);         // Ajoute le titre
  formData.append("image", file);                              // Ajoute le fichier image
  formData.append("category", elements.categoriesInput.value); // Ajoute la catégorie

  //  Envoie des données avec `fetch` vers l'API locale
  fetch("http://localhost:5678/api/works", {
    method: "POST", // Méthode POST = pour créer une nouvelle ressource
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"), // Authentification
    },
    body: formData, // Le corps contient les données du formulaire
  })
    .then((response) => {
      if (response.status === 201) {
        alert("Projet ajouté avec succès !");
        return response.json(); // Convertit la réponse en objet JavaScript
      } else {
        console.error("Erreur lors de l'ajout du projet:", response.status);
      }
    })
    .then((projet) => {
      if (projet) {
        //  Met à jour l'interface avec le nouveau projet

        works.push(projet); // Ajoute le projet dans le tableau global

        // Ajoute à la galerie principale
        const figure = createFigure(projet);
        document.querySelector(".gallery").appendChild(figure);

        // Ajoute aussi dans la modale
        const figureModale = createFigureModale(projet);
        document.querySelector(".projets-modal").appendChild(figureModale);

        // Ferme la modale d'ajout et retourne à la vue principale
        removeImage();
       
        returnBtn.click();
         closeModal();
      }
    })
    .catch((error) => {
      //  Gère les erreurs réseau ou autres
      console.error("Erreur lors de la création :", error.message);
      alert("Une erreur est survenue lors de l'ajout !");
    });
});


