const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const player = $(".player");
const playBtn = $(".btn-toggle-play");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const progress = $('#progress')
const prevBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $(".btn-repeat")
const playlist = $('.playlist')

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Click Pow Get Down",
      singer: "Raftaar x Fortnite",
      path: "./assets/music/song1.mp3",
      image: "./assets/img/anh1.jpg",
    },
    {
      name: "Yaadgar",
      singer: "Gulab Sidhu",
      path: "./assets/music/Yaadgar.mp3",
      image: "./assets/img/anh2.jpg",
    },
    {
      name: "Despacito",
      singer: "Luis Fonsi x Daddy Yankee",
      path: "./assets/music/despacito.mp3",
      image: "./assets/img/anh3.jpg",
    },
    {
      name: " Vì Mẹ Anh Bắt Chia Tay",
      singer: " Miu Lê, Karik, Châu Đăng Khoa",
      path: "./assets/music/ViMeAnhBatChiaTay.mp3",
      image:
        "./assets/img/anh4.jpg",
    },
    {
      name: "đứa nào làm em buồn?",
      singer: "Phúc Du, Hoàng Dũng",
      path: "./assets/music/DuaNaoLamEmBuon.mp3",
      image:
        "./assets/img/anh5.jpg",
    },
    {
      name: "Ngôi Sao Cô Đơn",
      singer: "Jack - J97",
      path: "./assets/music/NgoiSaoCoDon.mp3",
      image:
        "./assets/img/anh6.jpg",
    },
    {
      name: "Dĩ Vãng Cuộc Tình",
      singer: "Tuấn Hưng",
      path: "./assets/music/DiVangCuocTinh.mp3",
      image:
        "./assets/img/anh7.jpg",
    },
  ],

  setConfig: function (key, value) {
    this.config[key] = value
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
  },


  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
              <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                  <div class="thumb"
                    style="background-image: url('${song.image}')">
                  </div>
                  <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                  </div>
                  <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                  </div>
              </div>
            `;
    });

    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const cdWidth = cd.offsetWidth;

    const cdThumbAnimate = cdThumb.animate([
      { transform: "rotate(360deg)" }], {
        duration: 10000, // 10 seconds
        iterations: Infinity
      });
      cdThumbAnimate.pause();

    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    playBtn.onclick = function () {
      if (app.isPlaying) {
        audio.pause()
      } else {
        audio.play()
      }
    }

    audio.onplay = function () {
      app.isPlaying = true
      player.classList.add("playing")
      cdThumbAnimate.play()
    }

    audio.onpause = function () {
      app.isPlaying = false
      player.classList.remove("playing")
      cdThumbAnimate.pause()
    }

    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
        progress.value = progressPercent
      }
    }

    progress.onchange = function(e) {
      const seekTime = audio.duration / 100 * e.target.value
      audio.currentTime = seekTime
    }

    nextBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong()
      } else {
        app.nextSong()
      }
      audio.play()
      app.render()
      app.scrollToActiveSong()
    }
    prevBtn.onclick = function () {
      if (app.isRandom) {
        app.playRandomSong()
      } else {
        app.prevSong()
      }
      audio.play()
      app.render()
      app.scrollToActiveSong()
    }
    randomBtn.onclick = function (e) {
      app.isRandom = !app.isRandom
      app.setConfig('isRandom', app.isRandom)
      randomBtn.classList.toggle('active', app.isRandom)
    }

    repeatBtn.onclick = function (e) {
      app.isRepeat = !app.isRepeat
      app.setConfig('isRepeat', app.isRepeat)
      repeatBtn.classList.toggle('active', app.isRepeat)

    }

    audio.onended = function () {
      if (app.isRepeat)  {
        audio.play()
      } else {
        nextBtn.click()
      }
    }

    playlist.onclick = function (e) {
      const songNode = e.target.closest('.song:not(.active)')

      if (songNode || e.target.closest('.option')) {

        if (songNode) {
          app.currentIndex = Number(songNode.dataset.index)
          app.loadCurrentSong()
          app.render()
          audio.play()
        }

        if (e.target.closest('.option')) {

        }

      }
    }
  },

  scrollToActiveSong: function () {
    setTimeout(() => {
      $('.song.active').scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 200);
  },

  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom
    this.isRepeat = this.config.isRepeat
  },

  nextSong: function () {
    this.currentIndex++
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0
    }
    this.loadCurrentSong()
  },

  prevSong: function () {
    this.currentIndex--
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1
    }
    this.loadCurrentSong()
  },

  playRandomSong: function () {
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * this.songs.length)
    } while (newIndex === this.currentIndex)
    this.currentIndex = newIndex
    this.loadCurrentSong()
  },

  start: function () {
    this.loadConfig();

    this.defineProperties();

    this.handleEvents();

    this.loadCurrentSong();

    this.render();
    
    randomBtn.classList.toggle('active', this.isRandom)
    repeatBtn.classList.toggle('active', this.isRepeat)

  },
};

app.start();
