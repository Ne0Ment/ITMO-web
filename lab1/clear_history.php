<?php
session_start();

if (isset($_POST)) {
    $_SESSION['history'] = array();
}

?>