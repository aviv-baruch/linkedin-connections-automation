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

    await page.setViewport({ width: 752, height: 1920}); //opens on 752 width to avoid chat being expanded automatically
    
    await page.goto(loginPage, { waitUntil: 'domcontentloaded' })
    await login(username, password, page);

    await page.goto(myNetworkPage, { waitUntil: 'domcontentloaded' })
    // for(let i = 0;i < configuration.data.peopleToAddX4;i++)    
    // {
        await find_items(page);
        await page.reload({ waitUntil: [ "domcontentloaded"] });
    // }
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

async function find_items(page){
    const discoverUserCard = '.discover-person-card__name'
    const connectButton = 'Connect';
    
    await page.waitForSelector(discoverUserCard)
    await page.waitForSelector(`text/${connectButton}`);
    
    console.log("Beep")

    let connects = await page.$$(`text/${connectButton}`)
    console.log("Beep Beep")

    console.log(`Connect buttons: ${connects}\n total: ${connects.length}`)
       for (let i = 0;i < 8;i++) {
        const connect = connects[i];
        let randomNum = (Math.random() * (2 - 0.5)) + 0.5;
        await connect.evaluate(c => c.click());
        await new Promise(resolve => setTimeout(resolve, randomNum*1000));
       }


}

