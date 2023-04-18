import { Commit } from "vuex";

export interface ModalState {
    isOpen: boolean;
}

const modal = {
    state: () => ({
        isOpen: false,
    }),
    mutations: {
        open(state: ModalState) {
            state.isOpen = true;
        },
        close(state: ModalState) {
            state.isOpen = false;
        },
    },
    actions: {
        openModal({ commit }: { commit: Commit }) {
            commit("open");
        },
        closeModal({ commit }: { commit: Commit }) {
            commit("close");
        },
    },
    getters: {
        isOpen(state: ModalState) {
            return state.isOpen;
        }
    }
};

export default modal;
