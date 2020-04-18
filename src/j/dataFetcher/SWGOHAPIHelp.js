class SWGOHAPIHelp {
  constructor() {
    if (!SWGOHAPIHelp.instance) {
      this.username = 'lalala';
      this.password = '678365872365786238';
      this.userID = '326847126781467283';

      this.token = null;

      SWGOHAPIHelp.instance = this;
    }

    return SWGOHAPIHelp.instance;
  }

  async test() {
    await fetch('/api/test')
      .then(r => console.log(r))
      .catch(e => console.error(e));
  }
}

const instance = new SWGOHAPIHelp();
Object.freeze(instance);

export default instance;
