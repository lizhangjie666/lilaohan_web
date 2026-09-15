export default {
  routes: [
    { method: 'GET', path: '/oven/today', handler: 'oven.today', config: { auth: false } },
    { method: 'GET', path: '/oven/batches/:batchNumber', handler: 'oven.batch', config: { auth: false } },
    { method: 'POST', path: '/oven/creations', handler: 'oven.create', config: { auth: false } },
    { method: 'GET', path: '/oven/creations/:documentId', handler: 'oven.creation', config: { auth: false } },
    { method: 'POST', path: '/oven/creations/:documentId/fire', handler: 'oven.fire', config: { auth: false } },
    { method: 'POST', path: '/oven/creations/:documentId/after-image', handler: 'oven.afterImage', config: { auth: false } },
    { method: 'POST', path: '/oven/events', handler: 'oven.event', config: { auth: false } }
  ]
};
