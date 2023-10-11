<?php
session_start();

$history = array();
if (isset($_SESSION['history']))
    $history = $_SESSION['history'];

function inGraph($x, $y, $r) {
    if ($x>=0 and $y>=0 and hypot($x, $y)<=$r)
        return true;
    
    if ($x>=0 and $y<=0 and $x<=$r and $y<=$r)
        return true;

    if ($x<0 and $y<0)
        return false;
    
    if ($x<=0 and $y>=0 and $x<=$r and $x<=$r and (($x+$r)>=$y)) {
        return true;
    }

    return false;
}

function validValues($x, $y, $r) {
    $x_values = array('-5', '-4', '-3', '-2', '-1', '0', '1', '2', '3');
    $r_values = array('1', '2', '3', '4', '5');
    if (!isset($x) || !isset($y) || !isset($r))
        return false;
    
    if (in_array($x, $x_values) && $y >= -5 && $y <= 5 && in_array($r, $r_values))
        return true;

    return false;   
}


if (isset($_POST)) {
    $raw_data = file_get_contents("php://input");
    $data = json_decode($raw_data, true);
    
    if (validValues($data['x'], $data['y'], $data['r'])) {
        $new_record = array(
            'data' => "X: {$data['x']}, Y: {$data['y']}, R: {$data['r']}",
            'time' => date("d/m/Y H:i:s"),
            'success' => inGraph($data['x'], $data['y'], $data['r']) ? 'хорош' : 'плох'
        );
    
        // add new record
        array_push($history,  $new_record);
    
        //save new history
        $_SESSION['history'] = $history;
    }
    
}

?>