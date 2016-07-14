
var util = require('./util');
var argv = require('minimist')(process.argv.slice(2));

if(argv._ && argv._.length > 0) //look release build
{

    var cmd = "npm version " + argv._[0];

    util.series(["npm test",
        "npm run build-release",
/*        "git add -A", 
        "git commit -m" + '"'+"releasing new version" +'"',  

 //enable this code only if you want standalone files be checked into github,
 // remember to also update .gitignore to stop ignoring standalone folder 
 //remember you can also access the standalone files from npm, "https://npmcdn.com/<package-name>/standalone/<package-name>.js"  
           */
        cmd,
        "git push","git push --tags"],function(err){
        if(err)
        {
            console.log(err);
            process.exit(1);
        }

        process.exit(0);
    });

}
else
{
    console.log("\n Cannot Recognize the type of release. Please see instructions below");
    console.log('\n Options:\n\n raapid-release [release-type]' +
        '      --- Give type of release:  major | minor | patch | premajor | preminor | prepatch | prerelease\n'
    );

    process.exit(1);
}

