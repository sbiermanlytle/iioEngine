srcPath = 'src';

// Files will be concatenated in the following order
coreSrc = [
  'core/license',
  'core/core.js',
  'libs/jsextensions.js',
  'libs/is.js',
  'libs/convert.js',
  'libs/key.js',
  'libs/canvas.js',
  'libs/collision.js',
  'core/Interface.js',
  'data/Vector.js',
  'data/Color.js',
  'data/Gradient.js',
  'core/Drawable.js',
  'data/SpriteMap.js',
  'shapes/Shape.js',
  'shapes/Ellipse.js',
  'shapes/Polygon.js',
  'shapes/Line.js',
  'shapes/Rectangle.js',
  'shapes/Quad.js',
  'shapes/Text.js',
  'shapes/Grid.js',
  'core/App.js',
  'data/Sound.js',
  'core/Loader.js',
  'extras/box2dweb_iio.js'
].map(function(filename) { return srcPath + '/' + filename });

module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      options: {
        separator: '\n'
      },
      iio: {
        src: coreSrc,
        dest: 'build/iio.js',
        nonull: true
      },
      debug: {
        src: ['<%= concat.iio.dest %>', 'src/extras/*.js'],
        dest: 'build/iio.debug.js',
        nonull: true
      }
    },
    uglify: {
      iio: {
        options: {
          preserveComments: require('uglify-save-license')
        },
        files: {
          'build/iio.min.js': ['<%= concat.iio.dest %>']
        }
      },
      /*debug: {
        files: {
          'build/iio_debug.min.js': ['<%= concat.debug.dest %>']
        }
      }*/
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat:iio', 'uglify:iio']);
  grunt.registerTask('debug', ['concat', 'uglify']);
};

