const BGM = {
    Game: "audio/bgm",
};

const Effect = {
    CommonClick: "audio/common_click_eff",
    InsertEff: "audio/insert_eff",
    CollisionEff: "audio/collision_eff",
    OpenBoxEff: "audio/open_box_eff",
    RewardEff: "audio/reward_eff",
    DiskBrokenEff: "audio/disk_broken_eff",
};

cc.Class({
    statics: {
        BGM: BGM,
        Effect: Effect,
        effClips: [],
        init() {
            this.curBGMUrl = null;
            this.curBGMClip = null;

            this.bgmVolume = 0.9;
            this.effVolume = 1;
            this.bgmEnabled = true;
            this.effEnabled = true;

            const bgmEnabled = cc.sys.localStorage.getItem('bgmEnabled');
            if (bgmEnabled != null && bgmEnabled == 'false') {
                this.bgmEnabled = false;
            }

            const bgmVolume = cc.sys.localStorage.getItem('bgmVolume');
            if (bgmVolume != null) {
                this.bgmVolume = parseFloat(bgmVolume);
                cc.audioEngine.setMusicVolume(bgmVolume);
            }

            const effEnabled = cc.sys.localStorage.getItem('effEnabled');
            if (effEnabled != null && effEnabled == 'false') {
                this.effEnabled = false;
            }

            const effVolume = cc.sys.localStorage.getItem('effVolume');
            if (effVolume != null) {
                this.effVolume = parseFloat(effVolume);
                cc.audioEngine.setEffectsVolume(effVolume);
            }
            cc.resources.loadDir("audio/",  (err, clip)=> {
                cc.log(clip);
                clip.forEach(element => {
                    if (!this.findAudio(element.name)) {
                        this.effClips.push(element)
                    }
                });
            })
        },

        // 当前bgmurl
        getCurBGMUrl: function () {
            return this.curBGMUrl;
        },

        playBGM(url, force) {
            // 如果已经在播放就不播了
            if (this.curBGMUrl && this.curBGMUrl == url && !force) {
                return;
            }

            this.curBGMUrl = url;

            if (!this.bgmEnabled) {
                return;
            }

            if (this.curBGMClip) {
                this.uncache(this.curBGMClip);
            }
            let audio = this.findAudio(url)
            if (audio) {
                this.curBGMClip = audio;
                cc.audioEngine.playMusic(audio, true);
            } else {
                cc.resources.load(url, cc.AudioClip, (err, clip) => {
                    if (!err) {
                        this.curBGMClip = clip;
                        cc.audioEngine.playMusic(clip, true);
                        if (!this.findAudio(clip.name)) {
                            this.effClips.push(clip)
                        }
                    }
                });
            }
        },

        pauseBGM() {
            cc.audioEngine.pauseMusic();
        },

        resumeBGM() {
            cc.audioEngine.resumeMusic();
        },

        stopBGM() {
            cc.audioEngine.stopMusic();
        },

        playEffect(url, loop = false) {
            if (!this.effEnabled) {
                return;
            }
            let audio = this.findAudio(url)
            if (audio) {
                cc.audioEngine.playEffect(audio, loop);
            } else {
                cc.resources.load(url, cc.AudioClip, (err, clip) => {
                    if (!err) {
                        cc.audioEngine.playEffect(clip, loop);
                        if (!this.findAudio(clip.name)) {
                            this.effClips.push(clip)
                        }
                    }
                });
            }
        },

        pauseAllEffects() {
            cc.audioEngine.pauseAllEffects();
        },

        resumeAllEffects() {
            cc.audioEngine.resumeAllEffects();
        },

        stopALlEffects() {
            cc.audioEngine.stopAllEffects();
        },

        uncache(clip) {
            cc.audioEngine.uncache(clip);
        },

        uncacheAll() {
            cc.audioEngine.uncacheAll();
        },

        pauseAll() {
            cc.audioEngine.pauseAll();
        },

        resumeAll() {
            cc.audioEngine.resumeAll();
        },

        stopAll() {
            cc.audioEngine.stopAll();
        },

        setBGMEnabled(enabled) {
            if (this.bgmEnabled != enabled) {
                cc.sys.localStorage.setItem('bgmEnabled', String(enabled));
                this.bgmEnabled = enabled;
                if (this.bgmEnabled == true && this.curBGMUrl != null) {
                    this.playBGM(this.curBGMUrl, true);
                } else {
                    this.stopBGM();
                }
            }
        },

        getBGMEnabled() {
            return this.bgmEnabled;
        },

        setBGMVolume(v) {
            if (this.bgmVolume != v) {
                cc.sys.localStorage.setItem('bgmVolume', v);
                this.bgmVolume = v;
                cc.audioEngine.setMusicVolume(v);
            }
        },

        getBGMVomue() {
            return this.bgmVolume;
        },

        setEffectsEnabled(enabled) {
            if (this.effEnabled != enabled) {
                cc.sys.localStorage.setItem('effEnabled', String(enabled));
                this.effEnabled = enabled;
                if (!enabled) {
                    this.stopALlEffects();
                }
            }
        },

        getEffectsEnabled() {
            return this.effEnabled;
        },

        setEffectsVolume(v) {
            if (this.effVolume != v) {
                cc.sys.localStorage.setItem('effVolume', v);
                this.effVolume = v;
                cc.audioEngine.setEffectsVolume(this.effVolume);
            }
        },

        getEffectVolume() {
            return this.effVolume;
        },

        clean() {
            this.stopAll();
            this.uncacheAll();
            this.curBGMUrl = null;
            this.curBGMClip = null;
        },
        findAudio(url) {
            let audio = null
            this.effClips.forEach(e => {
                if (url.includes(e.name)) {
                    audio = e
                }
            })
            return audio
        }
    }
});