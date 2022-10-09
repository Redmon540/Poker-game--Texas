export default {
  url: process.env.NODE_ENV !== 'production' ?
    process.env.NODE_ENV === 'develop' ? 'http://35.77.85.99:3004'
      : 'http://127.0.0.1:3004' : 'http://www.jojgame.com:3004',
  res: location.href.split('#')[0] + '#',
};
