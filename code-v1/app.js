const Shikimori = require("node-shikimori-api");
const fs = require('fs');

const shiki = new Shikimori();
const user_id = 937225

function get_user_anime(this_user_id){
    shiki.api.users({
        user_id: this_user_id,
        section: "anime_rates",
        limit: 1000
      }).then((res) => {
        // console.log("anime_rates")
        // console.log(res)
        fs.writeFileSync(`${user_id}-anime_rates-full-raw-${+new Date}.json`,JSON.stringify(res))
      }).catch((err) => {
        console.log(err)
      });
}
function get_user_manga(this_user_id){
    shiki.api.users({
        user_id: this_user_id,
        section: "manga_rates",
        limit: 1000
      }).then((res) => {
        // console.log("manga_rates")
        // console.log(res)
        fs.writeFileSync(`${user_id}-manga_rates-full-raw-${+new Date}.json`,JSON.stringify(res))
      }).catch((err) => {
        console.log(err)
      });
}
function get_user_favorite(this_user_id){
    shiki.api.users({
        user_id: this_user_id,
        section: "favourites"
      }).then((res) => {
        // console.log("favourites")
        // console.log(res)
        fs.writeFileSync(`${user_id}-favourites-full-raw-${+new Date}.json`,JSON.stringify(res))
      }).catch((err) => {
        console.log(err)
      });
}

for (var ij of [get_user_anime, get_user_manga, get_user_favorite]){
    ij(user_id)
}