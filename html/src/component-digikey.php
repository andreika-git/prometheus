<?php

/*
	component-digikey.php
	(c) andreika, 2017.
*/

function getDigikeyData($partNumber)
{
	$digi = "http://www.digikey.com";
	$str = $digi . "/products/en?keywords=" . str_replace(" ", "%20", $partNumber);
	$d = file_get_contents($str);
	//echo $d;die;
	$data = array();
	
	$data["url"] = $str;

	if (preg_match("/record-count-container/", $d))	// this is not a product page, we have multiple results
	{
		if (preg_match("/itemprop=\"productid\"[^<]+<a href=\"([^\"]+)\"/", $d, $ret))
		{
			$str = $digi . $ret[1];
			$d = file_get_contents($str);
		}
	}

	if (preg_match("/itemprop=\"image\" src=\"([^\"]+)\"/", $d, $ret))
		$data["img"] = "http:" . $ret[1];
	if (preg_match("/itemprop=\"url\" href=\"([^\"]+)\"/", $d, $ret))
		$data["vurl"] = $digi . $ret[1];
	if (preg_match("/class=\"lnkDatasheet\" href=\"([^\"]+)\"/", $d, $ret))
		$data["ds"] = $ret[1];
	if (preg_match("/itemprop=\"name\"[^>]*>([^<]+)</", $d, $ret))
		$data["vname"] = $ret[1];
	if (preg_match("/itemprop=\"model\"[^>]*>([^<]+)/", $d, $ret))
		$data["model"] = trim($ret[1]);
	if (preg_match("/itemprop=\"description\"[^>]*>([^<]+)/", $d, $ret))
		$data["desc"] = trim($ret[1]);
	if (preg_match("/itemprop=\"price\"[^>]*>([^<]+)/", $d, $ret))
		$data["price"] = trim($ret[1]);

	return $data;
}



?>