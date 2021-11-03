<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$url2 = "./index.php";
if (!function_exists('curl_version')) {
    echo 'Curl is not installed';
}

$sub_id2 = null;

if (isset($_GET['sub_id2'])) {
    $sub_id2 = $_GET['sub_id2'];
}

function getRemoteIPAddress() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        return $_SERVER['HTTP_CLIENT_IP'];

    } else if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return $_SERVER['HTTP_X_FORWARDED_FOR'];
    }
    return $_SERVER['REMOTE_ADDR'];
}


if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $endpoint = "https://track.w-trk10.com/lds/affiliate/registration?lds-token=eb507a21-14aa-48a0-b435-65fe192b7a51";
    $ch = curl_init();

    $data = [
        "firstname" => $_POST['name'],
        "lastname" => $_POST['lastname'],
        "phone_code" => '+' . $_POST['phone_code'],
        "phone_number" => $_POST['phone_number'],
        "email" => $_POST['email'],
        "registration_ip" => getRemoteIPAddress(),
        "p4" => "Quantum Code",
        "p5" => $sub_id2,
        "tc" => "GA",
    ];


    $postdata = json_encode($data);
    curl_setopt($ch, CURLOPT_URL, $endpoint);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $postdata);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $output = curl_exec($ch);
    $res = json_decode($output, true);
    curl_close($ch);

    //print_r($res);


    if (isset($res["status"]) && $res["status"]) {
        //print_r($res["data"]);
        //$url2 = $res["result"]["url"];

        header('Location:thankyou.php');
    }


}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="success/success.css">
    <title>!</title>
    <meta charset="UTF-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1.0">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-touch-fullscreen" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="white">
    <meta name="apple-mobile-web-app-title" content="">
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">

</head>
<body>

<div class="wrap">
    <div class="blink"></div>
    <div class="step1 step2">
        <h1 class="step1__title">Error!</h1>
        <h2 class="step1__subtitle">Please try again!</h2>

    </div>
</div>

</body>
</html>
