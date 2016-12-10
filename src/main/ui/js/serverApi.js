
SERVER_API_DEFAULT = "http://128.0.169.5:8888/dev-studio/api"
// SERVER_API_DEFAULT = "http://192.168.10.98:8080/api"


SERVER_API_ACTION = {
    sendOrderFormUrl: SERVER_API_DEFAULT + '/customerrequest/',
    getProjectsUrl:  'js/data.json',
    sendResume: SERVER_API_DEFAULT +  "/resume",
    sendResumeFile: SERVER_API_DEFAULT +  "/"
};


var ServerApi =  function (){
   var api = {};

    api.sendOrderForm = function(data, callback){
        var success = callback;

        $.ajax({
            type: "POST",
            url: SERVER_API_ACTION.sendOrderFormUrl,
            data: data,
            error: function () {
                success();
            },
            success: function () {
                success();
            },
            dataType: "json",
            contentType: "application/json"
        });
    }

    api.getProjects =function(callback){

        $.ajax({
            type: "GET",
            url: SERVER_API_ACTION.getProjectsUrl,
            success: function (result) {
                callback(result);
            },
            dataType: "json",
            contentType: "application/json"
        });
    }

    api.sendResume = function(data, callback, $parent){

        $.ajax({
            type: "POST",
            url: SERVER_API_ACTION.sendResume,
            data: data,
            success: function () {
                callback($parent);
            },
            dataType: "json",
            contentType: "application/json"
        });
    }

    api.sendResumeFile = function(data, callback, $parent){

        $.ajax({
            type: "POST",
            url: SERVER_API_ACTION.sendResumeFile,
            data: formData,
            success: function () {
                callback($parent);
            },
            cache: false,
            contentType: false,
            processData: false
        });
    }

    return api;


}();
