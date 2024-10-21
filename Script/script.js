let audio = new Audio();//TODO: globle audio
let play = document.getElementById("play")//clicking on the svg 
let sound = document.getElementById("sound")
let currfloder;//globle floder
let mp3_remove//global varible  (array)
let mp3_list//global varible  (array)
//TODO:STAR
async function get_data(floder) {
    currfloder = floder//global varible updated
    let response = await fetch(`http://127.0.0.1:3000/songs/${currfloder}/`)//TODO:fetching The data from the locahost
    let data = await response.text()
    //FIXME:  display songs
    let div = document.createElement("div")//not the part of DOM so we can get the a tags for this div
    let pass = div.innerHTML = data//"text"passing to div as innerhtml
    console.log(pass)
    let anchor_tags = div.getElementsByTagName("a")//div is the document inside it we have td
    let a = Array.from(anchor_tags)
    let play_songs = a.filter((value) => {
       return value.href.endsWith(".mp3")
    })
    // console.log(play_songs)
    mp3_list = play_songs.map((value) => {

        return value.href.split(`${currfloder}/`)[1]
    })

    // console.log(mp3_list)
    mp3_remove = mp3_list.map((value) => {//local update
        return value.split(".mp3")[0]
    })
    //TODO: display the songs
    let songurl = document.querySelector(".songURL").getElementsByClassName("ul")[0]
    songurl.innerHTML = " "//to remove old songs
    for (const song of mp3_remove) {
        // console.log(song);
        let decode = decodeURI(song) //decode url components for displaying
        songurl.innerHTML += ` <li>
                        <img src=" /img/music .svg" alt="img">
                        <div class="scard">${decode}</div>
                        <div class="playimg">
                            <span>play now</span>
                            <img src=" /img/p.svg" alt="play">
                        </div>
                    </li>`
    }
    //TODO: playing 
    Array.from(document.querySelector(".songURL").getElementsByTagName("li")).forEach((value) => {
        value.addEventListener("click", (e) => {
            // console.log(value.querySelector(".scard").innerHTML)
            playAudio(value.querySelector(".scard").textContent)//js Hosting

        })

    })
    return data
}
function playAudio(songname) {
    audio.src = `songs/${currfloder}/` + songname + ".mp3" //TODO: we can update the song
    audio.play();
    play.src = " /img/p1.svg"
    let sna = document.querySelector(".songinfo")
    sna.innerHTML =`<h4>${ songname}<h4/>`
    sna.innerHTML += ' <img src=" /img/h.svg" >'

}
function convertSecondsToMinutes(seconds) {
    // Calculate the minutes and remaining seconds
    if (isNaN(seconds) || seconds < 0) {
        return "0:00"
    }

    else {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        // Format the remaining seconds to always have two digits
        const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

        // Combine minutes and formatted seconds
        return `${minutes}:${formattedSeconds}`;
    }
}

