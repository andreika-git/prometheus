<?php

/*
	component-settings.php
	(c) andreika, 2017.
*/

// pcb dims in mils
$pcbDims = array(array(984.251, 4921.26), array(4645.67, 984.251));
// image dims in pixels
$imgDims = array(array(-2,6), array(1222, 1298), array(2448, 0), array(1230, 1305));

// csv fields
$fields = array("d"=>"Designator", "f"=>"Footprint", "l"=>"Layer", "r"=>"Rotation", 
				"x"=>"Mid X", "y"=>"Mid Y", "t"=>"Type", "w"=>"Width", "h"=>"Height", 
				"ox"=>"Offset X", "oy"=>"Offset Y", "m"=>"Multilayer", "c"=>"Comment", 
				"s"=>"Supplier 1", "p"=>"Supplier Part Number 1", 
				"i"=>"Description", "k"=>"Remark", "o"=>"More",
				"ds"=>"ComponentLink2URL");

$downloadDigikeyData = true;

?>