foods = {}

$.getJSON("data/random_food_list.json", function(food_list) {
    foods = food_list;
    generateFoodTyper();
    setInterval(generateFoodTyper, 2000);
});

$(window).on('keydown', function(event) {
    if(document.activeElement.id === 'phatsearchfood' || document.activeElement.id === 'phatsearchlocation' ){
        if(event.which == 13) {
            document.getElementById('bigsearchform').submit();
            return false;
        }
    }
});


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