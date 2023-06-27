const ts = "1687602536298";
const apikey = "8c4ebda09e9718726ed872815b410b6d";
const hash = "386d48a66af8d66309403b9a8247ec00";
const loader= document.getElementById('loader');
const listContainer = document.getElementById('list_container');
let favIds = [];

let favList = [];
let nameStartsWith;

function getData(){
    //get the favourites list from localstorage
    favstr = localStorage.getItem('favIds');
    favIds=JSON.parse(favstr); 

    if(favIds.length === 0){
        loader.innerHTML='<h1 style="text-align:center; color:white;"> Your hero list is empty.</h1>';
    }

    listContainer.innerHTML='';
    favIds.forEach((fav)=>{
        fetchdata(fav);
    });
}
getData();



async function fetchdata(id){
    try{
        showloading(true);
        const response= await fetch(`https://gateway.marvel.com/v1/public/characters/${id}?ts=${ts}&apikey=${apikey}&hash=${hash}`);
        const data = await response.json();
        let hero = data.data.results[0];
        console.log("Done");
        showloading(false);
        favList.push(hero);
        addToDom(hero);
    }
    catch(err){
        console.log(err);
    }
}


function addToDom(hero){
    
    const div=document.createElement('div');
    
    div.innerHTML = `
    <div class="card" style="min-height:32rem; background-color: rgb(45, 42, 42); color: white; " >
        <img src="${hero.thumbnail.path}/portrait_fantastic.${hero.thumbnail.extension}" class="card-img-top" alt="Image Not Found" >
        <div class="card-body">
            <div class="flex center-sb">
                <a href="./details.html" style=" margin:0; text-decoration:none; color:white !important;
                font-size:1.25rem; font-weight:bolder;" data-id="${hero.id}">${hero.name}</a>
                <img src="../assets/delete.png" style="cursor:pointer;" class="delete" data-id="${hero.id}" />
            </div>
        </div>
        
    </div> `
    ;

    listContainer.append(div);
}


function showloading(show){
    if(show)
        loader.innerHTML = `<h1 style="text-align:center; color:white;"> Loading...</h1>`;
    else
        loader.innerHTML = ``; 
}

function deleteFav(id){
    favIds = favIds.filter(function (fav){ 
         return fav !== id ;
    });
    localStorage.setItem("favIds",JSON.stringify(favIds));
    getData();
}

document.addEventListener("click",(event)=>{
    if(event.target.classList.contains('delete')){
        deleteFav(event.target.dataset.id);
    }
    else if(event.target.dataset.id){
        localStorage.setItem("id",event.target.dataset.id);
    }
});