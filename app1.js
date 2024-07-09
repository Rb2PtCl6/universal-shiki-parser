const Shikimori = require("node-shikimori-api");
const fs = require('fs');

const shiki = new Shikimori();
const user_id = 937225

const json_file = "937225-anime_rates-full-raw-1720548938934.json"

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function myFunction() {
    console.log('Начало');
    await sleep(669);
    console.log('Конец');
}

function getId(src) {
    var content = JSON.parse(fs.readFileSync(src));
    var content_ids = [];
    for (var i of content) {
        content_ids.push(i.anime.id);
    }
    // console.log(content_ids);
    return content_ids;
}

async function fetchData() {
    var full_info = [];
    for (var this_anime_id of getId(json_file)) {
        console.log(this_anime_id)
        await shiki.api.animes({
            anime_id: this_anime_id
        }).then((res) => {
            // console.log(res)
            full_info.push(res)
        }).catch((err) => {
            console.log(err);
        });
        await myFunction();
    }
    fs.appendFileSync(`${user_id}-anime-names-full-${+new Date}.json`, JSON.stringify(full_info));
}

fetchData().catch((err) => {
    console.log(err);
});