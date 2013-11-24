module.exports = function(grunt) {
	grunt.initConfig({
		less: {
			development: {
		    	options: {
		    		paths: ['assets/less']
		    	},
		    	files: {
		    		'assets/css/main.css': 'assets/less/main.less'
		    	}
			}
		},
        uglify: {
            development: {
                files: {
                    'assets/js/blackjack.min.js': ['assets/js/blackjack.js']
                }
            }
        },
		watch: {
            less: {
                files: ['assets/less/*.less'],
                tasks: ['less']
            },
            js: {
                files: ['assets/js/blackjack.js'],
                tasks: ['uglify']
            }
        }
	});
    
    grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['less', 'uglify']);
};

