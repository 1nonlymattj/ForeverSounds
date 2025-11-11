// ForeverSoundsAccess.js
function requestAccess(personKey) {
    const entry = accessMap[personKey];
    if (!entry) return alert("Access not found.");

    const input = prompt(`Enter password for ${entry.displayName}:`);
    if (input === entry.password) {
        // Redirect directly to index.html with person parameter
        window.location.href = `index.html?person=${personKey}`;
    } else if (input !== null) {
        alert("Incorrect password. Please try again.");
    }
}
