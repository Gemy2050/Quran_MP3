const apiUrl = "https://mp3quran.net/api/v3";
const language = "ar";

// Stop All Audios Except Current Audio [Chosen Audio]
document.querySelectorAll("audio").forEach((aud) => {
  aud.onplay = function () {
    document.querySelectorAll("audio").forEach((el) => {
      if (el.id != aud.id) {
        el.pause();
      }
    });
  };
});

// Play Next Surah After Ending The Current Surah
document.querySelector("#quranAudio").onended = function () {
  const chooseSurah = document.querySelector("#chooseSurah");
  let index =
    chooseSurah.options.selectedIndex != chooseSurah.options.length - 1
      ? chooseSurah.options.selectedIndex
      : 0;

  const selectedSurah = chooseSurah.options[index + 1];
  selectedSurah.selected = true;

  this.src = selectedSurah.value;
};

// Quran
async function getReciters() {
  const chooseReciter = document.querySelector("#chooseReciter");
  let res = await fetch(`${apiUrl}/reciters?language=${language}`);
  let data = await res.json();

  chooseReciter.innerHTML = `<option value="">اختر قارئ</option>`;
  data.reciters.forEach((el) => {
    let option = document.createElement("option");
    option.value = el.id;
    option.innerHTML = el.name;

    el.moshaf.forEach((moshaf) => {
      if (moshaf.name.includes("المصحف المعلم")) {
        option.classList.add("teach");
        option.innerHTML += " (معلم) ";
      }
    });
    // chooseReciter.innerHTML += `<option value="${el.id}">${el.name}</option>`;
    chooseReciter.append(option);
  });

  chooseReciter.addEventListener("change", (e) => {
    getMoshaf(e.target.value);
  });
}
getReciters();

async function getMoshaf(id) {
  const chooseMoshaf = document.querySelector("#chooseMoshaf");
  let res = await fetch(
    `${apiUrl}/reciters?language=${language}&reciter=${id}`
  );
  let data = await res.json();

  chooseMoshaf.innerHTML = `<option value="">اختر روايه</option>`;
  data.reciters[0].moshaf.forEach((el) => {
    chooseMoshaf.innerHTML += `<option value="${el.id}" data-server="${el.server}" data-surahlist="${el.surah_list}" >${el.name}</option>`;
  });

  chooseMoshaf.addEventListener("change", () => {
    const selectedMoshaf =
      chooseMoshaf.options[chooseMoshaf.options.selectedIndex];
    const surahServer = selectedMoshaf.dataset.server;
    const surahList = selectedMoshaf.dataset.surahlist;

    getSurah(surahServer, surahList);
  });
}

async function getSurah(surahServer, surahList) {
  const chooseSurah = document.querySelector("#chooseSurah");
  let res = await fetch(`https://mp3quran.net/api/v3/suwar`);
  let data = await res.json();

  surahList = surahList.split(",");
  chooseSurah.innerHTML = `<option value="">اختر سوره</option>`;
  data.suwar.forEach((el) => {
    padId = `${el.id}`.padStart(3, "0");

    if (surahList.includes(`${el.id}`)) {
      chooseSurah.innerHTML += `<option value="${surahServer}${padId}.mp3" >${el.name}</option>`;
    }
  });

  chooseSurah.addEventListener("change", (e) => {
    // Add Source To Audio [Autoplay]
    document.querySelector("#quranAudio").src = e.target.value;
  });
}

function playLive(url) {
  if (Hls.isSupported()) {
    let video = document.querySelector("#liveVideo");
    let hls = new Hls();
    hls.loadSource(`${url}`);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      video.play();
    });
  }
}

// Radio

async function getRadio() {
  const chooseRadio = document.querySelector("#chooseRadio");
  let res = await fetch(`${apiUrl}/radios?language=${language}`);
  let data = await res.json();

  chooseRadio.innerHTML = `<option value="">اختر قارئ</option>`;
  data.radios.forEach((el) => {
    chooseRadio.innerHTML += `<option value="${el.url}">${el.name}</option>`;
  });

  chooseRadio.addEventListener("change", (e) => {
    document.querySelector("#radioAudio").src = e.target.value;
  });
}
getRadio();

// Tafsir

async function getTafsir() {
  const chooseTafsir = document.querySelector("#chooseTafsir");
  let res = await fetch(`${apiUrl}/tafsir?tafsir=1&language=${language}`);
  let data = await res.json();

  chooseTafsir.innerHTML = `<option value="">اختر سوره</option>`;
  data.tafasir.soar.forEach((el) => {
    chooseTafsir.innerHTML += `<option value="${el.url}">${el.name}</option>`;
  });

  chooseTafsir.addEventListener("change", (e) => {
    document.querySelector("#tafsirAudio").src = e.target.value;
  });
}
getTafsir();
