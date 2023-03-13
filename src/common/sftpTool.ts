const sftpClient = require('ssh2-sftp-client');

/**
 *  config={
        host:"",
        port:"22",
        username:"",
        password:""
    };
 * @param localFile 
 * @param remoteFile 
 * @param config 
 */
export async function sftpUploadDir(localFile: string, remoteFile: string, config: any, callBack: (error?: any) => void) {
    const client = new sftpClient('upload-test');
    try {

        await client.connect(config);
        client.on('upload', (info: any) => {
            console.log(`Listener: Uploaded ${info.source}`);
            callBack(`Listener: Uploaded ${info.source}`);
        });
        let rslt = await client.uploadDir(localFile, remoteFile);
        callBack("上传成功");
        return rslt;
    } catch (err) {
        console.error(err);
        callBack("上传失败");
        callBack(err);
    } finally {
        client.end();
      
    }
}