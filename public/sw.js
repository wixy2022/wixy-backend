self.addEventListener('message', async (event) => {
    console.log('Got message in the service worker');
});

self.addEventListener('push',(ev)=>{
    const data = ev.data?.json()
      console.log('Push recieved...')
      console.log(data.title,'data')
  const options = {
    body : data.body,
    icon: 'favicon.jpg',
    requireInteraction: true,
    onclick:console.log,
  }
      self.registration.showNotification('data.title',options )
  })

  self.addEventListener('notificationclick', function(event) {
    let url = 'https://wixy-2022.herokuapp.com/#/';
    event.notification.close(); // Android needs explicit close.
    event.waitUntil(
        self?.clients.matchAll({type: 'window'}).then( windowClients => {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (self?.clients.openWindow) {
                return self?.clients.openWindow(url);
            }
        })
    );
});
