const {i18n} = require('./next-i18next.config');

module.exports = {
  i18n,
  async rewrites() {
    return [
        {
            source: '/pass/note',
            destination: '/pass'
        }
    ];
  }
};