// local-web-server configuration file
module.exports = {
    port: 80,
    directory: '.',
    hostname: 'localhost',
    cors: {
        origin: '*',
        methods: 'GET'
    },
    compress: true,
    mime: {
        // This does not work. Workaround: rename .ttf to .ttf.css and use format() in css font import
    },

}