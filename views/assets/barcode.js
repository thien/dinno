
function getMostFrequentBarcode(freq) {
    // Iterates through freq, keeping track of the barcode with the highest frequency
    var mostFrequentBarcode = Object.keys(freq).reduce(function (a, b) { return freq[a] > freq[b] ? a : b });
    return mostFrequentBarcode;
}

function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

function initBarcodeScanner() {
    var decoded = []
    var freq = {}
    // document.getElementById("barcodeContainer").style.boxShadow = "inset 0px 0px 0px 50px red";
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#barcodeContainer'),
            constraints: {
                facingMode: "environment", // or user
            },
            debug: true,
        },
        locate: true,
        decoder: { // or code_39, codabar, ean_13, ean_8, upc_a, upc_e

            drawBoundingBox: true,
            showFrequency: false,
            drawScanline: true,
            showPattern: false,
            readers: ['ean_reader', 'ean_8_reader', 'upc_reader', 'upc_e_reader'],
        },
        //initialise barcode decoder
    }, function (err) {
        if (err) {
            console.log(err);
            $(".livevideo").remove()
            $("#NameScanOptionText").remove()
        }else{
            console.log("Initialization finished. Ready to start");
        }
    });
    Quagga.onDetected(function (data) {
        console.log(decoded.length)
        if (decoded.length > 50) {
            console.log(freq);
            $(".modal.livevideo").modal('hide');
            var barcode = getMostFrequentBarcode(freq);
            $("input#name").val("Searching for name...");
            $.get("/api/barcode",{code:barcode},function(data){ //query barcode api to get name of item.
                if (data && data.product && data.product.attributes  && data.product.attributes.product) {
                    $("input#name").val(data.product.attributes.product);
                    $("#name").keyup();
                }
                else {
                    $("input#name").val("No barcode info found :(");
                }
			})
            Quagga.stop();
        } else {
            //for live detection, decoded 50 times and then decide which one is the "right" barcode
            decoded.splice(decoded.length, 0, data.codeResult.code)
            if (!freq[data.codeResult.code]) {
                freq[data.codeResult.code] = 1;
            } else {
                freq[data.codeResult.code] = freq[data.codeResult.code] + 1
            }
            var vidpos = getOffset( document.getElementById('barcodeContainer') ); 
            $(".drawingBuffer").css({left: vidpos.left, position:'absolute'});

            document.getElementsByClassName("drawingBuffer")[0].style["boxShadow"] = "inset 0px 0px 0px " + (decoded.length * 2) + "px rgba(65,255,72," + decoded.length / 70 + ")";
        }
    })
}

var vidpos = getOffset( document.getElementById('barcodeContainer') ); 
$(".drawingBuffer").css({left: vidpos.left, position:'absolute'});
