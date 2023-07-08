const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY = 'F8_PLAYER'

const player = $('.player')
const heading = $('header h2')
const audio = $('#audio')
const cdThumb = $('.cd-thumb')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const preBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: "Angel Baby",
            singer: "Troye Sivan",
            path: "audios/angel-baby.mp3",
            image: "images/angel-baby.jpg",
            id: 1,
        },
        {
            name: "Head In The Clouds",
            singer: "Hayd",
            path: "audios/Head In the Clouds - Hayd.mp3",
            image: "images/Head In the Clouds.jpg",
            id: 2,
        },
        {
            name: "Under The Influence",
            singer: "Chris Brown",
            path: "audios/UnderTheInfluence-ChrisBrown.mp3",
            image: "images/UnderTheInfluence.webp",
            id: 3,
        },
        {
            name: "Paris in the Rain",
            singer: "Lauv",
            path: "/audios/Paris In The Rain - Lauv.mp3",
            image: "/images/Paris in the Rain.webp",
            id: 4,
        },
        {
            name: "Beautiful",
            singer: "Bazzi feat. Camila Cabello",
            path: "/audios/Beautiful - Bazzi_ Camila Cabello.mp3",
            image:
                "/images/Bazzi feat. Camila Cabello - Beautiful.jpg",
            id: 5,
        },
        {
            name: "I Fucking Love You",
            singer: "Bazzi",
            path: "/audios/Ifly-Bazzi.mp3",
            image: "/images/I.F.L.Y.jpg",
            id: 6,
        },
        {
            name: "Solo",
            singer: "Clean Bandit feat. Demi Lovato",
            path: "/audios/SoloFeatDemiLovato-CleanBandit.mp3",
            image: "/images/Clean Bandit - Solo.jpg",
            id: 7,
        },
        {
            name: "Night Changes",
            singer: "One Direction",
            path: "/audios/NightChanges-OneDirection.mp3",
            image: "/images/One Direction - Night Changes.jpg",
            id: 8,
        },
        {
            name: "Right Now (Na Na Na)",
            singer: "Akon",
            path: "/audios/Right now Na Na Na_ - Akon.mp3",
            image: "/images/Akon - Right Now (Na Na Na).jpg",
            id: 9,
        },
        {
            name: "Real Friends",
            singer: "Camila Cabello",
            path: "/audios/RealFriends-CamilaCabello.mp3",
            image: "/images/Camila Cabello - Real Friends.jpg",
            id: 10,
        },
        {
            name: "Dusk Till Dawn",
            singer: "ZAYN ft. Sia",
            path: "/audios/DuskTillDawn-ZaynSia.mp3",
            image:
                "/images/ZAYN - Dusk Till Dawn (Official Video) ft. Sia.jpg",
            id: 11,
        },
        {
            name: "Broken Angel",
            singer: "Arash feat. Helena",
            path: "/audios/Broken Angel - Arash_ Helena.mp3",
            image:
                "/images/Arash feat. Helena - Broken Angel.jpg",
            id: 12,
        },
        {
            name: "Without Me",
            singer: "Halsey",
            path: "/audios/Without Me - Halsey.mp3",
            image: "/images/Halsey - Without Me.jpg",
            id: 13,
        },
        {
            name: "Never Be the Same",
            singer: "Camila Cabello",
            path: "/audios/Never Be The Same - Camila Cabello.mp3",
            image:
                "/images/Camila Cabello - Never Be the Same.jpg",
            id: 14,
        },
        {
            name: "Attention",
            singer: "Charlie Puth",
            path: "/audios/Attention - Charlie Puth.mp3",
            image: "/images/Charlie Puth - Attention.jpg",
            id: 15,
        },
        {
            name: "As It Was",
            singer: "Harry Styles",
            path: "/audios/As It Was - Harry Styles.mp3",
            image: "/images/Harry Styles - As It Was.jpg",
            id: 16,
        },
        {
            name: "Kiss Me More",
            singer: "Doja Cat",
            path: "/audios/KissMeMore-DojaCat.mp3",
            image: "/images/Doja Cat - Kiss Me More.jpg",
            id: 17,
        },
        {
            name: "Señorita",
            singer: "Shawn Mendes, Camila Cabello",
            path: "/audios/Senorita - Shawn Mendes_ Camila Cabello.mp3",
            image:
                "/images/Shawn Mendes, Camila Cabello - Señorita.jpg",
            id: 18,
        },
        {
            name: "Let You Love Me",
            singer: "Rita Ora",
            path: "/audios/Let You Love Me - Rita Ora.mp3",
            image: "/images/Rita Ora - Let You Love Me.jpg",
            id: 19,
        },
        {
            name: "2U",
            singer: "David Guetta ft Justin Bieber",
            path: "/audios/2U - David Guetta_ Justin Bieber.mp3",
            image:
                "/images/David Guetta ft Justin Bieber - 2U.jpg",
            id: 20,
        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
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
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth

        // Xử lý CD quay / dừng
        const cdThumbAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000,
            interations: Infinity
        })
        cdThumbAnimate.pause()

        // Xử lý phóng to / thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Khi song được play
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // Khi song bị pause
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // Xử lý khi tua song
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }

        // Khi next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Khi pre song
        preBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.preSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }

        // Xử lý bật / tắt random song
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Xử lý lặp lại một song
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Xử lý next song khi audio ended
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Lắng nghe hành vi click vào playlist
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                // Xử lý khi bấm vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
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
        }, 300);
    },
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
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
    preSong: function () {
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
        } while (this.currentIndex === newIndex)

        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function () {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig()

        // Định nghĩa các thuộc tính cho Object
        this.defineProperties()

        // Lắng nghe / xử lý các sự kiện (DOM events)
        this.handleEvents()

        // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // Render playlist
        this.render()

        // Hiển thị trạng thái ban đầu của button repeat và random
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start()