let main = async () => {
    await get_data(`Eng`)//it is html text
    //TODO: controls of  play pauss 
    play.addEventListener("click", () => {
        if (audio.paused) {
            audio.play()

            play.src = " /img/p1.svg"
        } else {
            audio.pause()
            play.src = " /img/play.svg"
        }
    })
    //TODO: time update event

    audio.addEventListener("timeupdate", () => {
        let ct = Math.floor(audio.currentTime)//globle updated value
        // console.log(ct,"taking the globel updated varible")
        let cd = Math.floor(audio.duration)
        let stime = document.querySelector(".time")
        let t = convertSecondsToMinutes(ct)
        let d = convertSecondsToMinutes(cd)
        stime.textContent = `${t}/${d}`
        document.querySelector(".circle").style.left = (audio.currentTime) / (audio.duration) * 100 + "%"//it works with complet song becouse of audio.currentTime is a globle  declear
        document.querySelector(".circle").style.backgroundColor = "#20a7db"
        document.querySelector(".songbar").style.backgroundColor = "gray"
    })

    //TODO: song bar back and front
    //   The Element.getBoundingClientRect() method returns a DOMRect object providing information about the size of an element and its position relative to the viewport.
    document.querySelector(".songbar").addEventListener("click", (eobject) => {
        let per = (eobject.offsetX / eobject.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left =`${per}%`// JavaScript implicitly converts it to a string and adds % because it is often used for CSS properties like left.
        audio.currentTime = ((audio.duration) * per) / 100//global change
        //    console.log(g,"globle update the current time");

    })
    //TODO: next the svg
    let next = document.getElementById("next")
    next.addEventListener("click", () => {
        let index1 = mp3_list.indexOf((audio.src.split("/").slice(-1)[0]))
        if (mp3_list.length != 0 && index1 + 1 < mp3_list.length) {
            let next_s = decodeURI(mp3_list[index1 + 1].split(".mp3")[0])
            playAudio(next_s);
        }
        else {
            alert("songs are over")
        }


    })
     //TODO: play next song Automaticaiiy

     audio.addEventListener("ended", () => {
        let next1 = mp3_list.indexOf(audio.src.split("/").slice(-1)[0]);
        if (audio.currentTime == audio.duration) {
            let n = decodeURI(mp3_list[next1 + 1].split(".mp3")[0]);
            playAudio(n);
        }
    })
    //TODO:  back the svg
    let back = document.getElementById("back")
    back.addEventListener("click", () => {
        let index2 = mp3_list.indexOf((audio.src.split("/").slice(-1)[0]))
        if (mp3_list.length != 0 && index2 - 1 < mp3_list.length) {
            let back_s = decodeURI(mp3_list[index2 - 1].split(".mp3")[0])
            playAudio(back_s);
        }
    })

    //TODO: adding the volume bar
    document.getElementsByTagName("input")[0].addEventListener("change", (eobj) => {
        let volume = eobj.target.value / 100
        audio.volume = volume
        if (volume === 0.0) {
            sound.src = "/img/voff.svg"
        }
        else {
            sound.src = "/img/sound.svg"
        }
    })

    let sc = document.querySelector(".songcart")
    //FIXME: display all the alblams dynamically on the page
    async function displayALLsongs() {
        let response = await fetch(`http://127.0.0.1:3000/songs/`)
        let data = await response.text()
        //FIXME:  display songs
        let div = document.createElement("div")
        let pass = div.innerHTML = data
        let anchor_tags = div.getElementsByTagName("a")
        let a = Array.from(anchor_tags)
        for (const value of a) {
            if (value.href.includes("/songs")) {
                let dynamicfloder = value.href.split("/").slice(-2)[0]
    
                //TODO: data of title and by
                let response = await fetch(`http://127.0.0.1:3000/songs/${dynamicfloder}/info.json`)
                let data = await response .json()
                let { title: T, by: B } = data//destructuring of data 
                // console.log(T, B);
                sc.innerHTML += `
                <div class="cart" data-floder=${dynamicfloder}>
                    <div class="play">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="45" height="45">
                            <!-- Circle with green background -->
                            <circle cx="12" cy="12" r="12" fill="#20a7db" />
                            <!-- Sharp triangle play icon centered within the circle -->
                            <polygon points="8,5 8,19 18,12" fill="black" transform="translate(3, 3) scale(0.75)" />
                        </svg>
                    </div>
                    <img src="/songs/${dynamicfloder}/cover.jpg" alt="image">
                    <h4>${T}</h4>
                    <p>${B}</p>
                </div>

`
            }
        }

    }
    await displayALLsongs()
    //TODO: ADD the cards
    document.querySelectorAll(".cart").forEach((value) => {
        value.addEventListener("click", async (eobj) => {
            // console.log(eobj.currentTarget.dataset)
            await get_data(eobj.currentTarget.dataset.floder)

        })
    })

}
main()

