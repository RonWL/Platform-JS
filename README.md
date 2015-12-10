# Platform-JS
Ad Tool Streamlining the Process to Digital Ad Creation

Ad Template including Platform scripts dispatch / removal

In the main index file, there are the following lines:
	<script>
		$(document).dispatchPlatform({
			$platform:"DC"
		});
	</script>
	
This is essentially the most important asset.  The options. for now consist of "DC"(DoubleClick), and "SK"(Sizmek).
As other platforms are used and tested, there will be more additions.

Also note, that within the "scripts.js" file, the only function to begin any animation is that of the "init_animation", since it is 
called from within the "platform.js" file.

The "script.js" file's main purpose, is to handle animation, and/or any CUSTOM clicks, as the the clicktags are handled within the
"platform.js" file as well.

Rich Media Support Coming Soon...
