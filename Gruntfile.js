'use strict';

module.exports = function (grunt) {
	 require('jit-grunt')(grunt);
	 var serveStatic = require('serve-static');

	// Configurable paths for the application
	var appConfig = {
		app: require('./bower.json').appPath || 'app',
		dist: 'dist'
	};

	// Define the configuration for all the tasks
	grunt.initConfig({
		// Watches files for changes and runs tasks based on the changed files
	    watch: {
	      bower: {
	        files: ['bower.json'],
	        tasks: ['wiredep']
	      },
	      gruntfile: {
	        files: ['Gruntfile.js']
	      },
	      livereload: {
	        options: {
	          livereload: '<%= connect.options.livereload %>'
	        },
	        files: [
	          	'app/*.html',
	          	'app/components/**/*.*',
	      			'app/scripts/**/*.js',
	          	'app/styles/*.css',
	          	'app/templates/**/*.html',
	          	'app/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
	        ]
	      }
	    },

		// The actual grunt server settings
	    connect: {
	      options: {
	        port: 9000,
	        // Change this to '0.0.0.0' to access the server from outside.
	        hostname: 'localhost',
	        livereload: 35729
	      },
	      livereload: {
	        options: {
	          base: 'app',
	          // This will inject live reload script into the html
	          livereload: 35729, 
	          open: false
	        }
	      }
	    },

	    // Automatically inject Bower components into the app
	    wiredep: {
	      app: {
	        src: ['app/index.html'],
	        ignorePath:  /\.\.\//
	      }
	    }, 

	    clean: {
	      dist: {
	        files: [{
	          dot: true,
	          src: [
	            '.tmp',
	            'dist/{,*/}*',
	            'dist/.git{,*/}*'
	          ]
	        }]
	      },
	      server: '.tmp'
	    },
	});

	grunt.registerTask('serve', [
		'clean:server',
		'wiredep',
		'connect:livereload',
		'watch'
	]);

	grunt.registerTask('build', [
		'wiredep'
	]);

	grunt.registerTask('default', [
		'build'
	]);
}