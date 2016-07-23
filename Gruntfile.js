module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bump: {
            commit: true,
            commitMessage: 'Release v%VERSION%',
            createTag: true,
            tagName: 'v%VERSION%',
            tagMessage: 'Version %VERSION%',
            push: false,
            pushTo: 'origin master'
        },
        mochaTest: {
            options: {
                
            },
            src: ['test/**/*.spec.js']
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                ignores: ['node_modules']
            },
            all: ['index.js']
        }
    });
    
    grunt.loadNpmTasks('grunt-bump');
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-mocha-test");
    
    grunt.registerTask('test', 'Executes jshint and unit test', ['jshint', 'mochaTest']);
};