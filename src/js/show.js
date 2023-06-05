//const { render } = require("less");


class Shows {
  constructor() {

    try {
      this.savedShows = JSON.parse(localStorage["savedShows"]); // localStorage.getItem("tasks")
      console.log(this.savedShows)
  }
  catch{ this.savedShows = []; }

    this.apiURL = "https://api.jikan.moe/v4/anime?q=";
    this.apiURLEnd = "&sfw"
    this.$submit = document.querySelector('#submit')
    this.$addShow = document.querySelector('#addShow')
    this.$showList = document.querySelector('#showlists')


    this.$submit.onclick = this.onFormSubmit.bind(this)
    this.loadSavedShows();
  }
  onFormSubmit(event) {
    event.preventDefault();
    fetch(`${this.apiURL}${this.$addShow.value}${this.apiURLEnd}`)
      .then(response => response.json())
      .then(data => {
        //console.log(data)
        //console.log(data.data[1])//this format
        //document.getElementById("showlists").innerHTML = "";
        this.$addShow.value = "";
        this.showList(data.data);
      })
      .catch(error => {
        console.log(error);
        alert("somthing went wrong")
      })
  }
  showList(data) {
    this.shows = data;
    const itemHtml = data.map((data, index) => this.showListitem(data, index)).join('');
    document.getElementById("showlists").innerHTML = itemHtml;

    let detailsElements = document.getElementsByName("details");

    for (let i = 0; i < detailsElements.length; i++) {
      detailsElements[i].onclick = this.detailsHtml.bind(this, i)
    }

    let addElements = document.getElementsByName("addBtn");

    for (let i = 0; i < detailsElements.length; i++) {
      addElements[i].onclick = this.addToList.bind(this,i)
    }

  }


  addToList(i ,data){
    console.log(i)
    console.log(this.shows[i])

    const show = {
      title: this.shows[i].title,
      url: `https://www.crunchyroll.com/search?q=${this.shows[i].title}`,
    }

    //save to local html start
    this.savedShows.push(show);
    this.loadSavedShows();
    //console.log(show.url)

  }
  loadSavedShows(){

    localStorage["savedShows"] = JSON.stringify(this.savedShows);
    //save to local html complete
    let savedShowsHTML = "";
    for(let i =0; i < this.savedShows.length;i++){
      savedShowsHTML += this.savedShowHTML(this.savedShows[i]) 
      //console.log(this.savedShows[i]);
    }
    document.getElementById("savedShows").innerHTML = savedShowsHTML;

    const deleteSavedEvent = document.getElementsByName("deleteSavedShow");
        for (let i = 0; i < deleteSavedEvent.length; i++) {
            deleteSavedEvent[i].onclick = this.deleteSavedShow.bind(this, i);
        }


  }
  deleteSavedShow(i, event){
    console.log(i);
    console.log(event);
    console.log(this.savedShows[i]);
    console.log(this.savedShows)

    event.preventDefault();
    this.savedShows.splice(i, 1);
    this.loadSavedShows();
  }
  savedShowHTML(show){
    return `
    <div>
    <p>${show.title}</p>
    <a href="${show.url}" target="_blank">Link</a>
    <br>
    <br>
    <button id="deleteButton" name="deleteSavedShow" class="btn btn-primary">delete</button>
    <hr>
</div>
    `
  }

  detailsHtml(i, data) {
    let detailsHtml = `
    
      <div class="col-2">
        <img src="${this.shows[i].images.webp.image_url}" style="height: 100px;" alt="test">
        <p>Title</p>
      </div>

      <div class="col-7">
        <p>description: ${this.shows[i].synopsis}</p>
      </div>
      <div class="col-2">
        <p>Is going: ${this.shows[i].status}</p>
        <p>day</p>
        <a href="#">Link</a>
      </div>


      <div class="col-1">
        <br>
        <br>
        <button id="addBut" class="btn btn-primary">Add</button>
      </div>`;
    document.getElementById("detailsPage").innerHTML = detailsHtml;
  }
  showListitem(data, index) {
    return `
    <div class="row p-1" style="border: 1px solid black;" >
    <div class="col-2">
        <img src="${data.images.webp.image_url}" style="height: 50px;" alt="test">
    </div>
    <div class="col-2">
        <p>${data.title}</p>
    </div>
    <div class="col-2">
        <p>${data.source}</p>
    </div>
    <div class="col-2">
        <p>${data.status}</p>
    </div>
    <div class="col-1">
        <p>${data.broadcast.string}</p>
    </div>
    <div class="col-1">
        <button id="detailsButton" name="details" class="btn btn-primary">details</button>
    </div>
    <div class="col-1">
        <button id="addButton" name="addBtn" class="btn btn-primary">Add</button>
    </div>
    <div class="col-1">
        <button id="deleteButton" name = "dlt" class="btn btn-primary">delete</button>
    </div>
</div>`
  }


}
window.onload = () => { new Shows() }