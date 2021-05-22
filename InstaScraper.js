const request = require('request');
const cheerio = require("cheerio");
const UserAgents = require('user-agents');

const get = (url) => {
    const requestOptions = {
        url,
        headers: {
            'authority': 'www.instagram.com',
            'pragma': 'no-cache',
            'cache-control': 'no-cache',
            'upgrade-insecure-requests': '1',
            'user-agent': (new UserAgents()).random().toString(),
            'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'navigate',
            'sec-fetch-user': '?1',
            'sec-fetch-dest': 'document',
            'accept-language': 'en-US,en;q=0.9,pt-BR;q=0.8,pt;q=0.7',
        }
    };

    return new Promise((resolve) => {
        request(requestOptions, (_, __, body) => {
            resolve(body);
        });
    });
};

async function scrapeIG(url) {
    const $ = cheerio.load(await get(url));

    const description = $("meta[property='og:description']").attr('content');
    if (! description) {
        throw new Error('User not found');
    }

    const context = JSON.parse($("script[type='application/ld\+json']").html().trim());

    const username = context.alternateName;
    const name = context.name;
    const bio = decodeURIComponent(context.description);
    const userUrl = context.url;

    const [, followers] = description.match(/([0-9]+) Followers/);
    const [, following] = description.match(/([0-9]+) Following/);
    const [, posts] = description.match(/([0-9]+) Posts/);

    console.log({ username, name, bio, url: userUrl, followers, following, posts });
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
        scrapeIG("https://instagram.com/" + data)
            .then(() => process.exit())
            .catch((err) => {
                console.error(err);
                process.exit();
            });
    }
});
