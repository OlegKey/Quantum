const envs = ['prod', 'staging', 'dev', 'local'];
const LEAD = "lead";
const SIGNUP = "signup";
var formsProps = {};
var pathname = window.location.pathname;
function getUrlParams() {
    let params = {};
    window.location.search.replace('?', '').split('&').forEach(function (param) {
        let name = param.split('=')[0];
        let value = param.split('=')[1];
        params[name] = value;
    });
    return params;
}

var urlParams = getUrlParams();

function getServerUrl() {
    let env = getEnv();
    if (env === 'local') return "http://127.0.0.1:8080";
    let host = (env !== 'prod') ? env + evnDelimmiter + serverUrl : serverUrl;
    return "https://" + host;
}

function getEnv() {
    let host = window.location.hostname;
    for (let i = 0; i < envs.length; i++) {
        let env = envs[i];
        if (host.startsWith(env)) {
            env = host.replace(/\..*/, '');
            return env;
        }
    }
    return 'prod';
}

function initForm(type, formProps, callback) {
    $.get("/common/" + type + "Form.html", function (responseHTML) {
        $("." + type + "-form-container").append($(responseHTML));
        initFormProps(type, formProps);
        if (isFunction(callback)) {
            callback();
        }
    });
}

function initVideo(pagename) {
    var videoContainer = {
        main: document.getElementById("funnel-video-container"),
        youtube: document.getElementsByClassName("youtube-video"),
        vzaar: document.getElementsByClassName("vzaar-video")
    };

    isNull(videoContainer.main) ? console.log("there is no main video container") : doMainVideoRequest(pagename);

    if (videoContainer.youtube.length > 0 && videoContainer.vzaar.length > 0) {
        doAdditionalVideoRequest();
    }
}

function doMainVideoRequest(pagename) {
    var funnelName = window.location.hostname.replace("local.", "").replace("dev.", "").replace("staging.", "").replace("www.", "");
    doGet("/api/funnels/video?funnel=" + funnelName + "&name=" + pagename,
        (res) => {
            if (res.success) {
                setFunnelFrameSrc(res.data);
            }
            else {
                setFunnelFrameSrc("https://assets.weeblr.net/images/products/sh404sef/2015-10-14/medium/joomla-404-error-page.png");
            }
        },
        () => {
            setFunnelFrameSrc("https://assets.weeblr.net/images/products/sh404sef/2015-10-14/medium/joomla-404-error-page.png");
        }
    );
}

function setFunnelFrameSrc(src) {
    $('#funnel-video-iframe').prop('src', src);
}

function doAdditionalVideoRequest() {
    doGet("/api/features?names=uyv",
        (res) => {
            setFunnelAdditionalVideo(res.data.uyv);
        },
        () => {
            setFunnelAdditionalVideo(true)
        }
    );
}

function setFunnelAdditionalVideo(features) {
    isTrue(features) ? remove("youtube-video") : remove("vzaar-video");
}

function initSignupForm(formProps, callback) {
    initForm(SIGNUP, formProps, callback);
}

function initLeadForm(formProps, callback) {
    initForm(LEAD, formProps, callback);
}

function isProgressBarEnabled(type) {
    return formsProps[type]["isProgressBarEnabled"];
}

function isSuccessPopUpEnabled(type) {
    return formsProps[type]["isSuccessPopUpEnabled"];
}

function initFormProps(type, formProps) {
    formsProps[type] = {
        "isProgressBarEnabled": isTrue(formProps["isProgressBarEnabled"]),
        "isSuccessPopUpEnabled": isTrue(formProps["isSuccessPopUpEnabled"])
    };
    initField(type + "-first-name", formProps["firstName"]);
    initField(type + "-last-name", formProps["lastName"]);
    initField(type + "-email", formProps["email"]);
    initSubmitButton(type, formProps["button"]);
}

function initField(cssName, fieldProps) {
    if (isUndefined(fieldProps)) {
        $("." + cssName).css("display", "none").attr("required", false);
    }
    $("." + cssName).attr("placeholder", getValue(fieldProps, "placeholder"));
}

function initSubmitButton(type, text) {
    $("." + type + "-submit-button").text(text);
}

function remove(className) {
    $("." + className).remove();
}

function setLinksUrlParams(className) {
    let linksList = document.getElementsByClassName(className);

    for (let i = 0; i < linksList.length; i++) {
        let oldLink = linksList[i].href;
        let linkWithParams = !hasSectionReference(oldLink) ? oldLink + window.location.search
            : oldLink.split("#")[0] + window.location.search + "#" + oldLink.split("#")[1];
        linksList[i].setAttribute('href', linkWithParams);
    }
}

function hasSectionReference(link) {
    return link.split("#")[1];
}

function showError(error) {
    $(".error-message").css("display", "block").text(error);
}

function getUrlParamsString() {
    return window.location.search.replace('?', '');
}

function getFormData(e, type, useFullNames) {
    var data = urlParams;
    if (useFullNames && data !== null) {
        data = {
            transactionId: data["t"],
            funnelId: data["f"],
            affiliateId: data["a"],
            advertiserId: data["adv"],
            trafficSource: data["ts"],
            funnelHost: window.location.hostname.replace("www.","").replace("dev.","").replace("staging.","").replace("local.","")
        }
    }
    appendIfNotEmpty(e, data, type, "firstName");
    appendIfNotEmpty(e, data, type, "lastName");
    appendIfNotEmpty(e, data, type, "email");
    return data;
}

function appendIfNotEmpty(event, data, type, name) {
    var field = event.querySelector("#" + name + type.replace(/\b\w/g, l => l.toUpperCase()));
    if (field.value) {
        data[name] = field.value;
    }
}

function displayPopUpSuccess() {
    $('#exitpopup_bg').fadeIn();
    $('#modalsuscess').fadeIn();

    $(".lead-form__modal").css("display", "block");
}

function setFormUrlParams(type) {
    //var urlParams = getUrlParams();
    setFormUrlParam(urlParams, type, "firstName");
    setFormUrlParam(urlParams, type, "lastName");
    setFormUrlParam(urlParams, type, "email");
}

function setFormUrlParam(urlParams, type, name) {
    if (!isUndefined(urlParams[name])) {
        $("." + type + "-" + toDashCase(name)).val(decodeURIComponent(urlParams[name]));
    }
}

function doGet(url, onSuccess, onError) {
    doRequest(url, 'GET', '', onSuccess, onError);
}

function doPost(url, data, onSuccess, onError) {
    doRequest(url, 'POST', JSON.stringify(data), onSuccess, onError);
}

function doRequest(url, method, data, onSuccess, onError) {
    $.ajax({
        type: method,
        contentType: "application/json",
        headers: {"Authorization": "Basic ZnVubmVsczozUz5lSEVRS3VRe05aZVta"},
        url: getServerUrl() + url,
        data: data,
        success: (res) => {
            if (isFunction(onSuccess)) {
                onSuccess(res);
            }
        },
        error: () => {
            if (isFunction(onError)) {
                onError();
            }
        }
    });
}

// const fieldProps = {
//     placeholder: ''
// };
// const formProps = {
//     isProgressBarEnabled: false,
//     isSuccessPopUpEnabled: false,
//     firstName: fieldProps,
//     lastName: fieldProps,
//     email: fieldProps,
//     button: ""
// };
// const formsProps = {"signup": formProps, "lead": formProps};