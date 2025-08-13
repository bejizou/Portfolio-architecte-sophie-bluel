const form = document.getElementById("formLogin");
const submitButton = document.getElementById("btnLogin");
const errorMessage = document.getElementById("messageErreur");

// Ajoute un écouteur d'événement sur le formulaire 
form.addEventListener("submit", async (event) => {

    // Empêche le comportement par défaut du formulaire (qui est de recharger la page)
    event.preventDefault();

    // initialisation
    submitButton.disabled = true;
    errorMessage.textContent = "";

    // Récupère les valeurs des champs email et password 
    const login = {
        email: form.querySelector("[name=email]").value.trim(), // Récupère l'email// password saisi et supprime les espaces (trim)
        password: form.querySelector("[name=password]").value.trim(), 
    };

    try {
        // Envoie une requête POST vers l'API de connexion 
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST", 
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify(login), 
        });

        // Si la réponse de l'API est positive (code HTTP 200)
        if (response.ok) {
            // Récupère les données JSON de la réponse 
            const data = await response.json();

            // Stocke le token dans le localStorage pour maintenir la session
            localStorage.setItem("token", data.token);

            // Redirige l'utilisateur vers la page d'accueil après une connexion réussie
            window.location.href = "index.html";
        } else {
            // Si la connexion échoue (email ou mot de passe incorrect), affiche un message d'erreur
            errorMessage.textContent = "E-mail ou mot de passe introuvable";
        }
    } catch (error) {
        // Si une erreur technique survient (serveur indisponible, problème réseau, etc.)
        console.error("Erreur lors de la connexion :", error); // Affiche l'erreur dans la console pour le développeur
        errorMessage.textContent = "Une erreur est survenue. Veuillez réessayer plus tard."; // Affiche un message d'erreur à l'utilisateur
    } 
});
