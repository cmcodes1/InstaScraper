const puppeteer = require('puppeteer');

async function scrapeIG(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    
    const [e1] = await page.$x('//*[@id="react-root"]/section/main/div/header/section/div[1]/h2');
    const txt1 = await e1.getProperty('textContent');
    const username = await txt1.jsonValue();

    const [e2] = await page.$x('//*[@id="react-root"]/section/main/div/header/section/div[2]/h1');
    const txt2 = await e2.getProperty('textContent');
    const name = await txt2.jsonValue();
    
    const [e3] = await page.$x('//*[@id="react-root"]/section/main/div/header/section/div[2]/span');
    const txt3 = await e3.getProperty('textContent');
    const bio = await txt3.jsonValue();

    const [e4] = await page.$x('//*[@id="react-root"]/section/main/div/header/section/ul/li[2]/a/span');
    const txt4 = await e4.getProperty('textContent');
    const followers = await txt4.jsonValue();

    const [e5] = await page.$x('//*[@id="react-root"]/section/main/div/header/section/ul/li[3]/a/span');
    const txt5 = await e5.getProperty('textContent');
    const followings = await txt5.jsonValue();

    const [e6] = await page.$x('//*[@id="react-root"]/section/main/div/header/section/ul/li[1]/a/span');
    const txt6 = await e6.getProperty('textContent');
    const posts = await txt6.jsonValue();

    console.log({username, name, bio, followers, followings, posts});

    browser.close();
}

var standard_input = process.stdin;

standard_input.setEncoding('utf-8');

console.log("Enter the username: ");

standard_input.on('data', function (data) {

    if(data === 'exit\n') {
        console.log("User input complete, program exit.");
        process.exit();
    }
    else {
        scrapeIG('https://www.instagram.com/' + data);
    }
});