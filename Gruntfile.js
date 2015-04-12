srcPath = 'src/core';
coreSrc = [
  'core.js',
  'libs.js',
  'V.js',
  'Color.js',
  'Obj.js',
  'App.js',
  'SpriteMap.js',
  'Drawable.js',
  'Line.js',
  'Polygon.js',
  'Rectangle.js',
  'Square.js',
  'Grid.js',
  'Ellipse.js',
  'Text.js',
].map(function(filename) { return srcPath + '/' + filename });

module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      options: {
        separator: ';\n'
      },
      iio: {
        src: coreSrc,
        dest: 'build/iio.js',
        nonull: true
      },
      debug: {
        src: ['<%= concat.iio.dest %>', 'src/extras/*.js'],
        dest: 'build/iio_debug.js',
        nonull: true
      }
    },
    uglify: {
      iio: {
        files: {
          'build/iio.min.js': ['<%= concat.iio.dest %>']
        }
      },
      debug: {
        files: {
          'build/iio_debug.min.js': ['<%= concat.debug.dest %>']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['concat:iio', 'uglify:iio']);
  grunt.registerTask('debug', ['concat', 'uglify']);
};

