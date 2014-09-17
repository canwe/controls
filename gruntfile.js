module.exports = function (grunt) {
    grunt.initConfig({

        react:{

            dynamic_mappings: {
                files: [
                    {
                        expand: true,
                        cwd: 'js/react/src/',
                        src: ['**/*.js'],
                        dest: 'js/react/compiled',
                        ext: '.js'
                    }
                ]
            }
        },

        concat: {
            app: {
                dest: 'js/react/dist/reactapp.js',
                src: [
                    'js/react/compiled/Control.js',
                    'js/react/compiled/*.js'
                ]
            }
        },

        uglify: {
            development: {
                files:[{
                    'js/react/dist/reactapp.min.js': ['js/react/dist/reactapp.js']
                }]
            },
            options:{
                mangled: true,
                sourceMap: true,
                sourceMapName: 'js/react/dist/reactmap.min.map'
            }

        },

        watch: {
            app: {
                files: [ './js/react/src/*.js'  ],
                tasks: [ 'react', 'concat', 'uglify']
            }
        }
    });
// load plugins
    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

// register at least this one task
grunt.registerTask('default', [ 'react', 'concat', 'uglify', 'watch'  ]);



};
