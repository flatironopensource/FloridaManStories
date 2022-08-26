let latestButton = document.getElementById("latest-button");
let lastNews = 10;
let lastNewsId = "";
function getWeather() {
  fetch('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/new%20york?unitGroup=metric&include=current%2Cdays&key=TKNH3KX7YXMA7N4FRV5VUQP9H&contentType=json')
    .then(res => res.json())
    .then(data => {
      let now = new Date()
      const weatherElement = document.createElement('div')
      const weatherImg = document.createElement('img')
      weatherImg.width = "25"
      weatherImg.height = "25"
      for (i = 0; i < data.days.length; i++) {
        const weatherDays = document.createElement('span')
        let key = new Date(data.days[i].datetimeEpoch * 1000)
        let temp = data.days[i].temp
        let tempMax = data.days[i].tempmax
        let tempMin = data.days[i].tempmin
        let sunCloudRain = data.days[i].icon
        let nowDate = now.getDate()
        let keyDate = key.getDate()
        let eachLine = `${keyDate}${sunCloudRain}${tempMax}${tempMin}`
        if ((nowDate == keyDate)) {
          weatherDays.append(`${temp}\u00B0 `)
          weatherImg.src = "./assets/img/rainy.png"
          weatherDays.append(weatherImg)

        }
        // weatherDays.append(eachLine)
        weatherElement.appendChild(weatherDays)
        document.querySelector("#weather").appendChild(weatherElement)
      }
    })
}

function addLatestNews(one, two, three, four, id, likes) {
  const newsCard = document.createElement('div')
  newsCard.setAttribute("class", "card mb-3 latest-card")
  const row = document.createElement('div')
  row.setAttribute("class", "row g-0")
  newsCard.append(row)
  const col = document.createElement('div')
  col.setAttribute("class", "col-md-4")
  row.append(col)
  const newsImg = document.createElement('img')
  newsImg.setAttribute("class", "img-fluid rounded-start")
  newsImg.setAttribute("style", "height: 100%")
  newsImg.src = one
  col.append(newsImg)
  const nextDiv = document.createElement('div')
  nextDiv.setAttribute('class', 'col-md-8')
  row.append(nextDiv)
  const body = document.createElement('div')
  body.setAttribute('class', 'card-body')
  nextDiv.append(body)
  let newsTitle = document.createElement('h5')
  newsTitle.setAttribute('class', 'card-title')
  newsTitle.textContent = two
  body.append(newsTitle)
  let newsText = document.createElement('p')
  newsText.setAttribute('class', 'card-text')
  newsText.textContent = three
  body.append(newsText)
  const lastDiv = document.createElement('div')
  body.append(lastDiv)
  let readThis = document.createElement('a')
  readThis.href = four
  readThis.textContent = "Content     "
  lastDiv.append(readThis)
  let likeButton = document.createElement('button')
  likeButton.textContent = 'Like'
  likeButton.style.float = 'right'
  likeButton.setAttribute('type', 'button')
  likeButton.setAttribute('class', 'like-button btn btn-danger btn-outline-light')
  likeButton.setAttribute('onclick', 'likeNews("'+id+'")')
  likeButton.setAttribute('value', id)
  lastDiv.append(likeButton)
  let likeCounter = document.createElement('p')
  lastDiv.append(likeCounter)
  let latestNews = document.querySelector('#latest-news')
  latestNews.append(newsCard)
}

function addAllNews(one, two, three, four, id, likes) {
  const newsCard = document.createElement('div')
  newsCard.setAttribute("class", "card mb-3 latest-card")
  newsCard.setAttribute("style", "width: 100%;")
  const row = document.createElement('div')
  row.setAttribute("class", "row g-0")
  newsCard.append(row)
  const col = document.createElement('div')
  col.setAttribute("class", "col-md-4")
  row.append(col)
  const newsImg = document.createElement('img')
  newsImg.setAttribute("class", "img-fluid rounded-start")
  newsImg.setAttribute("style", "height: 100%")
  newsImg.src = one
  col.append(newsImg)
  const nextDiv = document.createElement('div')
  nextDiv.setAttribute('class', 'col-md-8')
  row.append(nextDiv)
  const body = document.createElement('div')
  body.setAttribute('class', 'card-body')
  nextDiv.append(body)
  let newsTitle = document.createElement('h5')
  newsTitle.setAttribute('class', 'card-title')
  newsTitle.textContent = two
  body.append(newsTitle)
  let newsText = document.createElement('p')
  newsText.setAttribute('class', 'card-text')
  newsText.textContent = three
  body.append(newsText)
  const lastDiv = document.createElement('div')
  body.append(lastDiv)
  let readThis = document.createElement('a')
  readThis.href = four
  readThis.textContent = "Content     "
  lastDiv.append(readThis)
  let likeButton = document.createElement('button')
  likeButton.textContent = 'Like'
  likeButton.style.float = 'right'
  likeButton.setAttribute('type', 'button')
  likeButton.setAttribute('class', 'like-button btn btn-danger btn-outline-light')
  likeButton.setAttribute('onclick', 'likeNews("'+id+'")')
  lastDiv.append(likeButton)
  let likeCounter = document.createElement('p')
  likeCounter.textContent = "Likes: "+likes
  lastDiv.append(likeCounter)
  let latestNews = document.getElementById('allNews')
  latestNews.append(newsCard)
}

