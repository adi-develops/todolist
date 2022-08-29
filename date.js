// console.log(module)

exports.getDate = function () {
    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    return today.toLocaleDateString("en-IN", options);
}

exports.getDay = getDay;

function getDay () {
    let today = new Date();

    let options = {
        weekday: "long",
    };

    return today.toLocaleDateString("en-IN", options);
}

// console.log(module.exports)