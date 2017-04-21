
function getMostFrequentBarcode(freq) {
    // Iterates through freq, keeping track of the barcode with the highest frequency
    var mostFrequentBarcode = Object.keys(freq).reduce(function (a, b) { return freq[a] > freq[b] ? a : b });
    return mostFrequentBarcode;
}


function run() {
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
        }else{
            console.log("Initialization finished. Ready to start");
            Quagga.start()
        }
    });
    Quagga.onDetected(function (data) {
        console.log(decoded.length)
        if (decoded.length > 50) {
            console.log(freq);
            var barcode = getMostFrequentBarcode(freq);
            $.get("/api/barcode",{code:barcode},function(data){ //query barcode api to get name of item.
                if (data && data.product && data.product.attributes  && data.product.attributes.product) {
                    $("input#name").val(data.product.attributes.product);
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
            document.getElementsByClassName("drawingBuffer")[0].style["boxShadow"] = "inset 0px 0px 0px " + (decoded.length * 2) + "px rgba(65,255,72," + decoded.length / 70 + ")";
        }
    })
}
run();
