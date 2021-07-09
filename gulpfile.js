const {series, parallel, src, dest} = require("gulp");

const gulp = require("gulp"),
	rename = require("gulp-rename"),
    inject = require("gulp-inject"),
	less = require("gulp-less"),
	autoprefixer = require("gulp-autoprefixer"),
	browserSync = require("browser-sync").create(),
	concat = require('gulp-concat');

gulp.task("html", function () {
	return gulp.src("./src/index.html").pipe(gulp.dest("./dist"))
});
	
gulp.task("less", function () {
	return src("./src/assets/styles/main.less")
		.pipe(less())
		.pipe(
			autoprefixer({
				cascade: false,
			})
		)
	.pipe(dest("./dist"));
});

gulp.task("scripts", function() {
	return src([
		'./src/assets/scripts/store/store.js',
		'./src/assets/scripts/components/node.js',
		'./src/assets/scripts/components/form.js',
		'./src/assets/scripts/components/table.js',
		'./src/assets/scripts/main.js'
	]) 
   		.pipe(concat('main.js')) 
   		.pipe(dest('./dist'));
});

gulp.task("serve", function () {
	browserSync.init({
		server: {
			baseDir: "dist",
		},
	});

	gulp.watch("./src/index.html").on("change", series("html"));
	gulp.watch("./src/assets/styles/**/*.less").on("change", series("less"));
	gulp.watch("./src/assets/scripts/**/*.js").on("change", series("scripts"));
	
	gulp.watch("./dist/index.html").on("change", browserSync.reload);
	gulp.watch("./dist/style.css").on("change", browserSync.reload);
	gulp.watch("./dist/main.js").on("change", browserSync.reload);
});

gulp.task("build", series("html", "less", "scripts"));

gulp.task("default", series(parallel("html", "less", "scripts"), "serve"));