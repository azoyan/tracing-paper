const navigator = document.getElementById("nav");
let zoomist;
let noSleep = new NoSleep();
let html = document.documentElement;
let imgElement;
let currentRotation = `rotate(0deg)`;

const ROTATION_REGEX = /rotate\((.*?)\)/gm;

function openFullscreen() {
    if (html.requestFullscreen) {
        html.requestFullscreen();
    } else if (html.webkitRequestFullscreen) { /* Safari */
        html.webkitRequestFullscreen();
    } else if (html.msRequestFullscreen) { /* IE11 */
        html.msRequestFullscreen();
    }
}

function closeFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
    }
}
window.addEventListener('DOMContentLoaded', (event) => {
    const uploadButton = document.querySelector('#uploadButton');
    const fileUpload = document.querySelector('#fileUpload');

    uploadButton.addEventListener('click', () => fileUpload.click());

    fileUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const imageUrl = URL.createObjectURL(file);

        imgElement = document.createElement('img');
        imgElement.src = imageUrl;

        while (navigator.firstChild) { navigator.firstChild.remove() }
        navigator.appendChild(createButtonPanel([createLockButton(), createRotateButton(), createFullscreenButton()]))

        document.getElementById("uploadForm").remove();

        // let el = document.getElementById("#zoomist");
        zoomist = new Zoomist('#zoomist', {
            maxRatio: 10,
            src: imgElement,
            fill: 'contain',
            maxRatio: 8,
            wheelable: true,
            on: {
                ready() {
                    console.log("ready")
                    document.querySelector("img").style.transform += currentRotation
                },
                zoom() {
                    let transform = document.querySelector("img").style.transform.replaceAll(ROTATION_REGEX, "") + currentRotation;
                    console.log("zoom", currentRotation, transform)
                    document.querySelector("img").style.transform = transform

                },
                wheel() {
                    let transform = document.querySelector("img").style.transform.replaceAll(ROTATION_REGEX, "") + currentRotation;
                    console.log("wheel", currentRotation, transform)
                    document.querySelector("img").style.transform = transform
                },
                drag() {
                    let transform = document.querySelector("img").style.transform.replaceAll(ROTATION_REGEX, "") + currentRotation;
                    console.log("drag", currentRotation, transform)
                    document.querySelector("img").style.transform = transform
                },
                pinch() {
                    let transform = document.querySelector("img").style.transform.replaceAll(ROTATION_REGEX, "") + currentRotation;
                    console.log("pinch", currentRotation, transform)
                    document.querySelector("img").style.transform = transform
                },
            }
        })
    });
});

function lockImage() {
    zoomist.options.draggable = false
    zoomist.options.pinchable = false
    zoomist.options.wheelable = false
    while (navigator.firstChild) { navigator.firstChild.remove() }
    navigator.appendChild(createButtonPanel([createRange(), createFullscreenButton()]))

    document.addEventListener('click', function enableNoSleep() {
        document.removeEventListener('click', enableNoSleep, false);
        noSleep.enable();
    }, false);
}

function createButtonPanel(elements) {
    let panel = document.createElement('div')
    panel.classList.add("row")

    for (let i = 0; i < elements.length; ++i) {
        let col = document.createElement('div')
        col.classList.add("col", "col-auto")
        col.appendChild(elements[i])
        panel.appendChild(col)
    }
    return panel
}

function createLockButton() {
    let button = document.createElement('button');
    button.classList.add("btn", "btn-outline-primary", "btn-sm", "d-flex", "align-items-center")
    button.onclick = lockImage
    button.innerHTML += `<i class="bi bi-lock"></i>`
    button.innerHTML += `<span class="d-none d-sm-inline">Lock</span>`
    return button
}
let rotation = 0;

function createRotateButton() {
    let button = document.createElement('button');
    button.classList.add("btn", "btn-outline-primary", "btn-sm", "d-flex", "align-items-center")
    button.type = "button"
    button.onclick = function () {
        rotation -= 90;
        if (rotation === -360) {
            // 360 means rotate back to 0
            rotation = 0;
        }
        currentRotation = `rotate(${rotation}deg)`
        document.querySelector("img").style.transform = currentRotation;
        // document.querySelector("img").style.transform.replace(ROTATION_REGEX, currentRotation)
    }

    // button.innerHTML += `<i class="bi bi-arrow-90deg-left"></i>Rotate 90°`
    button.innerText += `90°`
    return button
}

function createFullscreenButton() {
    let button = document.createElement('button');
    button.classList.add("btn", "btn-outline-secondary", "btn-sm", "d-flex", "align-items-center")
    console.log("isNotFullScreen", !document.fullscreenElement)
    button.innerHTML = `<i class="bi bi-arrows-fullscreen"></i>`
    document.addEventListener("fullscreenchange", (event) => {
        if (document.fullscreenElement == null) {
            console.log("exit fullscreen")
            button.innerHTML = `<i class="bi bi-arrows-fullscreen"></i>`
        }
        else {
            console.log("enter fullscreen")
            button.innerHTML = `<i class="bi bi-fullscreen-exit"></i>`
        }
    });
    button.onclick = function () {
        if (document.fullscreenElement == null) {
            openFullscreen()
        } else {
            closeFullscreen()
        }
    }

    return button
}

function createLabel(text) {
    // <label for="customRange3" class="form-label">Example range</label>
    let label = document.createElement('label')
    label.for = 'lockRange'
    label.classList.add('form-label')
    label.innerText = text
    return label
}
function createRange() {
    let button = document.createElement('button');
    button.classList.add("btn", "btn-outline-success", "btn-sm", "d-flex", "align-items-center")
    button.onclick = unlockImage
    button.innerHTML += `<i class="bi bi-unlock"></i>`
    button.innerHTML += `<span class="d-none d-sm-inline">Unlock</span>`
    return button
}

function unlockImage() {
    while (navigator.firstChild) { navigator.firstChild.remove() }
    navigator.appendChild(createButtonPanel([createLockButton(), createRotateButton(), createFullscreenButton()]))
    zoomist.options.draggable = true
    zoomist.options.pinchable = true
    zoomist.options.wheelable = true
    noSleep.disable()

}
