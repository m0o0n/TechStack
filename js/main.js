let preloader = document.getElementById("preloader")
let response
let url = 'https://content.guardianapis.com/search?q=trending&show-tags=all&page-size=20&show-fields=all&order-by=relevance&api-key=0cc1c5bc-7fe4-47bc-80cc-f17c13be193c'


function DrawLastPost(response){
  let last_post = document.getElementById("last_post");
console.log(response[0])
  let date1 = new Date(`${response[0].fields.firstPublicationDate}`);
    let date2 = new Date();
    let diff = date2 - date1;
    let milliseconds = diff;
    let seconds = milliseconds / 1000;
    let minutes = seconds / 60;
    let hours = minutes / 60;
    let days = hours / 24;
    
    
     let days_ago = Math.ceil(days);
    const template = `
    <div class="last_post__textContent">
            <h2 class="last_post__article">${response[0].webTitle}</h2>
            <p class="last_post__short_text">${response[0].fields.trailText}</p>
                <div class="last_post__readMore_Date">
                    <div class="last_post__Date">${days_ago} days ago</div>
                    <div class="last_post__readMore">Read More</div>
                </div>
          </div>
          <div class="last_post__image_container"><img src="${response[0].fields.thumbnail}" alt=""></div>`

          last_post.innerHTML = template
}

function DrawPosts(response){
  let content_greed = document.getElementById("content_greed");
  let result = response.map(el=>{
    let date1 = new Date(`${el.fields.firstPublicationDate}`);
    let date2 = new Date();
    let diff = date2 - date1;
    let milliseconds = diff;
    let seconds = milliseconds / 1000;
    let minutes = seconds / 60;
    let hours = minutes / 60;
    let days = hours / 24;
    
    
     let days_ago = Math.ceil(days);

    
    const template = `
    <div class="content_greed__post_container">
    <div class="content_greed__post">
        <div class="post__image_container"><img src="${el.fields.thumbnail}" alt=""></div>
        <div class="content_greed__post_paddingBox">
            <h3 class="post__article">${el.webTitle}</h3>
            <p class="post__short_text"> ${el.fields.trailText}</p>
            <div class="post__readMore_Date">
                <div class="post__Date">${days_ago} days ago</div>
                ${el.LastSeen ? `<div>${el.LastSeen}</div> `: '<div></div>'}
                
              <div class="post__readMore" id="${el.id}" >Read More</div>
            </div>
        </div>
    </div>
    </div>`
   
    return template
    
    }).join('')
    content_greed.innerHTML = result
}














  console.log("hi")
  let promise = fetch(url)
  .then((response) => {
    preloader.style.display = "flex"
    return response.json();
  })
  .then((data) => {
    preloader.style.display = "none"
    console.log(data.response.results[0].fields.body);
    console.log(data.response.results);
    response = data.response.results
    localStorage.setItem("response", JSON.stringify(response));
   
  }).then(()=>{
    response = JSON.parse(localStorage.getItem("response"))

    let sortByDate =(obj)=>{
      function SortDate(a, b) {
        return new Date(b.webPublicationDate) - new Date(a.webPublicationDate)
      }
      obj.sort(SortDate);
      console.log(obj);
      return obj
    }
    DrawLastPost(sortByDate(response))
    DrawPosts(sortByDate(response))
    console.log(response)
   let content_greed = document.getElementById("content_greed")
   content_greed.onclick=(e)=>{
     let target = e.target
     
     if(target.className == "post__readMore"){
      console.log(target.getAttribute("id"))
      localStorage.setItem('viseted', target.getAttribute("id"))
      
      // JSON.parse(localStorage.getItem('response'))
      response.find(el=> el.id===localStorage.getItem('viseted')).LastSeen = new Date()
        console.log(response.find(el=> el.id===localStorage.getItem('viseted')) )
        localStorage.setItem('response', JSON.stringify(response))
        
        DrawPosts(sortByDate(response))
        window.location.href = "./article.html"
        
     }
   }
    
  });

console.log(JSON.parse(localStorage.getItem('response')))

