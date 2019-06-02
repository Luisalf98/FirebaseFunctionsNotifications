/* eslint-disable promise/no-nesting */
const functions = require('firebase-functions');
var admin = require("firebase-admin");
var cors = require('cors')({ origin: true });
admin.initializeApp();
/*var serviceAccount = require("./fir-movil-224dc-firebase-adminsdk-rctdv-813e02fc73.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-movil-224dc.firebaseio.com"
});*/


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
const GROUP_NAME = "MOBILE_SP_IMAGES_TEST";

const request = require('request');
exports.createGroup = functions.https.onRequest((req, res) => {

    var groupBody = null;
    request.get({
        url: `https://fcm.googleapis.com/fcm/notification?notification_key_name=${GROUP_NAME}`,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=AAAADG4gwhA:APA91bHoVA5HjjJlN8xQpWA0hUHWm5QrFqJliIB1gRU9F__lrpkG2YmNFKTb_MxpejbX7o7bWDzr8sfCbFfsUTDL4giSvCF1klneJRLFLjomJUaJsRCTAZMPAeO3nxOy-9K7yOkAKUPG',
            'project_id': '53387248144'
        },
    }, (error, response, body) => {
        groupBody = JSON.parse(body);
        console.log(groupBody.error + " <-> " + groupBody.notification_key);

        if (groupBody.notification_key === undefined) {
            request.post({
                url: 'https://fcm.googleapis.com/fcm/notification',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'key=AAAADG4gwhA:APA91bHoVA5HjjJlN8xQpWA0hUHWm5QrFqJliIB1gRU9F__lrpkG2YmNFKTb_MxpejbX7o7bWDzr8sfCbFfsUTDL4giSvCF1klneJRLFLjomJUaJsRCTAZMPAeO3nxOy-9K7yOkAKUPG',
                    'project_id': '53387248144'
                },
                json: {
                    "operation": "create",
                    "notification_key_name": GROUP_NAME,
                    "registration_ids": [req.body.user_key]
                }
            }, (error, response, body) => {
                console.log("create ");
                if (!error && response.statusCode === 200) {
                    console.log(body);
                    //admin.database().ref('devices-groups').push(body);
                } else {
                    console.log("error");
                    console.log(body);
                }
                res.send({ "event": "create", "response": response });

            });
        } else {
            request.post({
                url: 'https://fcm.googleapis.com/fcm/notification',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'key=AAAADG4gwhA:APA91bHoVA5HjjJlN8xQpWA0hUHWm5QrFqJliIB1gRU9F__lrpkG2YmNFKTb_MxpejbX7o7bWDzr8sfCbFfsUTDL4giSvCF1klneJRLFLjomJUaJsRCTAZMPAeO3nxOy-9K7yOkAKUPG',
                    'project_id': '53387248144'
                },
                json: {
                    "operation": "add",
                    "notification_key_name": GROUP_NAME,
                    "notification_key": groupBody.notification_key,
                    "registration_ids": [req.body.user_key]
                }
            }, (error, response, body) => {
                console.log("add ");
                if (!error && response.statusCode === 200) {
                    console.log(body);
                    //admin.database().ref('devices-groups').push(body);
                } else {
                    console.log("error");
                    console.log(body);
                }
                res.send({ "event": "add", "response": response });
            });
        }



    });

    /*admin.messaging().sendToDeviceGroup(
        "APA91bGPE8RiK9DlpC4fPg_ZfKLE-LkcUqAWI-dY6uSWYwmjxNHTzkx0DcSjy-S9eNi-j-PbaydsZ3883dLWOfVIjEDw6Ia5eceMsFhfKLgeoJFvBY4mpFiVaTJoqcGk59vj6otoAsBi",
        {
            data: {
                payload: "Hello world Lucho!"
            }
        });

        res.send("Mandó el mensaje");*/

});

exports.newFileUpload = functions.storage.object('/images/{img}').onFinalize((omd, ec) => {
    return admin.storage().bucket().file(omd.name).makePublic().then(() => {

        var groupBody = undefined;
        return request.get({
            url: `https://fcm.googleapis.com/fcm/notification?notification_key_name=${GROUP_NAME}`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=AAAADG4gwhA:APA91bHoVA5HjjJlN8xQpWA0hUHWm5QrFqJliIB1gRU9F__lrpkG2YmNFKTb_MxpejbX7o7bWDzr8sfCbFfsUTDL4giSvCF1klneJRLFLjomJUaJsRCTAZMPAeO3nxOy-9K7yOkAKUPG',
                'project_id': '53387248144'
            },
        }, (error, response, body) => {
            groupBody = JSON.parse(body);
            if (groupBody.notification_key !== undefined) {
                return request.post({
                    url: 'https://fcm.googleapis.com/fcm/send',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'key=AAAADG4gwhA:APA91bHoVA5HjjJlN8xQpWA0hUHWm5QrFqJliIB1gRU9F__lrpkG2YmNFKTb_MxpejbX7o7bWDzr8sfCbFfsUTDL4giSvCF1klneJRLFLjomJUaJsRCTAZMPAeO3nxOy-9K7yOkAKUPG',
                        'project_id': '53387248144'
                    },
                    json: {
                        "notification_key_name": GROUP_NAME,
                        "to": groupBody.notification_key,
                        "data": {
                            "new_image_url": omd.mediaLink
                        }
                    }
                }, (error, response, body) => {
                    console.log("message ");
                    if (!error && response.statusCode === 200) {
                        console.log(body);
                        //admin.database().ref('devices-groups').push(body);
                    } else {
                        console.log("error");
                        console.log(body);
                    }
                    console.log({ "event": "message", "response": response });
                });
            } else {
                return null;
            }

        });
    });
});

exports.images = functions.https.onRequest((req, res) => {
    return cors(req, res, () => {
        var images = [];
        admin.storage().bucket().getFiles((e, files) => {
            if (e) {
                console.log("error", e);
                res.send({ error: e });
            } else {
                console.log("success: ", files);
                for (var i = 0; i < files.length; i++) {
                    images.push(files[i]["metadata"]["mediaLink"]);
                }
                res.send({ imagesUrls: images });
            }
        });
    });

    /*admin.database().ref().on('child_added', (snap) => {
        var imgs = snap.val();
        console.log(imgs);
        for (var key in imgs) {
            images.push(imgs[key]);
        }
        res.send({imagesUrls: images});
    });*/
});

