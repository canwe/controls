mo  module.exports = function(grunt) {
    grunt.initConfig({
      jsx: {
        client: {
	  src: 'js/react/src/*.js',
	  output_rule: {
	    regexp: js/react/dist\/(.*).jsx/,
	    replace: 'tmp\/$1.js',
	  }
	  executable: 'web',
	  minify: true
        }
      }
    });
// load plugins
grunt.loadNpmTasks('grunt-jsx');
//grunt.loadNpmTasks('grunt-contrib-watch');
//grunt.loadNpmTasks('grunt-contrib-uglify');

// register at least this one task
grunt.registerTask('default');



};
