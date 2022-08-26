let latestButton = document.getElementById("latest-button")

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
  likeButton.setAttribute('onclick', 'likeNews('+id+')')
  lastDiv.append(likeButton)
  let likeCounter = document.createElement('p')
  likeCounter.textContent = "Likes: "+likes
  lastDiv.append(likeCounter)
  let latestNews = document.querySelector('#latest-news')
  latestNews.append(newsCard)
}

function likeNews(id){
  fetch('https://floridamanstories.ml/api/incrementlikesonfirebase')
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
  likeButton.setAttribute('onclick', 'likeNews('+id+')')
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
  console.log('hello')
  let one = document.getElementById('image-url').value
  let two = document.getElementById('title').value
  let three = document.getElementById('description').value
  let four = document.getElementById('url').value
  // addTopNews(one, two, three, four)
})

let allLikeButtons = document.querySelectorAll('.like-button')
let latestLikes = document.querySelectorAll('latest-card')

document.addEventListener("DOMContentLoaded", () => {
  getWeather()
  fetch('https://floridamanstories.ml/api/listpopularnewsfromfirestore')
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      console.log(item);
      addTopNews(item._fieldsProto.urlToImage.stringValue,item._fieldsProto.title.stringValue,item._fieldsProto.description.stringValue,item._fieldsProto.shortUrl.stringValue,item._fieldsProto.likes.integerValue,item._ref._path.segments[1]);
    });
  });
  fetch('https://floridamanstories.ml/api/getnews')
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      addLatestNews(item._fieldsProto.urlToImage.stringValue,item._fieldsProto.title.stringValue,item._fieldsProto.description.stringValue,item._fieldsProto.shortUrl.stringValue,item._fieldsProto.likes.integerValue,item._ref._path.segments[1]);
    });
  });
});
