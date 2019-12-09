'use strict';

const applicationServerPublicKey = 'BIRqPBwOqqTu__0DulUGNLxZoSjNdGMnVK8BIHFLVpeuqnxn1VJowEXexkQZbuyJkrlsk0Aev3rhr_PsotXnw0g';

const pushButton = document.querySelector('#js-push-btn');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
 const padding = '='.repeat((4 - base64String.length % 4) % 4);
 const base64 = (base64String + padding)
   .replace(/\-/g, '+')
   .replace(/_/g, '/');

 const rawData = window.atob(base64);
 const outputArray = new Uint8Array(rawData.length);

 for (let i = 0; i < rawData.length; ++i) {
   outputArray[i] = rawData.charCodeAt(i);
 }
 return outputArray;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
 window.alert('Service Worker and Push is supported');

 navigator.serviceWorker.register('sw.js')
 .then(function(swReg) {
   window.alert('Service Worker is registered', swReg);

   swRegistration = swReg;
   initializeUI();
 })
 .catch(function(error) {
   window.alert('Service Worker Error', error);
 });
} else {
 window.alert('Push messaging is not supported');
 pushButton.textContent = 'Push Not Supported';
}

function initializeUI() {
 pushButton.addEventListener('click', function() {
   pushButton.disabled = true;
   if (isSubscribed) {
     unsubscribeUser();
   } else {
     subscribeUser();
   }
 });

 // Set the initial subscription value
 swRegistration.pushManager.getSubscription()
 .then(function(subscription) {
   isSubscribed = !(subscription === null);

   if (isSubscribed) {
     window.alert('User IS subscribed.');
   } else {
     window.alert('User is NOT subscribed.');
   }

   updateBtn();
 });
}

function updateBtn() {
 if (Notification.permission === 'denied') {
   pushButton.textContent = 'Notificaciones Bloqueadas';
   pushButton.disabled = true;
   updateSubscriptionOnServer(null);
   return;
 }

 if (isSubscribed) {
   // pushButton.style.display = 'none';
   pushButton.textContent = 'Desactivar Notificaciones';
 } else {
   pushButton.textContent = 'Activar Notificaciones';
 }

 pushButton.disabled = false;
}

function subscribeUser() {
 const applicationServerKey = urlB64ToUint8Array('BIRqPBwOqqTu__0DulUGNLxZoSjNdGMnVK8BIHFLVpeuqnxn1VJowEXexkQZbuyJkrlsk0Aev3rhr_PsotXnw0g');
 swRegistration.pushManager.subscribe({
   userVisibleOnly: true,
   applicationServerKey: applicationServerKey
 })
 .then(function(subscription) {
   window.alert('User is subscribed.');
   updateSubscriptionOnServer(subscription);
   isSubscribed = true;
   updateBtn();
 })
 .catch(function(err) {
   window.alert('Failed to subscribe the user: ', err);
   updateBtn();
 });
}

function unsubscribeUser() {
 swRegistration.pushManager.getSubscription()
 .then(function(subscription) {
   if (subscription) {
     return subscription.unsubscribe();
   }
 })
 .catch(function(error) {
   window.alert('Error unsubscribing', error);
 })
 .then(function() {
   updateSubscriptionOnServer(null);

   window.alert('User is unsubscribed.');
   isSubscribed = false;

   updateBtn();
 });
}

function updateSubscriptionOnServer(subscription) {
 if (subscription) {
   window.alert(JSON.stringify(subscription));
   document.getElementById("keys").innerText = JSON.stringify(subscription);

 }
}

let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
   e.preventDefault();
   deferredPrompt = e;
deferredPrompt.prompt();
});

var btnAdd = document.getElementById("btnInstall");

// Installation must be done by a user gesture! Here, the button click
btnAdd.addEventListener('click', (e) => {
    // hide our user interface that shows our A2HS button
    // btnAdd.style.display = 'none';
    // Show the prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice
        .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            window.alert('User accepted the A2HS prompt');
        } else {
            window.alert('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
    });
});
  
