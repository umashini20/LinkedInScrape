const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

let index;
let browser;

async function scrapeIndex(url,page){
    try{

    //const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.goto("https://www.linkedin.com/login?fromSignIn=true&trk=guest_homepage-basic_nav-header-signin");
    await page.type("input#username","umashini20@gmail.com");
    await page.type("input#password","Uthinksmart7*");
    await page.click("button.btn__primary--large",{delay:20});
    await page.waitForNavigation();

    for(index = 1; index<=2; index=index+1){
    await page.goto(url+index);

    const content = await page.evaluate(() => document.body.innerHTML);
    const $ = await cheerio.load(content);
    const homes =$(".entity-result__title-text").map((i,element) => 
        $(element).children(".app-aware-link").attr("href")+"about/"
        
        
     ).get();
    
    
    //const rj = homes;
     //console.log(homes);
     return homes;
     
    }
   
    }catch(err){
        console.error(err)
    }
    
}
async function scrapeDescription(url,page){
    try{
        await page.goto(url);
        const content = await page.evaluate(() => document.body.innerHTML);
        const $ = await cheerio.load(content);
        const title = $("h1").attr("title");
        const descrption = $(".artdeco-card").text();
        const free=descrption.replace(/[\r\n]/gm,'');
        const contactNo = free.match(/[+\s\.]?[0-9]?[+\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}?[-\s\.]?[0-9]{4,6} /);

        let displayContactNo = "null";

        if(contactNo != null){
            displayContactNo = contactNo[0];

        }
        
        console.log("Title: "+title);
        console.log("Contact No: "+displayContactNo);

        return{title,displayContactNo};
    }catch(err){
        console.error(err);
    }
}
async function main(){

 browser = await puppeteer.launch({headless:false});
 const descriptionPage = await browser.newPage();
 //const newpage = await browser.newPage();
 const homes = await scrapeIndex(
       // "https://www.linkedin.com/search/results/companies/?companyHqGeo=%5B%22101174742%22%5D&keywords=restaurant&origin=FACETED_SEARCH&sid=ayI&spellCorrectionEnabled=false&page="
    //"https://www.linkedin.com/search/results/companies/?companyHqGeo=%5B%22101174742%22%5D&keywords=restaurant&origin=FACETED_SEARCH&page=2&sid=t*)"
    "https://www.linkedin.com/search/results/companies/?companyHqGeo=%5B%22101174742%22%5D&keywords=restaurant&origin=FACETED_SEARCH&sid=ayI&spellCorrectionEnabled=false&page="
  );
  for(var i = 0; i < homes.length; i++){

  await scrapeDescription(homes[i],descriptionPage);
  }
  //console.log(homes);
}

main();
