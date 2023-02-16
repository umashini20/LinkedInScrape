/*Working fille scarpping 100pgs*/

const mongoose = require("mongoose");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const LinkedInArticle = require("./LinkedInArticle");



////Ushi2022
//mongodb+srv://umashini20:Ushi2022@cluster0.3plmlnp.mongodb.net/?retryWrites=true&w=majority
//Uthinksmart7*

const scrapeResults = [];
let browser;


async function connectToMongoDb(){
    await mongoose.connect(
       "mongodb+srv://umashini20:Ushi2022@cluster0.3plmlnp.mongodb.net/?retryWrites=true&w=majority",
        {useNewUrlParser:true}
    );
    console.log("Connect to MongoDb");
}

async function scrapeHeader(){
    try{
       
        browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto("https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin");
        await page.type("input#username","umashini20@gmail.com");
        await page.type("input#password","Uthinksmart7*");
        await page.click("button.btn__primary--large",{delay:20});
        await page.waitForNavigation();

        for(let index = 1; index<=100; index=index+1){

            await page.goto(
                //urli
                "https://www.linkedin.com/search/results/companies/?companyHqGeo=%5B%22101174742%22%5D&keywords=restaurant&origin=FACETED_SEARCH&sid=ayI&spellCorrectionEnabled=false&page=" +index
                ,{delay:1000});
            //while(currentPage<=pagesToScrape){
    
            const content = await page.content();
            const $ = await cheerio.load(content);
            $(".entity-result__content").each((index,element) => {
                const resultTitle = $(element).find(".app-aware-link");/*.attr("href")*/
                //const restaurantName = resultTitle.text();
                const url = resultTitle.attr("href");
                const typeOfIndustry = $(element).find(".entity-result__primary-subtitle");
                const typeAddress = typeOfIndustry.text();
                const scrapped = false; //url is not used still.
                const scrapeResult = {/*restaurantName,*/ url, typeAddress,scrapped};
                scrapeResults.push(scrapeResult);
                //console.log(scrapeResults);

               //const homes = scrapped
                
                
            });
           
            //console.log("At page no : "+index);
            
            
           

        }
        const linkedInArticle = new LinkedInArticle({
            scrapeResults
        });
        await linkedInArticle.save();
        return scrapeResults;
        
       
    }catch(err){
        console.error(err);
    }

}



async function main(){
    
    await connectToMongoDb();
    const restaurantWithHeaders = await scrapeHeader();
    //await createCsvFile(restaurantWithHeaders);
    console.log(restaurantWithHeaders);
   
}

main();
//scrapeHeader();