// ForeverSoundsAccess.js
// -----------------------------
// NEW CUSTOMER BUTTON
// -----------------------------
document.getElementById("newBtn").addEventListener("click", () => {
    window.open(
        "https://m.me/matthew.r.johnson.108?text=Hi!%20I'm%20interested%20in%20purchasing%20a%20ForeverSounds%20memory.",
        "_blank"
    );
});

// -----------------------------
// Open PIN dialog
// -----------------------------
$("#existingBtn").on("click", function () {
    $(".login-container").hide(); // hide main container

    $("#pinDialog").dialog({
        modal: true,
        width: 350,
        resizable: false,
        draggable: false,
        title: "Enter Your 4-Digit PIN",
        show: { effect: "fade", duration: 200 },
        hide: { effect: "fade", duration: 200 },
        closeText: "X",
        open: function () {
            $(".pin-box").val("");          // clear input
            $(".pin-box").first().focus();  // auto-focus first box
            $(".ui-dialog-titlebar-close").show(); // make sure "X" is visible
        },
        close: function () {
            $(".login-container").show(); // show login container again
        }
    });
});

// -----------------------------
// PIN auto-advance
// -----------------------------
$(document).on("input", ".pin-box", function () {
    if (this.value.length === 1) $(this).next(".pin-box").focus();
});

// -----------------------------
// Backspace auto-back
// -----------------------------
$(document).on("keydown", ".pin-box", function (e) {
    if (e.key === "Backspace" && this.value === "") $(this).prev(".pin-box").focus();
});

// -----------------------------
// Check PIN when 4 digits entered
// -----------------------------
$(document).on("keyup", ".pin-box", function () {
    const digits = $(".pin-box").map((i, el) => el.value).get().join("");

    if (digits.length === 4) {
        let matchedPersonKey = null;

        for (const key in accessMap) {
            if (accessMap[key].password === digits) {
                matchedPersonKey = key;
                break;
            }
        }

        if (matchedPersonKey) {
            $("#pinDialog").dialog("close");
            window.location.href = `index.html?person=${matchedPersonKey}`;
        } else {
            $("#pinError").show();
            $("#pinDialog").parent().effect("shake");
            $(".pin-box").val("");
            $(".pin-box").first().focus();
        }
    }
});
