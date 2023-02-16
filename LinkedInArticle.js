//working model of index.js file

const mongoose =require("mongoose");

const LinkedInArticle = mongoose.model(
    "LinkedInArticle",
    mongoose.Schema({
        scrapeResults : []
    })
);
module.exports = LinkedInArticle;