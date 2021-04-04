document.addEventListener('DOMContentLoaded', function() {
    fetch('/getallsavedimages')
    .then(response => response.json())
    .then(data => {
        let liste = document.getElementById('liste')
        let inner = "";
        console.log(data)
        data.forEach(element => {
            let date = new Date(element.datetime).toLocaleDateString("en-US")
            let hour = new Date(element.datetime).toLocaleTimeString("en-US")
            inner += "<tr><td>"+element.username+"</td><td>"+date +" "+hour+"</td><td><a href='/"+element.pathImage+"'>"+element.pathImage+"</a></td></tr>"
            
        });
        liste.innerHTML = inner;
    });
    
 }, false);