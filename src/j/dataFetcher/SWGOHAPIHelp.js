class SWGOHAPIHelp {
  constructor() {
    if (!SWGOHAPIHelp.instance) {
      this.username = "lalala";
      this.password = "678365872365786238";
      this.userID = "326847126781467283";

      this.token = null;

      SWGOHAPIHelp.instance = this;
    }

    return SWGOHAPIHelp.instance;
  }
}

const instance = new SWGOHAPIHelp();
Object.freeze(instance);

export default instance;
