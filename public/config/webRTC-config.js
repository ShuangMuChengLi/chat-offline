const ENV = require("../../config/env");
let conf = {
    iceConf:{
        "iceServers": [{ "url": "stun:chat.linchaoqun.com" }]
    }
};
if (ENV === "production") {
    conf.EXTENSION_ID = "fkgidgecgnhockejbpjcjhcofijdhebi";
} else {
    conf.EXTENSION_ID = "ebfmnilnhfcemoldogggfoicjhmjemfn";
}
module.exports = conf;
