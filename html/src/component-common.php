<?php

/*
	component-common.php
	(c) andreika, 2017.
*/

// convert 'mil' coords to pixel coords
function convertCoords($coord, $side)
{
	global $pcbDims, $imgDims;

	// the bottom layer is on the right
	$offs = $side * 2;

	if (count($coord) == 1)	// this is size, not coords
	{
		$i = 0;
		$coord[$i] = ($coord[$i]) / ($pcbDims[1][$i] - $pcbDims[0][$i]);
		$coord[$i] = $coord[$i] * ($imgDims[1][$i] - $imgDims[0][$i]);
		$coord[$i] = round($coord[$i]);
		return $coord;
	}

	for ($i = 0; $i < 2; $i++)
	{
		if (!isset($coord[$i]))
			continue;
		$coord[$i] = ($coord[$i] - $pcbDims[0][$i]) / ($pcbDims[1][$i] - $pcbDims[0][$i]);
		$coord[$i] = $coord[$i] * ($imgDims[1+$offs][$i] - $imgDims[0+$offs][$i]) + $imgDims[0+$offs][$i];
		$coord[$i] = round($coord[$i]);
	}
	return $coord;
}

// process values
function readField($type, $d)
{
	if ($type == "x" || $type == "y" || $type == "w" || $type == "h")
	{
		if (preg_match("/([0-9\.]+)mil/", $d, $ret))
		{
			$d = floatval($ret[1]);
		} else	
		{
			// convert mm to mils :-(
			$d = floatval($d) * 39.37007874;
		}
	}
	if ($type == "l")
	{
		// bottom layer - used as offset
		$d = ($d == "B") ? 1 : 0;
	}
	return $d;
}

// read CSV file
function read_csv($fname)
{
	global $fields;

	$data = @file($fname);
	$arr = array();
	$legend = array();
	$i = 0;
	foreach ($data as $d)
	{
		$r = preg_match_all("/\"([^\"\r\n]*)\"[;, ]?/", $d, $ret);
		if (!$r)
			$r = preg_match_all("/([^;,\r\n]*)[;,]?[\r\n]*/", $d, $ret);
		if ($r)
		{
			$line = array();
			$j = 0;
			foreach ($ret[1] as $r)
			{
				if ($i == 0)	// header
				{
					foreach ($fields as $f=>$fn)
					{
						if ($r == $fn)
							$legend[$f] = $j;
					}
				} 
				else if ($r != "")
				{
					foreach ($legend as $k=>$l)
					{
						if ($j == $l)
							$line[$k] = readField($k, $r);
					}
				}
				$j++;
			}
			if (array_key_exists("d", $line))
				$arr[] = $line;
		}
		$i++;
	}
	return $arr;
}

?>