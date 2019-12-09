app.post('/api/subscription', (req, res) => {
 console.log(req.body);

 sendPush(req, res).
 catch((err) => {
   console.error(err);
   window.alert(err.message);
 });

 res.send("Got the subscription");
});

function sendPush(req, res) {
 const subscriptionString = req.body.sub;
 const dataString = req.body.text;

 if (subscriptionString.length === 0 ) {
   return Promise.reject(new Error('Please provide a push subscription.'));
 }

 let subscriptionObject = null;
 try {
   subscriptionObject = JSON.parse(subscriptionString);
 } catch (err) {
   return Promise.reject(new Error('Unable to parse subscription as JSON'));
 }

 if (!subscriptionObject.endpoint) {
   return Promise.reject(new Error('The subscription MUST have an endpoint'));
 }

 if (subscriptionObject.endpoint.indexOf('…') !== -1) {
   return Promise.reject(new Error('The subscription endpoint appears to be ' +
     'truncated (It has \'...\' in it).\n\nDid you copy it from the console ' +
     'in Chrome?')
   );
 }

 // const publicElement = document.querySelector('.js-public-key');
 // const privateElement = document.querySelector('.js-private-key');

 return fetch('https://mipa-push-sever.herokuapp.com/api/send-push-msg', {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify({
     subscription: subscriptionObject,
     data: dataString,
     applicationKeys: {
       public: "BDp56NVEDirj4VII7cw1GOl66mgfYq3j3h2VAFcsYWzI4VgoIcM_w8sfCm_UipfuS5mAvQpTcE7BR0TXN3UVAfM",
       private: "9-XA3WkC7sDxymfbSkytsLE4txXynt2oCf31w6FHZcU",
     }
   })
 })
 .then((response) => {
   if (response.status !== 200) {
     return response.text()
     .then((responseText) => {
       throw new Error(responseText);
     });
   }
 });
}
