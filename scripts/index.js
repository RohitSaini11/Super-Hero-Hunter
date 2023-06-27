const ts = "1687602536298";
const apikey = "8c4ebda09e9718726ed872815b410b6d";
const hash = "386d48a66af8d66309403b9a8247ec00";
const CardsContainer = document.getElementById('cards_container');
const loader = document.getElementById('loader');
const suggest = document.getElementById('search_suggestion');
const lookAhead = document.getElementById('look_ahead_list');
const h = document.getElementById('hs');
let heros=[];
let lookAheadList=[];
let favIds=[];

async function fetchdata(searchText){
    if(searchText === undefined){
        try{
            showloading(true);
            const response= await fetch(`https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${apikey}&hash=${hash}`);
            const data = await response.json();
            heros = data.data.results;
            console.log("API is working!")
            showloading(false);
            renderCards();
        }
        catch(err){
            console.log(err);
        }
    }
    else {
        try{
            const response= await fetch(`https://gateway.marvel.com/v1/public/characters?nameStartsWith=${searchText}&ts=${ts}&apikey=${apikey}&hash=${hash}`);
            const data = await response.json();
            lookAheadList = data.data.results;
            addLookAhead();
        }
        catch(err){
            console.log(err);
        }
    }
}
fetchdata();

function showloading(show){
    if(show)
        loader.innerHTML = `<h1 style="text-align:center; color:white;"> Loading...</h1>`;
    else
        loader.innerHTML = ``; 
}

function addCardToDom(hero){
    const div=document.createElement('div');

    div.innerHTML = `
    <div class="card" style="min-height:48rem; background-color: rgb(45, 42, 42); color: white; " >
        <img src="${hero.thumbnail.path}/portrait_fantastic.${hero.thumbnail.extension}" class="card-img-top" alt="Image Not Found" >
        <div class="card-body">
             <a href="./pages/details.html" style=" margin:0; text-decoration:none; color:white !important;
            font-size:1.25rem; font-weight:bolder;" data-id="${hero.id}">${hero.name}</a>
            <p class="card-text">${hero.description}</p>
        </div>
    </div> `
    ;

    CardsContainer.append(div);
}

 function renderCards(){ 
    for(let i=0;i<heros.length;i++){
        if(heros[i].description !==""){
            addCardToDom(heros[i]);
        }
    }
 }
 
function addLookAhead(){ 
    lookAhead.innerHTML='';
    lookAheadList.forEach((item)=>{
        const div= document.createElement('div');
        div.innerHTML = `
            <li class="li-style flex center-sb" >
                    <div class="flex gap-1" >
                        <img style="width:55px; height:70px" src="${item.thumbnail.path}/portrait_small.${item.thumbnail.extension}" alt="NA">
                        <a href="./pages/details.html" style=" margin:0; text-decoration:none; color:white !important;
                        font-size:1.25rem; font-weight:bolder;" data-id="${item.id}">${item.name}</a>
                    </div>
                        <div class="heart-like-button" data-id="${item.id}"></div>
            </li>
        `;
        lookAhead.append(div);
    });
}

function like(button){
    if (button.classList.contains("liked")) {
        button.classList.remove("liked");
    } 
    else{
        button.classList.add("liked");
    }
}

function getFavs(){
    str=localStorage.getItem('favIds');
    if(str !==null)
        favIds = JSON.parse(str);
}

function checkFav(id){
    present = true;  
    if(favIds.length > 0){
        favIds.map(i=>{
            if(i=== id){
                present=false;
                return;
            }
        })

    }
    return present;
}

h.addEventListener('keyup', (event) => {

    if(event.target.value === ''){
        return;
    }
    searchText = event.target.value;
    fetchdata(searchText);
    
});
h.addEventListener('click',(event)=>{
    suggest.style.visibility="visible";
})

document.addEventListener("click",(event)=>{
    if(event.target.classList.contains('heart-like-button')){
        like(event.target);
        getFavs();
        if(checkFav(event.target.dataset.id)){
            favIds.push(event.target.dataset.id);
            localStorage.setItem("favIds",JSON.stringify(favIds));
        }   
    }
    else if(event.target !== h){
        suggest.style.visibility="hidden";
    }

    if(event.target.dataset.id){
        localStorage.setItem('id',event.target.dataset.id);
    } 
})