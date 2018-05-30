# noRedirect
Firefox plugin to avoid redirects encoded in urls.

It is made to work with the old firefox versions. The test version I use is 47.0.2. It may work in other versions too.

* To install it in firefox, you must go to about:config in the firefox url bar, and set the parameter xpinstall.signatures.required to false
* For easy deploy, you must create a file named "linktargetfinder@robertnyman.com" in "C:\Users\[USER]\AppData\Roaming\Mozilla\Firefox\Profiles\upvl1yzo.default\extensions" and edit it with the path of this repository locally. By example: "C:\GitHub\Proyectos\Firefox\noRedirect"
* If you want to distribute it you can meake a zip file with all the contents and remane it to a .xpi file

Work based with the following pages:
 - https://blog.mozilla.org/addons/2009/01/28/how-to-develop-a-firefox-extension/
 - https://developer.mozilla.org/en-US/docs/Archive/Add-ons/Code_snippets/Progress_Listeners
 - https://developer.mozilla.org/en-US/docs/Archive/Add-ons/Overlay_Extensions/XUL_School/Intercepting_Page_Loads
