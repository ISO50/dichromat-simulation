module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-contrib-compress');
	
	grunt.initConfig({
    	pkg: grunt.file.readJSON('package.json'),
		compress: {
			main: {
			    options: {
			    	mode: 'zip',
		    		archive: 'build/colorblindness-simulator-<%= pkg.version %>.xpi'
		    	},
		    	files: [
		      		{expand: true,
		      		cwd: 'src/',
		      		src: ['**'],
		      		dest: '/'},
		    	]
		  	}
		}
	});

	grunt.registerTask('default', ['compress']);
}