let to_change_response1 = JSON.parse(localStorage.getItem('response'))
let to_change_response = to_change_response1.map(a=>({...a}))
  let matches_arr = []
  let content_greed1 = document.getElementById("content_greed_container")
  content_greed1.onclick=(e)=>{
     let target = e.target
    
     if(target.className == "post__readMore"){
      
      matches_arr.push({id: target.getAttribute("id"), date: new Date()})
      
   for(let j =0; j<matches_arr.length; j++){
    for(let i =0; i<to_change_response.length; i++){
      console.log(matches_arr[j].id, to_change_response[i].id)
     if(matches_arr[j].id == to_change_response[i].id){
       console.log("true")
       to_change_response[i].LastSeen = matches_arr[j].date
     }
    }
    
  }
  DrawPosts(to_change_response)
     }
   }





  Promise.all([promise]).then(()=>{
    response = JSON.parse(localStorage.getItem("response"))
    console.log(response)
    let search_pull1 = document.getElementById("search_pull")
  search_pull1.onkeydown =(e)=>{
    let target = e.target
    if(e.keyCode === 13){
      let search_result = response.map(el=>{
        if(el.webTitle.fuzzy(target.value, 0.75)){
          return el
        }
     
      
    }).filter(el=>el != undefined)
    DrawPosts(search_result)
    }
  }

  DrawPosts(to_change_response)




  

  })


String.prototype.fuzzy = function(term, ratio) {
  var string = this.toLowerCase();
  var compare = term.toLowerCase();
  // var matches = 0;
  let words_arr = string.split(' ');
  let compare_arr = compare.split(' ')
 
  let bool = []
  if(words_arr.length>1){




    if (string.indexOf(compare) > -1) return true;
   if(compare_arr.length>1){
     let true_words =[]
     let matches = 0
     for(let i=0; i<compare_arr.length; i++){
      matches =0
       for(let k=0; k<words_arr.length; k++){
        
        for(let j=0; j<compare_arr[i].length; j++){
          
          words_arr[k].indexOf(compare_arr[i][j]) > -1 && words_arr[k].length >= compare_arr[i].length ? matches +=1 : null
          // console.log(words_arr[k], compare_arr[i][j], matches)
        }
        // console.log(matches, matches/words_arr[k].length, words_arr[k])
        if(matches/words_arr[k].length >= ratio){
          // console.log(matches/words_arr[k].length)
          true_words.push(true)
        }
        matches = 0
       }
     }
    //  console.log(true_words.length/compare_arr.length, true_words.length)
     if(true_words.length/compare_arr.length >= 0.75){
      //  console.log(true_words.length/compare_arr.length, true_words.length)
       return bool = true
     }
     else{
      return bool = false
     }

     

   }else{
    bool = words_arr.map(word=>{
      let map_matches = 0
      for (var i = 0; i < compare.length; i++) {
        word.indexOf(compare[i]) > -1 && word.length >= compare.length ? map_matches += 1 : null;
        // console.log(map_matches)
      }
      // console.log(word.length)
      if(map_matches/word.length >= ratio){
        return true;
      }
     
     
    })
   }
    
  }else{
    if (string.indexOf(compare) > -1) return true; 
    for (var i = 0; i < compare.length; i++) {
        string.indexOf(compare[i]) > -1 ? matches += 1 : null;
        console.log(matches)
    }
  }
  
  // console.log(this.split(' ').length )
  let true_b = bool.filter(el=>el)
  if(compare_arr.length > 1){
    return bool
  }else if(compare_arr.length == 1 && bool.filter(el=>el)[0]){
    return true
  }else{
    return false
  }
};




let open_wrapperMenu = document.getElementById("open_wrapperMenu");
let close_wrapperMenu = document.getElementById("close_wrapperMenu");

let wrapper__bar_active = document.getElementById("wrapper__bar_active");
let wrapper__bar_disactive = document.getElementById("wrapper__bar_disactive");

open_wrapperMenu.onclick =()=>{
  wrapper__bar_active.style.display = "flex"
  wrapper__bar_disactive.style.display = "none"
}

close_wrapperMenu.onclick =()=>{
  wrapper__bar_active.style.display = "none"
  wrapper__bar_disactive.style.display = "flex"
}

let search_pull = document.getElementById("search_pull")
let search_pull__search_icon = document.getElementById("search_pull__search-icon")
let search_pull__reset_icon = document.getElementById("search_pull__reset-icon")

search_pull.onkeyup =()=>{
  if(search_pull.value.length > 0){
    search_pull__search_icon.style.display = "none";
    search_pull__reset_icon.style.display = "flex"
  }else{
    search_pull__search_icon.style.display = "flex";
    search_pull__reset_icon.style.display = "none"
  }
  
}

search_pull__reset_icon.onclick =()=>{
  search_pull.value = ""
  search_pull__search_icon.style.display = "flex";
  search_pull__reset_icon.style.display = "none"
  DrawPosts(response)
}

  
