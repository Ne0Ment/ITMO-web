<?php
session_start();
$time_start = microtime(true);

$table_start = '<table id="history_table" class="lined-table fixed-table">
            <tr>
            <th>Данные</th>
            <th>Время</th>
            <th>Результат</th>
            </tr>
            ';
$table_end = '</table>';

$history = array();
if (isset($_SESSION['history']))
    $history = $_SESSION['history'];

function inGraph($x, $y, $r)
{
    if ($x >= 0 and $y >= 0 and hypot($x, $y) <= $r)
        return true;

    if ($x > 0 and $y < 0 and $x <= $r and $y <= $r)
        return true;

    if ($x < 0 and $y < 0)
        return false;

    if ($x < 0 and $y > 0 and ($x + $r) >= $y) {
        return true;
    }

    return false;
}


if (isset($_POST)) {

    // render the table
    $rendered_table = $table_start;
    foreach (array_reverse($history) as $record)
        $rendered_table .= "<tr>
        <td>{$record['data']}</td>
        <td>{$record['time']}</td>
        <td>{$record['success']}</td>
      </tr>";

    $rendered_table .= $table_end;
    $current_time = date("H:i:s");
    $script_time = strval((microtime(true) - $time_start));
    $rendered_table .= "<p>Current time: {$current_time}</p> <br> <p>Script execution time: {$script_time} seconds</p>";

    echo json_encode(
        array(
            "table" => array_reverse($history),
            "current_time" => $current_time,
            "script_time" => $script_time
        )
    );
}

?>