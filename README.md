# hexo-collaps
[![Downloads](https://img.shields.io/npm/dm/hexo-collaps.svg)](https://www.npmjs.com/package/hexo-collaps) [![npm](https://img.shields.io/npm/v/hexo-collaps.svg)](https://www.npmjs.com/package/hexo-collaps) [![LICENSE](https://img.shields.io/npm/l/hexo-collaps.svg)](LICENSE)

Parse movies and serials in Collaps CDN

## Installation
```
npm install --save hexo-collaps
```

## Usage
Register and get API key [Collaps CDN](https://collaps.org/signup?key=DOonBw2fAg9H):

Edit _config.yml:
```
collaps:
  api_key: API_KEY
  slug_pinycode:  true
  collections:  true
  poster_local: false
```
## Options

# slug_pinycode
Translate path to pinycode \\ for русский пользователей
# collections
In progress
# poster_local
Download posters to local

## Parse
```
hexo collaps cartoon

Other type on hexo help hexo-collaps
```

## License
Copyright (c) 2016, dimonpanik. Licensed under the [MIT license](https://github.com/dimonpanik/hexo-collaps/blob/master/LICENSE).

