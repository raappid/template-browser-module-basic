Error.stackTraceLimit = Infinity;


var modulesContext = require.context('./test', true, /\.spec\.tsx?$|.test\.tsx?$/);

modulesContext.keys().forEach(modulesContext);
