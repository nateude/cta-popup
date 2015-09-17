<?php

	// include required files
	echo '<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>';
	echo file_get_contents('cta-popup.htm');
	echo '<style>'.file_get_contents('cta-popup.css').'</style>';
	echo '<script>'.file_get_contents('jquery.cta-popup.min.js').'</script>';

?>