import puppeteer from 'puppeteer';
import UserAgent from 'user-agents';
import configuration from './config.json' assert {type: 'json'};


(async () => {
     //Randomize User agent or Set a valid one
     const userAgent = new UserAgent();
     const UA = userAgent || USER_AGENT;
     const browser = await puppeteer.launch({ headless: false,args: ["--window-size=1920,1080", "--window-position=0,0"] });
     const page = await browser.newPage();



    
    
    const loginPage = "https://www.linkedin.com/login"
    const myNetworkPage = "https://www.linkedin.com/mynetwork/"

    //user data
    const username = configuration.users.username
    const password = configuration.users.password
    console.log(username, password)


    await page.setViewport({ width: 752, height: 1920});
    
    await page.goto(loginPage, { waitUntil: 'domcontentloaded' })
    await login(username, password, page);
    await page.waitForNetworkIdle({ idleTime: 10000 });
    await page.goto(myNetworkPage, { waitUntil: 'domcontentloaded' })
    await goToNetworkPageAndConnect(page);
    console.log("success!")
    // await browser.close();
})();

async function login(username, password, page) {
    const logOnButton = '.btn__primary--large';

    await page.type('#username', username);
    await page.type('#password', password);
    await page.click(logOnButton);
    await page.waitForNetworkIdle({ idleTime: 500 });
}

async function goToNetworkPageAndConnect(page){
    console.log("im in network page")
    
    const discoverUserCard = '.discover-fluid-entity-list--item .mt2'
    await page.waitForSelector(discoverUserCard);
    await page.evaluate(() => {
        page.scrollTo(0, document.body.scrollHeight);
    });
    
    console.log("loaded")
    const buttons = await page.$$(discoverUserCard);
        console.log(buttons)
    //    // Iterate over buttons and click on each one
    //    for (const button of buttons) {
    //        await button.click();
    //        await new Promise(resolve => setTimeout(resolve, 1000));
    //    }

}

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight - window.innerHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}
// const buttons = await page.evaluate(() => {
//     const container = document.querySelector('#container');
//     return Array.from(container.querySelectorAll('.my-button'));
// });