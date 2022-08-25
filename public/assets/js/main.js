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
function addLatestNews(urlImage,titleNews,descOfNews,urlNews) {
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
  newsImg.src = urlImage
  col.append(newsImg)
  const nextDiv = document.createElement('div')
  nextDiv.setAttribute('class', 'col-md-8')
  row.append(nextDiv)
  const body = document.createElement('div')
  body.setAttribute('class', 'card-body')
  nextDiv.append(body)
  let newsTitle = document.createElement('h5')
  newsTitle.setAttribute('class', 'card-title')
  newsTitle.textContent = titleNews
  body.append(newsTitle)
  let newsText = document.createElement('p')
  newsText.setAttribute('class', 'card-text')
  newsText.textContent = descOfNews
  body.append(newsText)
  const lastDiv = document.createElement('div')
  body.append(lastDiv)
  let readThis = document.createElement('a')
  readThis.href = urlNews
  readThis.textContent = "Content     "
  lastDiv.append(readThis)
  let likeButton = document.createElement('button')
  likeButton.textContent = 'Like'
  likeButton.style.float = 'right'
  likeButton.setAttribute('type', 'button')
  likeButton.setAttribute('class', 'like-button btn btn-danger btn-outline-light')
  lastDiv.append(likeButton)
  let likeCounter = document.createElement('p')
  likeCounter.textContent = "Likes: "
  lastDiv.append(likeCounter)
  let latestNews = document.querySelector('#latest-news')
  latestNews.append(newsCard)
}
function addTopNews(urlImage,titleNews,descOfNews,urlNews) {
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
  newsImg.src = urlImage
  col.append(newsImg)
  const nextDiv = document.createElement('div')
  nextDiv.setAttribute('class', 'col-md-8')
  row.append(nextDiv)
  const body = document.createElement('div')
  body.setAttribute('class', 'card-body')
  nextDiv.append(body)
  let newsTitle = document.createElement('h5')
  newsTitle.setAttribute('class', 'card-title')
  newsTitle.textContent = titleOfNews
  body.append(newsTitle)
  let newsText = document.createElement('p')
  newsText.setAttribute('class', 'card-text')
  newsText.textContent = descOfNews
  body.append(newsText)
  const lastDiv = document.createElement('div')
  body.append(lastDiv)
  let readThis = document.createElement('a')
  readThis.href = urlNews
  readThis.textContent = "Content"
  lastDiv.append(readThis)
  let likeButton = document.createElement('button')
  likeButton.textContent = 'Like'
  likeButton.style.float = 'right'
  likeButton.setAttribute('type', 'button')
  likeButton.setAttribute('class', 'like-button btn btn-danger btn-outline-light')
  lastDiv.append(likeButton)
  let likeCounter = document.createElement('p')
  likeCounter.textContent = "Likes: "
  lastDiv.append(likeCounter)
  let topNews = document.querySelector('#top-news')
  topNews.append(newsCard)
}

let allLikeButtons = document.querySelectorAll('.like-button')
let latestLikes = document.querySelectorAll('latest-card')

// allLikeButtons.forEach(likeButton => {
//   likeButton.addEventListener('click',
//     e.target.setAttribute('class', 'btn btn-secondary btn-outline-light'))
// })

document.addEventListener("DOMContentLoaded", () => {
  getWeather()
  fetch('https://floridamanstories.ml/api/listpopularnewsfromfirestore')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    data.forEach(item => {
      console.log(item._fieldsProto.urlToImage,item._fieldsProto.title,item._fieldsProto.description,item._fieldsProto.shortUrl);
    });
  });
});