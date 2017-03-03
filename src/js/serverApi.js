
SERVER_API_DEFAULT = "http://62.80.173.67:8888/dev-studio/api/"
// SERVER_API_DEFAULT =  'http://192.168.10.245:8080/api/',


SERVER_API_ACTION = {
    sendOrderFormUrl: SERVER_API_DEFAULT + 'customerrequests/',
    getProjectsUrl:  SERVER_API_DEFAULT + "projects/",
    sendResume: SERVER_API_DEFAULT +  "resume/",
    sendResumeFile: SERVER_API_DEFAULT + "images/",
    getProjectImages: SERVER_API_DEFAULT + "images/",
    getVacancies: SERVER_API_DEFAULT + "vacancies/",
    getJobPositions: SERVER_API_DEFAULT + "jobpositions/",

};


var ServerApi =  function (){
   var api = {};

    api.getProjectImages =function(id, name){
        return SERVER_API_ACTION.getProjectImages + id + "/"+ name;
    }

    api.sendOrderForm = function(data, callback){
        var success = callback;
        $.ajax({
            type: "POST",
            url: SERVER_API_ACTION.sendOrderFormUrl,
            data: data,
            error: function () {
                // success();
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

    api.getVacancies =function(callback){
       return  $.ajax({
            type: "GET",
            url: SERVER_API_ACTION.getVacancies,
            dataType: "json",
            contentType: "application/json"
        }).then(function(data){
            return data;
        });
    }

    api.getJobPositions =function(callback){
       return  $.ajax({
            type: "GET",
            url: SERVER_API_ACTION.getJobPositions,
            dataType: "json",
            contentType: "application/json"
        }).then(function(data){
            return data;
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
        var formData = new FormData();
        formData.append("file", data);
        console.log(data);
        $.ajax({
            type: "POST",
            url: SERVER_API_ACTION.sendResumeFile + 1 + "/"+ data.name,
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
