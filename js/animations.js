var notificationCount = 0;

$().ready(() => {
    $('.power-usage').click(() => {
        animateOpenModal('power-usage', 900, 500);
        showPowerHistory('modal-content')
    });
    $('.battery').click(() => {
        animateOpenModal('battery', 900, 500);
        showBattery('modal-content');
    });
    $('.add-button').click(() => {
        animateOpenModal('add-button', 900, 500);
        showAddDevice('modal-content');
    });
    $('.renew').click(() => {
        animateOpenModal('renew', 900, 500);
        showEnergyHistory('modal-content');
    });
    $('.through').click(() => {
        animateOpenModal('through', 900, 500);
        showThroughputHistory('modal-content');
    });
    whereIsHome('modal-content');
    $('.overlay, .modal-close').click(() => {
        $('.modal-window').removeClass('show-up', 300);
        $('.modal-window').css({
            'width': '2px',
            'height': '2px'
        });
        $('.overlay').fadeOut(300);
    });
    $(document).keyup(function(e) {
        if (e.keyCode === 27) $('.overlay').click(); // esc
    });
});

var setProgress = (value) => {
    $('.loader').width(`${value}vw`);
    if (value > 100) {
        setTimeout(() => {
            $('.loader').hide();
        }, 800);
    }
};
 
var animateOpenModal = (from, width = 500, height = 300) => {
    var clicker = $(`.${from}`);
    var distanceV = clicker.offset().top,
        distanceH = clicker.offset().left,
        halfheight = clicker.height() / 2,
        halfwidth = clicker.width() / 2
    distanceV += halfheight;
    distanceH += halfwidth;
    $('.modal-window').css({
        'top': (distanceV + "px"),
        'left': (distanceH + "px"),
        'height': clicker.height(),
        'width': clicker.width()
    });
    setTimeout(() => {
        $('.modal-window').addClass('show-up');
        $('.overlay').fadeIn(300);
        $('.show-up').css({
            'width': width,
            'height': height
        });
    }, 10);
};

var addNotification = (message) => {

    $('.notification-tray').html($('.notification-tray').html() + newNot);
};