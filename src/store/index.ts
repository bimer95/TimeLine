import { createStore } from "vuex";
import mediaBlock from "./mediaBlock";
import modal from "./modal";

const store = createStore({
    modules: {
        mediaBlock,
        modal,
    }
});

export default store;
