var fs = require('fs')

function fileSize () {
    var stats = fs.statSync("user.txt")
    var fileSizeInBytes = stats.size;
    // Convert the file size to megabytes (optional)
    var fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
    return fileSizeInMegabytes
}

function deleteKey (key) {
    fs.readFile('user.txt', (err, data) => {
        if (err)
            throw err;
        var json = JSON.parse(data);
        if (json[key] == undefined)
            throw "Key Does Not Exist!"
        else {
            delete json[key]
            fs.writeFileSync('user.txt', JSON.stringify(json))
        }

    })
}

function create (key, value, path, ttl) {
    // Converting ttl to mili seconds
    if (ttl != undefined)
        ttl = ttl * 1000;
    console.log(key + " " + path + " " + ttl)
    if (key.lenght > 32)
        console.log("Key length should be less than or equal to 32")

    if (path == undefined)
        path = "D:\\files\\"

    //Checking if the value is a valid json
    try {
        var jsonValue = JSON.parse(value);
    } catch {
        console.log("Invalid Json Value!")
    }

    // Checking the json object size in kB
    const size = new TextEncoder().encode(JSON.stringify(jsonValue)).length
    const kiloBytes = size / 1024;
    if (kiloBytes > 16)
        throw "Value Size is more than 16 KB"

    var data = {
        [key]: jsonValue
    };
    try {
        // console.log(path + 'user.txt')
        //Checking if the file already exists
        // fs.access('/Users/ankitsaini/Downloads/user.txt', fs.F_OK, err => {
            //     console.log('Inside')
            //     //If the file does not exist already
            if (!fs.existsSync(path+'user.txt')) {
                console.log("not")
                fs.writeFileSync(path + 'user.txt', JSON.stringify(data), err => {
                    if (err)
                        console.log(err)

                    console.log("Data Saved!")
                });

                //Setting time-out if given
                if (ttl != undefined)
                    setTimeout(function () { deleteKey(key) }, ttl);
            }
            //If file already exists
            else {

                // Checking file size
                if (fileSize() > 1024)
                    throw "File Size is greater than 1 GB"

                console.log('yes')
                var dat = fs.readFileSync('user.txt', 'utf-8')

                var json = []
                json = JSON.parse(dat)
                if (json[key] != undefined) {
                    throw 'Key Aready Exists!'
                }

                //Adding new key-value pair to the existing file
                json[key] = JSON.parse(value)

                // Writing back the changes to the file
                fs.writeFileSync(path + 'user.txt', JSON.stringify(json))
                //Setting time-out if given
                if (ttl != undefined)
                    setTimeout(function () { deleteKey(key) }, ttl);

            }

        // })
    } catch (err) {
        console.log(err)
    }
}

function read (key) {
    var data = fs.readFileSync('user.txt', 'utf-8');
    data = JSON.parse(data)
    if (data[key] == undefined)
        return "Key Does not Exist!"
    else
        return data[key];
}



create('abcd','{"id":5,"name":"Harsh1","age":22}','./')
// deleteKey('abc')
console.log(read('abcd'))

module.exports = { deleteKey, create, read }


