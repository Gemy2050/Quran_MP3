const apiUrl = "https://mp3quran.net/api/v3";
const language = "ar";

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

  chooseMoshaf.addEventListener("change", (e) => {
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
      chooseSurah.innerHTML += `<option value="${surahServer}${padId}.mp3">${el.name}</option>`;
    }
  });

  chooseSurah.addEventListener("change", (e) => {
    // Add Source To Audio [Autoplay]
    document.querySelector("audio").src = e.target.value;
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
