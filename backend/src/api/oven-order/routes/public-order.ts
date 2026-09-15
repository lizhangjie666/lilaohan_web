export default {
  routes: [
    {
      method: 'POST',
      path: '/oven/orders/lookup',
      handler: 'public-order.lookup',
      config: { auth: false },
    },
  ],
};
