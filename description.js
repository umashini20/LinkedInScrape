//const mongoose = require("mongoose");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
//const LinkedInArticle = require("./LinkedInArticle");
const ObjectsToCsv = require('objects-to-csv');



////Ushi2022
//mongodb+srv://umashini20:Ushi2022@cluster0.3plmlnp.mongodb.net/?retryWrites=true&w=majority
//Uthinksmart7*

const scrapeResults = [];
const fullData = [];
let browser;
let scrappedLinks;


/*async function connectToMongoDb(){
    await mongoose.connect(
       "mongodb+srv://umashini20:Ushi2022@cluster0.3plmlnp.mongodb.net/?retryWrites=true&w=majority",
        {useNewUrlParser:true}
    );
    console.log("Connect to MongoDb");
}*/

async function scrapeHeader(){
  
    try{
       
       // browser = await puppeteer.launch({headless: false});
        const page = await browser.newPage();
        await page.goto("https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin");
        await page.type("input#username","umashini20@gmail.com");
        await page.type("input#password","ThinkSmart207*");
        await page.click("button.btn__primary--large",{delay:20});
        await page.waitForNavigation();

        for(let index = 1; index<=5; index=index+1){

            //const urli = "https://www.linkedin.com/search/results/companies/?companyHqGeo=%5B%22101174742%22%5D&keywords=restaurant&origin=FACETED_SEARCH&sid=ayI&spellCorrectionEnabled=false&page=" +index
            await page.goto(
             
                //"https://www.linkedin.com/search/results/companies/?companyHqGeo=%5B%22101174742%22%5D&keywords=restaurant&origin=FACETED_SEARCH&sid=ayI&spellCorrectionEnabled=false&page=" +index
                "https://www.linkedin.com/search/results/people/?geoUrn=%5B%22103644278%22%5D&keywords=ceo&network=%5B%22O%22%5D&origin=FACETED_SEARCH&sid=8BV&page="+index
                ,{ waitUntil: "networkidle2" });
            //while(currentPage<=pagesToScrape){
    
            const content = await page.content();
            const $ = await cheerio.load(content);
              $(".mb1").each((index,element) => {
                const links = $(element).find(".app-aware-link").attr("href");
                
                //const scrapeResult = {links};
                scrapeResults.push(links);
            
                
            }).get();
           
           

           
        }
        return scrapeResults;
       
        /*const linkedInArticle = new LinkedInArticle({
            scrapeResults
        });*/
        //await linkedInArticle.save();
        
        
        
       
    }catch(err){
        console.error("error"+err);
    }

}


async function scrapeDescription(url,page){

    try{

        await page.goto(url,{waitUntil: "networkidle2" });
        const content = await page.evaluate(() => document.body.innerHTML);
        const $ = await cheerio.load(content);
        const title = $("h1").attr("title");
       /* const descrption = $(".artdeco-card").text();
        const free=descrption.replace(/[\r\n]/gm,'');
        const contactNo = free.match(/[+\s\.]?[0-9]?[+\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}?[-\s\.]?[0-9]{4,6} /);*/

        let ContactNo = "null";

        if(contactNo != null){
            ContactNo = contactNo[0];

        }
        
        console.log("Title: "+title);
        console.log("Url: "+url);
       // console.log("Contact No: "+ContactNo);

        return{title, url/*, ContactNo*/};
        
    }catch(e){
        console.error(url);
        console.error("error" +e);
    }
    

}
async function createCsvFile(data){
    const csv = new ObjectsToCsv(data);
   
    // Save to file:
    await csv.toDisk('./testnew.csv');
   
   
  }

async function main(){
    
    //await connectToMongoDb();
    browser = await puppeteer.launch({headless: false});
    const descriptionPage = await browser.newPage();
    const restaurantWithHeaders = await scrapeHeader();
    //console.log(restaurantWithHeaders);
    
   
    for(var i = 0; i < restaurantWithHeaders.length; i++){


        const scrappedData =await scrapeDescription(restaurantWithHeaders[i], descriptionPage);
        fullData.push(scrappedData);

        
        //console.log(restaurantWithHeaders.length);
     }
     
   
     await createCsvFile(fullData);
   
}

main();