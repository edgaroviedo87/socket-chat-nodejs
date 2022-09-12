const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (files, validExtensions = ['png', 'jpg', 'jpeg', 'gif'], folder = '') => {

    return new Promise((resolve, reject) => {

        const { file } = files;
        const splitNameFile = file.name.split('.');
        const extension = splitNameFile[splitNameFile.length - 1];

        // Validate extensions
        if (!validExtensions.includes(extension)) {
            reject(`La extensión ${extension} no es permitida. ${validExtensions}`);
        }

        const tempName = uuidv4() + '.' + extension;
        uploadPath = path.join(__dirname, '../uploads/', folder, tempName);

        file.mv(uploadPath, (err) => {
            if (err) {
                reject(err);
            }

            resolve(tempName);
        });
    });
}

module.exports = {
    subirArchivo
}