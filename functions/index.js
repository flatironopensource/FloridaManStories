// TODO : Add documatation inside this file
const functions = require("firebase-functions");
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
const NewsAPI = require('newsapi');

// Firebase and GCP configuration
initializeApp();
const db = getFirestore();

// IMPORTANT: This is an starter function that will be triggered if there is no data in the firestore.
exports.addAllNewsToFirestore = functions.runWith({ secrets: ["FIRSTSETUPPASSWORD","NEWSAPIKEY"] }).https.onRequest((request, response) => {
    functions.logger.warn("WARNING: THIS IS AN STARTER FUNCTION THAT WILL BE TRIGGERED IF THERE IS NO DATA IN THE FIRESTORE!");
    const newsapikey = process.env.NEWSAPIKEY;
    const newsapi = new NewsAPI(newsapikey);
    if (request.query.pass == process.env.FIRSTSETUPPASSWORD) {
        for(let i = 1; i <= 5; i++) {
            let batch = db.batch();
            newsapi.v2.everything({
                q: "florida man",
                language: "en",
                page: i,
            })
            .then((res) => {
                if(res.status == "ok"){
                    res.articles.forEach(articles => {
                        // insert articles into the firestore batch
                        batch.set(db.collection("articles").doc(), {
                            author: articles.author,
                            content: articles.content,
                            description: articles.description,
                            publishedAt: articles.publishedAt,
                            source: articles.source,
                            title: articles.title,
                            url: articles.url,
                            urlToImage: articles.urlToImage,
                            likes: 0,
                        });
                    });
                    batch.commit().then(() => {
                        batch = null;
                        batch = db.batch() 
                    });
                    console.log("Successfully added 100 articles to the firestore!");
                }
                else{
                    functions.logger.error("DEV! Your code failed... Check out log: "+res.status);
                    return response.status(500).send("Sorry! Server is not available. <br> Detailed error log: "+res);
                }
            }).catch((err) => {
                functions.logger.error("DEV! Your code failed... Check out log: "+err);
                return response.status(500).send("Sorry! Server is not available. <br> Detailed error log: "+err);
            });
        }
        functions.logger.info("DEV! Your news has been added to the firestore! PS: Dont forget to delete this function!");
        return response.status(200).send("News has been added to the firestore! <br> PS: Dont forget to delete this function!");
    }
    else{
        functions.logger.warn("WARNING: There was an password attempt! Please either make sure your password is safe or delete this function from Firebase Function Admin Page.");
        response.status(403).send("Forbidden");
    }
});

exports.addNewNewsToFirestore = functions.pubsub.schedule('every 20 minutes').timeZone('Etc/Zulu').onRun(() => {
    let currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() - 19);
    currentDate = currentDate.toISOString();
    const newsapikey = process.env.NEWSAPIKEY;
    const newsapi = new NewsAPI(newsapikey);
    newsapi.v2.everything({
        q: "florida man",
        from: currentDate,
        language: "en",
        page: 1,
    })
    .then((res) => {
        if(res.status == "ok"){
            if(res.articles != null){
                res.articles.forEach(articles => {
                    // insert articles into firestore
                    console.log("Successfully Added: "+articles.title);
                    db.collection('articles').add({
                        author: articles.author,
                        content: articles.content,
                        description: articles.description,
                        publishedAt: articles.publishedAt,
                        source: articles.source,
                        title: articles.title,
                        url: articles.url,
                        urlToImage: articles.urlToImage,
                        likes: 0,
                    });
                    functions.logger.info("DEV! New news are added to firestore. News title: "+articles.title);
                });
                return null;
            }
            else{
                functions.logger.warn("Admin! Your code run but there were no new florida man news... Check out log: "+res.status);
                return null;
            }
        }
        else{
            functions.logger.error("DEV! Your code failed... Check out log: "+res.status);
            return null;
        }
    }).catch((err) => {
        functions.logger.error("DEV! Your code failed... Check out log: "+err);
        return null;
    });
});

// Get last sent news to the user and send user remaining news
exports.getNewsFromLastSentNews = functions.https.onRequest((request, response) => {
    const lastNews = request.body.lastNews;
    // Get all news from the firestore
    db.collection('articles').orderBy('publishedAt', 'desc').limit(20).startAt(lastNews).get().then((snapshot) => {
        if (snapshot.empty) {
            functions.logger.warn("WARNING: There is no news in the firestore!");
            return response.status(200).send("There is no news in the firestore!");
        }
        else{
            let news = [];
            snapshot.forEach((doc) => {
                news.push(doc.data());
            });
            return response.status(200).send(news);
        }
    }).catch((err) => {
        functions.logger.error("DEV! Your code failed... Check out log: "+err);
        return response.status(500).send("Sorry! Server is not available. <br> Detailed error log: "+err);
    });
});