function addTopNews(one, two, three, four, id, likes) {
  const newsCard = document.createElement('div')
  newsCard.setAttribute("class", "card mb-3 top-card")
  const row = document.createElement('div')
  row.setAttribute("class", "row g-0")
  newsCard.append(row)
  const col = document.createElement('div')
  col.setAttribute("class", "col-md-4")
  row.append(col)
  const newsImg = document.createElement('img')
  newsImg.setAttribute("class", "img-fluid rounded-start")
  newsImg.setAttribute("style", "height: 100%")
  newsImg.src = one
  col.append(newsImg)
  const nextDiv = document.createElement('div')
  nextDiv.setAttribute('class', 'col-md-8')
  row.append(nextDiv)
  const body = document.createElement('div')
  body.setAttribute('class', 'card-body')
  nextDiv.append(body)
  let newsTitle = document.createElement('h5')
  newsTitle.setAttribute('class', 'card-title')
  newsTitle.textContent = two
  body.append(newsTitle)
  let newsText = document.createElement('p')
  newsText.setAttribute('class', 'card-text')
  newsText.textContent = three
  body.append(newsText)
  const lastDiv = document.createElement('div')
  body.append(lastDiv)
  let readThis = document.createElement('a')
  readThis.href = four
  readThis.target = '_blank';
  readThis.textContent = "Content"
  lastDiv.append(readThis)
  let likeButton = document.createElement('button')
  likeButton.textContent = 'Like'
  likeButton.style.float = 'right'
  likeButton.setAttribute('type', 'button')
  likeButton.setAttribute('class', 'like-button btn btn-danger btn-outline-light')
  likeButton.setAttribute('onclick', 'likeNews("'+id+'")')
  lastDiv.append(likeButton)
  let likeCounter = document.createElement('p')
  likeCounter.textContent = "Likes: "+likes
  lastDiv.append(likeCounter)
  let topNews = document.querySelector('#top-news')
  topNews.append(newsCard)
}

let submitButton = document.getElementById('submit-form')
submitButton.addEventListener('submit', (e) =>{
  e.preventDefault()
  let title = document.getElementById('title').value
  let description = document.getElementById('description').value
  let content = document.getElementById('content').value
  let source = "Florida Man Stories";
  let author = document.getElementById('author').value
  let url = document.getElementById('url').value
  let urlToImage = document.getElementById('image-url').value
  let publishedAt = document.getElementById('publish').value

  fetch('https://floridamanstories.ml/api/insertusersubmittednews',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: title,
      description: description,
      content: content,
      source: source,
      author: author,
      url: url,
      urlToImage: urlToImage,
      publishedAt: publishedAt
    })
  })
  .then(res => res.json())
  .then(data => {
    console.log(data)
    if(data.success){
      alert('News Submitted')
      window.location.href = '/'
    }
  })
});

let allLikeButtons = document.querySelectorAll('.like-button')
let latestLikes = document.querySelectorAll('latest-card')

function likeNews(id){
  fetch("https://floridamanstories.ml/api/incrementlikesonfirebase",
  {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify({
         articleId : id
      })
  })
  .then(function(res){ 
    if(res.status === 200){
      console.log("success")
      window.location.reload()
    }
   })
  .catch(function(res){ console.log(res) })
}

document.addEventListener("DOMContentLoaded", () => {
  getWeather()
  fetch('https://floridamanstories.ml/api/listpopularnewsfromfirestore')
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      addTopNews(item._fieldsProto.urlToImage.stringValue,item._fieldsProto.title.stringValue,item._fieldsProto.description.stringValue,item._fieldsProto.shortUrl.stringValue,item._ref._path.segments[1],item._fieldsProto.likes.integerValue);
    });
  });
  fetch('https://floridamanstories.ml/api/getnews')
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      addLatestNews(item._fieldsProto.urlToImage.stringValue,item._fieldsProto.title.stringValue,item._fieldsProto.description.stringValue,item._fieldsProto.shortUrl.stringValue,item._ref._path.segments[1],item._fieldsProto.likes.integerValue);
      lastNewsId=item._ref._path.segments[1]
    });
  });
});

let lastScrollTop = 0;

// element should be replaced with the actual target element on which you have applied scroll, use window in case of no target element.
window.addEventListener("scroll", function(){ // or window.addEventListener("scroll"....
   let st = window.pageYOffset || document.documentElement.scrollTop; // Credits: "https://github.com/qeremy/so/blob/master/so.dom.js#L426"
   if (st > lastScrollTop){
    console.log('Scroll down');
    fetch('https://floridamanstories.ml/api/getnewslromlastsentnews', {
     headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json'
       },
       method: "POST",
       body: JSON.stringify({
         lastNews : lastNewsId
       })
    })
    .then(response => response.json())
    .then(data => {
      lastNews+=data.length
      data.forEach(item => {
        addAllNews(item._fieldsProto.urlToImage.stringValue,item._fieldsProto.title.stringValue,item._fieldsProto.description.stringValue,item._fieldsProto.shortUrl.stringValue,item._ref._path.segments[1],item._fieldsProto.likes.integerValue);
      });
    });
   } else {
      console.log('Scroll up');
   }
   lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
}, false);