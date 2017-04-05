/**
 * Created by ncu on 3/27/2017.
 */

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        typescript:{
            lib: {
                dest: 'build/core/lib.js',
                src: ['lib/pluck/**/*.ts', 'ts/**/*.ts'],
                options: {
                    target: 'ES5',
                    comments: true,
                    sourceMap: true,
                    references: ["library/definitions/**/*.d.ts"]
                }
            }
        },
        uglify: {
            lib:{
                options: {
                   sourceMap: true,
                   sourceMapIn: 'build/core/lib.js.map',
                },
                files:{
                    "build/core/lib.min.js":["build/core/lib.js"]
                }

            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-typescript');
    // Default task(s).
    grunt.registerTask('default', ['typescript:lib','uglify']);

};