foods = {}

$.getJSON("data/random_food_list.json", function(food_list) {
    foods = food_list;
    notify();
    console.log(document.cookie);
    generateFoodTyper();
    setInterval(generateFoodTyper, 2000);
});

function notify(){
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }
    else if (Notification.permission === "granted") {
        /*var options = {
                    body: "Welcome to Dinno!",
                    icon: "icon.jpg",
                    dir : "ltr"
                };
        var notification = new Notification("Dinno",options);*/
        //do nothing but we can send notifications!
    }
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (!('permission' in Notification)) {
                Notification.permission = permission;
            }

            if (permission === "granted") {
                var options = {
                    body: "Welcome to Dinno Notifications!",
                    icon: "icon.jpg",
                    dir : "ltr"
                };
                var notification = new Notification("Dinno",options);
            }
        });
    }
}

function generateFoodTyper() {
    var item = getRandomFood(foods);
    // type(item, "phatsearch");
    writeMagic("phatsearchfood", item)
}

function getRandomFood(food_list) {
    var item = food_list.dishes[Math.floor(Math.random() * (food_list.dishes.length))]
    // console.log(item)
    return item;
}

function writeMagic(div, type_this){
    // console.log("doing wandom magic")
    // console.log(div, type_this)
    var demo_input = document.getElementById(div);
    // console.log(demo_input)
    var index = 0;

    window.next_letter = function() {
        if (index <= type_this.length) {
            demo_input.placeholder = type_this.substr(0, index++);
            setTimeout("next_letter()", 50);
        }
    }

    // console.log(demo_input.placeholder)
    next_letter();
}