exports.getNews = functions.https.onRequest((request, response) => {
    // Request paramaeters
    let totalResult = request.body.totalResult;
    let articles = [];
    if (totalResult == null){
        totalResult = 10;
    }
    let order = request.body.order;
    if (order == null){
        order = "desc";
    }
    let keyword = request.body.keyword;
    if (keyword == null){
        // Retrieve articles from firestore acording to the request parameters
        db.collection("articles").orderBy("publishedAt", order).limit(totalResult).get().then(snapshot => {
            snapshot.forEach(doc => {
                articles.push(doc);
            });
            functions.logger.info("DEV! Your code succeeded!");
            return response.status(200).send(articles);
        }).catch(err => {
            functions.logger.error("DEV! Your code failed... Check out log: "+err);
            return response.status(500).send("Sorry! Server is not available. <br> Detailed error log: "+err);
        });
    }
    if(keyword != null){
        let keywordArray = keyword.split(" ");
        // Search for the keyword in the title and description of the articles
        db.collection("articles").where("title", "in", keywordArray).orderBy("publishedAt", order).limit(totalResult).get().then(snapshot => {
            snapshot.forEach(doc => {
                articles.push(doc);
            });
            functions.logger.info("DEV! Your code succeeded!");
            return response.status(200).send(articles);
        }).catch(err => {
            functions.logger.error("DEV! Your code failed... Check out log: "+err);
            return response.status(500).send("Sorry! Server is not available. <br> Detailed error log: "+err);
        });
    }
}); 

exports.getNewsLenghtFromFirestore = functions.https.onRequest((_request, response) => {
    db.collection("articles").get().then(function(querySnapshot) {      
        console.log(querySnapshot.size); 
        return response.status(200).send("Your total news are: "+querySnapshot.size);
    });
});


// Won't work if there are no likes on some articles
// NOTE: This will return whole collection of articles UNEDITED AND UNORDERED
exports.listPopularNewsFromFirestore = functions.https.onRequest((_request, response) => {
    db.collection("articles").orderBy("likes", "desc").orderBy("publishedAt", "desc").limit(10).get().then(function(querySnapshot) {
        let articles = [];
        querySnapshot.forEach(function(doc) {
            articles.push(doc);
        });
        return response.status(200).send(articles);
    }).catch(err => {
        return response.status(500).send("Sorry! Server is not available. <br> Detailed error log: "+err);
    });
});

exports.insertUserSubmittedNews = functions.https.onRequest((request, response) => {
    // Request parameters
    let title = request.body.title;
    let description = request.body.description;
    let content = request.body.content;
    let author = request.body.author;
    let url = request.body.url;
    let urlToImage = request.body.urlToImage;
    let publishedAt = request.body.publishedAt;
    let likes = 0;
    if (title == null || description == null || content == null || author == null || url == null || urlToImage == null || publishedAt == null){
        return response.status(400).send("Please fill out all the fields");
    }
    // Insert article into firestore
    db.collection('articles').add({
        author: articles.author,
        content: articles.content,
        description: articles.description,
        publishedAt: articles.publishedAt,
        source: articles.source,
        title: articles.title,
        url: articles.url,
        urlToImage: articles.urlToImage,
        likes: 0,
    }).then(() => {
        functions.logger.info("DEV! New news are added to firestore. News title: "+articles.title);
        return response.status(200).send("Successfully added");
    }
    ).catch(err => {
        functions.logger.error("DEV! Your code failed... Check out log: "+err);
        return response.status(500).send("Sorry! Server is not available. <br> Detailed error log: "+err);
    }
    );
});

/* WARNING : DON'T USE THIS FUNCTIPON FOR PRODUCTION
    You need to give this function a ReCaptcha protection, APP CHECKK and just security sake add Cloudflare too.
*/
exports.incrementLikesOnFirebase = functions.https.onRequest((request, response) => {
    // Request parameters
    let articleId = request.body.articleId;
    if (articleId == null){
        return response.status(400).send("Please fill out all the fields");
    }
    console.log("articleId: "+articleId);
    // Increment likes on firestore
    try{
        db.collection('articles').doc(articleId).update({
            likes: FieldValue.increment(1)
        });
        return response.status(200).send("Successfully added");
    }
    catch(err){
        return response.status(500).send("Sorry! Server is not available. <br> Detailed error log: "+err);
    }
});