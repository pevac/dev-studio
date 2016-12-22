
// SERVER_API_DEFAULT = "http://128.0.169.5:8888/dev-studio/api"
SERVER_API_DEFAULT = 'http://192.168.10.60:8080/api/'


SERVER_API_ACTION = {
    sendOrderFormUrl: SERVER_API_DEFAULT + 'customerrequests',
    getProjectsUrl:  SERVER_API_DEFAULT + "projects",
    sendResume: SERVER_API_DEFAULT +  "resume",
    sendResumeFile: SERVER_API_DEFAULT,
    getProjectImages:  'http://192.168.10.60:8080/api/images/'
};


var ServerApi =  function (){
   var api = {};

       api.getProjectImages =function(callback, id, name){
        var url1 = SERVER_API_ACTION.getProjectImages + "3/draft.png";
        var success1 = callback;
        $.ajax({
            // type: "GET",
            url: url1,
            // cache: true,
            // processData : false,
            // dataType: "image/png",
            // headers:{'Content-Type':'image/png','X-Requested-With':'XMLHttpRequest'},
            success: function (result) {
                console.log("hell");
                success1(result);
            },
            error: function(data){
// console.log(data);
//  success1(data.responseText);
            },
        });
    }

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
