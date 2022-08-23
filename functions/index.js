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
                articles.push(doc.data());
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
                articles.push(doc.data());
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