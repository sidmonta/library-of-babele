
interface GrabResponse {
  domain: string,
  icons: Array<{ size: string, src: string }>
}

export default class GrabFavicon {
  private cache: Map<string, string>;

  constructor() {
    this.cache = new Map<string, string>()
  }

  async grab(url: string) {
    const domain = this._createDomain(url)
    if (this.cache.has(domain)) {
      return this.cache.get(domain)
    }

    try {
      const faviconsResponse = await fetch(`http://favicongrabber.com/api/grab/${domain}`)
      const favicons: GrabResponse = await faviconsResponse.json()
      if (favicons?.icons) {
        const favicon = favicons?.icons[0]?.src
        this.cache.set(domain, favicon)
        return favicon
      }
    } catch (err) {
      this.cache.set(domain, 'https://www.w3.org/2008/site/images/favicon.ico')
    }
    return 'https://www.w3.org/2008/site/images/favicon.ico'
  }

  _createDomain(url: string): string {
    const domain = new URL(url)
    return domain.hostname
  }
}
