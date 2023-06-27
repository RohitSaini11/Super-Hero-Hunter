const ts = "1687602536298";
const apikey = "8c4ebda09e9718726ed872815b410b6d";
const hash = "386d48a66af8d66309403b9a8247ec00";
const loader = document.getElementById('loader');
const mainContainer = document.getElementById('main_container');
let item;
let id = localStorage.getItem('id');
let favIds=[];

function getFavs(){
    str=localStorage.getItem('favIds');
    if(str !==null)
        favIds = JSON.parse(str);
}

async function fetchdata(){
    try{
        showloading(true);
        const response= await fetch(`https://gateway.marvel.com/v1/public/characters/${id}?ts=${ts}&apikey=${apikey}&hash=${hash}`);
        const data = await response.json();
        item = data.data.results[0];
        console.log("Done!");
        showloading(false);
        addToDom();
    }
    catch(err){
        console.log(err);
    }
}

function createDetails(){
    let pageData=`
        <div id="" class="top flex gap-3 align-items-center">
                    <div class="top-left">
                        <img src="${item.thumbnail.path}/portrait_incredible.${item.thumbnail.extension}" alt="Image Not Available">
                    </div>
                    <div class="top-right">
                       <div class="flex center-sb">
                            <h1 style="margin-bottom:2rem;">${item.name}</h1>
                            <div class="heart-like-button" data-id="${item.id}"></div>
                       </div>
                        <p style="font-size:1.25rem;">${item.description}</p>
                    </div>
        </div>
    `;
    if(item.events.available > 4){
        let events = item.events.items.slice(0,4);
        pageData= pageData + `
            <h1 style="text-align: center;">Events</h1>
            <div id="" class="grid" style="margin:2rem 0;">
                 <div style="width:100%; " class="col-4">
                    <h6 style="text-align: center;">${events[0].name}.</h6>
                </div>
                 <div style="width:100%; " class="col-4">
                    <h6 style="text-align: center;">${events[1].name}.</h6>
                </div>
                 <div style="width:100%; " class="col-4">
                    <h6 style="text-align: center;">${events[2].name}.</h6>
                </div>
                 <div style="width:100%; " class="col-4">
                    <h6 style="text-align: center;">${events[3].name}</h6>
                </div>                   
            </div>
            `;
    }
    if(item.stories.available > 4){
        let stories= item.stories.items.slice(0,4);
        pageData= pageData + `
            <h1 style="text-align: center;">Stories</h1>
            <div id="" class="grid" style="margin:2rem 0;">
                <div style="width:100%; " class="col-4">
                    <h6 style="text-align: center;">${stories[0].name}.</h6>
                </div>
                <div style="width:100%; " class="col-4">
                    <h6 style="text-align: center;">${stories[1].name}.</h6>
                </div>
                <div style="width:100%; " class="col-4">
                    <h6 style="text-align: center;">${stories[2].name}.</h6>
                </div>
                <div style="width:100%; " class="col-4">
                    <h6 style="text-align: center;">${stories[3].name}</h6>
                </div>                   
            </div>
        `;
    }
    return pageData;
}

function addToDom(){
    mainContainer.innerHTML = createDetails();
}

function showloading(show){
    if(show)
        loader.innerHTML = `<h1 style="text-align:center; color:white;"> Loading...</h1>`;
    else
        loader.innerHTML = ``; 
}

fetchdata();

function like(button){
    if (button.classList.contains("liked")) {
        button.classList.remove("liked");
    } 
    else{
        button.classList.add("liked");
    }
}

function checkFav(id){
    present = true;  
    if(favIds.length > 0){
        favIds.map(i=>{
            if(i === id){
                present=false;
                return;
            }
        })
    }
    return present;
}

document.addEventListener("click",(event)=>{
        if(event.target.dataset.id){
            like(event.target);

            getFavs();
            
            if(checkFav(event.target.dataset.id)){
                favIds.push(event.target.dataset.id);
                localStorage.setItem("favIds",JSON.stringify(favIds));
            }
        }
});