<?php


// remove next two lines for production

//ini_set('display_errors', 'On');
//error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = mysqli_connect($cd_host, $cd_user, $cd_password, $cd_dbname);

if (mysqli_connect_errno()) {

    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;

}	

// Verifies the department to delete doesn't contain any personnel

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//curl_setopt($ch, CURLOPT_URL, 'http://localhost/AnthonyPou/project2/php/getPersonnelByDepartment.php?departmentID=' . $_REQUEST['id']);
curl_setopt($ch, CURLOPT_URL, 'https://anthonypou.co.uk/project2/php/getPersonnelByDepartment.php?departmentID=' . $_REQUEST['id']);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

if (count($decode['data']['personnel']) === 0) {

    // SQL statement accepts parameters and so is prepared to avoid SQL injection.
    // $_REQUEST used for development / debugging. Remember to change to $_POST for production
    $query = $conn->prepare('DELETE FROM department WHERE id = ?');

    $query->bind_param("i", $_REQUEST['id']);

    $query->execute();

    if (false === $query) {

        $output['status']['code'] = "400";
        $output['status']['name'] = "executed";
        $output['status']['description'] = "query failed";	
        $output['data'] = [];

        mysqli_close($conn);

        echo json_encode($output); 

        exit;

    }

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = ["Department " . $_REQUEST['id'] . " successfully deleted."];

    mysqli_close($conn);

    echo json_encode($output); 
} else {
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = ["msg"=>"This department can't be deleted, personnel is associated to it."];

    mysqli_close($conn);

    echo json_encode($output); 
}

?>
