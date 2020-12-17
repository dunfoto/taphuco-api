const axios = require("axios")
const firebaseCloudMessage = async (body, next) => {
    try {
        // AAAA44JGCW0:APA91bFapcAaC5TFvd5DNUx95RjbaX9U38Ffp15sNTcxxYR5lViW_yqkNzohpEhpV2zHK374BBRemPtebueveTvTutVGCdtBCrXMKu2UV8IG7Nlx7AuTVU0wFLIelFVWgsHfmzz-hovZ
        const res = await axios.post("https://fcm.googleapis.com/fcm/send", body, {
            headers: {
                Authorization: `key=AAAA44JGCW0:APA91bFapcAaC5TFvd5DNUx95RjbaX9U38Ffp15sNTcxxYR5lViW_yqkNzohpEhpV2zHK374BBRemPtebueveTvTutVGCdtBCrXMKu2UV8IG7Nlx7AuTVU0wFLIelFVWgsHfmzz-hovZ`,
                "Content-Type": "application/json"
            },
        })
        next(null, res)
    } catch (err) {
        console.log("ERROR", err)
        next(err, null)
    }
}

module.exports = {
    firebaseCloudMessage,
}
