

var util = require('./util');
var argv = require('minimist')(process.argv.slice(2));
var ncu = require("npm-check-updates");

var options = {
    // Always specify the path to the package file
    packageFile: 'package.json',
    loglevel:"warn",
    silent:false

};

if(argv.checkProd || argv.checkDev)
{
    if(argv.checkDev)
    {
        options.dev = true;
    }
    else if(argv.checkProd)
    {
        options.prod = true;
    }
    
    ncu.run(options).then(function(upgraded) {});
}
else if(argv.upgradeProd || argv.upgradeDev || argv.upgradeAll)
{
    options.upgrade = true;
    
    if(argv.upgradeProd)
    {
        options.prod = true;
    }
    else if(argv.upgradeDev)
    {
        options.dev = true;
    }

    ncu.run(options).then(function(upgraded) {});
}

