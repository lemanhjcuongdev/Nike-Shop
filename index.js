import { listData } from "./js/listData.js";
import { keyLocalStorageListSP } from "./js/constants.js";
import { getLocalStorage, setLocalStorage } from "./js/localStorage.js";

const data = getLocalStorage(keyLocalStorageListSP);

data.length !== 0 ? data : setLocalStorage(keyLocalStorageListSP, listData);
