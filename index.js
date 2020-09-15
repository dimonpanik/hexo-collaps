const fs = require('hexo-fs');
const request = require('request');
const util = require('hexo-util');



const ru_path = {
    "films": "Фильмы",
    "serials": "Сериалы",
    "cartoon": "Мультфильмы",
    "cartoon-serials": "Мультсериалы",
    "show": "Шоу",
    "anime": "Аниме",
    "anime-serials": "Аниме-сериалы"
}



hexo.config.collaps = Object.assign({
    api_key: hexo.config.collaps.api_key,
    slug_pinycode: hexo.config.collaps.slug_pinycode || true,
    collections: hexo.config.collaps.collections || true,
    posters_local: hexo.config.collaps.posters_local || true
}, hexo.config.collaps);

const api_url = "https://api1599802835.apicollaps.cc/list?token=" + hexo.config.collaps.api_key + "&type="
const collaps_options = {
    usage: '[type]',
    arguments: [
        { name: 'type', desc: 'Type parse movies {films|serials|cartoon|cartoon-serials|show|anime|anime-serials} ' }
    ]
}
const slugize = util.slugize
const escapeHTML = util.escapeHTML

hexo.extend.console.register("collaps", "Collaps movie parser", collaps_options, function (args) {
    if (ru_path[args._[0]]) {
        var _path = ""

        if (hexo.config.collaps.slug_pinycode == true) {
            for (const [key, value] of Object.entries(ru_path)) {
                if (key == args._[0]) {
                    _path = value
                }
            }
        }
        if (!fs.existsSync("source/_posts/" + _path)) {
            fs.mkdirSync("source/_posts/" + _path)
        }
        fs.emptyDirSync("source/_posts/" + _path)
        parse(args._[0], "source/_posts/" + _path, _path)
    } else {
        console.log("Please typing type")
        console.log(hexo.locals.get('posts'))
    }
});


function parse(type, path, _path) {
    console.log("Starting parse " + type + " into folder  " + path)

    request(api_url + type, function (error, response, body) {
        var full = JSON.parse(body)
        var pages = full['total'] / 100 + 1
        console.log("Found " + full['total'] + " entries")
        for (let page = 1; page < pages; page++) {
            request(api_url + type + "&limit=100&page=" + page, function (error, response, body) {
                var list = JSON.parse(body)
                if (Object.keys(list['results']).length !== 0) {
                    list['results'].forEach(item => {
                        var file = path + "/" + slugize(item['name']) + ".md"
                        item["slug"] = slugize(item['name'])
                        item['title'] = item['name'].replace(/:/g, " ").replace(/"/g, "")
                        item['name'] = item['name'].replace(/:/g, " ").replace(/"/g, "")
                        item['origin_name'] = item['origin_name'].replace(/:/g, " ")
                        item['categories'] = _path
                        if (typeof (item['genre']) !== 'undefined')
                            item['tags'] = item['genre']
                        delete item['genre']
                        delete item['type']

                        fs.appendFileSync(file, "---\n")
                        var data = ""
                        for (const [key, value] of Object.entries(item)) {
                            if (value !== null) {
                                if (typeof (value) !== 'object') {
                                    if (key == "categories") {
                                        data += key + ": " + "\n- " + value + "\n"
                                    } else {
                                        data += key + ": " + value + "\n"
                                    }

                                } else {
                                    if (key == "seasons") {
                                        data += key + ": " + "\n"
                                        value.forEach(season => {
                                            data += "   " + season['season'] + ": " + season['iframe_url'] + "\n"
                                        })

                                    } else {
                                        data += key + ": " + "\n"
                                        for (let val of Object.values(value)) {
                                            data += "- " + val + "\n"
                                        }


                                    }
                                }





                            }
                        }
                        fs.appendFileSync(file, data)
                        fs.appendFileSync(file, "\n---\n")
                        if (hexo.config.collaps.poster_local == true) {
                            request(item['poster']).pipe(fs.createWriteStream('source/images/' + item['id'] + '.png'))
                        }

                    });

                }
            })
        }





    });
}