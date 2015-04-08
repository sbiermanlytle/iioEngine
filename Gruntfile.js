module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
	  options: {
		separator: ';'
	  },
      iio: {
  	    src: ['core/src/*.js'],
		dest: 'core/iio.js'
      }
    },
	uglify: {
	  iio: {
	    files: {
		  'core/iio.min.js': ['<%= concat.iio.dest %>']
		}
	  }
	}
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['concat', 'uglify']);
};

