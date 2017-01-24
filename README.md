## **Update 04/11/2016**
*  Created an area at the top of the gulpfile for customisation
    *  Paths and file locations are configurable
    *  Notifications can easily be enabled or disabled
    *  The clean and browser sync tasks have been moved up here as well
*  Removed 2 packages and the task used for file extension renaming
*  Browser sync task now runs independently (Should fix the TCP port issue some of us were getting)
*  General code refactoring and linting

# Gulp workflow set up and usage guide
This guide will explain how to set up and install the task runner/builder Gulp.

## Initial set-up

1.  Download and install the latest version of Node. Make sure to download the 64bit version, if you're running a 64 bit OS. If given the option to install for all users or to your own profile only, choose the latter.

1. Now you need Node Package Manager. Node comes with NPM installed, but NPM is updated more frequently than Node, so run the following command to make sure it’s up to date:  
`$ npm install npm -g`  

1.  The git:// protocol is blocked on our networked. If you ever need to install bower, or any other application that uses this as the default installation protocol, then you need to run the following command:  
`$ git config --global url."https://".insteadOf git://`  

1.  Due to the complex folder hierarchy of the Node packages, some of the file paths exceed 4096 characters. 4096 characters is the limit that git imposes. To get around this, run the following command:  
`$ git config --system core.longpaths true`

1. There is a package that can lint your SCSS. You must install this dependency, or it'll error when you try and run `npm install`. To install the dependency, run this command:
`$ gem install scss_lint scss_lint_reporter_checkstyle`

1. If you're using Sublime Text as your IDE, then adding the following line to your user preferences file will prevent the @import error that sometimes crops up when compiling your stylesheet:
`"atomic_save": true,`

1.  Now install gulp globally using the following command:  
`$ npm install -g gulp`
  +  `-g` Installs packages globally i.e. to your Node installation directory
  +  `--save-dev` installs packages to your working directory, this is preferable, as it means all the files are added to our git repository. This template includes all packages you should need, you'll only need to use this command if you decide to add extra packages.

## Creating a new site

1.  Open a Git bash terminal in the root directory of your newly created site, and clone this repository using the following command:  
 `$ git clone https://gitlab.home-trial.com/infrastructure/lukestrap.git .`

1. Associate this folder with your repository by first deleting the **.git** folder, and then by entering the follow commands:
  1. git init
  1. git add --all
  1. git commit -m 'first commit'
  1. git remote add origin https://git.homeagency.co.uk/luke/test.git (Use your repository)
  1. git push origin master

1. Now install all the node packages, this can be done by typing `npm install` - This uses the package.json file to determine which packages to download.

## Using Gulp

If you'd like more information on what each of the packages inside gulpfile.js do, simply Google the name of the package, the first result should be the NPM page associated with it.

* **Running Gulp** - The only task you actually need to use this workflow, is the default one. To run the default task, Open terminal and type `$ gulp`
  + The default tasks runs a set of individual tasks, It is the watch task that will monitor your files for changes
  + By default, browserSync monitors html files in the current directory for changes, this is defined in the "browser-sync" task inside gulpfile.js

* **File Formats** -  You must update the `fileFormat` variable if you want gulp to work with any file type other than HTML. If you're working with multiple file types i.e. HTML and PHP, then the non-default file type will operate outside of the Gulp workflow
* **Editing files** -  The *'src/components' folder is where you need to be editing your html/php/etc. files. These are saved in the root level of your project (by default)
* **Editing scripts** - Custom scripts go inside the 'scripts/user' folder. Scripts compile in alphabetical order, those inside folders are last in the queue


## Tasks
These are default tasks required by Gulp. Below is a a brief description of tasks that you may need to reconfigure on a per project basis
 * `$ browser-sync` - This works as it is for static HTML builds, if you're using a server then
  + Comment out the `server` line
  + Uncomment the `proxy` line
  + Update the 'proxy' property with the correct URL
 * `$ sass` - The only thing you should need to edit in this task is the specificity of supported browsers for the Autoprefixer plugin. You can find a full list of options here - https://github.com/postcss/autoprefixer#options Or if you want to target based on usage data - https://github.com/ai/browserslist#custom-usage-data
 * `images` - This is set to 7 by default. If required, you can edit the level of optimisation, say for instance, if there's obvious image quality degradation at the default setting

## Additional tasks
These are some additional tasks. These are not required for the *default* Gulp task to properly function
 * `$ gulp qs` - Quick start task that doesn't compile anything, just watches
 * `$ gulp clean` - Empty's everything in the distribution folders and the HTML files in the root
 * `$ gulp scss-lint` - Checks SCSS for errors and warns of any bad practices - This requires ruby and SCSS Lint. Run `$ gem install scss_lint scss_lint_reporter_checkstyle` to install the required files. Lint reports are saved in the 'reports' folder
 * `$ gulp  replace` - Renames file extensions. Rename the `oldExt` and `newExt` variable values to use

## Optional configuration
* **Notifications** - By default, notifications only show when there's an error. If you'd like to completely disable notifications, then you can do so by uncommenting the first line in gulpfile.js
* **.jshintignore** - By default, this ignores *.js files in the root of the 'scripts' folder, this is to prevent endless Lint warnings from vendor plugins
* **.jshintsrc** - You may want to edit the `globals`property if you're using vendor plugins. Here you can add custom global variables, that aren't variables of your own, more specifically, variables that exist within 3rd party scripts and not your main.js file. Similarly, if you're splitting your scripts in to 'modules', then you may want to update this to prevent warnings from flooding through every time you save your JS

## Cross device browser synchronisation
This isn't required locally, but due to nearly all our ports being blocked, if you'd like the cross-browser functionality remotely, you'll need to use a tool called **ngrok**. Currently this only works with static HTML files. WordPress builds may be possible too, but it's probably more hassle than it's worth to attempt to get it working, considering all the cross device testing is usually done during the front end phase of a build.

 1. Register on https://ngrok.com/ 
 1. Download ngrok and add the executable to your working directory
 1. Run the following command with your auth token, which you can found on the dashboard once logged in to the website - `$ ngrok authtoken .6ytrV1TnA2t6VrQ1mQeRA_De9RRRSFun6soQtpDUnF`
 1. Run the command `$ ngrok http -region=eu 3000` inside your working directory. In this case, 3000 is the port number assigned by browserSync.
 1. Use the web address provided within the terminal window to access your build anywhere you like

## Updating packages
Please refer to this: https://www.npmjs.com/package/npm-check-updates