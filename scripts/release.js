
var util = require('./util');
var argv = require('minimist')(process.argv.slice(2));

if(argv._ && argv._.length > 0) //look release build
{

    var cmd = "npm version " + argv._[0];

    util.series([

        "npm test",

        ["git checkout master","checked out master branch"],

        ["git checkout -b production","checked out production branch"],

        ["git rebase master", "Rebasing from Master"],

        [cmd,"increasing version number and tagging"],

        "git push --follow-tags",

        ['git checkout master',"checked out master branch.."],

        "git merge --no-ff --no-edit master production",

        "git push",

        ['git branch -D production',"production branch deleted..release Done!!"]

    ],function(err){
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

