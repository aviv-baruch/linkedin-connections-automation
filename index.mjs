import puppeteer from 'puppeteer';
import configuration from './config.json' assert {type: 'json'};


(async () => {
    let connections = 0;
     const browser = await puppeteer.launch({ headless: false,args: ["--window-size=1920,1080", "--window-position=0,0"] });
     const page = await browser.newPage();
    
    const loginPage = "https://www.linkedin.com/login"
    const myNetworkPage = "https://www.linkedin.com/mynetwork/"

    //user data
    const username = configuration.users.username
    const password = configuration.users.password

    await page.setViewport({ width: 752, height: 1920});
    
    await page.goto(loginPage, { waitUntil: 'domcontentloaded' })
    await login(username, password, page);

    await page.goto(myNetworkPage, { waitUntil: 'domcontentloaded' })
    for(let i = 0;i < configuration.data.peopleToAddX4;i++)    
    {
        console.log(connections*i)
        await goToNetworkPageAndConnect(page,connections);
        await page.reload({ waitUntil: [ "domcontentloaded"] });
    }
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

async function goToNetworkPageAndConnect(page,connections){
    console.log("im in network page")
    
    const discoverUserCard = '.discover-fluid-entity-list--item .mt2'
    await page.waitForSelector(discoverUserCard);

    console.log("loaded")
    // await page.evaluate(() => {
    //     page.scrollTo(0, document.body.scrollHeight);
    // });
    const buttons = await page.$$(discoverUserCard);
        console.log(buttons)
    //    // Iterate over buttons and click on each one
       for (const button of buttons) {
           await button.click();
           connections++;
           await new Promise(resolve => setTimeout(resolve, 1000));
       }

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
