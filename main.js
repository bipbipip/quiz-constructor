import { processPage } from "./pages.js";
import { getItem, setItem, updateItem } from "./storage";

processPage(location.hash.replace("#", ""));
