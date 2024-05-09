import { listData } from "./js/listData.js";
import { keyLocalStorageListSP } from "./js/constants.js";
import { getLocalStorage, setLocalStorage } from "./js/localStorage.js";

const data = getLocalStorage(keyLocalStorageListSP);

data.length !== 0 ? data : setLocalStorage(keyLocalStorageListSP, listData);

import jsonServer from "json-server"; // importing json-server library
const server = jsonServer.create();
const router = jsonServer.router("backend/db.json");
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 8080; //  chose port from here like 8080, 3001

server.use(middlewares);
server.use(router);

server.listen(port);
