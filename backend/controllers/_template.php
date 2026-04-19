<?php
require_once "../config/database.php";
require_once "../utils/response.php";

class TemplateController {

    public function index() {
        $db = (new Database())->connect();

        // TODO: logic here

        response("ok");
    }
}
?>