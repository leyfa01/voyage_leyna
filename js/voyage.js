(function () {
    console.log("rest API");
    // URL de l'API REST de WordPress
    let les_categories = document.querySelectorAll(".une_categorie");
    let dataCategories = {};

    let url;
    for (const la_categorie of les_categories) {
        
        la_categorie.addEventListener("mousedown", function (e) {
            categorie = e.target.id;
            
            for (const la_categorie of les_categories) {
                la_categorie.classList.remove("actif");
            }

            e.target.classList.add("actif");

            url = `https://gftnth00.mywhc.ca/tim39/wp-json/wp/v2/posts?categories=${categorie}&per_page=30`;
            fetchUrl(url);
        });
    }

    // Liste de categories, afin de pouvoir sortir le lien et le nom a partir du ID de la categorie
    function fetchCategories() {
        let url = `https://gftnth00.mywhc.ca/tim39/wp-json/wp/v2/categories`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                data.forEach(categorie => {
                    dataCategories[categorie.id] = {nom: categorie.name, lien: categorie.link};
                });
            })
            .catch(function (error) {
                // Gérer les erreurs
                console.error("Erreur lors de la récupération des données :", error);
            });
    }

    // Effectuer la requête HTTP en utilisant fetch()
    function fetchUrl(url) {
        fetch(url)
            .then(function (response) {
                // Vérifier si la réponse est OK (statut HTTP 200)
                if (!response.ok) {
                    throw new Error("La requête a échoué avec le statut " + response.status);
                }
                // Analyser la réponse JSON
                return response.json();
            })
            .then(function (data) {
                // La variable "data" contient la réponse JSON
                console.log(data);
                let restapi = document.querySelector(".contenu__restapi");
                restapi.innerHTML = "";
                // Maintenant, vous pouvez traiter les données comme vous le souhaitez
                // Par exemple, extraire les titres des articles comme dans l'exemple précédent
                data.forEach(function (article) {
                    let titre = article.title.rendered;
                    // Fait un element a, pour le lien de la categorie
                    let categories = article.categories.map(id => {
                        let categorie = dataCategories[id];
                        return `<a href="${categorie.lien}">${categorie.nom}</a>`;
                    }).join("");
                    // Couper le contenu
                    let contenu = article.content.rendered.split(" ").slice(0, 10).join(" ") + "..";
                    // Creer la carte
                    let carte = document.createElement("div");
                    carte.classList.add("restapi__carte");
                    
                    // Remplir la carte
                    carte.innerHTML = `
                    <div class="carte">
                        <h4>${titre}</h4>
                        <div class="liens">${categories}</div>
                        ${contenu}</p>
                        <a href="https://gftnth00.mywhc.ca/tim39/?p=${article.id}">En savoir plus</a>
                    </div>
                    `;
                    restapi.appendChild(carte);
                });
            })
            .catch(function (error) {
                // Gérer les erreurs
                console.error("Erreur lors de la récupération des données :", error);
            });
    }
    fetchCategories();
})();
