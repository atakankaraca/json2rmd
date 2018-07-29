const express = require('express'),
      app = express(),
      fs = require('fs'),
      upload = require('express-fileupload'),
      helper = require('./helper');

const directory = "./files/";

app.use(upload())

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/api/convert2rmd", function(req, res){
    if(req.files)
    {
        var file = req.files.filename, filename = file.name;

        helper.checkDirectory(directory);

        file.mv(directory + filename, function(err){
            if(err)
            {
                console.log(err); 
            }
            else {                
                var json = fs.readFileSync(directory + filename, 'latin1');                                    
                if(json) {
                    try {
                        //Example file which is given not a valid JSON file. Therefore, in type of ObjectId and ISODate fields are replaced as 1.
                        json = json.replace(/ObjectId\(.*?\)/g, "1").replace(/ISODate\(.*?\)/g, "1");
                        parsedJson = JSON.parse(json);
                        var cells = parsedJson.stages[0].cells;

                        var result = helper.generateRmdFiles(cells, function(err){
                            if(err)
                                res.send(err);
                        });

                        res.send(result);
                    } catch(e) {
                        res.status(400, "Bad Request")
                    }
                }
            }
        });

    }
})

app.get('/api/download/:filename', function(req, res){
    var file = __dirname + directory.replace(".", "") + req.params.filename;
    res.download(file);
})

app.listen(3000, () => console.log("Listening on port 3000"));