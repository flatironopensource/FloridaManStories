# Florida Man Stories
Get your Florida Man news here! You don't need to spend time on web trying to find it. We caught all of em for you. What are you waiting for come here and chill.

## Setup 
### Create Firebase project with Blaze plan and add firebase Functions to your project
You can follow my instructions [here](https://portfolio-umut-yildirim.web.app/blog/how-to-create-your-own-backend-api)

### Deploy using Firebase CLI
```bash
firebase deploy
```

## Run the addAllNewsToFirestore for once.
<https://YOUR-FUNCTIONS-PUBLIC-URL.web.app/addAllNewsToFirestore?pass=yoursecretpass>

Give some time for this function to run. It takes some time to get all the news from the web. And add them to Firestore.

After that, you can visit your website and see the news.
## Backend Developer FAQ:
- Use addAllNewsToFirestore only once! During Emulator or First Time Production run. If you use it every single time it will start to readd old datas again. (Give secret pass to your env and run this script only once)