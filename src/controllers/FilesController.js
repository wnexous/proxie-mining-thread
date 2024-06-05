import fs from "fs";
import { ProxieType } from "../@types/ProxieType.js";
import path from "path";

/**
 * @abstract
 */
export default class FilesController {
  /** @private*/
  static config = {
    proxieFolder: "proxies",
    inputFileName: "input.txt",
    outputFileName: "output.txt",
  };
  /**
   * @param {string} filePath
   * @private
   * */
  static getFileLines(filePath) {
    const file = fs.readFileSync(filePath, "utf8");
    const fileLines = file.split("\n");
    return fileLines;
  }
  /**
   * @param {string[]} stringArray
   * @private
   *  */
  static stringArrayToProxieList(stringArray) {
    /** @type {ProxieType[]} */
    const proxies = [];

    stringArray.forEach((line) => {
      try {
        proxies.push(new ProxieType(new URL(line)));
      } catch (error) {
        try {
          proxies.push(new ProxieType(new URL("http://" + line)));
        } catch (error) {
          console.log("Não foi possível ler a proxie:", line);
        }
      }
    });

    return proxies;
  }
  static getInputs() {
    const fileLines = this.getFileLines(
      path.join(this.config.proxieFolder, this.config.inputFileName)
    );
    return this.stringArrayToProxieList(fileLines);
  }
  static getOutputs() {
    const fileLines = this.getFileLines(
      path.join(this.config.proxieFolder, this.config.outputFileName)
    );
    return this.stringArrayToProxieList(fileLines);
  }

  /**
   *  @param {URL} address
   * @param {number} time
   */
  static appendOutput(address, time) {
    const fileUrl = path.join(
      this.config.proxieFolder,
      this.config.outputFileName
    );
    fs.appendFileSync(fileUrl, `${address.href} ${time}ms\r\n`);
  }

  /**
   * @param {number} index
   */
  static appendDivisor(index) {
    const fileUrl = path.join(
      this.config.proxieFolder,
      this.config.outputFileName
    );
    fs.appendFileSync(fileUrl, `QUADRANTE ${index} ` + "-".repeat(50) + "\r\n");
  }
}
