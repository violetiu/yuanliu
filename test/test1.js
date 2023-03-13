const sftpClient = require('ssh2-sftp-client');
const path = require("path");
var localFile = path.join("/Users/taoyongwen", ".prototyping", "build", "aqpg");
const config = {
    host: "www.violetime.com",
    port: "22",
    username: "ubuntu",
    password: "tyw@101905"
};

async function update() {
    const client = new sftpClient('upload-test');
    const src = path.join("/Users/taoyongwen", ".prototyping", "build", "aqpg");
    const dst = '/home/web/root/aqpg';
    try {
        await client.connect(config);
        client.on('upload', info => {
            console.log(`Listener: Uploaded ${info.source}`);
        });
        let rslt = await client.uploadDir(src, dst);
        return rslt;
    } catch (err) {
        console.error(err);
    } finally {
        client.end();
    }
}
update();