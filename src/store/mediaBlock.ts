import { Commit } from "vuex";

export interface MediaBlock {
    id: string;
    name: string;
    startTime: number;
    duration: number;
    color: string;
    endTime: number;
}

export interface MediaBlockState {
    mediaBlocks: MediaBlock[];
    dialogModel: Partial<MediaBlock>;
}

const mediaBlock = {
    state: (): MediaBlockState => ({
        mediaBlocks: [],
        dialogModel: {},
    }),

    mutations: {
        addMediaBlock(state: MediaBlockState, mediaBlock: MediaBlock) {
            state.mediaBlocks.push(mediaBlock);
            state.mediaBlocks.sort((a, b) => a.startTime - b.startTime);
        },

        removeMediaBlock(state: MediaBlockState, mediaBlockId: string) {
            state.mediaBlocks = state.mediaBlocks.filter(block => block.id !== mediaBlockId);
        },
        setMediaBlocks(state: MediaBlockState, mediaBlocks: MediaBlock[]) {
            state.mediaBlocks = mediaBlocks;
        },
        updateMediaBlock(state: MediaBlockState, updatedMediaBlock: MediaBlock) {
            const index = state.mediaBlocks.findIndex(block => block.id === updatedMediaBlock.id);
            if (index !== -1) {
                state.mediaBlocks[index] = updatedMediaBlock;
            }
        },
        setDialogFields(state: MediaBlockState, payload: Partial<MediaBlock>) {
            state.dialogModel = { ...payload };
        },
    },

    actions: {
        addMediaBlock({ commit, state }: { commit: Commit; state: MediaBlockState }, mediaBlock: MediaBlock) {
            mediaBlock.id = Date.now().toString();
            commit("addMediaBlock", mediaBlock);
            localStorage.setItem("mediaBlocks", JSON.stringify(state.mediaBlocks));
        },

        removeMediaBlock({ commit, state }: { commit: Commit; state: MediaBlockState }, mediaBlockId: string) {
            commit("removeMediaBlock", mediaBlockId);
            localStorage.setItem("mediaBlocks", JSON.stringify(state.mediaBlocks));
        },
        loadMediaBlocks({ commit }: { commit: Commit }) {
            return new Promise((resolve, reject) => {
                const mediaBlocks: MediaBlock[] = JSON.parse(localStorage.getItem("mediaBlocks") || "[]");
                commit("setMediaBlocks", mediaBlocks);
                resolve(mediaBlocks);
            }).catch((error) => {
                console.log(error);
                throw error;
            });
        },
        updateMediaBlock({ commit, state }: { commit: Commit; state: MediaBlockState }, updatedMediaBlock: MediaBlock) {
            commit("updateMediaBlock", updatedMediaBlock);
            localStorage.setItem("mediaBlocks", JSON.stringify(state.mediaBlocks));
        },
        resetDialogFields({ commit }: { commit: Commit }) {
            commit("setDialogFields", {
                name: "",
                duration: 0,
                startTime: 0,
                color: "",
            });
        }
    },
    getters: {
        visibleMediaBlocks: (state: MediaBlockState) => (start: number, end: number) => {
            return state.mediaBlocks.filter(
                (block: MediaBlock) => {
                    return (block.startTime) >= start && (block.startTime) + (block.duration) <= end;
                }
            );
        },
    },
};

export default mediaBlock;
