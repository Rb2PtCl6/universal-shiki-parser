const Shikimori = require("node-shikimori-api");
const fs = require('fs');

const shiki = new Shikimori();
const user_id = 937225;
const dateUTC = +new Date
const additional_path = `recived_data/${dateUTC}`

function create_out_dir(dir_name){
    fs.mkdirSync(dir_name)
}

function sleep(ms = 669) {
    // 669 ms - 60 seconds / 669 ms per request = 90 reuests per minute
    // 90 rpm and 5 rps - api limits
    return new Promise(resolve => setTimeout(resolve, ms));
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
        content_ids.sort((a, b) => a - b)
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

        console.log(`All enteries of type "${type}" of user "${this_user_id}" were recived!`)

        const rawFilePath = `${additional_path}/${this_user_id}-${section}-full-raw-${dateUTC}.json`;
        fs.writeFileSync(rawFilePath, JSON.stringify(res));

        console.log(`All enteries of type "${type}" of user "${this_user_id}" were written to file!`)
        console.log(`Filename : "${rawFilePath}"`)
        console.log(`All detailed enteries of type "${type}" were started to recive!`)

        const content_ids = processor(res)

        const full_info = [];
        var content_ids_length = content_ids.length
        var content_ids_length_as_str = String(content_ids_length).length
        for (var i = 0; i < content_ids_length; i++) {
            var id = content_ids[i]
            console.log(`${String(i+1).padStart(content_ids_length_as_str, "0")}/${content_ids_length} Getting entry of type "${type}" with id "${id}"`);
            const response = await shiki.api[apiEndpoint]({ anime_id: id });
            full_info.push(response);
            await sleep();
        }
        console.log(`All detailed enteries of type "${type}" were recived!`)
        const infoFilePath = `${additional_path}/${this_user_id}-${fileName}-full-${dateUTC}.json`;
        fs.appendFileSync(infoFilePath, JSON.stringify(full_info));
        console.log(`All detailed enteries of type "${type}" were written to file!`)
        console.log(`Filename : "${infoFilePath}"`)
    } catch (err) {
        console.log(err);
    }
}

create_out_dir(additional_path)

async function main() {
    await getUserData(user_id, "anime");
    await getUserData(user_id, "manga");
    await getUserData(user_id, "character");
}

main().catch((err) => {
    console.log(err);
});
