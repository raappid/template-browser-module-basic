

var util = require('./util');
var argv = require('minimist')(process.argv.slice(2));
var cpy = require("cpy");


if(argv._ && argv._.length > 0) //look release build
{
    var subCommand = argv._[0];
    if(subCommand.toLowerCase() === "release")
    {
        build(true);
    }

}
else //do dev build
{
    build();
}

function build(isRelease){

    var cmd = "tsc";

    if(isRelease)
        cmd = cmd + " --declaration";
    else
        cmd = cmd + " --sourceMap";

    util.series(["npm run clean",cmd], function (err) {

        if(err)
        {
            console.log(err);
            process.exit(1);
        }
        else
        {
            if(isRelease)
            {
                cpy(["**/*.js","**/*.d.ts"],"../dist",{cwd:process.cwd()+"/src",parents: true, nodir: true}).then(function(){

                    process.exit(0);

                },function(err){

                    console.log(err);
                    process.exit(1);
                })
            }

        }
    });

}

