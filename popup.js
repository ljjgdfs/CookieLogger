
var BGPage = chrome.extension.getBackgroundPage();

function set_log_state() {
    BGPage.cookie_logger.set_log_state($(this).val());
    window.close();
}

function set_url_flag() {
    BGPage.cookie_logger.set_url_flag($(this).val());
    window.close();
}

function init() {
    console.log("init ...... ");
    var log_option = BGPage.cookie_logger.get_log_state();
    var url_flag = BGPage.cookie_logger.get_url_flag();
    console.log(log_option, url_flag);

    $("#"+log_option).attr("checked", true);
    $("#"+url_flag).attr("checked", true);

    $(":radio.state").click(set_log_state);
    $(":radio.option").click(set_url_flag);
    $('#clear').click(
            function() {
                BGPage.cookie_logger.clear_cookies();
                window.close();
            });
    $('#about').click(
            function() {
                BGPage.openAboutPage();
                window.close();
            });
}

$("document").ready(init);
