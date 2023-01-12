var jpdbBaseUrl = "http://api.login2explore.com:5577/";
var jpdbIrl = "/api/irl";
var jpdbIml = "/api/iml";
var empdbname = "EMP-DB";
var empRealationName = "EmpData";
var connToken = "90932475|-31949270398847322|90955417"

$('#empId').focus();

function saveRecNo2LS(jsonObj) {
    var lvlData = JSON.parse(jsonObj.data);
    localStorage.setItem("recno", lvlData.rec_no);
}

function getEmpIdAsJsonObj() {
    var empId = $('#empId').val();
    var jsonStr = {
        id: empId
    };
    return JSON.stringify(jsonStr);
}

function fillData(jsonObj) {
    saveRecNo2LS(jsonObj);
    var data = JSON.parse(jsonObj.data).record;
    $('#empName').val(data.name);
    $('#empSal').val(data.sal);
    $('#empHra').val(data.hra);
    $('#empDa').val(data.da);
    $('#empDeduct').val(data.deduct);
}

function validateData() {
    var empId, empName, empSal, empHra, empDa, empDeduct;
    empId = $('#empId').val();
    empName = $('#empName').val();
    empSal = $('#empSal').val();
    empHra = $('#empHra').val();
    empDa = $('#empDa').val();
    empDeduct = $('#empDeduct').val();

    if (empId === "") {
        alert("Employee Id is Missing");
        $('#empId').focus();
        return "";
    }
    if (empName === "") {
        alert("Employee Name is Missing");
        $('#empName').focus();
        return "";
    }
    if (empSal === "") {
        alert("Employee Salary is Missing");
        $('#empSal').focus();
        return "";
    }
    if (empHra === "") {
        alert("Employee HRA is Missing");
        $('#empHra').focus();
        return "";
    }
    if (empDa === "") {
        alert("Employee DA is Missing");
        $('#empDa').focus();
        return "";
    }
    if (empDeduct === "") {
        alert("Employee Deduction is Missing");
        $('#empDeduct').focus();
        return "";
    }

    var jsonStrObj = {
        id: empId,
        name: empName,
        sal: empSal,
        hra: empHra,
        da: empDa,
        deduct: empDeduct
    };
    return JSON.stringify(jsonStrObj);
}

function getEmp() {
    var empIDJsonObj = getEmpIdAsJsonObj();
    var getRequest = createGET_BY_KEYRequest(connToken, empdbname, empRealationName, empIDJsonObj);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(getRequest, jpdbBaseUrl, jpdbIrl);
    jQuery.ajaxSetup({ async: true });
    if (resJsonObj.status === 400) {
        $('#empSave').prop("disabled", false);
        $('#empreset').prop("disabled", false);
        $('#empName').focus();

    }
    else if (resJsonObj.status === 200) {
        $('#empId').prop("disabled", true);
        fillData(resJsonObj);

        $('#empchange').prop("disabled", false);
        $('#empreset').prop("disabled", false);
        $('#empName').focus();
    }
}

function resetEmployee() {
    $('#empId').val("");
    $('#empName').val("");
    $('#empSal').val("");
    $('#empHra').val("");
    $('#empDa').val("");
    $('#empDeduct').val("");
    $('#empId').prop("disabled", false);
    $('#empSave').prop("disabled", true);
    $('#empchange').prop("disabled", true);
    $('#empreset').prop("disabled", true);
    $('#empId').focus();
}
function saveEmployee() {
    var jsonStrObj = validateData();
    if (jsonStrObj == "") {
        return "";
    }
    var putRequest = createPUTRequest(connToken, jsonStrObj, empdbname, empRealationName);
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(putRequest, jpdbBaseUrl, jpdbIml);
    jQuery.ajaxSetup({ async: true });
    resetEmployee();
    $("#empId").focus();
}

function changeEmployee() {
    $('#empchange').prop("disabled", true);
    jsonChg = validateData();
    var updatRequest = createUPDATeRequest(connToken, jsonChg, empdbname, empRealationName, localStorage.getItem("recno"));
    jQuery.ajaxSetup({ async: false });
    var resJsonObj = executeCommandAtGivenBaseUrl(updatRequest, jpdbBaseUrl, jpdbIml);
    jQuery.ajaxSetup({ async: true });
    console.log(resJsonObj);
    resetEmployee();
    $("#empId").focus();
}