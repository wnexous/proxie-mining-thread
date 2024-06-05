export class ProxieType {
  /**
   * @private
   * @type {URL}
   * */
  url;

  constructor(url) {
    this.url = url;
  }
  getProxie() {
    return this.url;
  }
}
