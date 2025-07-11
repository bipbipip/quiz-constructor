import { processPage } from "./pages.js";
import { getItem, setItem, updateItem } from "./storage.js";

processPage(location.hash.replace("#", ""));
