
let JsonMovie;
let body = document.getElementById('main');
let step = 0;

let acteur = {};
let directeur = [];

let actorInfo;
let actorFilms;

let acteurJoue = [];
let filmJoue = [];

function film(id){
    // fonction pour afficher l'affiche de film et initialiser le jeu
    var uri = `https://api.themoviedb.org/3/movie/${id}?api_key=04c7c4f6678bfa21d968ad5385e5a732&language=en-US&append_to_response=credits`;
    
    fetch(uri)
    .then(function(response) {
    
        return response.json();
    })
    .then((response) => {
        console.log(response);
        let imageURL = `https://image.tmdb.org/t/p/original/${response.poster_path}`;
    
        var imagePoster = document.createElement("IMG");
        imagePoster.src = imageURL;
    
        var title = document.createElement("h1");
        title.innerHTML = response.original_title;
    
        var releaseDate = document.createElement("h2");
        releaseDate.innerHTML = response.release_date;
    
        var mainDiv = document.createElement('div');
        mainDiv.id = 'root';
        document.getElementById('main').appendChild(mainDiv);
        mainDiv.appendChild(imagePoster);
        mainDiv.appendChild(title);
        mainDiv.appendChild(releaseDate);
    
        JsonMovie = response;
        acteur = [];
        appendActeur(response.credits.cast);
        appendDirecteur(response.credits.crew);

        CreateForm1(step);
        console.log(acteur);
        return response;
    
    })

}


function replaceLastActeur(idActeur) {
    // fonction pour remplacer la div form par l'image de l'acteur ou réalisateur
    console.log(document.getElementById("formId".concat('', step)));
    document.getElementById("formId".concat('', step-1)).innerHTML = '';

    // Ajout image
    fetch(`https://api.themoviedb.org/3/person/${idActeur}?api_key=04c7c4f6678bfa21d968ad5385e5a732&language=en-US&append_to_response=movie_credits`)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        let imageURL = `https://image.tmdb.org/t/p/original/${data.profile_path}`;
        var imagePoster = document.createElement("IMG");
        imagePoster.src = imageURL;
        imagePoster.className = "imageActeur"

        console.log(data);

        let nom = document.createElement('h1');
        nom.innerHTML = data.name;

        document.getElementById("formId".concat('', step-1)).appendChild(imagePoster);
        document.getElementById("formId".concat('', step-1)).appendChild(nom);

        actorInfo = [];
        actorInfo = data;
        actorFilms = [];
        console.log(data)
        data.movie_credits.cast.forEach(element => actorFilms[element.original_title.toLowerCase()]= element.id);
        data.movie_credits.crew.forEach(element => actorFilms[element.original_title.toLowerCase()]= element.id);
        console.log(actorFilms);
    })
    
}

function appendActeur (tab) {
    // fonction pour ajouter les acteurs dans la liste de réponse
    console.log(tab);
    tab.forEach(element => acteur[element.name.toLowerCase()] = element.id);
    
}

function appendDirecteur (tab) {
    // fonction pour ajouter les directeurs dans la liste de reponse
    tab.forEach(element => acteur[element.name.toLowerCase()] = element.id);

}


function CreateForm1(etape) {
    // permet de construire le form pour la question sur les acteurs et réalisateur
    step += 1;
    var inputText = document.createElement("input");
    inputText.id = "step".concat('', step);
    var buttonForm = document.createElement("button");
    buttonForm.setAttribute("onclick","form1()");
    buttonForm.innerHTML = "Valider";

    var formDiv = document.createElement('div');
    formDiv.id = "formId".concat('', step);
    formDiv.className = "cadre";
    document.getElementById('main').appendChild(formDiv);

    var text = document.createElement('h2');
    text.innerHTML = "Give the director or one of the actors of the movie."
 
    formDiv.appendChild(text);
    formDiv.appendChild(inputText);
    formDiv.appendChild(buttonForm);
}

function CreateForm2(etape) {
    // permet de construire le form pour la question des films 
    step += 1;
    var inputText = document.createElement("input");
    inputText.id = "step".concat('', step);

    var buttonForm = document.createElement("button");
    buttonForm.setAttribute("onclick","form2()");
    buttonForm.innerHTML ="Valider";

    var formDiv = document.createElement('div');
    formDiv.id = "formId".concat('', step);
    formDiv.className = "cadre";
    
    document.getElementById('main').appendChild(formDiv);

    var text = document.createElement('h2');
    text.innerHTML = "Give the name of a movie where this person was actor or director."
 
    formDiv.appendChild(text);
    formDiv.appendChild(inputText);
    formDiv.appendChild(buttonForm);
}

function form1() {
    // permet de verifier la reponse donnée en input par l'utilisateur 
    let reponse = document.getElementById("step".concat('', step)).value.toLowerCase();
    
    if(reponse in acteur && !acteurJoue.includes(reponse)) {
        acteurJoue.push(reponse);
        CreateForm2();
        console.log(acteur[reponse])
        replaceLastActeur(acteur[reponse])
    }
    else if (acteurJoue.includes(reponse)) {
        erreur('You already gave this actor!')
    }
    else {
        // Print quelque chose en rouge
        erreur('Wrong');
        console.log('faux');
    }

}

function form2() {
    // permet de verifier la reponse donnée en input pas l'utilisateur 
    console.log(step)
    console.log(actorFilms)
    let reponse = document.getElementById("step".concat('', step)).value.toLowerCase();

    if(reponse in actorFilms && !filmJoue.includes(reponse)) {
        filmJoue.push(reponse);
        console.log(actorFilms[reponse])
        document.getElementById('main').removeChild(document.getElementById("formId".concat('', step)));
        film(actorFilms[reponse])
    }
    else if (filmJoue.includes(reponse)) {
        erreur('You already gave this film!')
    }
    else {
        // Print quelque chose en rouge
        erreur('Wrong');
        console.log('faux');
    }
    //fetch("https://api.themoviedb.org/3/search/movie?api_key=04c7c4f6678bfa21d968ad5385e5a732&query=the+avengers")

}



async function erreur(e) {
    // Function pour afficher les erreurs d'input de l'utilisateur
    let theError = document.createElement('h6');
    theError.innerText = e;
    theError.id = 'theerror'
    document.getElementById("formId".concat('', step)).appendChild(theError);
    setTimeout(() => {document.getElementById('theerror').remove()}, 5000)
}


film(671) // initialisation du jeu, remplacer ici le chiffre par l'id de votre choix pour changer le film de départ


