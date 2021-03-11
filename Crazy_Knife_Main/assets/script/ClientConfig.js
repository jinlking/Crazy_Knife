

window.zy = window.zy || {};

window.DEBUG_OPEN = false;

// 首次进入游戏
window.FirstEnter = true;

window.env = 'develop'
window.envConfig = {
    develop: {
        envId: "debug-9g5ku4kd80230fea",
        configUrl: "https://6465-debug-9g5ku4kd80230fea-1305103240.tcb.qcloud.la",
        score:"develop-score"
    },
    trial: {
        envId: "debug-9g5ku4kd80230fea",
        configUrl: "https://6465-debug-9g5ku4kd80230fea-1305103240.tcb.qcloud.la",
        score:"develop-score"
    },
    release: {
        envId: "release-3g0m66k61fd33bea",
        configUrl: "https://7265-release-3g0m66k61fd33bea-1305103240.tcb.qcloud.la",
        score:"release-score"
    },
}