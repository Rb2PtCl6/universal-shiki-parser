const Shikimori = require("node-shikimori-api");
const fs = require('fs');

const shiki = new Shikimori();
const user_id = 937225;
const dateUTC = +new Date

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function myFunction() {
    console.log('Start to wait');
    await sleep(669);
    console.log('End to wait');
}

var processors = {
    anime: function(res){
        var content_ids = [];
        for (var i of res) {
            content_ids.push(i.anime.id);
        }
        return content_ids;
    },
    manga: function(res){
        var content_ids = [];
        for (var i of res) {
            content_ids.push(i.manga.id);
        }
        return content_ids;
    },
    character: function(res){
        var content_ids = [];
        for (var i of res.characters) {
            content_ids.push(i.id);
        }
        return content_ids;
    }
}
var sections ={
    anime: "anime_rates",
    manga: "manga_rates",
    character: "favourites"
}

async function getUserData(this_user_id, type) {
    var section = sections[type]
    var fileName = `${type}s-names`
    var apiEndpoint = `${type}s`
    var processor = processors[type]
    try {
        const res = await shiki.api.users({
            user_id: this_user_id,
            section: section,
            limit: 1000
        });

        const rawFilePath = `${this_user_id}-${section}-full-raw-${dateUTC}.json`;
        fs.writeFileSync(rawFilePath, JSON.stringify(res));

        const content_ids = processor(res)

        const full_info = [];
        for (const id of content_ids) {
            console.log(id);
            const response = await shiki.api[apiEndpoint]({ anime_id: id });
            full_info.push(response);
            await myFunction();
        }

        const infoFilePath = `${this_user_id}-${fileName}-full-${dateUTC}.json`;
        fs.appendFileSync(infoFilePath, JSON.stringify(full_info));
    } catch (err) {
        console.log(err);
    }
}

async function main() {
    await getUserData(user_id, "anime");
    await getUserData(user_id, "manga");
    await getUserData(user_id, "character");
}

main().catch((err) => {
    console.log(err);
});
