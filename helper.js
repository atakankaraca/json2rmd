var fs = require('fs');
var path = require('path');

//function that wraps content as "R or Python" and creates file to /files/createdfiles/ path
function rmdFileCreator(cells)
{
    filePaths = [];

    for(var i = 0; i < cells.length; i++){  
        var fileContent = cells[i].code;
        var fileLanguage = cells[i].language;
        var filePath = './files/createdfiles/' + cells[i].index + "-" + cells[i].language + ".rmd";

        var wrappedFile = fileWrapper(fileContent, fileLanguage);

        fs.writeFile(filePath, wrappedFile, function (err) {
            if(err){
                return err;
            }
        });
        
        filePaths.push("/api/download/" + path.basename(filePath));
    }

    return filePaths;
}

//
function fileWrapper(fileContent, fileLanguage)
{
    if(fileLanguage === "R" || fileLanguage === "Python")
    {
        return `\`\`\`{${fileLanguage.toString().toLowerCase()}}\n ${fileContent}\n\`\`\``;
    }
    else
    {
        return fileContent;
    }
}

function generateDownloadLinks(filePaths) {    
    var result = "";
    filePaths.forEach(element => {
        result += `<a href="${element}" target="_blank">${path.basename(element)}</a><br/>`;
    });

    return result;
}

function generateRmdFiles(cells) {

    var filePaths = rmdFileCreator(cells);
    var downloadLinksAsHtml = generateDownloadLinks(filePaths);

    return downloadLinksAsHtml;
}

module.exports.generateRmdFiles = generateRmdFiles;