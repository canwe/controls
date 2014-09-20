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
                dest: 'js/react/dist/xforms.react.js',
                src: [
                    'js/vendors/ecmascript6.polyfills.js',
                    'js/react/compiled/Control.js',
                    'js/react/compiled/*.js'
                ]
            },
            uglifyfiles: [{
                'js/react/dist/xforms.react.min.js': ['js/react/dist/xforms.react.js']
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


        connect: {
            server: {
                options: {
                    port: 3000,
                    base: './server/'
                }
            },
            client: {
                options: {
                    port: 8080,
                    base: './',
                    keepalive: true,
                    open: 'http://localhost:8080/react.html'
                }
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
    grunt.loadNpmTasks('grunt-contrib-connect');

// register at least this one task
    grunt.registerTask('default', [ 'react', 'concat', 'uglify', 'watch' ]);
    grunt.registerTask('servers', [ 'connect' ]);

};
