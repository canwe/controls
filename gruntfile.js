module.exports = function (grunt) {
    grunt.initConfig({

        options: {
            reactfiles: [
                {
                    expand: true,
                    cwd: 'js/react/src/',
                    src: ['**/*.js'],
                    dest: 'js/react/compiled',
                    ext: '.js'
                }
            ],
            concatfiles:  {
                dest: 'js/react/dist/reactapp.js',
                src: [
                    'js/react/compiled/Control.js',
                    'js/react/compiled/*.js'
                ]
            },
            uglifyfiles: [{
                'js/react/dist/reactapp.min.js': ['js/react/dist/reactapp.js']
            }]
        },
        react: {
            dynamic_mappings: {
                files: '<%= options.reactfiles %>'
            }
        },
        concat: {
            app: '<%= options.concatfiles %>'
        },

        uglify: {
            development: {
                files: '<%= options.uglifyfiles%>'
            },
            options: {
                mangled: true,
                sourceMap: true
            }
        },

        watch: {
            app: {
                files: [ './js/react/src/*.js'  ],
                tasks: [ 'react', 'concat', 'uglify'],

                options: {
                    livereload: true
                }
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
