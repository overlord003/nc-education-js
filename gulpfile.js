const {series, parallel, src, dest} = require("gulp");

const gulp = require("gulp"),
	rename = require("gulp-rename"),
    inject = require("gulp-inject"),
	less = require("gulp-less"),
	autoprefixer = require("gulp-autoprefixer"),
	browserSync = require("browser-sync").create(),
	concat = require('gulp-concat');

gulp.task("html", function () {
	return gulp.src("./app/index.html").pipe(gulp.dest("./dist"))
});
	
gulp.task("less", function () {
	return src("./app/assets/styles/main.less")
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
		'./app/src/store/store.js',
		'./app/src/components/node.js',
		'./app/src/components/button.js',
		'./app/src/components/userform.js',
		'./app/src/components/selectionform.js',
		'./app/src/components/tablerow.js',
		'./app/src/components/table.js',
		'./app/src/main.js'
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

	gulp.watch("./app/index.html").on("change", series("html"));
	gulp.watch("./app/assets/styles/**/*.less").on("change", series("less"));
	gulp.watch("./app/src/**/*.js").on("change", series("scripts"));
	
	gulp.watch("./dist/index.html").on("change", browserSync.reload);
	gulp.watch("./dist/style.css").on("change", browserSync.reload);
	gulp.watch("./dist/main.js").on("change", browserSync.reload);
});

gulp.task("build", series("html", "less", "scripts"));

gulp.task("default", series(parallel("html", "less", "scripts"), "serve"));