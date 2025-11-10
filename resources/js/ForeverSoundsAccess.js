// ForeverSoundsAccess.js

function requestAccess(personKey) {
    const entry = accessMap[personKey];
    if (!entry) return alert("Access not found.");

    const input = prompt(`Enter password for ${entry.displayName}:`);
    if (input === entry.password) {
        // Store the personKey in sessionStorage for the generic index.html
        sessionStorage.setItem("personKey", personKey);
        window.location.href = "index.html"; // generic page
    } else if (input !== null) {
        alert("Incorrect password. Please try again.");
    }
}
