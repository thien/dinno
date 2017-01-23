foods = {}

$.getJSON("data/random_food_list.json", function(food_list) {
    foods = food_list;
    generateFoodTyper();
    setInterval(generateFoodTyper, 10000);
});


function generateFoodTyper() {
    var item = getRandomFood(foods);
    type(item, "phatsearch");
}

function getRandomFood(food_list) {
    return food_list.dishes[Math.floor(Math.random() * (food_list.dishes.length))];
}

function type(string, element) {
    divid = document.getElementById(element);
    (function writer(i) {
        if (string.length <= i++) {
            divid.value = string;
            return;
        }
        divid.value = string.substring(0, i);
        if (divid.value[divid.value.length - 1] != " ") divid.focus();
        var rand = Math.floor(Math.random() * (100)) + 140;
        setTimeout(function() {
            writer(i);
        }, rand);
    })(0)
}