//jshint esversion:6
// module.exports.getDate = getDate;
// function getDate() {
//     var today = new Date();
//     var options = {
//         weekday:'long',
//         day: 'numeric',
//         month: 'long'
//     };
//     var day = today.toLocaleDateString('en-US', options);
//     return day;
// }



// we can say instead which is shorter!!!
exports.getDate = function() {
    var today = new Date();
    var options = {
        weekday:'long',
        day: 'numeric',
        month: 'long'
    };
    return today.toLocaleDateString('en-US', options);
};

exports.getDay = function() {
    var today = new Date();
    var options = {
        weekday:'long',
    };
    return today.toLocaleDateString('en-US', options);
};
